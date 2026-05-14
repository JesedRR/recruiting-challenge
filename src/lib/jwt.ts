import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h';

export function generateToken(merchantId: string): string {
  return jwt.sign({ merchantId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { merchantId: string };
    return decoded.merchantId;
  } catch (error) {
    return null;
  }
}