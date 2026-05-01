import { NextRequest, NextResponse } from 'next/server';
import { listChatMessages, addChatMessage } from '@/lib/db';

// GET /api/chat - fetch messages for a room
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room') || 'general';
  const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

  const messages = listChatMessages(room, limit);
  return NextResponse.json(messages);
}

// POST /api/chat - send a message
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user, message, room } = body;

  if (!user || typeof user !== 'string' || user.trim().length === 0)
    return NextResponse.json({ message: 'User is required' }, { status: 400 });
  if (!message || typeof message !== 'string' || message.trim().length === 0)
    return NextResponse.json({ message: 'Message is required' }, { status: 400 });

  const safeRoom = (room && typeof room === 'string' && room.trim()) ? room.trim() : 'general';
  const saved = addChatMessage({ user: user.trim(), message: message.trim(), room: safeRoom });

  return NextResponse.json({ success: true, message: 'Message sent successfully', data: saved }, { status: 201 });
}
