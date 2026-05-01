import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { isSessionRevoked } from './db';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}
const SECRET = JWT_SECRET || 'fallback-dev-secret-change-in-production';

export interface JwtPayload {
  id: string;
  role: string;
  jti?: string;
}

export function verifyToken(req: NextRequest): JwtPayload | null {
  const token = req.headers.get('x-auth-token') || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as { user: JwtPayload; jti?: string };
    const payload = decoded.user;
    const jti = decoded.jti || payload.jti || '';
    // Check if this session has been revoked by admin
    if (jti && isSessionRevoked(jti, payload.id)) return null;
    return { ...payload, jti };
  } catch {
    return null;
  }
}

export function signToken(payload: Omit<JwtPayload, 'jti'>): { token: string; jti: string } {
  const jti = randomUUID();
  const token = jwt.sign({ user: { ...payload, jti }, jti }, SECRET, { expiresIn: '7d' });
  return { token, jti };
}
