'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Trash2, RefreshCw, LogOut, Mail, MessageSquare, Users,
  Download, ShieldOff, ShieldCheck, AlertCircle
} from 'lucide-react';

interface ContactMessage {
  id: string; name: string; email: string; message: string; created_at: string;
}
interface NewsletterSubscriber {
  id: string; email: string; subscribed_at: string;
}
interface ChatMsg {
  id: string; user: string; message: string; room: string; created_at: string;
}
interface AppUser {
  id: string; name: string; email: string; role: string; created_at: string;
}
interface RevokedSession {
  jti: string; user_id: string; user_email: string; revoked_at: string; reason?: string;
}

type Tab = 'contact' | 'newsletter' | 'chat' | 'users';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('contact');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [revokedSessions, setRevokedSessions] = useState<RevokedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [revoking, setRevoking] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) { setToken(storedToken); setIsAuthenticated(true); fetchAll(storedToken); }
    else setLoading(false);
  }, []);

  const authHeaders = (t: string) => ({ 'x-auth-token': t, 'Content-Type': 'application/json' });

  const fetchAll = async (t: string) => {
    setLoading(true); setError(null);
    try {
      const [cRes, nRes, chRes, uRes, rRes] = await Promise.all([
        fetch('/api/contact', { headers: authHeaders(t) }),
        fetch('/api/newsletter', { headers: authHeaders(t) }),
        fetch('/api/chat?limit=200', { headers: authHeaders(t) }),
        fetch('/api/admin/users', { headers: authHeaders(t) }),
        fetch('/api/admin/revoked-sessions', { headers: authHeaders(t) }),
      ]);
      if (cRes.status === 401) { handleLogout(); return; }
      if (cRes.ok) setMessages(await cRes.json());
      if (nRes.ok) setSubscribers(await nRes.json());
      if (chRes.ok) setChatMessages(await chRes.json());
      if (uRes.ok) setAppUsers(await uRes.json());
      if (rRes.ok) setRevokedSessions(await rRes.json());
    } catch { setError('Failed to load data. Please refresh.'); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Login failed'); }
      const { token: t } = await res.json();
      localStorage.setItem('adminToken', t);
      setToken(t); setIsAuthenticated(true);
      fetchAll(t);
    } catch (err: any) { setError(err.message || 'Login failed'); setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null); setIsAuthenticated(false);
    setMessages([]); setSubscribers([]); setChatMessages([]); setAppUsers([]); setRevokedSessions([]);
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers: authHeaders(token || '') });
    if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== id));
    else { const d = await res.json().catch(() => ({})); setError(d.message || 'Delete failed.'); }
  };

  const deleteSubscriber = async (id: string) => {
    if (!window.confirm('Remove this subscriber?')) return;
    const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE', headers: authHeaders(token || '') });
    if (res.ok) setSubscribers((prev) => prev.filter((s) => s.id !== id));
    else { const d = await res.json().catch(() => ({})); setError(d.message || 'Delete failed.'); }
  };

  const revokeUserSessions = async (userId: string, userEmail: string) => {
    if (!window.confirm(`Revoke all active sessions for ${userEmail}? They will be logged out immediately on next request.`)) return;
    setRevoking(userId);
    try {
      const res = await fetch('/api/admin/revoke', {
        method: 'POST',
        headers: authHeaders(token || ''),
        body: JSON.stringify({ userId, reason: 'Revoked by admin via dashboard' }),
      });
      const d = await res.json();
      if (res.ok) {
        setError(null);
        // refresh
        await fetchAll(token!);
      } else {
        setError(d.message || 'Revocation failed.');
      }
    } catch { setError('Revocation request failed.'); }
    finally { setRevoking(null); }
  };

  const exportSubscribersCSV = () => {
    fetch('/api/newsletter/export', { headers: authHeaders(token || '') })
      .then((res) => { if (!res.ok) throw new Error('Export failed'); return res.blob(); })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; document.body.appendChild(link); link.click();
        document.body.removeChild(link); URL.revokeObjectURL(url);
      })
      .catch(() => setError('Failed to export subscribers.'));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/5 border border-yellow-500/10 p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">Admin Login</h1>
          {error && <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input className="w-full px-4 py-2 bg-black/50 border border-yellow-500/20 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                type="email" placeholder="admin@vinay.dev" value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <input className="w-full px-4 py-2 bg-black/50 border border-yellow-500/20 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                type="password" placeholder="••••••••" value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
            </div>
            <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
              type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-yellow-500 transition-colors">← Back to Home</button>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/5 rounded-lg text-xs text-gray-500 text-center">
            Default: admin@vinay.dev / Admin@12345
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'contact', label: 'Contact', icon: Mail, count: messages.length },
    { id: 'newsletter', label: 'Newsletter', icon: Users, count: subscribers.length },
    { id: 'chat', label: 'Chat', icon: MessageSquare, count: chatMessages.length },
    { id: 'users', label: 'Users & Sessions', icon: ShieldOff, count: appUsers.length },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 p-4 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <button onClick={() => token && fetchAll(token)}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-bold py-2 px-4 rounded-lg flex items-center border border-yellow-500/20 transition-colors" disabled={loading}>
              <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />Refresh
            </button>
            <button onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 px-4 rounded-lg flex items-center border border-red-500/20 transition-colors">
              <LogOut size={16} className="mr-1" />Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center space-x-2">
            <AlertCircle size={16} /><span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${
                tab === id ? 'bg-yellow-500 text-black border-yellow-500 font-bold' : 'bg-yellow-500/5 text-gray-400 border-yellow-500/10 hover:bg-yellow-500/10 hover:text-gray-200'
              }`}>
              <Icon size={16} /><span>{label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-black/20' : 'bg-yellow-500/10'}`}>{count}</span>
            </button>
          ))}
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mb-2" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {/* Contact */}
              {tab === 'contact' && (
                messages.length === 0 ? <div className="p-8 text-center text-gray-500">No contact messages yet.</div> : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-yellow-500/10">
                      <thead><tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Message</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Action</th>
                      </tr></thead>
                      <tbody className="divide-y divide-yellow-500/5">
                        {messages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-yellow-500/5 transition-colors">
                            <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{msg.name}</td>
                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{msg.email}</td>
                            <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{msg.message}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-sm">{new Date(msg.created_at).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => deleteContact(msg.id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Newsletter */}
              {tab === 'newsletter' && (
                subscribers.length === 0 ? <div className="p-8 text-center text-gray-500">No newsletter subscribers yet.</div> : (
                  <div className="overflow-x-auto">
                    <div className="flex justify-end px-4 py-2 border-b border-yellow-500/10">
                      <button onClick={exportSubscribersCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-lg transition-colors">
                        <Download size={14} />Export CSV
                      </button>
                    </div>
                    <table className="min-w-full divide-y divide-yellow-500/10">
                      <thead><tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3">#</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Subscribed At</th><th className="px-4 py-3">Action</th>
                      </tr></thead>
                      <tbody className="divide-y divide-yellow-500/5">
                        {subscribers.map((sub, i) => (
                          <tr key={sub.id} className="hover:bg-yellow-500/5 transition-colors">
                            <td className="px-4 py-3 text-gray-500 text-sm">{i + 1}</td>
                            <td className="px-4 py-3 text-gray-300">{sub.email}</td>
                            <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">{new Date(sub.subscribed_at).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => deleteSubscriber(sub.id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Chat */}
              {tab === 'chat' && (
                chatMessages.length === 0 ? <div className="p-8 text-center text-gray-500">No chat messages yet.</div> : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-yellow-500/10">
                      <thead><tr className="text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3">User</th><th className="px-4 py-3">Room</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Time</th>
                      </tr></thead>
                      <tbody className="divide-y divide-yellow-500/5">
                        {chatMessages.slice().reverse().map((msg) => (
                          <tr key={msg.id} className="hover:bg-yellow-500/5 transition-colors">
                            <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{msg.user}</td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">{msg.room}</span></td>
                            <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{msg.message}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-sm">{new Date(msg.created_at).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Users & Sessions */}
              {tab === 'users' && (
                <div>
                  <div className="p-4 border-b border-yellow-500/10">
                    <h3 className="text-yellow-500 font-semibold flex items-center space-x-2">
                      <ShieldOff className="w-4 h-4" /><span>Session Revocation</span>
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Revoking a user's sessions immediately invalidates their JWT tokens. They will be logged out on their next request.
                    </p>
                  </div>
                  {appUsers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No registered users yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-yellow-500/10">
                        <thead><tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Role</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-yellow-500/5">
                          {appUsers.map((u) => {
                            const isRevoked = revokedSessions.some((r) => r.user_id === u.id);
                            return (
                              <tr key={u.id} className="hover:bg-yellow-500/5 transition-colors">
                                <td className="px-4 py-3 text-gray-300">{u.name}</td>
                                <td className="px-4 py-3 text-gray-400">{u.email}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                  {isRevoked ? (
                                    <span className="flex items-center space-x-1 text-xs text-red-400"><ShieldOff size={12} /><span>Sessions revoked</span></span>
                                  ) : (
                                    <button
                                      onClick={() => revokeUserSessions(u.id, u.email)}
                                      disabled={revoking === u.id}
                                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      {revoking === u.id ? <RefreshCw size={12} className="animate-spin" /> : <ShieldOff size={12} />}
                                      <span>Revoke Sessions</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Revoked sessions list */}
                  {revokedSessions.length > 0 && (
                    <div className="border-t border-yellow-500/10 p-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-red-400" /><span>Revocation Log ({revokedSessions.length})</span>
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {revokedSessions.map((r) => (
                          <div key={r.jti} className="flex items-center justify-between px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-lg text-xs">
                            <span className="text-gray-400">{r.user_email}</span>
                            <span className="text-gray-500">{r.reason || 'Revoked'}</span>
                            <span className="text-gray-600">{new Date(r.revoked_at).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, LogOut, Mail, MessageSquare, Users, Download } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

interface ChatMsg {
  id: string;
  user: string;
  message: string;
  room: string;
  created_at: string;
}

type Tab = 'contact' | 'newsletter' | 'chat';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('contact');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchAll(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const authHeaders = (t: string) => ({ 'x-auth-token': t, 'Content-Type': 'application/json' });

  const fetchAll = async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const [cRes, nRes, chRes] = await Promise.all([
        fetch('/api/contact', { headers: authHeaders(t) }),
        fetch('/api/newsletter', { headers: authHeaders(t) }),
        fetch('/api/chat?limit=200', { headers: authHeaders(t) }),
      ]);
      if (cRes.status === 401 || nRes.status === 401) { handleLogout(); return; }
      if (cRes.ok) setMessages(await cRes.json());
      if (nRes.ok) setSubscribers(await nRes.json());
      if (chRes.ok) setChatMessages(await chRes.json());
    } catch {
      setError('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Login failed');
      }
      const { token: t } = await res.json();
      localStorage.setItem('adminToken', t);
      setToken(t);
      setIsAuthenticated(true);
      fetchAll(t);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setMessages([]);
    setSubscribers([]);
    setChatMessages([]);
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers: authHeaders(token || '') });
    if (res.ok) setMessages((prev) => prev.filter((m) => m.id !== id));
    else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || 'Failed to delete message.');
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!window.confirm('Remove this subscriber?')) return;
    const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE', headers: authHeaders(token || '') });
    if (res.ok) setSubscribers((prev) => prev.filter((s) => s.id !== id));
    else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || 'Failed to remove subscriber.');
    }
  };

  const exportSubscribersCSV = () => {
    const link = document.createElement('a');
    fetch('/api/newsletter/export', { headers: authHeaders(token || '') })
      .then((res) => {
        if (!res.ok) throw new Error('Export failed');
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(() => setError('Failed to export subscribers.'));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/5 border border-yellow-500/10 p-8 rounded-xl w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-yellow-500">Admin Login</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1" htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-2 bg-black/50 border border-yellow-500/20 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                id="email"
                type="email"
                placeholder="admin@vinay.dev"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1" htmlFor="password">Password</label>
              <input
                className="w-full px-4 py-2 bg-black/50 border border-yellow-500/20 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <button
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-yellow-500 transition-colors">
              ← Back to Home
            </button>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/5 rounded-lg text-xs text-gray-500 text-center">
            Default: admin@vinay.dev / Admin@12345
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'contact', label: 'Contact Messages', icon: Mail, count: messages.length },
    { id: 'newsletter', label: 'Newsletter', icon: Users, count: subscribers.length },
    { id: 'chat', label: 'Chat Messages', icon: MessageSquare, count: chatMessages.length },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => token && fetchAll(token)}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-bold py-2 px-4 rounded-lg flex items-center border border-yellow-500/20 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 px-4 rounded-lg flex items-center border border-red-500/20 transition-colors"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors border ${
                tab === id
                  ? 'bg-yellow-500 text-black border-yellow-500 font-bold'
                  : 'bg-yellow-500/5 text-gray-400 border-yellow-500/10 hover:bg-yellow-500/10 hover:text-gray-200'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-black/20' : 'bg-yellow-500/10'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mb-2" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {/* Contact Messages Tab */}
              {tab === 'contact' && (
                messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No contact messages yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-yellow-500/10">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-500/5">
                        {messages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-yellow-500/5 transition-colors">
                            <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{msg.name}</td>
                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{msg.email}</td>
                            <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{msg.message}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-sm">
                              {new Date(msg.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => deleteContact(msg.id)} className="text-red-500 hover:text-red-400 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Newsletter Tab */}
              {tab === 'newsletter' && (
                subscribers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No newsletter subscribers yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="flex justify-end px-4 py-2 border-b border-yellow-500/10">
                      <button
                        onClick={exportSubscribersCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-lg transition-colors"
                      >
                        <Download size={14} />
                        Export CSV
                      </button>
                    </div>
                    <table className="min-w-full divide-y divide-yellow-500/10">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Subscribed At</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-500/5">
                        {subscribers.map((sub, i) => (
                          <tr key={sub.id} className="hover:bg-yellow-500/5 transition-colors">
                            <td className="px-4 py-3 text-gray-500 text-sm">{i + 1}</td>
                            <td className="px-4 py-3 text-gray-300">{sub.email}</td>
                            <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                              {new Date(sub.subscribed_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => deleteSubscriber(sub.id)} className="text-red-500 hover:text-red-400 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Chat Messages Tab */}
              {tab === 'chat' && (
                chatMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No chat messages yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-yellow-500/10">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 uppercase">
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Room</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-500/5">
                        {chatMessages.slice().reverse().map((msg) => (
                          <tr key={msg.id} className="hover:bg-yellow-500/5 transition-colors">
                            <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{msg.user}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">{msg.room}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{msg.message}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-sm">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}