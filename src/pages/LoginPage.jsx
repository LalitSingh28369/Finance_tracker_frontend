// ─────────────────────────────────────────────
//  LoginPage.jsx
//
//  What this does:
//  - Shows login form
//  - Calls loginUser API via AuthContext
//  - On success → redirects to Dashboard
//  - Shows error if login fails
// ─────────────────────────────────────────────

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = ({ onNavigate }) => {
  // Local state just for this form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Get login function and states from AuthContext
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) return;

    const success = await login(username, password);

    if (success) {
      onNavigate("dashboard"); // go to dashboard
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>💰</div>
          <h1 style={styles.title}>Finance Tracker</h1>
          <p style={styles.subtitle}>Track your money, own your future</p>
        </div>

        {/* Error message from API */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Switch to register */}
        <p style={styles.switchText}>
          Don't have an account?{" "}
          <span style={styles.link} onClick={() => onNavigate("register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

// ── Inline styles — no extra CSS file needed ──
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  logo: { fontSize: "48px", marginBottom: "10px" },
  title: { margin: 0, fontSize: "24px", color: "#1a1a2e", fontWeight: "700" },
  subtitle: { color: "#888", marginTop: "6px", fontSize: "14px" },
  error: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#444" },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    background: "linear-gradient(135deg, #0f3460, #533483)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  switchText: { textAlign: "center", marginTop: "20px", color: "#888", fontSize: "14px" },
  link: { color: "#0f3460", fontWeight: "600", cursor: "pointer" },
};

export default LoginPage;
