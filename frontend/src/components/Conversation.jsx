import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/navbar_logo.png";
import { 
  startSpeakingSession, 
  sendSpeakingMessage, 
  getSessionMessages, 
  endSpeakingSession 
} from "../services/speakingService";
import api from "../services/api";

function Conversation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const friendId = searchParams.get("friend") || "AI Friend";
  const topic = searchParams.get("topic") || "General English";
  const scenario = searchParams.get("scenario") || "";
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Note Down State
  const [noteWord, setNoteWord] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteStatus, setNoteStatus] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        // 1. Start session
        const sessionData = await startSpeakingSession({
          friendName: friendId,
          topic: scenario || topic,
          personality: "friendly tutor",
          level: "intermediate"
        });
        setSessionId(sessionData.session?.id || sessionData.sessionId);

        // 2. Fetch initial messages
        const initialMessages = await getSessionMessages(sessionData.session?.id || sessionData.sessionId);
        setMessages(initialMessages.messages || initialMessages || []);
      } catch (error) {
        console.error("Session init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;

    const userMessage = inputValue;
    setInputValue("");
    
    setMessages(prev => [...prev, { 
      role: "user", 
      text: userMessage, 
      timestamp: new Date().toISOString() 
    }]);

    setIsTyping(true);

    try {
      const aiResponse = await sendSpeakingMessage({
        sessionId,
        message: userMessage
      });

      setMessages(prev => [...prev, { 
        role: "assistant", 
        text: aiResponse.reply, 
        timestamp: new Date().toISOString() 
      }]);
    } catch (error) {
      console.error("Sending message error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNoteDown = async (e) => {
    e.preventDefault();
    if (!noteWord.trim()) return;
    
    setNoteStatus("adding...");
    try {
      await api.post("/ai-tutor/note-down", { word: noteWord });
      setNoteStatus("Saved!");
      setNoteWord("");
      setTimeout(() => {
        setNoteStatus("");
        setIsNoteOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Note down error:", error);
      setNoteStatus("Error!");
    }
  };

  const handleEndSession = async () => {
    if (sessionId) {
      try {
        await endSpeakingSession(sessionId);
      } catch (e) {
        console.error("End session error:", e);
      }
    }
    navigate("/student");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAF9]">
        <p className="text-lg font-semibold text-slate-400">Connecting to AI Friend...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9]">

      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/student" className="flex items-center gap-4">
          <span className="text-2xl cursor-pointer">←</span>
          <img src={logo} alt="Speakly" className="h-10 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-4">
          <div className="text-right"><span className="rounded-full bg-[#E7F5EF] px-4 py-2 text-xs font-bold text-[#477D65]">AI FRIEND: {friendId.toUpperCase()}</span><p className="mt-2 text-[11px] text-slate-400">Topic: {topic}</p></div>
          <button 
            onClick={handleEndSession}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            End Session
          </button>
          </div>
        </div>
      </header>


      <main className="mx-auto max-w-3xl px-6 py-10">

        <div className="text-center mb-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl text-white">
          {friendId.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold capitalize">{friendId}</h2>
          <p className="text-sm text-slate-500">
          Your AI conversation partner
          </p>
        </div>


        <div className="space-y-6 mb-24">
          {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === "user" 
              ? "bg-black text-white rounded-tr-sm" 
              : "bg-white text-black rounded-tl-sm"
            }`}>
              <p className="text-xs opacity-60 mb-1">
                {msg.role === "user" ? "You" : friendId}
              </p>
              <p className="text-sm leading-relaxed">
                {msg.text}
              </p>
            </div>
          </div>
          ))}
          
          {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
          )}
          <div ref={messagesEndRef} />
        </div>


        {/* Note Down Box */}
        <div className="fixed bottom-24 right-6 flex flex-col items-end gap-2">
          {isNoteOpen && (
          <form onSubmit={handleNoteDown} className="mb-2 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 w-64 animate-in fade-in slide-in-bottom-4">
            <p className="text-xs font-bold text-slate-500 mb-2">Note Down Difficult Word</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteWord}
                onChange={(e) => setNoteWord(e.target.value)}
                placeholder="Enter word..."
                className="flex-1 text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-black"
              />
              <button 
                type="submit"
                className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold transition hover:bg-neutral-800"
              >
                {noteStatus || "Add"}
              </button>
            </div>
          </form>
          )}
          <button 
          onClick={() => setIsNoteOpen(!isNoteOpen)}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-lg border border-slate-200 hover:bg-slate-50 transition"
          >
          <span>📝</span>
          <span>{isNoteOpen ? "Close Notes" : "Note Down"}</span>
          </button>
        </div>


        <form onSubmit={handleSendMessage} className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAF9] via-[#F8FAF9] to-transparent">
          <div className="mx-auto max-w-3xl flex gap-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-black transition shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            Send
          </button>
          
          </div>
        </form>

      </main>

    </div>
  );
}

export default Conversation;
