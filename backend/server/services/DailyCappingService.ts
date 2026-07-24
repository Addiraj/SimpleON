import { Prisma, CappingHandlingType } from '@prisma/client';
import { prisma } from '../config/database.js';
import { logger } from '../config/logger.js';
import { FinancialDateService } from './FinancialDateService.js';
import { DailyEarningService, DailyEarningMetrics } from './DailyEarningService.js';
import { QualifiedBuilderService } from './QualifiedBuilderService.js';

export interface CappingEvaluationResult {
  businessDate: string;
  grossEarnings: number;
  creditedEarnings: number;
  dailyCap: number;
  remainingCap: number;
  cappedAmount: number;
  heldAmount: number;
  carriedForwardAmount: number;
  qualifiedBuilderCount: number;
  completedCycleCount: number;
  allowedThisTransaction: number;
  excessThisTransaction: number;
  dailyCappingRecord: any;
  dailyEarningRecord: any;
}

export class DailyCappingService {
  /**
   * Evaluates and applies daily earning capping within a database transaction.
   * Calculates gross earnings, already credited earnings, remaining cap, allowed credit,
   * excess amount, and applies configured excess handling (HELD, FORFEITED, CARRIED_FORWARD).
   * Stores calculation snapshot and ensures non-negative numbers and idempotency.
   *
   * @param userId User ID
   * @param grossAmount Proposed new earning amount
   * @param handlingType Excess handling type: HELD, FORFEITED, CARRIED_FORWARD (Default: HELD)
   * @param customDate Optional date override
   * @param db Prisma transaction or database client
   */
  static async evaluateAndApplyCapping(
    userId: string,
    grossAmount: number,
    handlingType: CappingHandlingType = CappingHandlingType.HELD,
    customDate?: Date,
    db: any = prisma
  ): Promise<CappingEvaluationResult> {
    const executeCapping = async (tx: any) => {
      // 1. Determine configured business date & timezone
      const businessDate = FinancialDateService.getBusinessDate(customDate);
      const businessDateStr = FinancialDateService.getBusinessDateString(customDate);
      const timezone = FinancialDateService.getTimezone();

      const safeGrossInput = Math.max(0, grossAmount);

      // 2. Load user and current level configuration
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { current_level: true },
      });

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      // 3. Determine daily cap limit from active level configuration
      let levelConfig = user.current_level;
      if (!levelConfig) {
        levelConfig = await tx.levelConfiguration.findFirst({
          where: { level_order: 1, status: 'ACTIVE' },
        });
      }

      const levelConfigId = levelConfig?.id || 'default-level';
      const dailyCapLimit = levelConfig?.daily_cap
        ? Math.max(0, parseFloat(levelConfig.daily_cap.toString()))
        : 1000;

      // 4. Fetch existing records for user and business date
      let dailyEarning = await tx.dailyEarning.findUnique({
        where: {
          user_id_business_date: {
            user_id: userId,
            business_date: businessDate,
          },
        },
      });

      let dailyCapping = await tx.dailyCapping.findUnique({
        where: {
          user_id_business_date: {
            user_id: userId,
            business_date: businessDate,
          },
        },
      });

      // 5. Calculate existing credited earnings & remaining cap
      const currentGross = Math.max(
        0,
        dailyEarning ? parseFloat(dailyEarning.gross_amount.toString()) : 0
      );

      const currentCredited = Math.max(
        0,
        dailyEarning ? parseFloat(dailyEarning.credited_amount.toString()) : 0
      );

      const remainingCapBefore = Math.max(0, dailyCapLimit - currentCredited);

      // 6. Calculate allowed credit and excess
      const allowedThisTransaction = Math.min(safeGrossInput, remainingCapBefore);
      const excessThisTransaction = Math.max(0, safeGrossInput - allowedThisTransaction);

      // 7. Calculate excess breakdown based on handlingType
      let addHeld = 0;
      let addCapped = 0;
      let addCarried = 0;

      if (excessThisTransaction > 0) {
        if (handlingType === CappingHandlingType.FORFEITED) {
          addCapped = excessThisTransaction;
        } else if (handlingType === CappingHandlingType.CARRIED_FORWARD) {
          addCarried = excessThisTransaction;
        } else {
          // Default: HELD
          addHeld = excessThisTransaction;
        }
      }

      const newGross = Math.max(0, currentGross + safeGrossInput);
      const newCredited = Math.max(0, currentCredited + allowedThisTransaction);
      const remainingCapAfter = Math.max(0, dailyCapLimit - newCredited);

      // 8. Fetch builder qualifications and cycle counts
      const qualification = await QualifiedBuilderService.getQualificationData(userId, tx);

      // 9. Store calculation snapshot
      const snapshot = {
        evaluatedAt: new Date().toISOString(),
        userId,
        businessDate: businessDateStr,
        levelConfigurationId: levelConfigId,
        levelName: levelConfig?.name || 'Starter Booster',
        dailyCapLimit,
        inputGrossAmount: safeGrossInput,
        currentCreditedBefore: currentCredited,
        allowedThisTransaction,
        excessThisTransaction,
        handlingType,
        newGrossTotal: newGross,
        newCreditedTotal: newCredited,
        remainingCapAfter,
        qualifiedBuilderCount: qualification.builderCount,
        completedCycleCount: qualification.completedCycles,
      };

      // 10. Upsert `daily_earnings` record
      if (dailyEarning) {
        dailyEarning = await tx.dailyEarning.update({
          where: { id: dailyEarning.id },
          data: {
            gross_amount: new Prisma.Decimal(newGross),
            credited_amount: new Prisma.Decimal(newCredited),
            capped_amount: { increment: new Prisma.Decimal(addCapped) },
            held_amount: { increment: new Prisma.Decimal(addHeld) },
            carried_forward_amount: { increment: new Prisma.Decimal(addCarried) },
            daily_cap: new Prisma.Decimal(dailyCapLimit),
            status: remainingCapAfter === 0 ? 'FINALIZED' : 'ACTIVE',
          },
        });
      } else {
        dailyEarning = await tx.dailyEarning.create({
          data: {
            user_id: userId,
            business_date: businessDate,
            gross_amount: new Prisma.Decimal(newGross),
            credited_amount: new Prisma.Decimal(newCredited),
            capped_amount: new Prisma.Decimal(addCapped),
            held_amount: new Prisma.Decimal(addHeld),
            carried_forward_amount: new Prisma.Decimal(addCarried),
            daily_cap: new Prisma.Decimal(dailyCapLimit),
            timezone,
            status: remainingCapAfter === 0 ? 'FINALIZED' : 'ACTIVE',
          },
        });
      }

      // 11. Upsert `daily_cappings` record
      const currentCappingExcess = dailyCapping
        ? parseFloat(dailyCapping.excess_earning.toString())
        : 0;
      const totalCappingExcess = Math.max(0, currentCappingExcess + excessThisTransaction);

      if (dailyCapping) {
        dailyCapping = await tx.dailyCapping.update({
          where: { id: dailyCapping.id },
          data: {
            level_configuration_id: levelConfigId,
            gross_earning: new Prisma.Decimal(newGross),
            allowed_earning: new Prisma.Decimal(newCredited),
            excess_earning: new Prisma.Decimal(totalCappingExcess),
            handling_type: handlingType,
            qualified_builder_count: qualification.builderCount,
            completed_cycle_count: qualification.completedCycles,
            calculation_snapshot: snapshot,
            finalized_at: remainingCapAfter === 0 ? new Date() : null,
          },
        });
      } else {
        dailyCapping = await tx.dailyCapping.create({
          data: {
            user_id: userId,
            level_configuration_id: levelConfigId,
            business_date: businessDate,
            gross_earning: new Prisma.Decimal(newGross),
            allowed_earning: new Prisma.Decimal(newCredited),
            excess_earning: new Prisma.Decimal(totalCappingExcess),
            handling_type: handlingType,
            qualified_builder_count: qualification.builderCount,
            completed_cycle_count: qualification.completedCycles,
            calculation_snapshot: snapshot,
            finalized_at: remainingCapAfter === 0 ? new Date() : null,
          },
        });
      }

      logger.info(
        {
          userId,
          businessDate: businessDateStr,
          allowedThisTransaction,
          excessThisTransaction,
          remainingCapAfter,
        },
        '[DailyCappingService] Evaluated and applied daily capping'
      );

      return {
        businessDate: businessDateStr,
        grossEarnings: newGross,
        creditedEarnings: newCredited,
        dailyCap: dailyCapLimit,
        remainingCap: remainingCapAfter,
        cappedAmount: parseFloat(dailyEarning.capped_amount.toString()),
        heldAmount: parseFloat(dailyEarning.held_amount.toString()),
        carriedForwardAmount: parseFloat(dailyEarning.carried_forward_amount.toString()),
        qualifiedBuilderCount: qualification.builderCount,
        completedCycleCount: qualification.completedCycles,
        allowedThisTransaction,
        excessThisTransaction,
        dailyCappingRecord: dailyCapping,
        dailyEarningRecord: dailyEarning,
      };
    };

    if (db !== prisma) {
      return executeCapping(db);
    } else {
      return prisma.$transaction(executeCapping, {
        maxWait: 5000,
        timeout: 10000,
      });
    }
  }

  /**
   * Safely handles earning reversals without permitting negative numbers.
   */
  static async handleReversal(
    userId: string,
    reversalAmount: number,
    customDate?: Date,
    db: any = prisma
  ) {
    const businessDate = FinancialDateService.getBusinessDate(customDate);
    const safeAmount = Math.max(0, reversalAmount);

    const dailyEarning = await db.dailyEarning.findUnique({
      where: {
        user_id_business_date: {
          user_id: userId,
          business_date: businessDate,
        },
      },
    });

    if (!dailyEarning) return;

    const currentGross = parseFloat(dailyEarning.gross_amount.toString());
    const currentCredited = parseFloat(dailyEarning.credited_amount.toString());

    const newGross = Math.max(0, currentGross - safeAmount);
    const newCredited = Math.max(0, currentCredited - safeAmount);

    await db.dailyEarning.update({
      where: { id: dailyEarning.id },
      data: {
        gross_amount: new Prisma.Decimal(newGross),
        credited_amount: new Prisma.Decimal(newCredited),
        status: 'ACTIVE',
      },
    });

    const dailyCapping = await db.dailyCapping.findUnique({
      where: {
        user_id_business_date: {
          user_id: userId,
          business_date: businessDate,
        },
      },
    });

    if (dailyCapping) {
      await db.dailyCapping.update({
        where: { id: dailyCapping.id },
        data: {
          gross_earning: new Prisma.Decimal(newGross),
          allowed_earning: new Prisma.Decimal(newCredited),
        },
      });
    }

    logger.info({ userId, reversalAmount: safeAmount, newCredited }, '[DailyCappingService] Processed safe earning reversal');
  }

  /**
   * GET /api/capping/status
   */
  static async getStatus(userId: string, db: any = prisma) {
    const metrics: DailyEarningMetrics = await DailyEarningService.getDailyEarnings(userId, undefined, db);
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { current_level: true },
    });

    const usagePercentage = metrics.dailyCap > 0
      ? Math.min(100, (metrics.creditedEarnings / metrics.dailyCap) * 100)
      : 0;

    return {
      businessDate: metrics.businessDate,
      grossEarnings: metrics.grossEarnings,
      creditedEarnings: metrics.creditedEarnings,
      dailyCap: metrics.dailyCap,
      remainingCap: metrics.remainingCap,
      cappedAmount: metrics.cappedAmount,
      heldAmount: metrics.heldAmount,
      carriedForwardAmount: metrics.carriedForwardAmount,
      qualifiedBuilderCount: metrics.qualifiedBuilderCount,
      completedCycleCount: metrics.completedCycleCount,
      usagePercentage: parseFloat(usagePercentage.toFixed(2)),
      status: metrics.remainingCap === 0 ? 'CAPPED' : 'ACTIVE',
      currentLevel: user?.current_level?.name || 'Starter Booster',
    };
  }

  /**
   * GET /api/capping/history
   */
  static async getHistory(userId: string, page: number = 1, limit: number = 10, db: any = prisma) {
    const skip = (Math.max(1, page) - 1) * Math.max(1, limit);

    const [total, records] = await Promise.all([
      db.dailyCapping.count({ where: { user_id: userId } }),
      db.dailyCapping.findMany({
        where: { user_id: userId },
        include: {
          level_configuration: true,
        },
        orderBy: { business_date: 'desc' },
        skip,
        take: Math.max(1, limit),
      }),
    ]);

    const formattedHistory = records.map((rec: any) => ({
      id: rec.id,
      businessDate: rec.business_date.toISOString().split('T')[0],
      levelName: rec.level_configuration?.name || 'Starter Booster',
      grossEarning: parseFloat(rec.gross_earning.toString()),
      allowedEarning: parseFloat(rec.allowed_earning.toString()),
      excessEarning: parseFloat(rec.excess_earning.toString()),
      handlingType: rec.handling_type,
      qualifiedBuilderCount: rec.qualified_builder_count,
      completedCycleCount: rec.completed_cycle_count,
      calculationSnapshot: rec.calculation_snapshot,
      finalizedAt: rec.finalized_at,
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      history: formattedHistory,
    };
  }

  /**
   * GET /api/capping/summary
   */
  static async getSummary(userId: string, db: any = prisma) {
    const status = await this.getStatus(userId, db);

    const recentRecords = await db.dailyCapping.findMany({
      where: { user_id: userId },
      orderBy: { business_date: 'desc' },
      take: 7,
    });

    const historicalSummary = recentRecords.map((rec: any) => ({
      businessDate: rec.business_date.toISOString().split('T')[0],
      gross: parseFloat(rec.gross_earning.toString()),
      allowed: parseFloat(rec.allowed_earning.toString()),
      excess: parseFloat(rec.excess_earning.toString()),
    }));

    return {
      currentStatus: status,
      recent7Days: historicalSummary,
    };
  }
}
