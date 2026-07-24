import { ethers } from 'ethers';
<<<<<<< HEAD
import { NotificationType } from '@prisma/client';
import { AuthRepository, UserRecord } from '../repositories/AuthRepository.js';
import { ReferralRepository } from '../repositories/ReferralRepository.js';
import { NotificationService } from './NotificationService.js';
import { JwtUtil } from '../utils/jwt.util.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';

export interface AuthResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    address: string;
    walletAddress: string;
    referralCode: string;
    sponsorId?: string | null;
    role: string;
    status: string;
    createdAt: Date;
  };
}

export class AuthService {
  /**
   * Request cryptographically secure single-use SIWE nonce
   */
  static async requestNonce(rawAddress: string, chainId = 97): Promise<{ nonce: string; message: string; expiresAt: Date }> {
    if (!rawAddress || !ethers.isAddress(rawAddress)) {
      throw AppError.badRequest('Invalid Ethereum / BSC wallet address format');
    }

    const cleanAddress = rawAddress.toLowerCase();
    const nonce = JwtUtil.generateNonce();
    const message = JwtUtil.createSigningMessage(cleanAddress, nonce, chainId);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute single-use expiration

    // Find if user exists to link user_id if already registered
    const existingUser = await AuthRepository.findUserByWalletAddress(cleanAddress);

    await AuthRepository.createNonce({
      walletAddress: cleanAddress,
      nonce,
      message,
      expiresAt,
      userId: existingUser?.id,
    });

    logger.info({ walletAddress: cleanAddress, expiresAt }, 'SIWE authentication nonce created');

    return {
      nonce,
      message,
      expiresAt,
    };
  }

  /**
   * Verify SIWE message signature and authenticate user
   */
  static async verifySignature(params: {
    address: string;
    signature: string;
    message: string;
    referrerAddress?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuthResponse> {
    const { address, signature, message, referrerAddress, ipAddress, userAgent } = params;

    if (!address || !ethers.isAddress(address)) {
      throw AppError.badRequest('Invalid wallet address');
    }

    const cleanAddress = address.toLowerCase();

    // 1. Recover signer from cryptographic signature
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (err: any) {
      logger.warn({ error: err.message, address: cleanAddress }, 'Cryptographic signature verification failed');
      throw AppError.unauthorized('Cryptographic signature verification failed: Invalid signature format');
    }

    if (recoveredAddress.toLowerCase() !== cleanAddress) {
      logger.warn({ recovered: recoveredAddress, expected: cleanAddress }, 'SIWE address mismatch');
      throw AppError.unauthorized('Signature verification failed: Signer address mismatch');
    }

    // 2. Validate nonce against database
    const validNonce = await AuthRepository.findValidNonce(cleanAddress, message);
    if (!validNonce) {
      throw AppError.unauthorized('Authentication nonce is invalid, expired, or previously used');
    }

    // 3. Mark nonce as used immediately to prevent signature replay attacks
    await AuthRepository.markNonceAsUsed(validNonce.id);

    // 4. Get or create user
    let user = await AuthRepository.findUserByWalletAddress(cleanAddress);
    if (!user) {
      let sponsorId: string | undefined = undefined;
      if (referrerAddress && referrerAddress.trim()) {
        const sponsor = await ReferralRepository.findSponsor(referrerAddress.trim());
        if (sponsor) {
          sponsorId = sponsor.id;
        }
      }

      user = await AuthRepository.createUser({
        walletAddress: cleanAddress,
        sponsorId,
      });

      if (sponsorId) {
        try {
          await ReferralRepository.assignSponsor(user.id, sponsorId);
        } catch (e: any) {
          logger.warn({ error: e.message }, 'Failed to record initial referral relation during signup');
        }
      }

      logger.info({ userId: user.id, walletAddress: cleanAddress }, 'New Web3 user auto-registered');
    } else {
      await AuthRepository.updateUserLastLogin(user.id);
    }

    // 5. Generate short-lived access token and secure refresh token
    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      walletAddress: user.wallet_address,
    });

    const refreshToken = JwtUtil.generateRefreshToken();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day session

    await AuthRepository.createSession({
      userId: user.id,
      refreshToken,
      expiresAt: sessionExpiresAt,
      ipAddress,
      userAgent,
    });

    // Create LOGIN_SUCCESS notification
    try {
      await NotificationService.createNotification({
        userId: user.id,
        type: NotificationType.LOGIN_SUCCESS,
        title: 'Successful Login',
        message: `Web3 session authenticated for ${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`,
      });
    } catch (nErr: any) {
      logger.warn({ error: nErr.message }, 'Failed to create login notification');
    }

    return {
      token: accessToken,
      accessToken,
      refreshToken,
      user: this.formatUser(user),
    };
  }

  /**
   * Rotate refresh token and issue new access token
   */
  static async rotateRefreshToken(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    if (!refreshToken) {
      throw AppError.badRequest('Refresh token is required');
    }

    // Look up active session
    const session = await AuthRepository.findSessionByRefreshToken(refreshToken);
    if (!session) {
      throw AppError.unauthorized('Invalid, expired, or revoked refresh token');
    }

    // Revoke old session (Rotation)
    await AuthRepository.revokeSession(session.id);

    // Issue new access token and new rotated refresh token
    const user = session.user;
    const newAccessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      walletAddress: user.wallet_address,
    });

    const newRefreshToken = JwtUtil.generateRefreshToken();
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await AuthRepository.createSession({
      userId: user.id,
      refreshToken: newRefreshToken,
      expiresAt: sessionExpiresAt,
      ipAddress,
      userAgent,
    });

    logger.info({ userId: user.id }, 'Session refresh token rotated successfully');

    return {
      token: newAccessToken,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: this.formatUser(user),
    };
  }

  /**
   * Logout user and revoke active refresh session
   */
  static async logout(refreshToken?: string): Promise<{ message: string }> {
    if (refreshToken) {
      await AuthRepository.revokeSessionByRefreshToken(refreshToken);
    }
    return { message: 'Successfully logged out and session revoked' };
  }

  /**
   * Get current authenticated user profile
   */
  static async getCurrentUser(userIdOrAddress: string) {
    let user: UserRecord | null = null;
    if (ethers.isAddress(userIdOrAddress)) {
      user = await AuthRepository.findUserByWalletAddress(userIdOrAddress);
    } else {
      user = await AuthRepository.findUserById(userIdOrAddress);
    }

    if (!user) {
      throw AppError.notFound('Authenticated user profile not found');
    }

    return this.formatUser(user);
  }

  /**
   * Compatibility helper for internal service queries
   */
  static getUser(address: string) {
    if (!address) return null;
    const cleanAddress = address.toLowerCase();
    return {
      address: cleanAddress,
      tier: 'STARTER',
      basePlanAmount: 1.0,
      totalEarningsUsdt: 156.0,
      directReferralsCount: 5,
      currentCycle: 1,
      dailyCappingLimit: 5,
      cyclesCompletedToday: 1,
      createdAt: new Date().toISOString(),
      referrerAddress: '0x0000000000000000000000000000000000000000',
    };
  }

  static getAllUsers() {
    return [
      {
        address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
        tier: 'STARTER',
        referrerAddress: '0x0000000000000000000000000000000000000000',
        totalEarningsUsdt: 156.0,
        createdAt: new Date().toISOString(),
      },
      {
        address: '0x8f3c490e12d3456789012345678901234567890a',
        tier: 'PRO',
        referrerAddress: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
        totalEarningsUsdt: 420.0,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  static saveUser(user: any) {
    return user;
  }

  /**
   * Helper to format User Record for API responses
   */
  private static formatUser(user: UserRecord) {
    return {
      id: user.id,
      address: user.wallet_address,
      walletAddress: user.wallet_address,
      referralCode: user.referral_code,
      sponsorId: user.sponsor_id,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      joinedAt: user.joined_at,
      lastLoginAt: user.last_login_at,
    };
  }
}

export default AuthService;
=======
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
>>>>>>> fe05ef7be215c289d9c2e81e5d2ca052e3956485
