import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getSummary,
} from "../api/api";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Shopping", "Health", "Other"];

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: today,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [txData, summaryData] = await Promise.all([
        getTransactions(),
        getSummary(),
      ]);
      setTransactions(Array.isArray(txData) ? txData : []);
      setSummary(summaryData || { balance: 0, totalIncome: 0, totalExpense: 0 });
    } catch (err) {
      setError("Failed to load data. Is your backend running on localhost:8080?");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.title.trim()) { alert("Please enter a title"); return; }
    if (!form.amount || isNaN(form.amount)) { alert("Please enter a valid amount"); return; }
    if (!form.date) { alert("Please select a date"); return; }

    setAdding(true);
    try {
      await addTransaction({
        title: form.title,
        amount: parseFloat(form.amount),
        category: form.category,
        type: form.type,
        date: form.date,
      });
      setForm({ title: "", amount: "", category: "Food", type: "expense", date: today });
      setShowForm(false);
      await fetchAll();
    } catch (err) {
      setError("Failed to add transaction. Check backend.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      await fetchAll();
    } catch (err) {
      setError("Failed to delete.");
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>💰 Finance Tracker</span>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {user?.username || "User"}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>

        {/* Error */}
        {error && (
          <div style={styles.errorBanner}>
            ⚠️ {error}
            <button onClick={() => { setError(null); fetchAll(); }} style={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={styles.loadingBox}>
            <p>⏳ Loading your finances...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={styles.cards}>
              <div style={{ ...styles.card, borderTop: "4px solid #0f3460" }}>
                <div style={styles.cardIcon}>💳</div>
                <div>
                  <p style={styles.cardLabel}>BALANCE</p>
                  <p style={{ ...styles.cardValue, color: "#0f3460" }}>
                    ₹{Number(summary.balance || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div style={{ ...styles.card, borderTop: "4px solid #2ecc71" }}>
                <div style={styles.cardIcon}>📈</div>
                <div>
                  <p style={styles.cardLabel}>TOTAL INCOME</p>
                  <p style={{ ...styles.cardValue, color: "#2ecc71" }}>
                    ₹{Number(summary.totalIncome || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div style={{ ...styles.card, borderTop: "4px solid #e74c3c" }}>
                <div style={styles.cardIcon}>📉</div>
                <div>
                  <p style={styles.cardLabel}>TOTAL EXPENSES</p>
                  <p style={{ ...styles.cardValue, color: "#e74c3c" }}>
                    ₹{Number(summary.totalExpense || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  Transactions
                  <span style={styles.badge}>{transactions.length}</span>
                </h2>
                <button
                  style={styles.addBtn}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "✕ Cancel" : "+ Add Transaction"}
                </button>
              </div>

              {/* Add Form */}
              {showForm && (
                <div style={styles.formBox}>
                  {/* Row 1: Title + Amount */}
                  <div style={styles.row}>
                    <div style={styles.fieldBox}>
                      <label style={styles.label}>Title *</label>
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="e.g. Grocery shopping"
                        value={form.title}
                        onChange={(e) => updateForm("title", e.target.value)}
                      />
                    </div>
                    <div style={styles.fieldBox}>
                      <label style={styles.label}>Amount (₹) *</label>
                      <input
                        style={styles.input}
                        type="number"
                        min="0"
                        placeholder="500"
                        value={form.amount}
                        onChange={(e) => updateForm("amount", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Row 2: Category + Type + Date */}
                  <div style={styles.row}>
                    <div style={styles.fieldBox}>
                      <label style={styles.label}>Category *</label>
                      <select
                        style={styles.select}
                        value={form.category}
                        onChange={(e) => updateForm("category", e.target.value)}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.fieldBox}>
                      <label style={styles.label}>Type *</label>
                      <select
                        style={styles.select}
                        value={form.type}
                        onChange={(e) => updateForm("type", e.target.value)}
                      >
                        <option value="expense">💸 Expense</option>
                        <option value="income">💰 Income</option>
                      </select>
                    </div>

                    <div style={styles.fieldBox}>
                      <label style={styles.label}>Date *</label>
                      <input
                        style={styles.input}
                        type="date"
                        value={form.date}
                        onChange={(e) => updateForm("date", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {form.title && form.amount && (
                    <div style={styles.preview}>
                      📝 Preview: <strong>{form.title}</strong> —{" "}
                      <strong style={{
                        color: form.type === "expense" ? "#e74c3c" : "#2ecc71"
                      }}>
                        {form.type === "expense" ? "-" : "+"}₹{form.amount}
                      </strong>{" "}
                      [{form.category}] on {form.date}
                    </div>
                  )}

                  <button
                    style={{ ...styles.saveBtn, opacity: adding ? 0.7 : 1 }}
                    onClick={handleAdd}
                    disabled={adding}
                  >
                    {adding ? "⏳ Saving..." : "✅ Save Transaction"}
                  </button>
                </div>
              )}

              {/* Transaction List */}
              {transactions.length === 0 ? (
                <div style={styles.emptyBox}>
                  <div style={{ fontSize: "48px" }}>📭</div>
                  <p style={{ color: "#888", marginTop: "12px" }}>
                    No transactions yet. Add your first one!
                  </p>
                </div>
              ) : (
                <div style={styles.list}>
                  {transactions.map((tx) => (
                    <div key={tx.id} style={styles.txItem}>
                      <div>
                        <div style={styles.txCat}>
                          {getCatEmoji(tx.category)} {tx.category}
                        </div>
                        <div style={styles.txTitle}>{tx.title}</div>
                        <div style={styles.txDate}>{tx.date}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{
                          fontSize: "18px",
                          fontWeight: "800",
                          color: tx.type === "expense" ? "#e74c3c" : "#2ecc71"
                        }}>
                          {tx.type === "expense" ? "-" : "+"}
                          ₹{Number(tx.amount || 0).toLocaleString("en-IN")}
                        </span>
                        <button
                          style={styles.delBtn}
                          onClick={() => handleDelete(tx.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const getCatEmoji = (cat) => {
  const map = {
    Food: "🍔", Transport: "🚗", Entertainment: "🎬",
    Shopping: "🛍️", Health: "❤️", Other: "📦"
  };
  return map[cat] || "📦";
};

const styles = {
  page: { minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" },
  nav: {
    background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
    padding: "16px 32px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  navLogo: { color: "#fff", fontSize: "20px", fontWeight: "700" },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  navUser: { color: "#ccc", fontSize: "14px" },
  logoutBtn: {
    background: "rgba(255,255,255,0.15)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px",
    padding: "8px 16px", cursor: "pointer", fontSize: "14px",
  },
  content: { maxWidth: "900px", margin: "0 auto", padding: "32px 16px" },
  errorBanner: {
    background: "#fff0f0", border: "1px solid #ffcccc", color: "#cc0000",
    padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  retryBtn: {
    background: "#cc0000", color: "#fff", border: "none",
    borderRadius: "6px", padding: "6px 12px", cursor: "pointer",
  },
  loadingBox: { textAlign: "center", padding: "60px", fontSize: "18px", color: "#888" },
  cards: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "28px" },
  card: {
    background: "#fff", borderRadius: "18px", padding: "24px 20px",
    display: "flex", alignItems: "center", gap: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
  },
  cardIcon: { fontSize: "36px" },
  cardLabel: { margin: 0, color: "#999", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" },
  cardValue: { margin: "4px 0 0", fontSize: "26px", fontWeight: "800" },
  section: {
    background: "#fff", borderRadius: "18px", padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
  },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  sectionTitle: { margin: 0, fontSize: "18px", fontWeight: "800", color: "#1a1a2e", display: "flex", alignItems: "center", gap: "10px" },
  badge: { background: "#f0f0ff", color: "#0f3460", fontSize: "13px", fontWeight: "700", padding: "2px 10px", borderRadius: "99px" },
  addBtn: {
    background: "linear-gradient(135deg, #0f3460, #533483)", color: "#fff",
    border: "none", borderRadius: "10px", padding: "10px 20px",
    cursor: "pointer", fontWeight: "600", fontSize: "14px",
  },
  formBox: {
    background: "#f9f9ff", border: "1.5px solid #e0e0ff",
    borderRadius: "14px", padding: "24px", marginBottom: "24px",
  },
  row: { display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" },
  fieldBox: { display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "150px" },
  label: { fontSize: "13px", fontWeight: "700", color: "#444" },
  input: {
    padding: "12px 14px", border: "2px solid #e0e0e0", borderRadius: "10px",
    fontSize: "15px", outline: "none", background: "#fff",
    width: "100%", boxSizing: "border-box",
    color: "#222",           // ← text visible
    WebkitTextFillColor: "#222", // ← fixes Safari/Chrome autofill
  },
  select: {
    padding: "12px 14px", border: "2px solid #e0e0e0", borderRadius: "10px",
    fontSize: "15px", outline: "none", background: "#fff",
    width: "100%", boxSizing: "border-box", cursor: "pointer",
    appearance: "auto",
    color: "#222",           // ← dropdown text visible
  },
  preview: {
    background: "#fff", border: "1px solid #e0e0ff", borderRadius: "8px",
    padding: "10px 14px", marginBottom: "16px", fontSize: "14px", color: "#555",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #0f3460, #533483)", color: "#fff",
    border: "none", borderRadius: "10px", padding: "14px 32px",
    fontSize: "16px", fontWeight: "700", cursor: "pointer", width: "100%",
  },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  txItem: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 18px", borderRadius: "12px",
    border: "1.5px solid #f0f0f0", background: "#fafafa",
  },
  txCat: { fontSize: "11px", fontWeight: "800", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" },
  txTitle: { fontSize: "15px", fontWeight: "600", color: "#1a1a2e" },
  txDate: { fontSize: "12px", color: "#bbb", marginTop: "2px" },
  delBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "18px", opacity: 0.5 },
  emptyBox: { textAlign: "center", padding: "50px 0" },
};

export default DashboardPage;
