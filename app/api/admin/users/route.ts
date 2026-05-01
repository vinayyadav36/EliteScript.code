import { NextRequest, NextResponse } from 'next/server';
import { listUsers } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/users — list all registered users (admin only)
export async function GET(req: NextRequest) {
  const admin = verifyToken(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (admin.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  return NextResponse.json(listUsers());
}
