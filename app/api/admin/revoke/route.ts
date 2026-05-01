import { NextRequest, NextResponse } from 'next/server';
import { revokeAllUserSessions, listUsers } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// POST /api/admin/revoke — revoke all active sessions for a user
export async function POST(req: NextRequest) {
  const admin = verifyToken(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { userId, reason } = body;

  if (!userId || typeof userId !== 'string')
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });

  // Confirm user exists
  const users = listUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  revokeAllUserSessions(userId, reason || 'Revoked by admin');

  return NextResponse.json({
    success: true,
    message: `All sessions for ${target.email} have been revoked. They will be logged out on next request.`,
  });
}
