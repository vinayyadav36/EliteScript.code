import { NextRequest, NextResponse } from 'next/server';
import { listRevokedSessions, listUsers } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/revoked-sessions — list all revoked sessions (admin only)
export async function GET(req: NextRequest) {
  const admin = verifyToken(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const revoked = listRevokedSessions();
  const users = listUsers();
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.email]));

  const enriched = revoked.map((r) => ({
    ...r,
    user_email: userMap[r.user_id] || 'Unknown',
  }));

  return NextResponse.json(enriched);
}
