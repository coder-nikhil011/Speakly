import api from "./api";

export const startSpeakingSession =
  async (data) => {
    const response = await api.post(
      "/speaking/start",
      data
    );

    return response.data;
  };


export const sendSpeakingMessage =
  async (data) => {
    const response = await api.post(
      "/speaking/message",
      data
    );

    return response.data;
  };


export const getSpeakingHistory =
  async () => {
    const response = await api.get(
      "/speaking/history"
    );

    return response.data;
  };


export const getSessionMessages =
  async (sessionId) => {
    const response = await api.get(
      `/speaking/${sessionId}/messages`
    );

    return response.data;
  };


export const endSpeakingSession =
  async (sessionId) => {
    const response = await api.patch(
      `/speaking/${sessionId}/end`
    );

    return response.data;
  };