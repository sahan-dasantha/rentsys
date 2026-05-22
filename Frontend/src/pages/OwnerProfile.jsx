import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { C, T } from "../styles/theme"; // ← ADDED: replaces the entire local C object and styles object

// ── ICON COMPONENTS ──────────────────────────────────────────────
// These small SVG icons are kept here since they're specific to this page
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

// ── INFO ROW COMPONENT ───────────────────────────────────────────
// Reusable row used inside info cards — shows icon + label + value
// "last" prop removes the bottom border on the final row
const InfoRow = ({ icon, label, value, last }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "14px",
      padding: "14px 0",
      borderBottom: last ? "none" : `1px solid ${C.border}`,
      paddingBottom: last ? 0 : undefined,
    }}
  >
    <span style={{ color: C.accent, marginTop: "2px", flexShrink: 0 }}>
      {icon}
    </span>
    <div>
      <div style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.97rem", color: C.text }}>{value || "—"}</div>
    </div>
  </div>
);

// ── MAIN COMPONENT ───────────────────────────────────────────────
const OwnerProfile = () => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── fetch owner data on page load ──
  useEffect(() => {
    const stored = localStorage.getItem("owner");
    if (!stored) {
      navigate("/ownerlogin");
      return;
    } // redirect if not logged in

    const parsed = JSON.parse(stored);

    axios
      .get(`http://localhost:8081/owner/${parsed.ownerId}`)
      .then((res) => {
        setOwner(res.data);
        setLoading(false);
      })
      .catch(() => {
        setOwner(parsed);
        setLoading(false);
      }); // fallback to localStorage
  }, [navigate]);

  // ── get initials from full name for avatar (e.g. "Sahan Dasantha" → "SD") ──
  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "O";

  const handleLogout = () => {
    localStorage.removeItem("owner");
    navigate("/ownerlogin");
  };

  // ── LOADING STATE ────────────────────────────────────────────────
  if (loading)
    return (
      <div
        style={{ ...T.page, alignItems: "center", justifyContent: "center" }}
      >
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
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <span style={{ color: C.muted }}>Loading profile…</span>
      </div>
    );

  // ── ERROR STATE ──────────────────────────────────────────────────
  if (error)
    return (
      <div
        style={{ ...T.page, alignItems: "center", justifyContent: "center" }}
      >
        <span style={{ color: C.danger, fontSize: "1.1rem" }}>{error}</span>
        <button
          onClick={() => navigate("/ownerlogin")}
          style={{ ...T.btnOutline, marginTop: "16px" }}
        >
          Back to Login
        </button>
      </div>
    );

  // ── MAIN RENDER ──────────────────────────────────────────────────
  return (
    <div style={T.page}>
      <style>{`
        button:hover { opacity: 0.82; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.2s both; }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────
          ← CHANGED: was styles.topBar — now uses T.topBar from theme  */}
      <nav style={T.topBar}>
        {/* ← CHANGED: was styles.logo — now uses T.logo from theme */}
        <span style={T.logo}>🏠 RentSys</span>

        <button
          onClick={handleLogout}
          style={{
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
          }}
        >
          <IconLogout /> Logout
        </button>
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          maxWidth: "900px",
          width: "100%",
          margin: "48px auto",
          padding: "0 24px",
        }}
      >
        {/* ── HERO CARD ─────────────────────────────────────────────
            Shows avatar initials, owner name, badge, edit button    */}
        <div
          className="fade-up"
          style={{
            // ← CHANGED: was styles.heroCard — now spreads T.card + extra styles
            ...T.card,
            background: `linear-gradient(135deg, ${C.card} 0%, #1e2235 100%)`,
            borderRadius: "20px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            gap: "36px",
            marginBottom: "28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative gold glow top-right corner */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* avatar circle with owner initials */}
          <div
            style={{
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
            }}
          >
            {initials(owner.fullName)}
          </div>

          {/* owner name + gold badge */}
          <div>
            <h1
              style={{
                fontSize: "1.9rem",
                fontWeight: "700",
                margin: "0 0 6px",
                letterSpacing: "0.02em",
                color: C.text,
              }}
            >
              {owner.fullName}
            </h1>
            <span
              style={{
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
              }}
            >
              <IconBuilding /> Property Owner
            </span>
          </div>

          {/* Edit Profile button
              ← CHANGED: was styles.editBtn — now uses T.btnOutline from theme */}
          <button
            style={{
              ...T.btnOutline,
              marginLeft: "auto",
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexShrink: 0,
            }}
            onClick={() => navigate(`/owner/edit/${owner.ownerId}`)}
          >
            <IconEdit /> Edit Profile
          </button>
        </div>

        {/* ── STATS STRIP ───────────────────────────────────────────
            3 stat cards in a row showing numbers
            ← CHANGED: was styles.statsStrip + styles.statCard
            now uses T.card from theme for each card                 */}
        <div
          className="fade-up-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          {[
            { num: "—", lbl: "Properties Listed" },
            { num: "—", lbl: "Active Tenants" },
            { num: "—", lbl: "Years on Platform" },
          ].map((s, i) => (
            <div
              key={i}
              style={{ ...T.card, textAlign: "center", padding: "24px" }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: C.accent,
                  fontFamily: "'Georgia', serif",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: C.muted,
                  marginTop: "4px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {s.lbl}
              </div>
            </div>
          ))}
        </div>

        {/* ← ADDED: Manage My Properties button
            Navigates to /ownerproperties page where owner can add/view properties */}
        <div className="fade-up-2" style={{ marginBottom: "28px" }}>
          <button
            onClick={() => navigate("/ownerproperties")}
            style={{
              ...T.btnGold, // gold filled button from theme
              width: "100%",
              padding: "14px",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            🏠 Manage My Properties
          </button>
        </div>

        {/* ── INFO CARDS GRID ───────────────────────────────────────
            2 columns: Contact Info + Personal Details
            1 full-width row: Account Info
            ← CHANGED: was styles.grid + styles.infoCard
            now uses T.card from theme                               */}
        <div
          className="fade-up-3"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Contact Information */}
          <div style={T.card}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
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

          {/* Personal Details */}
          <div style={T.card}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
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

          {/* Account Information — gridColumn spans both columns */}
          <div style={{ ...T.card, gridColumn: "1 / -1" }}>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IconBuilding /> Account Information
            </div>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              {/* Owner ID */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                  }}
                >
                  Owner ID
                </div>
                <div
                  style={{
                    color: C.accent,
                    fontFamily: "monospace",
                    fontSize: "1.05rem",
                  }}
                >
                  #{String(owner.ownerId).padStart(5, "0")}
                </div>
              </div>

              {/* Account Status with green dot */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                  }}
                >
                  Account Status
                </div>
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
        {/* ── END INFO CARDS GRID ─────────────────────────────────── */}
      </main>
    </div>
  );
};

export default OwnerProfile;
