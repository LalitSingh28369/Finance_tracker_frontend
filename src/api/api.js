const BASE_URL = "https://financetrackerbackend-production-40d2.up.railway.app/api";

const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let msg = "Something went wrong";
    try {
      const data = await res.json();
      msg = data.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.status === 204 ? null : res.json();
};

// ── AUTH ──────────────────────────────────────
export const sendOtp = (username, email) =>
  request("/auth/send-otp", {
    method: "POST",
    body: { username, email },
  });

export const registerUser = (username, email, password, otp) =>
  request("/auth/register", {
    method: "POST",
    body: { username, email, password, otp },
  });

export const loginUser = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: { username, password },
  });

export const logoutUser = () =>
  request("/auth/logout", { method: "POST" });

// ── TRANSACTIONS ──────────────────────────────
export const getTransactions = () => request("/transactions");

export const addTransaction = (transaction) =>
  request("/transactions", {
    method: "POST",
    body: transaction,
  });

export const updateTransaction = (id, transaction) =>
  request(`/transactions/${id}`, {
    method: "PUT",
    body: transaction,
  });

export const deleteTransaction = (id) =>
  request(`/transactions/${id}`, { method: "DELETE" });

export const getSummary = () => request("/transactions/summary");

export const getBudgetLimits = () => request("/budget");

export const setBudgetLimit = (category, limitAmount) =>
  request("/budget", {
    method: "POST",
    body: { category, limitAmount },
  });
