// ─────────────────────────────────────────────
// api.js - Backend API Configuration
// Uses environment variables for local & production
// ─────────────────────────────────────────────

// Local Development  -> http://localhost:8080
// Production (Vercel) -> https://your-render-backend.onrender.com

const BASE_URL = https://financetrackerbackend-production-40d2.up.railway.app/api";

// ─────────────────────────────────────────────
// Helper Function
// ─────────────────────────────────────────────
const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Required for HttpOnly JWT Cookie
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Something went wrong");
  }

  // Handle endpoints with no response body
  if (res.status === 204) return null;

  return res.json();
};

// ─────────────────────────────────────────────
// AUTH APIs
// ─────────────────────────────────────────────

// Send OTP
export const sendOtp = (username, email) =>
  request("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ username, email }),
  });

// Register User
export const registerUser = (username, email, password, otp) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      otp,
    }),
  });

// Login User
export const loginUser = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });

// Logout User
export const logoutUser = () =>
  request("/auth/logout", {
    method: "POST",
  });

// ─────────────────────────────────────────────
// TRANSACTION APIs
// ─────────────────────────────────────────────

// Get All Transactions
export const getTransactions = () =>
  request("/transactions");

// Add Transaction
export const addTransaction = (transaction) =>
  request("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });

// Update Transaction
export const updateTransaction = (id, transaction) =>
  request(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });

// Delete Transaction
export const deleteTransaction = (id) =>
  request(`/transactions/${id}`, {
    method: "DELETE",
  });

// Get Dashboard Summary
export const getSummary = () =>
  request("/transactions/summary");
