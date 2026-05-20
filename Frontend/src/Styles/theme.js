export const C = {
  bg: "#0d0f14",
  surface: "#13161e",
  card: "#181c27",
  border: "#252a38",
  accent: "#c9a96e", // gold
  accent2: "#e8c98a",
  text: "#eef0f6",
  muted: "#7a8099",
  danger: "#e05c5c",
};

// Reusable style blocks
export const T = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    color: C.text,
    fontFamily: "'Georgia', serif",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // ← makes logo left, links right
    padding: "18px 48px", // ← CHANGED: more horizontal padding
    borderBottom: `1px solid ${C.border}`,
    background: C.surface,
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%", // ← ADDED: full width
    boxSizing: "border-box", // ← ADDED: padding included in width
  },
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "28px",
  },
  input: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    color: C.text,
    padding: "10px 14px",
    width: "100%",
    fontSize: "0.95rem",
    outline: "none",
  },
  btnGold: {
    background: C.accent,
    color: C.bg,
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  btnOutline: {
    background: "transparent",
    border: `1px solid ${C.accent}`,
    color: C.accent,
    borderRadius: "8px",
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  label: {
    fontSize: "0.78rem",
    color: C.muted,
    marginBottom: "6px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    display: "block",
  },
};
