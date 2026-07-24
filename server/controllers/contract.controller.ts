import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';

export class ContractController {
  static getContractInfo(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          boosterContractAddress: config.contracts.boosterAddress,
          usdtContractAddress: config.contracts.usdtAddress,
          supportedChains: config.chains,
          abiSummary: [
            'function registerAndActivate(address referrer) external',
            'function upgradeTier(uint8 targetTier) external',
            'function activateMainPlan() external',
            'function users(address user) external view returns (bool, address, uint8, uint256, uint256, uint256, uint256)',
            'function basePlanAmount() external view returns (uint256)'
          ]
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
