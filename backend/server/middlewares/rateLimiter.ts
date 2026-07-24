import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 auth requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication requests from this IP, please try again after a minute',
      statusCode: 429,
    },
  },
});
