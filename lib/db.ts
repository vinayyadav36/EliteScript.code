import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ChatMessageRecord {
  id: string;
  user: string;
  message: string;
  room: string;
  created_at: string;
}

export interface NewsletterSubscriberRecord {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface RevokedSessionRecord {
  jti: string;
  user_id: string;
  revoked_at: string;
  reason?: string;
}

interface PortfolioDatabase {
  users: UserRecord[];
  contact_messages: ContactMessageRecord[];
  chat_messages: ChatMessageRecord[];
  newsletter_subscribers: NewsletterSubscriberRecord[];
  revoked_sessions: RevokedSessionRecord[];
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'portfolio.json');

let initialized = false;

function nowIso(): string {
  return new Date().toISOString();
}

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const emptyDb: PortfolioDatabase = {
      users: [],
      contact_messages: [],
      chat_messages: [],
      newsletter_subscribers: [],
      revoked_sessions: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(emptyDb, null, 2), 'utf-8');
  }
}

function readDb(): PortfolioDatabase {
  ensureDataFile();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as Partial<PortfolioDatabase>;

  return {
    users: parsed.users ?? [],
    contact_messages: parsed.contact_messages ?? [],
    chat_messages: parsed.chat_messages ?? [],
    newsletter_subscribers: parsed.newsletter_subscribers ?? [],
    revoked_sessions: parsed.revoked_sessions ?? [],
  };
}

function writeDb(data: PortfolioDatabase): void {
  ensureDataFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function ensureInitialized(): void {
  if (initialized) return;

  const db = readDb();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@vinay.dev').toLowerCase().trim();
  const hasAdmin = db.users.some((user) => user.email.toLowerCase() === adminEmail);

  if (!hasAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    db.users.push({
      id: generateId(),
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      role: 'admin',
      created_at: nowIso(),
    });
    writeDb(db);
    console.log(`[DB] Default admin user created: ${adminEmail}`);
  }

  initialized = true;
}

export function generateId(): string {
  return randomUUID();
}

export function getUserByEmail(email: string): UserRecord | null {
  ensureInitialized();
  const normalized = email.toLowerCase().trim();
  return readDb().users.find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export function getUserById(id: string): UserRecord | null {
  ensureInitialized();
  return readDb().users.find((user) => user.id === id) ?? null;
}

export function createUser(input: { name: string; email: string; password: string; role?: 'admin' | 'user' }): UserRecord {
  ensureInitialized();
  const db = readDb();

  const user: UserRecord = {
    id: generateId(),
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    password: input.password,
    role: input.role ?? 'user',
    created_at: nowIso(),
  };

  db.users.push(user);
  writeDb(db);
  return user;
}

export function listContactMessages(): ContactMessageRecord[] {
  ensureInitialized();
  return readDb().contact_messages.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function addContactMessage(input: { name: string; email: string; message: string }): ContactMessageRecord {
  ensureInitialized();
  const db = readDb();

  const contactMessage: ContactMessageRecord = {
    id: generateId(),
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    created_at: nowIso(),
  };

  db.contact_messages.push(contactMessage);
  writeDb(db);
  return contactMessage;
}

export function deleteContactMessage(id: string): boolean {
  ensureInitialized();
  const db = readDb();
  const before = db.contact_messages.length;
  db.contact_messages = db.contact_messages.filter((message) => message.id !== id);

  if (db.contact_messages.length === before) return false;

  writeDb(db);
  return true;
}

export function listChatMessages(room: string, limit: number): ChatMessageRecord[] {
  ensureInitialized();
  const normalizedRoom = room.trim() || 'general';

  return readDb().chat_messages
    .filter((message) => message.room === normalizedRoom)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(0, limit);
}

export function addChatMessage(input: { user: string; message: string; room: string }): ChatMessageRecord {
  ensureInitialized();
  const db = readDb();

  const chatMessage: ChatMessageRecord = {
    id: generateId(),
    user: input.user.trim(),
    message: input.message.trim(),
    room: input.room.trim() || 'general',
    created_at: nowIso(),
  };

  db.chat_messages.push(chatMessage);
  writeDb(db);
  return chatMessage;
}

export function listNewsletterSubscribers(): NewsletterSubscriberRecord[] {
  ensureInitialized();
  return readDb().newsletter_subscribers.sort((a, b) => b.subscribed_at.localeCompare(a.subscribed_at));
}

export function getNewsletterSubscriberByEmail(email: string): NewsletterSubscriberRecord | null {
  ensureInitialized();
  const normalized = email.toLowerCase().trim();
  return readDb().newsletter_subscribers.find((subscriber) => subscriber.email === normalized) ?? null;
}

export function addNewsletterSubscriber(email: string): NewsletterSubscriberRecord {
  ensureInitialized();
  const db = readDb();

  const subscriber: NewsletterSubscriberRecord = {
    id: generateId(),
    email: email.toLowerCase().trim(),
    subscribed_at: nowIso(),
  };

  db.newsletter_subscribers.push(subscriber);
  writeDb(db);
  return subscriber;
}

export function deleteNewsletterSubscriber(id: string): boolean {
  ensureInitialized();
  const db = readDb();
  const before = db.newsletter_subscribers.length;
  db.newsletter_subscribers = db.newsletter_subscribers.filter((subscriber) => subscriber.id !== id);

  if (db.newsletter_subscribers.length === before) return false;

  writeDb(db);
  return true;
}

// ─── Session Revocation ───────────────────────────────────────────────────────

export function revokeSession(jti: string, userId: string, reason?: string): void {
  ensureInitialized();
  const db = readDb();
  const already = db.revoked_sessions.some((r) => r.jti === jti);
  if (already) return;
  db.revoked_sessions.push({ jti, user_id: userId, revoked_at: nowIso(), reason });
  writeDb(db);
}

export function revokeAllUserSessions(userId: string, reason?: string): void {
  ensureInitialized();
  const db = readDb();
  // Mark a special wildcard record keyed by user_id so all JTIs for that user are invalid
  const existing = db.revoked_sessions.find((r) => r.jti === `user:${userId}`);
  if (existing) {
    existing.revoked_at = nowIso();
    existing.reason = reason;
  } else {
    db.revoked_sessions.push({ jti: `user:${userId}`, user_id: userId, revoked_at: nowIso(), reason });
  }
  writeDb(db);
}

export function isSessionRevoked(jti: string, userId: string): boolean {
  ensureInitialized();
  const db = readDb();
  // Check specific JTI or wildcard user revocation
  return db.revoked_sessions.some((r) => r.jti === jti || r.jti === `user:${userId}`);
}

export function listRevokedSessions(): RevokedSessionRecord[] {
  ensureInitialized();
  return readDb().revoked_sessions.sort((a, b) => b.revoked_at.localeCompare(a.revoked_at));
}

export function clearExpiredRevocations(olderThanDays = 30): void {
  ensureInitialized();
  const db = readDb();
  const cutoff = new Date(Date.now() - olderThanDays * 86400000).toISOString();
  db.revoked_sessions = db.revoked_sessions.filter((r) => r.revoked_at > cutoff);
  writeDb(db);
}

// ─── Users listing (admin) ───────────────────────────────────────────────────

export function listUsers(): Omit<UserRecord, 'password'>[] {
  ensureInitialized();
  return readDb().users.map(({ password: _p, ...u }) => u);
}
