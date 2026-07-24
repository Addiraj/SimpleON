<<<<<<< HEAD
import { env } from './env.js';

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
=======
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'simpleon_production_jwt_secret_key_99887766',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
  
  chains: {
    bscTestnet: {
      chainId: 97,
      name: 'BNB Smart Chain Testnet',
<<<<<<< HEAD
      rpcUrl: env.BSC_TESTNET_RPC,
=======
      rpcUrl: process.env.BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
      explorerUrl: 'https://testnet.bscscan.com',
      symbol: 'tBNB',
    },
    bscMainnet: {
      chainId: 56,
      name: 'BNB Smart Chain Mainnet',
<<<<<<< HEAD
      rpcUrl: env.BSC_MAINNET_RPC,
=======
      rpcUrl: process.env.BSC_MAINNET_RPC || 'https://bsc-dataseed.binance.org/',
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
      explorerUrl: 'https://bscscan.com',
      symbol: 'BNB',
    },
  },
  
  contracts: {
<<<<<<< HEAD
    boosterAddress: env.SIMPLEON_BOOSTER_ADDRESS,
    usdtAddress: env.MOCK_USDT_ADDRESS,
=======
    boosterAddress: process.env.SIMPLEON_BOOSTER_ADDRESS || '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    usdtAddress: process.env.MOCK_USDT_ADDRESS || '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
  },
  
  boosterMultipliers: {
    starter: 1,    // 1x Base Plan
    builder: 4,    // 4x Base Plan
    leader: 16,   // 16x Base Plan
    champion: 64,  // 64x Base Plan
    mainPlan: 100, // 100x Base Plan
  }
};
