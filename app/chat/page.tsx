"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send, MessageSquare, Video, VideoOff, Mic, MicOff,
  PhoneCall, PhoneOff, Users, Wifi, WifiOff
} from "lucide-react";

type ChatMessage = {
  id: string;
  user: string;
  message: string;
  created_at: string;
};

// ─── WebRTC helpers ───────────────────────────────────────────────────────────

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

// Minimal-bandwidth video constraints
const LOW_VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 22050 },
  video: { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15, max: 20 } },
};
const AUDIO_ONLY_CONSTRAINTS: MediaStreamConstraints = {
  audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 22050 },
  video: false,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState("general");
  const [username, setUsername] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('chat_username') || '') : ''
  );
  const [nameSet, setNameSet] = useState(() =>
    typeof window !== 'undefined' ? !!localStorage.getItem('chat_username') : false
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── WebRTC state ──
  const [callMode, setCallMode] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [useVideo, setUseVideo] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const signalingRef = useRef<BroadcastChannel | null>(null);

  // ── Fetch messages ──
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?room=${encodeURIComponent(roomId)}`);
      if (!res.ok) throw new Error('Failed to load messages');
      setMessages(await res.json());
    } catch {
      setError("Could not load chat messages.");
    }
  }, [roomId]);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchMessages().finally(() => setLoading(false));
    const interval = setInterval(fetchMessages, 4000); // poll every 4s (minimal)
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send text message ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username || 'Anonymous', message: newMessage, room: roomId })
      });
      if (!res.ok) throw new Error('Failed to send message');
      const { data } = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch {
      setError("Could not send message.");
    } finally {
      setLoading(false);
    }
  };

  // ── WebRTC: signaling via BroadcastChannel (same-browser demo) ──
  // In production you would replace BroadcastChannel with a WebSocket signaling server.
  const setupSignaling = useCallback((channel: BroadcastChannel, pc: RTCPeerConnection) => {
    channel.onmessage = async (event) => {
      const { type, payload } = event.data;
      if (type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        channel.postMessage({ type: 'answer', payload: answer });
      } else if (type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
      } else if (type === 'ice') {
        if (payload) await pc.addIceCandidate(new RTCIceCandidate(payload));
      } else if (type === 'hang-up') {
        endCall();
      }
    };
  }, []);

  const startCall = useCallback(async (withVideo: boolean) => {
    try {
      setCallMode('calling');
      setUseVideo(withVideo);
      const constraints = withVideo ? LOW_VIDEO_CONSTRAINTS : AUDIO_ONLY_CONSTRAINTS;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      pcRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallMode('connected');
        }
      };

      const channel = new BroadcastChannel(`rtc-${roomId}`);
      signalingRef.current = channel;
      setupSignaling(channel, pc);

      pc.onicecandidate = (event) => {
        channel.postMessage({ type: 'ice', payload: event.candidate });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      channel.postMessage({ type: 'offer', payload: offer });

      setVideoEnabled(withVideo);
      setMicEnabled(true);
    } catch (err) {
      setError('Could not access camera/microphone. Please check permissions.');
      setCallMode('idle');
    }
  }, [roomId, setupSignaling]);

  const endCall = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    signalingRef.current?.postMessage({ type: 'hang-up', payload: null });
    signalingRef.current?.close();
    signalingRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setCallMode('idle');
    setVideoEnabled(false);
  }, []);

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMicEnabled((m) => !m);
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setVideoEnabled((v) => !v);
  };

  useEffect(() => () => endCall(), [endCall]);

  const rooms = [
    { id: "general", name: "General" },
    { id: "tech", name: "Technology" },
    { id: "finance", name: "Finance" },
    { id: "marketing", name: "Marketing" },
    { id: "design", name: "Design" },
    { id: "sales", name: "Sales" },
  ];

  // ── Name setup screen ──
  if (!nameSet) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/5 border border-yellow-500/10 p-8 rounded-2xl max-w-sm w-full">
          <Users className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-yellow-500 text-center mb-2">Enter Chat</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Choose a display name (anonymous is fine)</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            const name = username.trim() || 'Anonymous';
            setUsername(name);
            localStorage.setItem('chat_username', name);
            setNameSet(true);
          }} className="space-y-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name (or leave blank)"
              className="w-full px-4 py-2 bg-black/50 border border-yellow-500/20 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
            />
            <button type="submit"
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors">
              Enter Chat →
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
          <h1 className="text-4xl font-bold text-yellow-500 mb-1">Community Chat</h1>
          <p className="text-gray-500 text-sm">Chat anonymously · WebRTC audio/video available</p>
        </motion.div>

        {error && <div className="text-red-400 text-center mb-4 text-sm">{error}</div>}

        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Left: Chat */}
          <div className="flex-1 flex flex-col">
            {/* Room tabs */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
              {rooms.map((room) => (
                <button key={room.id} onClick={() => setRoomId(room.id)}
                  className={`px-3 py-1.5 rounded-full flex items-center space-x-1 whitespace-nowrap transition-colors text-sm ${
                    roomId === room.id ? 'bg-yellow-500 text-black font-bold' : 'bg-yellow-500/10 text-gray-300 hover:bg-yellow-500/20'
                  }`}>
                  <MessageSquare className="w-3 h-3" />
                  <span>{room.name}</span>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex flex-col h-[55vh]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.user === username;
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          isOwn ? 'bg-yellow-500 text-black' : 'bg-yellow-500/10 text-gray-200'
                        }`}>
                          {!isOwn && <p className="text-xs text-yellow-500/70 mb-0.5 font-medium">{msg.user}</p>}
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-0.5 ${isOwn ? 'text-black/50' : 'text-gray-500'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-yellow-500/10 p-3 flex space-x-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${roomId}...`}
                  className="flex-1 bg-black/50 border border-yellow-500/20 rounded-full px-4 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  disabled={loading} />
                <button type="submit" disabled={!newMessage.trim() || loading}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-full w-9 h-9 flex items-center justify-center transition-colors disabled:opacity-40">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right: Audio/Video panel */}
          <div className="lg:w-72 space-y-3">
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4">
              <h3 className="text-yellow-500 font-semibold mb-1 flex items-center space-x-2">
                <Wifi className="w-4 h-4" />
                <span>Audio / Video</span>
              </h3>
              <p className="text-gray-500 text-xs mb-4">
                Peer-to-peer WebRTC · Low bandwidth · Same browser tab demo. In production, share the room link to connect with others.
              </p>

              {callMode === 'idle' ? (
                <div className="space-y-2">
                  <button onClick={() => startCall(false)}
                    className="w-full flex items-center justify-center space-x-2 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-colors text-sm">
                    <PhoneCall className="w-4 h-4" />
                    <span>Audio Call</span>
                  </button>
                  <button onClick={() => startCall(true)}
                    className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm">
                    <Video className="w-4 h-4" />
                    <span>Video Call (320p · 15fps)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Status badge */}
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    callMode === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {callMode === 'connected' ? <><Wifi className="w-3 h-3" /><span>Connected</span></> : <><WifiOff className="w-3 h-3" /><span>Calling... waiting for peer</span></>}
                  </div>

                  {/* Local video */}
                  {useVideo && (
                    <div className="relative">
                      <video ref={localVideoRef} autoPlay muted playsInline
                        className="w-full rounded-lg bg-black border border-yellow-500/20" style={{ maxHeight: '120px' }} />
                      <span className="absolute bottom-1 left-1 text-xs text-white/60 bg-black/50 px-1 rounded">You</span>
                    </div>
                  )}
                  {!useVideo && <audio ref={localVideoRef as any} autoPlay muted className="hidden" />}

                  {/* Remote video */}
                  {useVideo ? (
                    <div className="relative">
                      <video ref={remoteVideoRef} autoPlay playsInline
                        className="w-full rounded-lg bg-black border border-yellow-500/20" style={{ maxHeight: '120px' }} />
                      <span className="absolute bottom-1 left-1 text-xs text-white/60 bg-black/50 px-1 rounded">Remote</span>
                    </div>
                  ) : (
                    <audio ref={remoteVideoRef as any} autoPlay className="hidden" />
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <button onClick={toggleMic}
                      className={`p-2 rounded-full border transition-colors ${micEnabled ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                      {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                    {useVideo && (
                      <button onClick={toggleVideo}
                        className={`p-2 rounded-full border transition-colors ${videoEnabled ? 'border-blue-500/30 text-blue-400' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                        {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>
                    )}
                    <button onClick={endCall}
                      className="p-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors">
                      <PhoneOff className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Chatting as</p>
                <p className="text-sm text-yellow-400 font-semibold">{username}</p>
              </div>
              <button onClick={() => { localStorage.removeItem('chat_username'); setNameSet(false); setUsername(''); }}
                className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">
                Change
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Public chat — please be respectful. WebRTC calls are direct peer-to-peer; no audio/video passes through our servers.
        </p>
      </div>
    </main>
  );
}
