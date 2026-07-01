// ─────────────────────────────────────────────
//  api.js  —  ALL backend calls live here
// ─────────────────────────────────────────────

const BASE_URL = "https://financetrackerbackend-production-40d2.up.railway.app/api";

const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Something went wrong");
  }

  return res.json();
};

// ── AUTH ──────────────────────────────────────

export const sendOtp = (username, email) =>
  request("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ username, email }),
  });

export const registerUser = (username, email, password, otp) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password, otp }),
  });

export const loginUser = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const logoutUser = () =>
  request("/auth/logout", { method: "POST" });

// ── TRANSACTIONS ──────────────────────────────

export const getTransactions = () => request("/transactions");

export const addTransaction = (transaction) =>
  request("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });

export const updateTransaction = (id, transaction) =>
  request(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });

export const deleteTransaction = (id) =>
  request(`/transactions/${id}`, { method: "DELETE" });

export const getSummary = () => request("/transactions/summary");

// ── BUDGET ────────────────────────────────────

// These must be in your api.js
export const getBudgetLimits = () =>
  request("/budget");

export const setBudgetLimit = (category, limitAmount) =>
  request("/budget", {
    method: "POST",
    body: JSON.stringify({ category, limitAmount }),
  });

export const deleteBudgetLimit = (id) =>
  request(`/budget/${id}`, { method: "DELETE" });
