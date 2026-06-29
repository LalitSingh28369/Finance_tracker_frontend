import { useState } from "react";
import { sendOtp, registerUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

const RegisterPage = ({ onNavigate }) => {
  const { login } = useAuth();

  const [step, setStep]         = useState(1); // 1=form, 2=otp
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!username || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(username, email);
      setStep(2); // move to OTP screen
      setSuccess("OTP sent to " + email + "! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleRegister = async () => {
    if (!otp) { setError("Please enter OTP"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await registerUser(username, email, password, otp);
      // Auto login after register
      await login(username, password);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>💰</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>
            {step === 1
              ? "Fill your details to get started"
              : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* Step Indicator */}
        <div style={styles.steps}>
          <div style={{
            ...styles.step,
            background: "#0f3460",
            color: "#fff"
          }}>
            1
          </div>
          <div style={styles.stepLine} />
          <div style={{
            ...styles.step,
            background: step === 2 ? "#0f3460" : "#e0e0e0",
            color: step === 2 ? "#fff" : "#999"
          }}>
            2
          </div>
        </div>
        <div style={styles.stepLabels}>
          <span style={styles.stepLabel}>Details</span>
          <span style={styles.stepLabel}>Verify OTP</span>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Success */}
        {success && <div style={styles.success}>{success}</div>}

        {/* ── STEP 1: Details Form ── */}
        {step === 1 && (
          <div style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                style={styles.input}
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="your@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </div>
        )}

        {/* ── STEP 2: OTP Form ── */}
        {step === 2 && (
          <div style={styles.form}>
            <p style={styles.otpInfo}>
              📧 OTP sent to <strong>{email}</strong>
            </p>
            <div style={styles.field}>
              <label style={styles.label}>Enter 6-digit OTP</label>
              <input
                style={{ ...styles.input, ...styles.otpInput }}
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <button
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Verifying..." : "✅ Verify & Register"}
            </button>
            <button
              style={styles.resendBtn}
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setSuccess("");
              }}
            >
              ← Change Details
            </button>
            <button
              style={styles.resendBtn}
              onClick={handleSendOtp}
              disabled={loading}
            >
              🔄 Resend OTP
            </button>
          </div>
        )}

        <p style={styles.switchText}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => onNavigate("login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
  },
  header: { textAlign: "center", marginBottom: "24px" },
  logo: { fontSize: "48px", marginBottom: "10px" },
  title: { margin: 0, fontSize: "24px", fontWeight: "800", color: "#1a1a2e" },
  subtitle: { color: "#888", marginTop: "6px", fontSize: "14px" },

  // Steps
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
    marginBottom: "4px",
  },
  step: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },
  stepLine: {
    width: "80px",
    height: "3px",
    background: "#e0e0e0",
  },
  stepLabels: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "8px",
    paddingRight: "8px",
    marginBottom: "20px",
  },
  stepLabel: { fontSize: "12px", color: "#888", fontWeight: "600" },

  error: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  success: {
    background: "#f0fff4",
    border: "1px solid #b2f5c8",
    color: "#1a7a3c",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  form: { display: "flex", flexDirection: "column", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#444" },
  input: {
    padding: "12px 14px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    color: "#222",
    background: "#fff",
  },
  otpInput: {
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "8px",
    fontWeight: "700",
  },
  btn: {
    background: "linear-gradient(135deg, #0f3460, #533483)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "4px",
  },
  otpInfo: {
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
    margin: 0,
  },
  resendBtn: {
    background: "none",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    color: "#555",
    cursor: "pointer",
  },
  switchText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#888",
    fontSize: "14px",
  },
  link: { color: "#0f3460", fontWeight: "600", cursor: "pointer" },
};

export default RegisterPage;