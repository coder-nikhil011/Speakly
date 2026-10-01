import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getStoredUser } from "../services/authService";
import api from "../services/api";

export default function SpeakingRoom() {
  const [params] = useSearchParams();
  const user = getStoredUser();
  const invitedFriendId = params.get("friendId") || "";
  const [roomId, setRoomId] = useState(params.get("room") || "");
  const [peerId, setPeerId] = useState("");
  const [joined, setJoined] = useState(false);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(invitedFriendId ? "Create a private invitation room for your friend." : "Enter a private invitation code from a friend.");
  
  const localVideo = useRef(null); 
  const remoteVideo = useRef(null); 
  const pcRef = useRef(null); 
  const streamRef = useRef(null); 
  const peerRef = useRef(null); 
  const signalTime = useRef(0); 
  const pollRef = useRef(null);

  const createRoom = () => setRoomId(Math.random().toString(36).slice(2, 8).toUpperCase());
  
  const sendSignal = async (to, type, data) => { 
    try { 
      await api.post("/rooms/signal", { roomId, from: peerId, to, type, data }); 
    } catch (e) {
      console.error("Signal error:", e);
    } 
  };

  const setupPeer = async (target, caller) => {
    peerRef.current = target;
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pcRef.current = pc;
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => pc.addTrack(track, streamRef.current));
    }

    pc.ontrack = (event) => { 
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0]; 
      }
    };

    pc.onicecandidate = (event) => { 
      if (event.candidate) sendSignal(target, "ice", event.candidate); 
    };

    if (caller) { 
      const offer = await pc.createOffer(); 
      await pc.setLocalDescription(offer); 
      await sendSignal(target, "offer", offer); 
    }
  };

  const processSignals = async () => {
    if (!joined || !peerId) return;
    try {
      const response = await api.get("/rooms/signals", { params: { roomId, peerId, since: signalTime.current } });
      for (const item of response.data.signals || []) {
        signalTime.current = Math.max(signalTime.current, item.createdAt);
        if (item.type === "offer") { 
          if (!pcRef.current) await setupPeer(item.from, false); 
          peerRef.current = item.from; 
          await pcRef.current.setRemoteDescription(item.data); 
          const answer = await pcRef.current.createAnswer(); 
          await pcRef.current.setLocalDescription(answer); 
          await sendSignal(item.from, "answer", answer); 
          setStatus("Connected to your friend."); 
        }
        else if (item.type === "answer" && pcRef.current) { 
          await pcRef.current.setRemoteDescription(item.data); 
          setStatus("Connected to your friend."); 
        }
        else if (item.type === "ice" && pcRef.current) { 
          try { await pcRef.current.addIceCandidate(item.data); } catch {} 
        }
        else if (item.type === "chat") {
          setChat((prev) => [...prev, item.data]);
        }
      }
    } catch (e) {
      console.error("Polling error:", e);
    }
  };

  const joinRoom = async () => {
    if (!roomId.trim()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream; 
      if (localVideo.current) localVideo.current.srcObject = stream;
      
      const response = await api.post("/rooms/join", { roomId: roomId.trim().toUpperCase(), invitedUserId: invitedFriendId });
      const data = response.data; 
      setRoomId(data.roomId); 
      setPeerId(data.peerId); 
      setJoined(true); 
      setStatus(data.existingPeerId ? "Connecting you to your friend..." : "Private room ready. Share this invitation code only with your friend.");
      if (data.existingPeerId) await setupPeer(data.existingPeerId, true);
    } catch (error) { 
      streamRef.current?.getTracks().forEach(t => t.stop()); 
      setStatus(error.response?.data?.message || "Camera/microphone permission is required for video practice."); 
    }
  };

  const endCall = async () => {
    setJoined(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
    }
    if (peerId) {
      api.post("/rooms/leave", { roomId, peerId }).catch(() => {});
    }
    setStatus(invitedFriendId ? "Create a private invitation room for your friend." : "Enter a private invitation code from a friend.");
  };

  useEffect(() => { 
    if (!joined) return; 
    pollRef.current = setInterval(processSignals, 900); 
    return () => clearInterval(pollRef.current); 
  }, [joined, peerId, roomId]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      if (pcRef.current) pcRef.current.close();
      if (peerId) api.post("/rooms/leave", { roomId, peerId }).catch(() => {});
    };
  }, [peerId, roomId]);

  const sendChat = async (e) => { 
    e.preventDefault(); 
    if (!message.trim() || !peerRef.current) return; 
    const item = { name: user?.name || "Student", message: message.trim(), at: new Date().toISOString() }; 
    setChat((prev) => [...prev, item]); 
    await sendSignal(peerRef.current, "chat", item); 
    setMessage(""); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link to="/social/community" className="text-sm font-bold text-slate-500">← Community</Link>
            <h1 className="mt-3 text-3xl font-extrabold">Private Video Room</h1>
            <p className="mt-1 text-sm text-slate-500">Only an accepted friend can join an invitation room.</p>
          </div>
          {roomId && <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold">Invite: {roomId}</div>}
        </div>

        {!joined ? (
          <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold">{invitedFriendId ? "Call your friend" : "Join a private call"}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {invitedFriendId ? "Create the invitation code and send it to the friend you selected in Community." : "Enter the invitation code your friend sent you. Public rooms are disabled."}
            </p>
            {invitedFriendId && (
              <button onClick={createRoom} className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 font-bold hover:bg-slate-50 transition">
                Generate private invite code
              </button>
            )}
            <div className="mt-5 flex gap-2">
              <input 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value.toUpperCase())} 
                placeholder="INVITE CODE" 
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-black"
              />
              <button onClick={joinRoom} disabled={!roomId.trim()} className="rounded-xl bg-black px-5 py-3 font-bold text-white disabled:opacity-40">
                Join
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">The server verifies that the two accounts are accepted friends.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[2rem] bg-black p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="aspect-video overflow-hidden rounded-2xl bg-slate-900">
                  <video ref={localVideo} autoPlay muted playsInline className="h-full w-full object-cover" />
                </div>
                <div className="aspect-video overflow-hidden rounded-2xl bg-slate-900">
                  <video ref={remoteVideo} autoPlay playsInline className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">{status}</p>
                <button 
                  onClick={endCall} 
                  className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition active:scale-95"
                >
                  End Call
                </button>
              </div>
            </div>

            <div className="flex flex-col rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold">Room chat</h2>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[500px]">
                {chat.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-10">No messages yet. Say hello!</p>
                ) : (
                  chat.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.name === user?.name ? "items-end" : "items-start"}`}>
                      <p className="text-[10px] font-bold text-slate-400 mb-1">{m.name}</p>
                      <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${m.name === user?.name ? "bg-black text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"}`}>
                        {m.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendChat} className="p-6 border-t border-slate-100 flex gap-2">
                <input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Write a message..." 
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-black"
                />
                <button type="submit" className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
