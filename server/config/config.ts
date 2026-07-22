import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'simpleon_production_jwt_secret_key_99887766',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  chains: {
    bscTestnet: {
      chainId: 97,
      name: 'BNB Smart Chain Testnet',
      rpcUrl: process.env.BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      explorerUrl: 'https://testnet.bscscan.com',
      symbol: 'tBNB',
    },
    bscMainnet: {
      chainId: 56,
      name: 'BNB Smart Chain Mainnet',
      rpcUrl: process.env.BSC_MAINNET_RPC || 'https://bsc-dataseed.binance.org/',
      explorerUrl: 'https://bscscan.com',
      symbol: 'BNB',
    },
  },
  
  contracts: {
    boosterAddress: process.env.SIMPLEON_BOOSTER_ADDRESS || '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    usdtAddress: process.env.MOCK_USDT_ADDRESS || '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  },
  
  boosterMultipliers: {
    starter: 1,    // 1x Base Plan
    builder: 4,    // 4x Base Plan
    leader: 16,   // 16x Base Plan
    champion: 64,  // 64x Base Plan
    mainPlan: 100, // 100x Base Plan
  }
};
