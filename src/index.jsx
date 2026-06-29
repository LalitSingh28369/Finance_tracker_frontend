// ─────────────────────────────────────────────
//  index.jsx  —  Entry point
//  React starts here. Mounts App into the HTML.
//  You don't need to touch this file.
// ─────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global reset styles
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
