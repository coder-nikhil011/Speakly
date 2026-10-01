import api from "./api";

export const getChallenges = async () => {
  const response = await api.get("/challenges");
  return response.data.challenges || [];
};

export const createChallenge = async (type) => {
  const response = await api.post(`/challenges/${type}`);
  return response.data.challenge;
};

export const completeChallenge = async (id) => {
  const response = await api.patch(`/challenges/${id}/complete`);
  return response.data.challenge;
};
