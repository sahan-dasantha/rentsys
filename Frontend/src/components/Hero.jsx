import { useNavigate } from "react-router-dom"; // ← ADDED: for START button navigation
import { C } from "../Styles/theme"; // ← ADDED: import theme colors

// ← ADDED: SVG house illustration component
const HouseIllustration = () => (
  <svg
    viewBox="0 0 400 340"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: "100%",
      maxWidth: "420px",
      filter: "drop-shadow(0 20px 40px rgba(201,169,110,0.15))",
    }}
  >
    {/* ── glow behind house ── */}
    <ellipse cx="200" cy="300" rx="160" ry="24" fill={`${C.accent}18`} />

    {/* ── main building body ── */}
    <rect
      x="60"
      y="160"
      width="280"
      height="160"
      rx="4"
      fill={C.card}
      stroke={C.border}
      strokeWidth="1.5"
    />

    {/* ── roof ── */}
    <polygon
      points="40,165 200,55 360,165"
      fill={C.surface}
      stroke={C.accent}
      strokeWidth="2"
    />

    {/* ── roof detail line ── */}
    <polygon
      points="60,165 200,72 340,165"
      fill="none"
      stroke={`${C.accent}44`}
      strokeWidth="1"
    />

    {/* ── chimney ── */}
    <rect
      x="270"
      y="80"
      width="28"
      height="50"
      rx="2"
      fill={C.surface}
      stroke={C.border}
      strokeWidth="1.5"
    />
    {/* smoke */}
    <circle cx="276" cy="72" r="5" fill={`${C.muted}44`} />
    <circle cx="284" cy="64" r="7" fill={`${C.muted}33`} />
    <circle cx="292" cy="56" r="5" fill={`${C.muted}22`} />

    {/* ── front door ── */}
    <rect
      x="163"
      y="230"
      width="74"
      height="90"
      rx="4"
      fill={C.surface}
      stroke={C.accent}
      strokeWidth="1.5"
    />
    {/* door arch */}
    <path
      d="M163,250 Q163,230 200,230 Q237,230 237,250"
      fill={`${C.accent}22`}
      stroke={C.accent}
      strokeWidth="1.5"
    />
    {/* door knob */}
    <circle cx="229" cy="278" r="4" fill={C.accent} />
    {/* door panel lines */}
    <line
      x1="178"
      y1="265"
      x2="178"
      y2="315"
      stroke={C.border}
      strokeWidth="1"
    />
    <line
      x1="222"
      y1="265"
      x2="222"
      y2="315"
      stroke={C.border}
      strokeWidth="1"
    />

    {/* ── left window ── */}
    <rect
      x="82"
      y="185"
      width="68"
      height="60"
      rx="3"
      fill={`${C.accent}11`}
      stroke={C.accent}
      strokeWidth="1.5"
    />
    <line
      x1="116"
      y1="185"
      x2="116"
      y2="245"
      stroke={C.accent}
      strokeWidth="1"
    />
    <line
      x1="82"
      y1="215"
      x2="150"
      y2="215"
      stroke={C.accent}
      strokeWidth="1"
    />
    {/* window glow */}
    <rect x="82" y="185" width="68" height="60" rx="3" fill={`${C.accent}08`} />

    {/* ── right window ── */}
    <rect
      x="250"
      y="185"
      width="68"
      height="60"
      rx="3"
      fill={`${C.accent}11`}
      stroke={C.accent}
      strokeWidth="1.5"
    />
    <line
      x1="284"
      y1="185"
      x2="284"
      y2="245"
      stroke={C.accent}
      strokeWidth="1"
    />
    <line
      x1="250"
      y1="215"
      x2="318"
      y2="215"
      stroke={C.accent}
      strokeWidth="1"
    />
    <rect
      x="250"
      y="185"
      width="68"
      height="60"
      rx="3"
      fill={`${C.accent}08`}
    />

    {/* ── path to door ── */}
    <rect x="178" y="318" width="44" height="8" rx="2" fill={C.border} />
    <rect x="168" y="323" width="64" height="4" rx="2" fill={`${C.border}88`} />

    {/* ── small bushes ── */}
    <ellipse
      cx="90"
      cy="322"
      rx="22"
      ry="14"
      fill={`${C.accent}22`}
      stroke={`${C.accent}44`}
      strokeWidth="1"
    />
    <ellipse
      cx="310"
      cy="322"
      rx="22"
      ry="14"
      fill={`${C.accent}22`}
      stroke={`${C.accent}44`}
      strokeWidth="1"
    />

    {/* ── stars / sparkles ── */}
    {[
      [340, 40],
      [28, 120],
      [370, 200],
      [15, 260],
    ].map(([x, y], i) => (
      <g key={i}>
        <line
          x1={x - 6}
          y1={y}
          x2={x + 6}
          y2={y}
          stroke={`${C.accent}66`}
          strokeWidth="1.2"
        />
        <line
          x1={x}
          y1={y - 6}
          x2={x}
          y2={y + 6}
          stroke={`${C.accent}66`}
          strokeWidth="1.2"
        />
      </g>
    ))}
  </svg>
);

const Hero = () => {
  const navigate = useNavigate(); // ← ADDED: for START button

  return (
    // ← CHANGED: replaced Bootstrap "hero" class with dark themed section
    <section
      style={{
        background: `linear-gradient(160deg, ${C.bg} 0%, #0f1220 60%, ${C.bg} 100%)`,
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "60px 0",
      }}
    >
      {/* ← ADDED: subtle background grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${C.border}33 1px, transparent 1px),
                          linear-gradient(90deg, ${C.border}33 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

      {/* ← ADDED: gold glow top right */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ← CHANGED: replaced Bootstrap "container > row" with flex layout */}
      <div
        style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          gap: "60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ← CHANGED: empty left column → house illustration */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <HouseIllustration />
        </div>

        {/* ── right column — text ── */}
        <div style={{ flex: 1 }}>
          {/* ← ADDED: small badge above heading */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: `${C.accent}18`,
              border: `1px solid ${C.accent}44`,
              borderRadius: "20px",
              padding: "5px 14px",
              fontSize: "0.75rem",
              color: C.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            ✦ Property Management System
          </div>

          {/* ← CHANGED: plain <h1> → large gold styled heading */}
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: "700",
              lineHeight: "1.15",
              color: C.text,
              fontFamily: "'Georgia', serif",
              margin: "0 0 20px",
            }}
          >
            Your New Home {/* ← ADDED: gold highlight on key word */}
            <span
              style={{
                color: C.accent,
                borderBottom: `2px solid ${C.accent}`,
                paddingBottom: "2px",
              }}
            >
              Awaits
            </span>
            <br />
            <span
              style={{ fontSize: "0.75em", color: C.muted, fontWeight: 400 }}
            >
              Houses & Apartments for Rent
            </span>
          </h1>

          {/* ← CHANGED: plain <p> → styled muted description */}
          <p
            style={{
              color: C.muted,
              fontSize: "1rem",
              lineHeight: "1.7",
              marginBottom: "36px",
              maxWidth: "420px",
            }}
          >
            Manage your rental properties, tenants, agreements, and payments —
            all in one place. Simple, fast, and reliable.
          </p>

          {/* ← CHANGED: "btn btn-outline-dark" → gold themed buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/ownersignup")} // ← ADDED: navigates to register
              style={{
                background: C.accent,
                color: C.bg,
                border: "none",
                borderRadius: "10px",
                padding: "14px 32px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "opacity .2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Get Started →
            </button>

            {/* ← ADDED: secondary outline button */}
            <button
              onClick={() => navigate("/ownerlogin")}
              style={{
                background: "transparent",
                color: C.accent,
                border: `1px solid ${C.accent}`,
                borderRadius: "10px",
                padding: "14px 32px",
                fontSize: "1rem",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "opacity .2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Login
            </button>
          </div>

          {/* ← ADDED: small stats row below buttons */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "40px",
              paddingTop: "32px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {[
              { num: "200+", label: "Properties" },
              { num: "500+", label: "Happy Tenants" },
              { num: "50+", label: "Owners" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: C.accent,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginTop: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
