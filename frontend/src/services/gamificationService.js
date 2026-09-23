import api from './api';

export const gamificationService = {
  async getUserStats() {
    const { data } = await api.get('/gamification/stats');
    return data;
  },
  async getLeaderboard() {
    const { data } = await api.get('/gamification/leaderboard');
    return data.leaderboard;
  }
};
