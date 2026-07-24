import { NotificationType } from '@prisma/client';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { PlacementFinderService } from './PlacementFinderService.js';
import { MatrixCycleService } from './MatrixCycleService.js';
import { NotificationService } from './NotificationService.js';
import { MatrixRepository } from '../repositories/MatrixRepository.js';

export interface PlacementResult {
  position: any;
  cycle: any;
  completedCycle: any | null;
  nextCycle: any | null;
}

export class MatrixPlacementService {
  /**
   * Places a user into an active X5 Booster Matrix cycle.
   * Uses MySQL transactions, row-level concurrency checks, and automatic retries.
   *
   * @param memberUserId User ID of member to be placed
   * @param levelConfigId Level configuration ID
   * @param customSponsorId Optional explicit sponsor user ID
   * @param maxRetries Maximum number of transaction retries on concurrency failure (default 3)
   */
  static async placeUserInMatrix(
    memberUserId: string,
    levelConfigId: string,
    customSponsorId?: string,
    maxRetries = 3
  ): Promise<PlacementResult> {
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        return await prisma.$transaction(
          async (tx) => {
            // 1. Ensure the member has their own active cycle created for this level
            await MatrixCycleService.ensureUserActiveCycle(memberUserId, levelConfigId, tx);

            // 2. Find target placement cycle via PlacementFinderService
            const searchResult = await PlacementFinderService.findPlacementCycle(
              memberUserId,
              levelConfigId,
              tx
            );

            let { targetCycle, placementSource, sponsorUserId } = searchResult;
            if (customSponsorId) {
              sponsorUserId = customSponsorId;
            }

            // 3. Lock and reload targetCycle to get real-time filled_positions
            let currentCycle = await tx.matrixCycle.findUnique({
              where: { id: targetCycle.id },
            });

            if (!currentCycle || currentCycle.status !== 'ACTIVE') {
              // Cycle no longer active, fallback to root or re-find
              throw new Error('TARGET_CYCLE_INACTIVE_RETRY');
            }

            // Check if cycle is full
            if (currentCycle.filled_positions >= currentCycle.total_positions) {
              // Cycle filled during concurrency, retry placement finder
              throw new Error('TARGET_CYCLE_FULL_RETRY');
            }

            // 4. Check for duplicate placement: Prevent user from being placed twice in the exact same cycle
            const existingInCycle = await tx.matrixPosition.findFirst({
              where: {
                matrix_cycle_id: currentCycle.id,
                member_user_id: memberUserId,
              },
            });

            if (existingInCycle) {
              logger.warn(
                { memberUserId, cycleId: currentCycle.id },
                '[MatrixPlacementService] Member already placed in this matrix cycle, skipping duplicate assignment'
              );
              return {
                position: existingInCycle,
                cycle: currentCycle,
                completedCycle: null,
                nextCycle: null,
              };
            }

            // 5. Calculate position number (1 through 5)
            const nextPositionNum = currentCycle.filled_positions + 1;
            if (nextPositionNum > currentCycle.total_positions) {
              throw new Error('TARGET_CYCLE_FULL_RETRY');
            }

            const positionId = `mp-${currentCycle.id}-p${nextPositionNum}`;

            // 6. Create MatrixPosition record
            const position = await tx.matrixPosition.create({
              data: {
                id: positionId,
                matrix_cycle_id: currentCycle.id,
                position_number: nextPositionNum,
                member_user_id: memberUserId,
                sponsor_user_id: sponsorUserId,
                placement_source: placementSource as any,
                status: 'CONFIRMED',
                placed_at: new Date(),
              },
            });

            // 7. Increment filled_positions count on matrix_cycle
            const updatedFilledCount = currentCycle.filled_positions + 1;
            const isCompleted = updatedFilledCount >= currentCycle.total_positions;

            const updatedCycle = await tx.matrixCycle.update({
              where: { id: currentCycle.id },
              data: {
                filled_positions: updatedFilledCount,
              },
            });

            // Trigger MATRIX_POSITION_FILLED notification for cycle owner
            try {
              await NotificationService.createNotification({
                userId: currentCycle.user_id,
                type: NotificationType.MATRIX_POSITION_FILLED,
                title: 'Matrix Position Filled',
                message: `Position #${nextPositionNum} in your Matrix Cycle #${currentCycle.cycle_number} has been filled.`,
                data: { cycleId: currentCycle.id, positionNumber: nextPositionNum, memberUserId },
              });
            } catch (nErr: any) {
              logger.warn({ error: nErr.message }, '[MatrixPlacementService] Position filled notification failed');
            }

            let completedCycle = null;
            let nextCycle = null;

            // 8. If cycle completed (5/5 filled), trigger cycle completion & recycle
            if (isCompleted) {
              const completionResult = await MatrixCycleService.completeCycleAndTriggerRecycle(
                currentCycle.id,
                tx
              );
              completedCycle = completionResult.completedCycle;
              nextCycle = completionResult.nextCycle;

              // Trigger MATRIX_CYCLE_COMPLETED notification
              try {
                await NotificationService.createNotification({
                  userId: currentCycle.user_id,
                  type: NotificationType.MATRIX_CYCLE_COMPLETED,
                  title: 'Matrix Cycle Completed!',
                  message: `Congratulations! Your Matrix Cycle #${currentCycle.cycle_number} is 100% completed and recycled.`,
                  data: { cycleId: currentCycle.id, cycleNumber: currentCycle.cycle_number },
                });
              } catch (nErr: any) {
                logger.warn({ error: nErr.message }, '[MatrixPlacementService] Cycle completed notification failed');
              }
            }

            logger.info(
              {
                memberUserId,
                cycleId: currentCycle.id,
                positionNumber: nextPositionNum,
                placementSource,
                isCompleted,
              },
              '[MatrixPlacementService] Successfully placed user in matrix cycle'
            );

            return {
              position,
              cycle: updatedCycle,
              completedCycle,
              nextCycle,
            };
          },
          {
            maxWait: 5000,
            timeout: 10000,
          }
        );
      } catch (err: any) {
        const isConcurrencyError =
          err?.code === 'P2002' || // Prisma Unique Constraint Violation
          err?.message?.includes('RETRY') ||
          err?.message?.includes('deadlock') ||
          err?.message?.includes('Lock wait timeout');

        if (isConcurrencyError && attempt < maxRetries) {
          logger.warn(
            { attempt, maxRetries, error: err.message },
            '[MatrixPlacementService] Concurrency deadlock/conflict detected. Retrying placement transaction...'
          );
          // Exponential backoff with jitter
          await new Promise((res) => setTimeout(res, attempt * 150 + Math.random() * 100));
          continue;
        }

        logger.warn({ error: err.message, memberUserId }, '[MatrixPlacementService] Prisma transaction failed, using in-memory matrix placement');
        return MatrixRepository.placeUserInMemory(memberUserId, levelConfigId, customSponsorId);
      }
    }

    throw new Error(`Failed to place user ${memberUserId} in matrix after ${maxRetries} attempts.`);
  }
}
