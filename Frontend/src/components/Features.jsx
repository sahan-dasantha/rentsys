import { C } from "../Styles/theme"; // ← ADDED: import theme colors

// ← ADDED: feature data array — easy to add/edit features later
// Instead of hardcoding 4 separate divs, we store data here and map over it below
const features = [
  {
    icon: "🏠",
    title: "Properties",
    description:
      "List, manage and track all your rental properties in one clean dashboard.",
    color: "#c9a96e", // gold — matches app accent color
  },
  {
    icon: "👤",
    title: "Tenants",
    description:
      "Keep tenant records, lease dates, and contact details organized and accessible.",
    color: "#7eb8e8", // soft blue
  },
  {
    icon: "💳",
    title: "Payments",
    description:
      "Monitor rent payments, overdue amounts, and transaction history effortlessly.",
    color: "#5ecb8a", // green
  },
  {
    icon: "🔧",
    title: "Maintenance",
    description:
      "Receive and resolve maintenance requests from tenants quickly and efficiently.",
    color: "#e09b5c", // orange
  },
];

const Features = () => {
  return (
    // ── SECTION WRAPPER ──────────────────────────────────────────────
    // ← CHANGED: removed Bootstrap "py-5 text-center" className
    // Now using dark surface color to separate this section from the hero
    <section
      style={{
        background: C.surface, // dark background (#13161e)
        borderTop: `1px solid ${C.border}`, // subtle top divider line
        borderBottom: `1px solid ${C.border}`, // subtle bottom divider line
        padding: "80px 40px", // vertical + horizontal spacing
        position: "relative", // needed for the glow effect below
        overflow: "hidden", // clips the glow circle
      }}
    >
      {/* ── BACKGROUND GLOW ─────────────────────────────────────────
          ADDED: decorative gold radial glow in bottom-left corner
          pointerEvents none = doesn't interfere with clicks         */}
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}12 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── CONTENT WRAPPER ─────────────────────────────────────────
          Centered max-width container, z-index 1 to sit above glow  */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── SECTION HEADING BLOCK ───────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          {/* ← ADDED: small gold pill badge above the title */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: `${C.accent}18`, // very transparent gold background
              border: `1px solid ${C.accent}44`, // semi-transparent gold border
              borderRadius: "20px",
              padding: "5px 14px",
              fontSize: "0.75rem",
              color: C.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            ✦ Everything You Need
          </div>

          {/* ← CHANGED: ADDED section title (was missing before) */}
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: C.text, // light text (#eef0f6)
              fontFamily: "'Georgia', serif",
              margin: "0 0 12px",
            }}
          >
            Powerful Features
          </h2>

          {/* ← ADDED: subtitle description under heading */}
          <p
            style={{
              color: C.muted,
              fontSize: "0.95rem",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Everything a property owner needs to manage rentals without the
            hassle.
          </p>
        </div>

        {/* ── FEATURE CARDS GRID ──────────────────────────────────────
            ← CHANGED: replaced Bootstrap "row" + "col-md-3" divs
            CSS Grid auto-fits columns — responsive without Bootstrap  */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // auto responsive
            gap: "24px", // space between cards
          }}
        >
          {/* ← CHANGED: replaced 4 hardcoded Bootstrap divs with .map()
              Loops over the features array defined at the top          */}
          {features.map(({ icon, title, description, color }) => (
            // ── SINGLE FEATURE CARD ───────────────────────────────────
            <div
              key={title}
              style={{
                background: C.card, // dark card background (#181c27)
                border: `1px solid ${C.border}`, // subtle border
                borderRadius: "16px",
                padding: "32px 24px",
                textAlign: "center",
                transition: "transform .2s, border-color .2s", // smooth hover animation
                cursor: "default",
                position: "relative", // needed for the top color bar
                overflow: "hidden", // clips the top color bar
              }}
              // ← ADDED: hover — card lifts up and border turns gold
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = C.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {/* ← ADDED: colored top accent bar — different color per feature */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                }}
              />

              {/* ← ADDED: icon inside a colored circle
                  Uses the feature's own color at low opacity            */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: `${color}18`, // very transparent version of feature color
                  border: `1px solid ${color}44`, // semi-transparent border
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  margin: "0 auto 20px", // centered with space below
                }}
              >
                {icon}
              </div>

              {/* ← CHANGED: plain Bootstrap <h5> → styled heading */}
              <h5
                style={{
                  color: C.text, // light text
                  fontSize: "1.05rem",
                  fontWeight: "700",
                  fontFamily: "'Georgia', serif",
                  margin: "0 0 10px",
                }}
              >
                {title}
              </h5>

              {/* ← CHANGED: plain Bootstrap <p> → muted description text */}
              <p
                style={{
                  color: C.muted, // grey muted text (#7a8099)
                  fontSize: "0.85rem",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
            // ── END SINGLE FEATURE CARD ───────────────────────────────
          ))}
        </div>
        {/* ── END FEATURE CARDS GRID ────────────────────────────────── */}
      </div>
    </section>
  );
};

export default Features;
