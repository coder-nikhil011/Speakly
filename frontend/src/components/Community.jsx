import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/navbar_logo.png";

function Community() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/social/friends");
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get("/social/pending");
      setPendingRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const response = await api.get(`/social/search?query=${searchQuery}`);
      setUsers(response.data.users || []);
    } catch (error) {
      alert("Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await api.post("/social/request", { recipientId: userId });
      alert("Friend request sent!");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  const handleRequest = async (requestId, status) => {
    try {
      await api.post("/social/handle-request", { requestId, status });
      alert(`Request ${status}!`);
      fetchPendingRequests();
    fetchFriends();
    } catch (error) {
      alert("Error handling request");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Community</h1>
          </div>
          <button 
            onClick={() => navigate("/student")}
            className="bg-white border border-slate-200 px-5 py-2 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Pending Requests - Modernized */}
        {pendingRequests.length > 0 && (
          <div className="mb-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
              <span className="text-slate-500">🔔</span> Friend Requests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map((req) => (
                <div key={req._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {req.requester?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate text-slate-800">{req.requester?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{req.requester?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => handleRequest(req._id, "accepted")}
                      className="bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition shadow-sm"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleRequest(req._id, "rejected")}
                      className="bg-white text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:text-slate-600 transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Private Video Calls */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-12">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-2xl font-bold text-slate-800">Private Video Calls</h2><p className="mt-2 text-sm text-slate-500">Call accepted friends directly. Each room is private and can only be joined by the invited friend.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">Friends only</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {friends.length === 0 ? <p className="text-sm text-slate-400">Accept or add a friend to start a private video call.</p> : friends.map((friend) => (
              <div key={friend._id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-slate-600">{friend.name?.charAt(0)}</div><div><p className="font-bold text-slate-800">{friend.name}</p><p className="text-xs text-slate-400">{friend.email}</p></div></div>
                <button onClick={() => navigate(`/speaking-room?friendId=${encodeURIComponent(friend._id)}`)} className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white">📹 Call</button>
              </div>
            ))}
          </div>
        </div>

        {/* Search Section - Modernized */}
        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm mb-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Find New Friends</h2>
            <p className="text-slate-500 mb-8">Search for fellow students to practice and grow together.</p>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or email address..." 
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-50 transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/10"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>
        </div>

        {/* User Results - Modernized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-xl hover:border-slate-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-600 group-hover:bg-slate-600 group-hover:text-white transition-colors duration-300">
                  {user.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={() => sendRequest(user._id)}
                className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-600 hover:text-white transition-all duration-200 shadow-sm"
              >
                Add Friend
              </button>
            </div>
          ))}
          {users.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="text-4xl mb-4">🔎</div>
              <p className="text-slate-400 font-medium">No users found. Try searching for a different name or email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Community;
