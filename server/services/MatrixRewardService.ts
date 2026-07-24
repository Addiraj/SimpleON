import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { DailyCappingService } from './DailyCappingService.js';

export interface RewardCalculationResult {
  grossReward: number;
  allowedReward: number;
  cappedExcess: number;
  dailyCapLimit: number;
  currentGrossToday: number;
  ledgerEntry: any;
  transaction: any;
}

export class MatrixRewardService {
  /**
   * Calculates and credits cycle reward for a completed matrix cycle.
   * Ensures idempotency via unique ledger idempotency key `reward-mc-${cycleId}`.
   * Enforces daily capping rules.
   *
   * @param cycle MatrixCycle record
   * @param configSnapshot Saved level configuration snapshot
   * @param db Prisma transaction client
   */
  static async calculateAndCreditCycleReward(
    cycle: any,
    configSnapshot: any,
    db: any = prisma
  ): Promise<RewardCalculationResult> {
    const userId = cycle.user_id;
    const cycleId = cycle.id;
    const cycleNumber = cycle.cycle_number;

    // 1. Determine reward basis
    const joiningAmount = parseFloat(configSnapshot.joining_amount || '100');
    const slotValue = joiningAmount * 0.15; // 15% slot allocation
    const totalSlots = cycle.total_positions || configSnapshot.matrix_size || 5;
    const totalCyclePool = totalSlots * slotValue;

    // Net income rate: Cycle 1 = 40% (40% upgrade wallet + 20% retopup + 40% net income), Cycle 2+ = 80% (20% retopup + 80% net income)
    const netPayoutRate = cycleNumber === 1 ? 0.40 : 0.80;

    // Configured cycle_reward override or calculated pool
    const configuredReward = configSnapshot.cycle_reward ? parseFloat(configSnapshot.cycle_reward) : null;
    const grossReward = configuredReward !== null && !isNaN(configuredReward) && configuredReward > 0
      ? configuredReward
      : totalCyclePool * netPayoutRate;

    // 2. Check and apply Daily Capping via DailyCappingService
    const cappingEval = await DailyCappingService.evaluateAndApplyCapping(
      userId,
      grossReward,
      undefined,
      undefined,
      db
    );

    const allowedReward = cappingEval.allowedThisTransaction;
    const cappedExcess = cappingEval.excessThisTransaction;
    const dailyCapLimit = cappingEval.dailyCap;
    const currentGrossToday = cappingEval.grossEarnings;

    // 3. Create Wallet Ledger Credit (Idempotent)
    const idempotencyKey = `reward-mc-${cycleId}`;

    const existingLedger = await db.walletLedger.findUnique({
      where: { idempotency_key: idempotencyKey },
    });

    if (existingLedger) {
      logger.info(
        { userId, cycleId, idempotencyKey },
        '[MatrixRewardService] Cycle reward ledger credit already exists (idempotent)'
      );
      return {
        grossReward,
        allowedReward: parseFloat(existingLedger.amount.toString()),
        cappedExcess,
        dailyCapLimit,
        currentGrossToday,
        ledgerEntry: existingLedger,
        transaction: null,
      };
    }

    // Create Transaction record
    const transaction = await db.transaction.create({
      data: {
        user_id: userId,
        transaction_type: 'MATRIX_REWARD',
        amount: new Prisma.Decimal(allowedReward),
        currency: 'USDT',
        status: 'COMPLETED',
        description: `Matrix Cycle #${cycleNumber} Reward (${(netPayoutRate * 100)}% payout rate)`,
        metadata: {
          cycle_id: cycleId,
          cycle_number: cycleNumber,
          gross_reward: grossReward,
          allowed_reward: allowedReward,
          capped_excess: cappedExcess,
          daily_cap: dailyCapLimit,
        },
        completed_at: new Date(),
      },
    });

    // Create WalletLedger Credit
    const ledgerEntry = await db.walletLedger.create({
      data: {
        user_id: userId,
        transaction_id: transaction.id,
        entry_type: 'MATRIX_REWARD',
        direction: 'CREDIT',
        amount: new Prisma.Decimal(allowedReward),
        available_amount: new Prisma.Decimal(allowedReward),
        status: 'AVAILABLE',
        idempotency_key: idempotencyKey,
        source_type: 'MATRIX_CYCLE',
        source_id: cycleId,
        metadata: {
          cycle_number: cycleNumber,
          net_payout_rate: netPayoutRate,
        },
      },
    });

    logger.info(
      { userId, cycleId, allowedReward, cappedExcess },
      '[MatrixRewardService] Successfully credited cycle reward to user wallet ledger'
    );

    return {
      grossReward,
      allowedReward,
      cappedExcess,
      dailyCapLimit,
      currentGrossToday,
      ledgerEntry,
      transaction,
    };
  }
}
