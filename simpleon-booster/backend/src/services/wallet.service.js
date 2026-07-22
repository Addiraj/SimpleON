import { User } from '../models/index.js';

export const walletService = {
  /**
   * Connect a wallet. Finds existing user by wallet_address or creates a new one.
   * Updates connection status and timestamp.
   */
  async connectWallet(walletAddress, provider = null) {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Find or create user
    let [user, created] = await User.findOrCreate({
      where: { wallet_address: normalizedAddress },
      defaults: {
        wallet_address: normalizedAddress,
        wallet_provider: provider,
        is_connected: true,
        last_connected_at: new Date()
      }
    });

    // If user already existed, update their connection status
    if (!created) {
      user.is_connected = true;
      user.last_connected_at = new Date();
      if (provider) user.wallet_provider = provider;
      await user.save();
    }

    return { user, isNew: created };
  },

  /**
   * Disconnect a wallet. Sets is_connected to false.
   */
  async disconnectWallet(walletAddress) {
    if (!walletAddress) return false;
    
    const normalizedAddress = walletAddress.toLowerCase();
    const result = await User.update(
      { is_connected: false },
      { where: { wallet_address: normalizedAddress } }
    );

    return result[0] > 0;
  }
};
