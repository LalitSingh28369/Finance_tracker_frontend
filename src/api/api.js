// ─────────────────────────────────────────────
// api.js - FINAL FIXED VERSION
// ─────────────────────────────────────────────

let BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

BASE_URL = BASE_URL.replace(/\/$/, "");

// ─────────────────────────────────────────────
// REQUEST HANDLER
// ─────────────────────────────────────────────
const request = async (url, options = {}) => {
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  const finalUrl = `${BASE_URL}/api${cleanUrl}`;

  const res = await fetch(finalUrl, {
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
      msg = (await res.json()).message;
    } catch {}
    throw new Error(msg);
  }

  return res.status === 204 ? null : res.json();
};

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

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
  request("/auth/logout", {
    method: "POST",
  });

// ─────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────

export const getTransactions = () =>
  request("/transactions");

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
  request(`/transactions/${id}`, {
    method: "DELETE",
  });

export const getSummary = () =>
  request("/transactions/summary");
