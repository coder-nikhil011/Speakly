import api from "./api";

export const getMyProfile = async () => {
  const response = await api.get("/profile/me");
  // Return both user and profile merged into one object for the frontend
  return {
    ...response.data.user,
    ...response.data.profile,
  };
};


export const updateMyProfile = async (data) => {
  const response = await api.put(
    "/profile/update",
    data
  );

  return response.data;
};