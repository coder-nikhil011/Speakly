import api from "./api";

export const getRevision = async () => {
  const response = await api.get(
    "/revision"
  );

  return response.data;
};


export const submitRevisionAnswer =
  async (data) => {
    const response = await api.post(
      "/revision/answer",
      data
    );

    return response.data;
  };


export const getSmartRevision =
  async () => {
    const response = await api.get(
      "/revision/smart"
    );

    return response.data;
  };