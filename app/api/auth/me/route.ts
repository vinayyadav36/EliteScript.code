import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const decoded = verifyToken(req);
  if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = getUserById(decoded.id);
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  const { password: _p, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
