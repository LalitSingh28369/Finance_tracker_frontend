// ─────────────────────────────────────────────
//  App.jsx  —  Root component
//
//  This is the entry point of your React app.
//  It handles simple navigation between pages.
//
//  WHY NOT React Router?
//  For a beginner project, simple useState for
//  navigation is cleaner. You can add React Router
//  later when your app grows.
//
//  Structure:
//  App
//   └─ AuthProvider (wraps everything, provides user state)
//       └─ Shows the right page based on "currentPage" state
// ─────────────────────────────────────────────

import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// ── Inner app decides which page to show ──
const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("login");

  // If user is logged in, always show dashboard
  // This is basic "protected route" logic
  if (user) {
    return <DashboardPage />;
  }

  // Not logged in — show login or register
  if (currentPage === "register") {
    return <RegisterPage onNavigate={setCurrentPage} />;
  }

  return <LoginPage onNavigate={setCurrentPage} />;
};

// ── Root App wraps everything in AuthProvider ──
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
