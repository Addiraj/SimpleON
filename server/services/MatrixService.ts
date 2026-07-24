import { AuthService } from './AuthService.js';

export class MatrixService {
  /**
   * Generates a complete 13-Level Forced Matrix tree structure for a user
   */
  static get13LevelMatrixTree(userAddress: string) {
    const rootUser = AuthService.getUser(userAddress);
    const allUsers = AuthService.getAllUsers();

    // Construct 13-Level 3x3 forced matrix hierarchy
    const levels = [];
    const basePlan = rootUser ? rootUser.basePlanAmount : 1.0;
    const perLevelAmount = (basePlan * 100 * 0.65) / 13; // 5% per level

    let currentLevelNodesCount = 3;
    for (let level = 1; level <= 13; level++) {
      const levelPartners = Math.min(
        currentLevelNodesCount,
        allUsers.filter(u => u.referrerAddress === userAddress).length + (level * 2)
      );

      levels.push({
        level,
        maxCapacity: currentLevelNodesCount,
        filledNodes: Math.min(levelPartners, currentLevelNodesCount),
        rewardPerNodeUsdt: perLevelAmount,
        totalLevelEarningsUsdt: Math.min(levelPartners, currentLevelNodesCount) * perLevelAmount,
        percentageAllocation: '5%'
      });

      currentLevelNodesCount *= 3; // 3x3 forced matrix expansion multiplier
      if (currentLevelNodesCount > 1594323) currentLevelNodesCount = 1594323; // Max 13th level cap
    }

    return {
      userAddress,
      matrixType: '13_LEVEL_FORCED_3X3',
      totalLevels: 13,
      perLevelRewardUsdt: perLevelAmount,
      levels
    };
  }

  /**
   * Generates X5 and X4 Matrix split stats
   */
  static getSpecialMatrices(userAddress: string) {
    const user = AuthService.getUser(userAddress);
    const basePlan = user ? user.basePlanAmount : 1.0;
    const mainPlanCost = basePlan * 100;

    return {
      x5Matrix: {
        name: 'X5 Matrix Split',
        totalPercentage: '15%',
        allocationUsdt: mainPlanCost * 0.15,
        cycle: 1,
        positions: [
          { index: 1, type: 'Re-topup Wallet', percentage: '20%', amount: mainPlanCost * 0.15 * 0.20 },
          { index: 2, type: 'Upgrade Wallet', percentage: '40%', amount: mainPlanCost * 0.15 * 0.40 },
          { index: 3, type: 'Direct Net Income', percentage: '40%', amount: mainPlanCost * 0.15 * 0.40 },
          { index: 4, type: 'Filled', percentage: 'Direct', amount: mainPlanCost * 0.15 },
          { index: 5, type: 'Recycle Trigger', percentage: 'Auto', amount: mainPlanCost * 0.15 },
        ]
      },
      x4Matrix: {
        name: 'X4 Passive 2x2 Spillover Matrix',
        totalPercentage: '20%',
        allocationUsdt: mainPlanCost * 0.20,
        activeSpillovers: 4,
        description: 'Passive placement pool where positions fill automatically from team or global spillover pathways.'
      }
    };
  }
}
