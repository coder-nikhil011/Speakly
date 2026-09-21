import api from "./api";

export const generateStory = async (data) => {
  const response = await api.post(
    "/stories/generate",
    data
  );

  return response.data;
};


export const getStories = async () => {
  const response = await api.get(
    "/stories"
  );

  return response.data;
};


export const explainText = async (data) => {
  const response = await api.post(
    "/text-learning/explain",
    data
  );

  return response.data;
};


export const discoverVocabulary =
  async (data) => {
    const response = await api.post(
      "/text-learning/discover-vocabulary",
      data
    );

    return response.data;
  };