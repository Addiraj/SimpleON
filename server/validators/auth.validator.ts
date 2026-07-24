import { z } from 'zod';

export const getNonceSchema = z.object({
  walletAddress: z.string().optional(),
  address: z.string().optional(),
  chainId: z.coerce.number().optional(),
}).refine((data) => !!(data.walletAddress || data.address), {
  message: 'walletAddress or address parameter is required',
  path: ['walletAddress'],
});

export const verifySignatureSchema = z.object({
  address: z.string().optional(),
  walletAddress: z.string().optional(),
  signature: z.string().min(10, 'Signature is required'),
  message: z.string().min(10, 'Message is required'),
  referrerAddress: z.string().optional(),
}).refine((data) => !!(data.address || data.walletAddress), {
  message: 'address or walletAddress is required',
  path: ['address'],
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});
