import { AuthService } from './AuthService.js';

export class UserService {
  static getUserProfile(address: string) {
    const user = AuthService.getUser(address);
    if (!user) {
      throw new Error('User profile not found');
    }

    const allUsers = AuthService.getAllUsers();
    const directReferrals = allUsers.filter(u => u.referrerAddress === address.toLowerCase());

    return {
      user,
      referralLink: `https://simpleon.io/?ref=${user.address}`,
      directReferrals: directReferrals.map(r => ({
        address: r.address,
        tier: r.tier,
        createdAt: r.createdAt
      }))
    };
  }

  static updateBasePlan(address: string, newBasePlan: number) {
    const user = AuthService.getUser(address);
    if (!user) {
      throw new Error('User profile not found');
    }

    if (newBasePlan < 0.1 || newBasePlan > 1000) {
      throw new Error('Base plan amount must be between 0.1 and 1000 USDT');
    }

    user.basePlanAmount = newBasePlan;
    AuthService.saveUser(user);
    return user;
  }
}
