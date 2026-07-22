import { walletService } from '../services/wallet.service.js';

export const connectWallet = async (req, res, next) => {
  try {
    const { address, provider } = req.body;
    
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    const result = await walletService.connectWallet(address, provider);

    // Placeholder: We would normally return a JWT here for authenticated sessions
    res.json({
      success: true,
      data: {
        user: {
          memberId: result.user.member_id,
          address: result.user.wallet_address,
          isNew: result.isNew
        }
      },
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const disconnectWallet = async (req, res, next) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    await walletService.disconnectWallet(address);

    res.json({
      success: true,
      message: 'Wallet disconnected successfully'
    });
  } catch (error) {
    next(error);
  }
};
