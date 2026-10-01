import api from "./api";

export const createCheckoutSession = async (plan) => {
  const response = await api.post("/payments/create-checkout-session", { plan });
  return response.data; // Returns { url: 'stripe_url' }
};

export const checkPlanStatus = async () => {
  const response = await api.get("/profile/me");
  return response.data.user.plan;
};
