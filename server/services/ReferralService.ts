import { ReferralRepository } from '../repositories/ReferralRepository.js';
import { AuthRepository } from '../repositories/AuthRepository.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../config/logger.js';

export class ReferralService {
  /**
   * Validate a referral code or sponsor wallet address
   */
  static async validateReferralCode(
    referralCode: string,
    currentUserId?: string,
    currentUserAddress?: string
  ) {
    if (!referralCode || !referralCode.trim()) {
      throw AppError.badRequest('Referral code is required');
    }

    const sponsor = await ReferralRepository.findSponsor(referralCode.trim());
    if (!sponsor) {
      return {
        valid: false,
        message: 'Invalid referral code or sponsor not found',
        sponsor: null,
      };
    }

    // Check self-referral
    if (
      (currentUserId && sponsor.id === currentUserId) ||
      (currentUserAddress && sponsor.wallet_address.toLowerCase() === currentUserAddress.toLowerCase())
    ) {
      return {
        valid: false,
        message: 'Self-referral is strictly forbidden',
        sponsor: null,
      };
    }

    const addr = sponsor.wallet_address;
    const shortAddress = `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return {
      valid: true,
      message: 'Sponsor verified successfully',
      sponsor: {
        id: sponsor.id,
        walletAddress: addr,
        shortWalletAddress: shortAddress,
        referralCode: sponsor.referral_code,
        displayName: sponsor.display_name || null,
        status: sponsor.status || 'ACTIVE',
      },
    };
  }

  /**
   * Assign sponsor to user with full validations
   */
  static async assignSponsor(userId: string, codeOrAddress: string) {
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }

    if (!codeOrAddress || !codeOrAddress.trim()) {
      throw AppError.badRequest('Referral code or sponsor address is required');
    }

    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const sponsor = await ReferralRepository.findSponsor(codeOrAddress.trim());
    if (!sponsor) {
      throw AppError.notFound('Referral sponsor not found');
    }

    // Rule: Prevent sponsor changes after sponsor is set to a DIFFERENT sponsor
    if (user.sponsor_id && user.sponsor_id !== sponsor.id) {
      throw AppError.badRequest('User already has an assigned sponsor relationship and cannot be changed');
    }

    // Rule: Prevent self-referral
    if (sponsor.id === userId || sponsor.wallet_address.toLowerCase() === user.wallet_address.toLowerCase()) {
      throw AppError.badRequest('Self-referral: You cannot refer yourself');
    }

    // Rule: Prevent duplicate relationship
    const exists = await ReferralRepository.hasRelation(sponsor.id, userId);
    if (exists) {
      throw AppError.conflict('Referral relationship already exists');
    }

    const result = await ReferralRepository.assignSponsor(userId, sponsor.id);

    logger.info(
      { userId, sponsorId: sponsor.id, relationsCreated: result.totalRelationsCreated },
      'Sponsor assigned and referral network updated'
    );

    return {
      sponsorId: sponsor.id,
      sponsorWallet: sponsor.wallet_address,
      sponsorReferralCode: sponsor.referral_code,
      relationsCreated: result.totalRelationsCreated,
    };
  }

  /**
   * Get Referral Summary
   */
  static async getSummary(userId: string, host?: string, protocol?: string) {
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }
    return ReferralRepository.getSummary(userId, host, protocol);
  }

  /**
   * Get Direct Referrals List (Paginated)
   */
  static async getDirectReferrals(
    userId: string,
    options: { page?: number; limit?: number; search?: string }
  ) {
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    return ReferralRepository.getDirectReferrals(userId, {
      page,
      limit,
      search: options.search,
    });
  }

  /**
   * Get Network Tree
   */
  static async getReferralTree(userId: string, options: { maxDepth?: number; search?: string }) {
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }
    const maxDepth = Math.min(13, Math.max(1, Number(options.maxDepth) || 5));
    return ReferralRepository.getReferralTree(userId, maxDepth, options.search);
  }

  /**
   * Get Referral Link & Code
   */
  static async getReferralLink(userId: string, host = 'simpleon.io', protocol = 'https') {
    if (!userId) {
      throw AppError.unauthorized('Authentication required');
    }

    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const referralCode = user.referral_code || `SO-${userId.substring(0, 8).toUpperCase()}`;
    const referralUrl = `${protocol}://${host}/?ref=${referralCode}`;

    return {
      referralCode,
      referralUrl,
    };
  }
}

export default ReferralService;
