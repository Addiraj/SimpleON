export * from './types/index';

export interface QualifiedReferrals {
  builders: number;
  leaders: number;
  champions: number;
}

export interface BoosterTierData {
  name: string;
  amount: number;
  collection: number;
  retopup: number;
  upgrade: number;
  firstNetIncome?: number;
  mainPlanAllocation?: number;
  dailyCap: number;
  accent: string;
  iconName: 'rocket' | 'trending-up' | 'users' | 'trophy';
}

export interface MainPlanBreakdown {
  x5Amount: number;
  levelPoolAmount: number;
  x4Amount: number;
  mainPlanTotal: number;
}

export interface X5Split {
  retopup: number;
  upgradeWallet: number;
  incomeWallet: number;
}

export interface LevelPoolRow {
  level: number;
  amount: number;
  members: number;
  potentialIncome: number;
}
