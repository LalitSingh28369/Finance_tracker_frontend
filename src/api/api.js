// ─────────────────────────────────────────────
// api.js - Backend API Configuration
// Works for Local + Production (Vercel)
// ─────────────────────────────────────────────

// BASE URL comes from environment variable (Vite)
const BASE_URL = import.meta.env.VITE_API_URL;

// Fallback (in case env is missing)
if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// ─────────────────────────────────────────────
// Helper Function
// ─────────────────────────────────────────────
const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // required for JWT cookies
    ...options,
  });

  // Handle error responses
  if (!res.ok) {
    let errorMessage = "Something went wrong";

    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch (e) {}

    throw new Error(errorMessage);
  }

  // No content response
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
    body: JSON.stringify({ username, email, password, otp }),
  });

// Login User
export const loginUser = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
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
