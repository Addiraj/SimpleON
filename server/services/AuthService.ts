import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// In-memory persistent Web3 auth state store for container execution
interface UserRecord {
  address: string;
  referrerAddress?: string;
  tier: 'STARTER' | 'BUILDER' | 'LEADER' | 'CHAMPION' | 'MAIN_PLAN';
  basePlanAmount: number;
  totalEarningsUsdt: number;
  directReferralsCount: number;
  currentCycle: number;
  dailyCappingLimit: number;
  cyclesCompletedToday: number;
  createdAt: string;
}

const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();
const userStore = new Map<string, UserRecord>();

// Seed root owner account
userStore.set('0x0000000000000000000000000000000000000000', {
  address: '0x0000000000000000000000000000000000000000',
  tier: 'CHAMPION',
  basePlanAmount: 1.0,
  totalEarningsUsdt: 12500.0,
  directReferralsCount: 42,
  currentCycle: 12,
  dailyCappingLimit: 25,
  cyclesCompletedToday: 2,
  createdAt: new Date().toISOString()
});

export class AuthService {
  /**
   * Generate a unique cryptographic SIWE nonce for a wallet address
   */
  static generateNonce(address: string): { nonce: string; message: string; expiresAt: number } {
    const cleanAddress = address.toLowerCase();
    const nonce = `SimpleOn Auth Nonce: ${Math.floor(Math.random() * 1000000000)}`;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    nonceStore.set(cleanAddress, { nonce, expiresAt });

    const message = `Welcome to SimpleOn Web3 Booster Platform!\n\nPlease sign this message to verify wallet ownership:\n\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

    return { nonce, message, expiresAt };
  }

  /**
   * Verify EIP-191 wallet signature and issue JWT session token
   */
  static verifySignature(
    address: string,
    signature: string,
    message: string,
    referrerAddress?: string
  ): { token: string; user: UserRecord } {
    const cleanAddress = address.toLowerCase();

    // Verify ECDSA signature against message using ethers
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature).toLowerCase();
    } catch (err) {
      throw new Error('Invalid signature format');
    }

    if (recoveredAddress !== cleanAddress) {
      throw new Error('Cryptographic signature verification failed: Signer address mismatch');
    }

    // Retrieve or initialize user
    let user = userStore.get(cleanAddress);
    if (!user) {
      user = {
        address: cleanAddress,
        referrerAddress: referrerAddress ? referrerAddress.toLowerCase() : undefined,
        tier: 'STARTER',
        basePlanAmount: 1.0,
        totalEarningsUsdt: 0.0,
        directReferralsCount: 0,
        currentCycle: 1,
        dailyCappingLimit: 5,
        cyclesCompletedToday: 0,
        createdAt: new Date().toISOString()
      };
      userStore.set(cleanAddress, user);

      // Update referrer's direct referrals count if available
      if (user.referrerAddress && userStore.has(user.referrerAddress)) {
        const refUser = userStore.get(user.referrerAddress)!;
        refUser.directReferralsCount += 1;
      }
    }

    // Sign JWT token
    const token = jwt.sign({ address: cleanAddress }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    return { token, user };
  }

  static getUser(address: string): UserRecord | undefined {
    return userStore.get(address.toLowerCase());
  }

  static getAllUsers(): UserRecord[] {
    return Array.from(userStore.values());
  }

  static saveUser(user: UserRecord): void {
    userStore.set(user.address.toLowerCase(), user);
  }
}
