import { AuthService } from './AuthService.js';
import { config } from '../config/config.js';

export class BoosterService {
  /**
   * Calculates exact Booster Tier metrics and upgrade breakdown based on active Base Plan
   */
  static getBoosterCalculations(basePlan: number = 1.0) {
    const starterCost = basePlan * config.boosterMultipliers.starter;
    const builderCost = basePlan * config.boosterMultipliers.builder;
    const leaderCost = basePlan * config.boosterMultipliers.leader;
    const championCost = basePlan * config.boosterMultipliers.champion;
    const mainPlanCost = basePlan * config.boosterMultipliers.mainPlan;

    return {
      basePlanAmount: basePlan,
      tiers: [
        {
          tier: 'STARTER',
          multiplier: '1x',
          cost: starterCost,
          collectedFrom5Partners: starterCost * 5,
          reSubscribeCost: starterCost,
          autoUpgradeCost: builderCost,
          netIncome: 0.0,
          description: `5 partners × ${starterCost.toFixed(2)} USDT = ${(starterCost * 5).toFixed(2)} USDT collected. ${starterCost.toFixed(2)} USDT recycles Starter, ${builderCost.toFixed(2)} USDT upgrades to Builder.`
        },
        {
          tier: 'BUILDER',
          multiplier: '4x',
          cost: builderCost,
          collectedFrom5Partners: builderCost * 5,
          reSubscribeCost: builderCost,
          autoUpgradeCost: leaderCost,
          netIncome: 0.0,
          description: `5 partners × ${builderCost.toFixed(2)} USDT = ${(builderCost * 5).toFixed(2)} USDT collected. ${builderCost.toFixed(2)} USDT recycles Builder, ${leaderCost.toFixed(2)} USDT upgrades to Leader.`
        },
        {
          tier: 'LEADER',
          multiplier: '16x',
          cost: leaderCost,
          collectedFrom5Partners: leaderCost * 5,
          reSubscribeCost: leaderCost,
          autoUpgradeCost: championCost,
          netIncome: 0.0,
          description: `5 partners × ${leaderCost.toFixed(2)} USDT = ${(leaderCost * 5).toFixed(2)} USDT collected. ${leaderCost.toFixed(2)} USDT recycles Leader, ${championCost.toFixed(2)} USDT upgrades to Champion.`
        },
        {
          tier: 'CHAMPION',
          multiplier: '64x',
          cost: championCost,
          collectedFrom5Partners: championCost * 5,
          reSubscribeCost: championCost,
          autoUpgradeCost: mainPlanCost,
          netIncome: basePlan * 156.0,
          description: `5 partners × ${championCost.toFixed(2)} USDT = ${(championCost * 5).toFixed(2)} USDT collected. ${championCost.toFixed(2)} USDT recycles Champion, ${mainPlanCost.toFixed(2)} USDT activates Main Plan, leaving ${(basePlan * 156.0).toFixed(2)} USDT Net Income.`
        },
        {
          tier: 'MAIN_PLAN',
          multiplier: '100x',
          cost: mainPlanCost,
          x5Split: mainPlanCost * 0.15,
          forcedLevelPool: mainPlanCost * 0.65,
          perLevelIncome: (mainPlanCost * 0.65) / 13,
          x4MatrixAllocation: mainPlanCost * 0.20,
          description: `100x Main Plan (${mainPlanCost.toFixed(2)} USDT): 15% X5 matrix split, 65% across 13 forced levels (${((mainPlanCost * 0.65) / 13).toFixed(2)} USDT/level), 20% X4 passive pool.`
        }
      ]
    };
  }

  /**
   * Process a simulated or live Booster Tier Upgrade
   */
  static upgradeUserBoosterTier(address: string, targetTier: 'BUILDER' | 'LEADER' | 'CHAMPION' | 'MAIN_PLAN') {
    const user = AuthService.getUser(address);
    if (!user) {
      throw new Error('User not found');
    }

    user.tier = targetTier;
    if (targetTier === 'CHAMPION') {
      user.totalEarningsUsdt += user.basePlanAmount * 156.0;
    }

    AuthService.saveUser(user);

    return {
      success: true,
      user,
      message: `Successfully upgraded to ${targetTier} Tier`
    };
  }
}
