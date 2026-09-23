import React, { useState, useEffect } from 'react';
import { gamificationService } from '../services/gamificationService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await gamificationService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Leaderboard...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Global Leaderboard</h1>
        <p className="text-slate-500">Compete with the best learners worldwide!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Rank</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Learner</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Streak</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaderboard.map((user, index) => (
              <tr key={user.userId} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-400 text-white' : 
                    index === 1 ? 'bg-slate-300 text-slate-700' : 
                    index === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={user.profilePhoto || '/assets/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                  <span className="font-medium text-slate-900">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold">
                    🔥 {user.streak}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  {user.xp.toLocaleString()} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
