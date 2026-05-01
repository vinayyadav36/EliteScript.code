import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password)
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });

  const user = getUserByEmail(email);
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });

  const { token, jti } = signToken({ id: user.id, role: user.role });
  return NextResponse.json({
    token,
    jti,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
