import api from "./api";

export const getContentLibrary = async (type) => {
  const response = await api.get("/content/library", { params: type ? { type } : {} });
  return response.data;
};
