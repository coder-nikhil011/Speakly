import api from "./api";

export const loginUser = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  if (response.data.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};


export const registerUser = async (data) => {
  const response = await api.post(
    "/auth/signup",
    data
  );

  if (response.data.token) {
    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};


export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};


export const getStoredUser = () => {
  const user = localStorage.getItem("user");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};