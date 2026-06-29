// ─────────────────────────────────────────────
// api.js - Backend API Configuration
// ─────────────────────────────────────────────

// BASE URL from Vite env
let BASE_URL = import.meta.env.VITE_API_URL;

// ❗ Safety check
if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// 🔥 Remove trailing slash if present
BASE_URL = BASE_URL.replace(/\/$/, "");

// 🔥 Ensure backend path consistency (IMPORTANT FIX)
if (!BASE_URL.endsWith("/api")) {
  BASE_URL = `${BASE_URL}/api`;
}

// ─────────────────────────────────────────────
// Helper Function
// ─────────────────────────────────────────────
const request = async (url, options = {}) => {
  // ensure single slash
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  const res = await fetch(`${BASE_URL}${cleanUrl}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    ...options,
  });

  // handle errors
  if (!res.ok) {
    let errorMessage = "Something went wrong";

    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (e) {}

    throw new Error(errorMessage);
  }

  // no response body
  if (res.status === 204) return null;

  return res.json();
};

// ─────────────────────────────────────────────
// AUTH APIs
// ─────────────────────────────────────────────

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
  request("/auth/logout", {
    method: "POST",
  });

// ─────────────────────────────────────────────
// TRANSACTIONS APIs
// ─────────────────────────────────────────────

export const getTransactions = () =>
  request("/transactions");

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
  request(`/transactions/${id}`, {
    method: "DELETE",
  });

export const getSummary = () =>
  request("/transactions/summary");
