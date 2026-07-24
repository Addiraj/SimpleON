import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/config.js';

export interface JwtPayload {
  userId: string;
  walletAddress: string;
}

export class JwtUtil {
  /**
   * Sign short-lived JWT access token
   */
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      {
        userId: payload.userId,
        address: payload.walletAddress.toLowerCase(),
      },
      config.jwtSecret,
      {
        expiresIn: '15m', // Short-lived access token requirement
      }
    );
  }

  /**
   * Verify JWT access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      return {
        userId: decoded.userId || decoded.id,
        walletAddress: (decoded.address || decoded.walletAddress).toLowerCase(),
      };
    } catch (err) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Generate cryptographically secure refresh token
   */
  static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  /**
   * Hash token (SHA-256) for secure DB storage
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate cryptographically secure 32-byte nonce
   */
  static generateNonce(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create human-readable SIWE signing message
   */
  static createSigningMessage(walletAddress: string, nonce: string, chainId = 97): string {
    const cleanAddress = walletAddress.toLowerCase();
    const timestamp = new Date().toISOString();
    return (
      `Welcome to SimpleOn Web3 Booster Platform!\n\n` +
      `Please sign this message to verify wallet ownership:\n\n` +
      `Wallet Address: ${cleanAddress}\n` +
      `Nonce: ${nonce}\n` +
      `Chain ID: ${chainId}\n` +
      `Timestamp: ${timestamp}\n\n` +
      `This signature is free and does not trigger any blockchain transaction or gas fee.`
    );
  }
}

export default JwtUtil;
