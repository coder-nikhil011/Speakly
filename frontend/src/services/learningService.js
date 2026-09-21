import api from "./api";

export const getTodayLearning = async (params = {}) => {
  const response = await api.get("/learning/today", { params });
  return response.data;
};

export const getLearningProgress = async () => {
  const response = await api.get("/learning/summary");
  return response.data.summary || {};
};

export const getLearningHistory = async () => {
  const response = await api.get("/learning/progress");
  return response.data.progress || [];
};

export const saveLearningProgress = async (data) => {
  const response = await api.post("/learning/progress", data);
  return response.data;
};

export const getWords = async (params = {}) => {
  const response = await api.get("/learning/today", { params });
  return response.data.words || [];
};

export const getWordById = async (id) => {
  const response = await api.get(`/learning/word/${id}`);
  return response.data.word;
};

export const getStudentsProgress = async () => {
  const response = await api.get("/teacher-content/students/progress");
  const rows = response.data.progress || [];
  const grouped = new Map();
  rows.forEach((row) => {
    const user = row.userId;
    if (!user?._id) return;
    if (!grouped.has(user._id)) grouped.set(user._id, { _id: user._id, name: user.name, email: user.email, level: row.wordId?.level || "Level not set", scores: [] });
    grouped.get(user._id).scores.push(Number(row.score || 0));
  });
  return [...grouped.values()].map((student) => ({ ...student, progress: student.scores.length ? Math.round(student.scores.reduce((a, b) => a + b, 0) / student.scores.length) : 0 }));
};

export const getTodayClass = async () => {
  const response = await api.get("/learning-content/today");
  return response.data.content;
};

export const saveContentPractice = async (data) => {
  const response = await api.post("/learning-content/progress", data);
  return response.data.progress;
};

export const getContentHistory = async () => {
  const response = await api.get("/learning-content/history");
  return response.data.history || [];
};

export const getDailyLearningStatus = async () => {
  const response = await api.get("/learning/daily-status");
  return response.data;
};

export const completeDailyLearning = async () => {
  const response = await api.post("/learning/daily-complete");
  return response.data;
};
