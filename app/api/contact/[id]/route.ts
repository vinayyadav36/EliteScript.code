import { NextRequest, NextResponse } from 'next/server';
import { deleteContactMessage } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// DELETE /api/contact/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const deleted = deleteContactMessage(params.id);
  if (!deleted) return NextResponse.json({ message: 'Message not found' }, { status: 404 });

  return NextResponse.json({ success: true, message: 'Message deleted successfully' });
}
