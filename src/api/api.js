// ─────────────────────────────────────────────
//  api.js  —  ALL backend calls live here
//  Change BASE_URL when you deploy to production
// ─────────────────────────────────────────────

const BASE_URL = "http://localhost:8080/api";

// ── Helper: every fetch goes through this ──
// So we don't repeat headers & credentials everywhere
const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ← sends cookie automatically on every request
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Something went wrong");
  }

  return res.json();
};

// ─────────────────────────────────────────────
//  AUTH APIs
// ─────────────────────────────────────────────

// POST /api/auth/register
// Body: { username, email, password }
// Step 1: Send OTP to email
export const sendOtp = (username, email) =>
  request("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ username, email }),
  });

// Step 2: Register with OTP
export const registerUser = (username, email, password, otp) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password, otp }),
  });



// POST /api/auth/login
// Body: { username, password }
// Spring Boot sets HttpOnly cookie in response
export const loginUser = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// POST /api/auth/logout
// Spring Boot clears the cookie
export const logoutUser = () =>
  request("/auth/logout", { method: "POST" });

// ─────────────────────────────────────────────
//  TRANSACTION APIs
// ─────────────────────────────────────────────

// GET /api/transactions
// Returns all transactions for logged-in user
export const getTransactions = () => request("/transactions");

// POST /api/transactions
// Body: { title, amount, category, date, type }
// type = "income" or "expense"
export const addTransaction = (transaction) =>
  request("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });

// PUT /api/transactions/:id
export const updateTransaction = (id, transaction) =>
  request(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });

// DELETE /api/transactions/:id
export const deleteTransaction = (id) =>
  request(`/transactions/${id}`, { method: "DELETE" });

// GET /api/transactions/summary
// Returns { totalIncome, totalExpense, balance }
export const getSummary = () => request("/transactions/summary");

