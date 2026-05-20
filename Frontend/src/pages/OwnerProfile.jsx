import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ── tiny icon components (no extra deps) ──────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const IconMail = () => <Icon d="M4 4h16v16H4z M22 6l-10 7L2 6" />;
const IconPhone = () => (
  <Icon d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17z" />
);
const IconHome = () => (
  <Icon d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z M9 21V12h6v9" />
);
const IconId = () => <Icon d="M2 5h20v14H2z M8 10h8 M8 14h4" />;
const IconLogout = () => (
  <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
);
const IconEdit = () => (
  <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
);
const IconBuilding = () => (
  <Icon d="M3 21h18 M5 21V7l7-4 7 4v14 M9 21v-4h6v4" />
);

// ── colour palette & helpers ──────────────────────────────────────
const C = {
  bg: "#0d0f14",
  surface: "#13161e",
  card: "#181c27",
  border: "#252a38",
  accent: "#c9a96e", // warm gold
  accent2: "#e8c98a",
  text: "#eef0f6",
  muted: "#7a8099",
  danger: "#e05c5c",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: C.text,
    display: "flex",
    flexDirection: "column",
  },

  // ── top bar ──
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 40px",
    borderBottom: `1px solid ${C.border}`,
    background: C.surface,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: C.accent,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    border: `1px solid ${C.border}`,
    color: C.muted,
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all .2s",
  },

  // ── main layout ──
  main: {
    flex: 1,
    maxWidth: "900px",
    width: "100%",
    margin: "48px auto",
    padding: "0 24px",
  },

  // ── hero card ──
  heroCard: {
    background: `linear-gradient(135deg, ${C.card} 0%, #1e2235 100%)`,
    border: `1px solid ${C.border}`,
    borderRadius: "20px",
    padding: "40px",
    display: "flex",
    alignItems: "center",
    gap: "36px",
    marginBottom: "28px",
    position: "relative",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    top: "-40px",
    right: "-40px",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
    pointerEvents: "none",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accent2} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.6rem",
    fontWeight: "700",
    color: C.bg,
    flexShrink: 0,
    boxShadow: `0 0 0 4px ${C.bg}, 0 0 0 6px ${C.accent}55`,
  },
  heroName: {
    fontSize: "1.9rem",
    fontWeight: "700",
    margin: "0 0 6px",
    letterSpacing: "0.02em",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: `${C.accent}22`,
    border: `1px solid ${C.accent}55`,
    color: C.accent,
    borderRadius: "20px",
    padding: "4px 14px",
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  editBtn: {
    marginLeft: "auto",
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "transparent",
    border: `1px solid ${C.accent}66`,
    color: C.accent,
    padding: "9px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all .2s",
    flexShrink: 0,
  },

  // ── grid ──
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  infoCard: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "28px",
  },
  infoCardFull: {
    gridColumn: "1 / -1",
  },
  cardLabel: {
    fontSize: "0.7rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.muted,
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "14px 0",
    borderBottom: `1px solid ${C.border}`,
  },
  rowIcon: {
    color: C.accent,
    marginTop: "2px",
    flexShrink: 0,
  },
  rowLabel: {
    fontSize: "0.75rem",
    color: C.muted,
    marginBottom: "3px",
  },
  rowValue: {
    fontSize: "0.97rem",
    color: C.text,
  },

  // ── stats strip ──
  statsStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "28px",
  },
  statCard: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
  },
  statNum: {
    fontSize: "2rem",
    fontWeight: "700",
    color: C.accent,
    fontFamily: "'Georgia', serif",
  },
  statLbl: {
    fontSize: "0.75rem",
    color: C.muted,
    marginTop: "4px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },

  // ── loader / error ──
  center: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "16px",
    color: C.muted,
    minHeight: "60vh",
  },
};

// ── InfoRow ──────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value, last }) => (
  <div
    style={{
      ...styles.row,
      ...(last ? { borderBottom: "none", paddingBottom: 0 } : {}),
    }}
  >
    <span style={styles.rowIcon}>{icon}</span>
    <div>
      <div style={styles.rowLabel}>{label}</div>
      <div style={styles.rowValue}>{value || "—"}</div>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────
const OwnerProfile = () => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("owner");
    if (!stored) {
      navigate("/ownerlogin");
      return;
    }

    const parsed = JSON.parse(stored);
    const id = parsed.ownerId;

    axios
      .get(`http://localhost:8081/owner/${id}`)
      .then((res) => {
        setOwner(res.data);
        setLoading(false);
      })
      .catch(() => {
        // fallback to stored data if API fails
        setOwner(parsed);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("owner");
    navigate("/ownerlogin");
  };

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "O";

  // ── loading ──
  if (loading)
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <div
            style={{
              width: 44,
              height: 44,
              border: `3px solid ${C.border}`,
              borderTop: `3px solid ${C.accent}`,
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <span>Loading profile…</span>
        </div>
      </div>
    );

  // ── error ──
  if (error)
    return (
      <div style={styles.page}>
        <div style={styles.center}>
          <span style={{ color: C.danger, fontSize: "1.1rem" }}>{error}</span>
          <button
            onClick={() => navigate("/ownerlogin")}
            style={{
              ...styles.logoutBtn,
              color: C.accent,
              borderColor: C.accent,
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <style>{`
        button:hover { opacity: 0.82; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.2s both; }
      `}</style>

      {/* Top bar */}
      <nav style={styles.topBar}>
        <span style={styles.logo}>🏠 HomeRent</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <IconLogout /> Logout
        </button>
      </nav>

      <main style={styles.main}>
        {/* Hero card */}
        <div className="fade-up" style={styles.heroCard}>
          <div style={styles.heroBg} />
          <div style={styles.avatar}>{initials(owner.fullName)}</div>
          <div>
            <h1 style={styles.heroName}>{owner.fullName}</h1>
            <span style={styles.heroBadge}>
              <IconBuilding /> Property Owner
            </span>
          </div>
          <button
            style={styles.editBtn}
            onClick={() => navigate(`/owner/edit/${owner.ownerId}`)}
          >
            <IconEdit /> Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="fade-up-2" style={styles.statsStrip}>
          {[
            { num: "—", lbl: "Properties Listed" },
            { num: "—", lbl: "Active Tenants" },
            { num: "—", lbl: "Years on Platform" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLbl}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Info grid */}
        <div className="fade-up-3" style={styles.grid}>
          {/* Contact info */}
          <div style={styles.infoCard}>
            <div style={styles.cardLabel}>
              <IconMail /> Contact Information
            </div>
            <InfoRow
              icon={<IconMail />}
              label="Email Address"
              value={owner.email}
            />
            <InfoRow
              icon={<IconPhone />}
              label="Phone Number"
              value={owner.phoneNumber}
              last
            />
          </div>

          {/* Personal info */}
          <div style={styles.infoCard}>
            <div style={styles.cardLabel}>
              <IconId /> Personal Details
            </div>
            <InfoRow
              icon={<IconId />}
              label="National ID"
              value={owner.nationalId}
            />
            <InfoRow
              icon={<IconHome />}
              label="Address"
              value={owner.address}
              last
            />
          </div>

          {/* Owner ID — full width */}
          <div style={{ ...styles.infoCard, ...styles.infoCardFull }}>
            <div style={styles.cardLabel}>
              <IconBuilding /> Account Information
            </div>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <div>
                <div style={styles.rowLabel}>Owner ID</div>
                <div
                  style={{
                    ...styles.rowValue,
                    color: C.accent,
                    fontFamily: "monospace",
                    fontSize: "1.05rem",
                  }}
                >
                  #{String(owner.ownerId).padStart(5, "0")}
                </div>
              </div>
              <div>
                <div style={styles.rowLabel}>Account Status</div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#5ecb8a",
                    fontSize: "0.95rem",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#5ecb8a",
                      display: "inline-block",
                    }}
                  />
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerProfile;
