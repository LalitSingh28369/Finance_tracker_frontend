import { useState, useEffect } from "react";
import { getBudgetLimits, setBudgetLimit, deleteBudgetLimit } from "../api/api";


const CATEGORIES = ["Food", "Transport", "Entertainment", "Shopping", "Health", "Other"];

const BudgetSection = () => {
  const [budgets, setBudgets]         = useState([]);
  const [category, setCategory]       = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [message, setMessage]         = useState("");

  useEffect(() => { fetchBudgets(); }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await getBudgetLimits();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!limitAmount || isNaN(limitAmount) || parseFloat(limitAmount) <= 0) {
      setMessage("error:Please enter a valid amount");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await setBudgetLimit(category, parseFloat(limitAmount));
      setMessage("success:Budget limit saved!");
      setLimitAmount("");
      fetchBudgets();
    } catch (err) {
      setMessage("error:Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this budget limit?")) return;
    try {
      await deleteBudgetLimit(id);
      fetchBudgets();
    } catch (err) {
      setMessage("error:Failed to delete.");
    }
  };

  const getCatEmoji = (cat) => {
    const map = { Food:"🍔", Transport:"🚗", Entertainment:"🎬", Shopping:"🛍️", Health:"❤️", Other:"📦" };
    return map[cat] || "📦";
  };

  const isSuccess = message.startsWith("success:");
  const msgText   = message.replace(/^(success|error):/, "");

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>⚠️ My Budget Limits</h2>
      <p style={styles.subtitle}>
        Set monthly limits. You'll get an email alert when you cross them!
      </p>

      {/* Form */}
      <div style={styles.formBox}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{getCatEmoji(cat)} {cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Monthly Limit (₹)</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              placeholder="e.g. 5000"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div style={styles.btnWrapper}>
            <label style={{ ...styles.label, opacity: 0 }}>.</label>
            <button
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Set Limit"}
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            marginTop: "12px", padding: "10px 14px",
            borderRadius: "8px", fontSize: "14px",
            background: isSuccess ? "#f0fff4" : "#fff0f0",
            color: isSuccess ? "#1a7a3c" : "#cc0000",
            border: isSuccess ? "1px solid #b2f5c8" : "1px solid #ffcccc",
          }}>
            {isSuccess ? "✅" : "❌"} {msgText}
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : budgets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <div style={{ fontSize: "40px" }}>🎯</div>
          <p style={{ color: "#888", marginTop: "8px" }}>No budget limits set yet.</p>
          <p style={{ color: "#bbb", fontSize: "13px" }}>Set a limit above to get email alerts!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {budgets.map((b) => (
            <div key={b.id} style={styles.item}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>{getCatEmoji(b.category)}</span>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>
                    {b.category}
                  </div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>Monthly limit</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f3460" }}>
                  ₹{Number(b.limitAmount).toLocaleString("en-IN")}
                </span>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", opacity: 0.5 }}
                  onClick={() => handleDelete(b.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  section: {
    background: "#fff", borderRadius: "18px", padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginTop: "24px",
  },
  title: { margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "#1a1a2e" },
  subtitle: { margin: "0 0 20px", color: "#888", fontSize: "14px" },
  formBox: {
    background: "#f9f9ff", border: "1.5px solid #e0e0ff",
    borderRadius: "14px", padding: "20px", marginBottom: "24px",
  },
  row: { display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "150px" },
  btnWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "700", color: "#444" },
  input: {
    padding: "12px 14px", border: "2px solid #e0e0e0", borderRadius: "10px",
    fontSize: "15px", outline: "none", color: "#222", background: "#fff",
    width: "100%", boxSizing: "border-box",
  },
  select: {
    padding: "12px 14px", border: "2px solid #e0e0e0", borderRadius: "10px",
    fontSize: "15px", outline: "none", color: "#222", background: "#fff",
    width: "100%", boxSizing: "border-box", cursor: "pointer",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #0f3460, #533483)", color: "#fff",
    border: "none", borderRadius: "10px", padding: "12px 24px",
    fontSize: "15px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap",
  },
  item: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 18px", background: "#fafafa",
    borderRadius: "12px", border: "1.5px solid #f0f0f0",
  },
};

export default BudgetSection;
