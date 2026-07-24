import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server/app.js';
import { AuthRepository } from '../../server/repositories/AuthRepository.js';
import { UserRepository } from '../../server/repositories/UserRepository.js';
import { JwtUtil } from '../../server/utils/jwt.util.js';
import { createTestWallet, resetAllTestStores } from '../helpers/testUtils.js';

describe('11-13. User Profile & Preferences Unit Tests', () => {
  beforeEach(() => {
    resetAllTestStores();
  });

  it('11. User profile retrieval returns user details and stats', async () => {
    const testWallet = createTestWallet();
    const user = await AuthRepository.createUser({ walletAddress: testWallet.address });
    const token = JwtUtil.generateAccessToken({ userId: user.id, walletAddress: user.wallet_address });

    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.walletAddress).toBe(testWallet.address);
    expect(res.body.data.profile.referralCode).toBeDefined();
  });

  it('12. Profile update validation enforces email format and display name constraints', async () => {
    const testWallet = createTestWallet();
    const user = await AuthRepository.createUser({ walletAddress: testWallet.address });
    const token = JwtUtil.generateAccessToken({ userId: user.id, walletAddress: user.wallet_address });

    // Invalid email format
    const resInvalid = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not-an-email' });

    expect(resInvalid.status).toBe(400);

    // Valid profile update
    const resValid = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'Web3 Builder', email: 'builder@example.com' });

    expect(resValid.status).toBe(200);
    expect(resValid.body.data.profile.displayName).toBe('Web3 Builder');
    expect(resValid.body.data.profile.email).toBe('builder@example.com');
  });

  it('13. User preferences endpoint retrieves and updates notification/UI preferences', async () => {
    const testWallet = createTestWallet();
    const user = await AuthRepository.createUser({ walletAddress: testWallet.address });
    const token = JwtUtil.generateAccessToken({ userId: user.id, walletAddress: user.wallet_address });

    // Get default preferences
    const resGet = await request(app)
      .get('/api/user/preferences')
      .set('Authorization', `Bearer ${token}`);

    expect(resGet.status).toBe(200);
    expect(resGet.body.data.preferences).toBeDefined();

    // Update preferences
    const resUpdate = await request(app)
      .put('/api/user/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ emailNotifications: false, theme: 'DARK' });

    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.data.preferences.emailNotifications).toBe(false);
    expect(resUpdate.body.data.preferences.theme).toBe('DARK');
  });
});
