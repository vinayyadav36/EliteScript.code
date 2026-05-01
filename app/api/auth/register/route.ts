import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0)
    return NextResponse.json({ message: 'Name is required' }, { status: 400 });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
  if (!password || password.length < 6)
    return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });

  const existing = getUserByEmail(email);
  if (existing) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  const user = createUser({ name: name.trim(), email: email.trim(), password: hash, role: 'user' });

  const { token, jti } = signToken({ id: user.id, role: user.role });
  return NextResponse.json({ token, jti }, { status: 201 });
}
