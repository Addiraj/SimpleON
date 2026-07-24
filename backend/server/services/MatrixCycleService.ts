import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { MatrixCompletionService } from './MatrixCompletionService.js';
import { MatrixRepository } from '../repositories/MatrixRepository.js';

export class MatrixCycleService {
  /**
   * Ensures an active matrix cycle exists for a user at a given level configuration.
   * Creates Cycle #1 if none exists.
   */
  static async ensureUserActiveCycle(
    userId: string,
    levelConfigId: string,
    db: any = prisma
  ) {
    try {
      const existingActive = await db.matrixCycle.findFirst({
        where: {
          user_id: userId,
          level_configuration_id: levelConfigId,
          status: 'ACTIVE',
        },
        orderBy: { cycle_number: 'desc' },
      });

      if (existingActive) {
        return existingActive;
      }

      return await this.createFirstCycleForUser(userId, levelConfigId, db);
    } catch (err: any) {
      logger.warn({ error: err.message }, '[MatrixCycleService] Prisma unavailable, using MatrixRepository fallback');
      const active = await MatrixRepository.findActiveCycle(userId, levelConfigId, db);
      if (active) return active;
      return MatrixRepository.createCycle({
        userId,
        levelConfigId,
        cycleNumber: 1,
      }, db);
    }
  }

  /**
   * Creates the initial Cycle #1 for a user at a specific level configuration.
   */
  static async createFirstCycleForUser(
    userId: string,
    levelConfigId: string,
    db: any = prisma
  ) {
    try {
      const cycleId = `mc-${userId}-${levelConfigId}-c1`;

      const existingCycle = await db.matrixCycle.findUnique({
        where: { id: cycleId },
      });

      if (existingCycle) {
        return existingCycle;
      }

      // Get matrix_size from LevelConfiguration if available
      const levelConfig = await db.levelConfiguration.findUnique({
        where: { id: levelConfigId },
        select: { matrix_size: true },
      });

      const matrixSize = levelConfig?.matrix_size || 5;

      const newCycle = await db.matrixCycle.create({
        data: {
          id: cycleId,
          user_id: userId,
          level_configuration_id: levelConfigId,
          cycle_number: 1,
          total_positions: matrixSize,
          filled_positions: 0,
          status: 'ACTIVE',
          started_at: new Date(),
        },
      });

      logger.info({ userId, levelConfigId, cycleId }, '[MatrixCycleService] Created initial Cycle #1');
      return newCycle;
    } catch (err: any) {
      logger.warn({ error: err.message }, '[MatrixCycleService] Prisma unavailable, using MatrixRepository fallback for createFirstCycleForUser');
      return MatrixRepository.createCycle({
        userId,
        levelConfigId,
        cycleNumber: 1,
      }, db);
    }
  }

  /**
   * Handles cycle completion when all 5 positions are filled.
   * Delegates to MatrixCompletionService for reward calculation, capping, re-topup, and next cycle creation.
   */
  static async completeCycleAndTriggerRecycle(
    cycleId: string,
    db: any = prisma
  ) {
    return MatrixCompletionService.processCycleCompletion(cycleId, db);
  }
}
