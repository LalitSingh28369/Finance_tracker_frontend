// ─────────────────────────────────────────────
// api.js - FIXED VERSION (Vercel + Railway)
// ─────────────────────────────────────────────

// Base URL from Vite env
let BASE_URL = import.meta.env.VITE_API_URL;

// Safety check
if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// Remove trailing slash if any
BASE_URL = BASE_URL.replace(/\/$/, "");

// Ensure all requests go through /api
const withApiPrefix = (url) => {
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  // if already contains /api, don't duplicate it
  return cleanUrl.startsWith("/api") ? cleanUrl : `/api${cleanUrl}`;
};

// ─────────────────────────────────────────────
// Core request handler
// ─────────────────────────────────────────────
const request = async (url, options = {}) => {
  const finalUrl = `${BASE_URL}${withApiPrefix(url)}`;

  const res = await fetch(finalUrl, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let errorMessage = "Something went wrong";

    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (e) {}

    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;

  return res.json();
};

// ─────────────────────────────────────────────
// AUTH APIs
// ─────────────────────────────────────────────

export const sendOtp = (username, email) =>
  request("/api/auth/send-otp", {
    method: "POST",
    body: { username, email },
  });

export const registerUser = (username, email, password, otp) =>
  request("/api/auth/register", {
    method: "POST",
    body: { username, email, password, otp },
  });

export const loginUser = (username, password) =>
  request("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });

export const logoutUser = () =>
  request("/api/auth/logout", {
    method: "POST",
  });

// ─────────────────────────────────────────────
// TRANSACTIONS APIs
// ─────────────────────────────────────────────

export const getTransactions = () =>
  request("/api/transactions");

export const addTransaction = (transaction) =>
  request("/api/transactions", {
    method: "POST",
    body: transaction,
  });

export const updateTransaction = (id, transaction) =>
  request(`/api/transactions/${id}`, {
    method: "PUT",
    body: transaction,
  });

export const deleteTransaction = (id) =>
  request(`/api/transactions/${id}`, {
    method: "DELETE",
  });

export const getSummary = () =>
  request("/api/transactions/summary");
