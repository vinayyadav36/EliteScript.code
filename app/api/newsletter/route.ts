import { NextRequest, NextResponse } from 'next/server';
import { listNewsletterSubscribers, getNewsletterSubscriberByEmail, addNewsletterSubscriber } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/newsletter - list all subscribers (admin only)
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  return NextResponse.json(listNewsletterSubscribers());
}

// POST /api/newsletter - subscribe
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ success: false, message: 'Valid email is required' }, { status: 400 });

  const existing = getNewsletterSubscriberByEmail(email);
  if (existing) {
    return NextResponse.json({ success: false, message: 'This email is already subscribed.' }, { status: 409 });
  }

  addNewsletterSubscriber(email);
  return NextResponse.json({ success: true, message: 'Subscribed successfully!' }, { status: 201 });
}
