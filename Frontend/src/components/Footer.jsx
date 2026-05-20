import { Link } from "react-router-dom"; // ← ADDED: for internal navigation links
import { C } from "../Styles/theme"; // ← ADDED: import theme colors
import { Building2 } from "lucide-react"; // modern icon

const Footer = () => {
  return (
    // ── FOOTER WRAPPER ───────────────────────────────────────────────
    // ← CHANGED: replaced Bootstrap "bg-dark text-white text-center p-3"
    // with a full dark themed footer with multiple sections
    <footer
      style={{
        background: C.surface, // dark surface (#13161e)
        borderTop: `1px solid ${C.border}`, // subtle top divider
        padding: "60px 40px 0", // space above, no bottom (handled by bottom bar)
        marginTop: "auto", // pushes footer to bottom of page
      }}
    >
      {/* ── MAIN FOOTER GRID ─────────────────────────────────────────
          4 columns: Brand | Quick Links | For Users | Contact
          auto-fit makes it responsive on smaller screens             */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          paddingBottom: "48px",
        }}
      >
        {/* ── COLUMN 1: BRAND ─────────────────────────────────────── */}
        <div>
          {/* ← ADDED: logo matching navbar style */}
          <div
            style={{
              display: "flex", // ← ADDED: flex row
              alignItems: "center", // ← ADDED: vertically center icon + text
              gap: "10px", // ← ADDED: space between icon and text
              fontSize: "1.4rem",
              fontWeight: "700",
              color: C.accent, // gold
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "rgba(201,169,110,0.12)",
                padding: "4px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(201,169,110,0.25)",
              }}
            >
              <Building2 size={24} color="#c9a96e" strokeWidth={2.2} />
            </div>
            RentSys
          </div>

          {/* ← ADDED: brand description */}
          <p
            style={{
              color: C.muted,
              fontSize: "0.85rem",
              lineHeight: "1.7",
              maxWidth: "220px",
              margin: "0 0 20px",
            }}
          >
            A simple and powerful rental property management system for owners
            and tenants.
          </p>

          {/* ← ADDED: social media icon links */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "FB", href: "#" },
              { label: "TW", href: "#" },
              { label: "IG", href: "#" },
              { label: "LI", href: "#" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  textDecoration: "none",
                  transition: "border-color .2s, color .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.accent;
                  e.currentTarget.style.color = C.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.muted;
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── COLUMN 2: QUICK LINKS ───────────────────────────────── */}
        {/* ← ADDED: navigation links for easy access */}
        <div>
          <h6
            style={{
              color: C.text,
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Quick Links
          </h6>

          {/* ← ADDED: list of internal page links */}
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
            { label: "Help", to: "/help" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              style={{
                display: "block",
                color: C.muted,
                fontSize: "0.88rem",
                textDecoration: "none",
                marginBottom: "10px",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = C.accent)}
              onMouseLeave={(e) => (e.target.style.color = C.muted)}
            >
              › {label}
            </Link>
          ))}
        </div>

        {/* ── COLUMN 3: FOR USERS ─────────────────────────────────── */}
        {/* ← ADDED: login/register links for owners and tenants */}
        <div>
          <h6
            style={{
              color: C.text,
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            For Users
          </h6>

          {[
            { label: "Owner Login", to: "/ownerlogin" },
            { label: "Tenant Login", to: "/tenantlogin" },
            { label: "Owner Signup", to: "/ownersignup" },
            { label: "Tenant Signup", to: "/tenantsignup" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              style={{
                display: "block",
                color: C.muted,
                fontSize: "0.88rem",
                textDecoration: "none",
                marginBottom: "10px",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = C.accent)}
              onMouseLeave={(e) => (e.target.style.color = C.muted)}
            >
              › {label}
            </Link>
          ))}
        </div>

        {/* ── COLUMN 4: CONTACT ───────────────────────────────────── */}
        {/* ← ADDED: contact information section */}
        <div>
          <h6
            style={{
              color: C.text,
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Contact Us
          </h6>

          {/* ← ADDED: contact details with icons */}
          {[
            { icon: "📧", text: "support@rentsys.com" },
            { icon: "📞", text: "+94 77 123 4567" },
            { icon: "📍", text: "Colombo, Sri Lanka" },
            { icon: "🕐", text: "Mon–Fri, 9am – 6pm" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "0.9rem" }}>{icon}</span>
              <span
                style={{
                  color: C.muted,
                  fontSize: "0.85rem",
                  lineHeight: "1.5",
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ── END MAIN FOOTER GRID ──────────────────────────────────── */}

      {/* ── BOTTOM BAR ──────────────────────────────────────────────
          ← CHANGED: replaced plain "© 2026 RentSys" <p> tag
          with a full bottom bar containing copyright + policy links  */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`, // divider above bottom bar
          padding: "20px 0",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", // wraps on small screens
          gap: "12px",
        }}
      >
        {/* ← CHANGED: plain copyright text → styled with gold year */}
        <p style={{ color: C.muted, fontSize: "0.82rem", margin: 0 }}>
          © <span style={{ color: C.accent }}>2026</span> RentSys. All rights
          reserved.
        </p>

        {/* ← ADDED: policy links on the right */}
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (label) => (
              <a
                key={label}
                href="#"
                style={{
                  color: C.muted,
                  fontSize: "0.82rem",
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = C.accent)}
                onMouseLeave={(e) => (e.target.style.color = C.muted)}
              >
                {label}
              </a>
            ),
          )}
        </div>
      </div>
      {/* ── END BOTTOM BAR ────────────────────────────────────────── */}
    </footer>
  );
};

export default Footer;
