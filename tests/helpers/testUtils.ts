import { ethers } from 'ethers';
import { AuthRepository } from '../../server/repositories/AuthRepository.js';
import { UserRepository } from '../../server/repositories/UserRepository.js';
import { ReferralRepository } from '../../server/repositories/ReferralRepository.js';
import { PaymentRepository } from '../../server/repositories/PaymentRepository.js';
import { MatrixRepository } from '../../server/repositories/MatrixRepository.js';

export interface TestWalletUser {
  wallet: ethers.HDNodeWallet;
  address: string;
}

export function createTestWallet(): TestWalletUser {
  const wallet = ethers.Wallet.createRandom();
  return {
    wallet,
    address: wallet.address.toLowerCase(),
  };
}

export function resetAllTestStores(): void {
  AuthRepository.resetMemoryStore();
  UserRepository.resetMemoryStore();
  ReferralRepository.resetMemoryStore();
  PaymentRepository.resetMemoryStore();
  MatrixRepository.resetMemoryStore();
}
