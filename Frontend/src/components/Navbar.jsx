import { useNavigate, Link } from "react-router-dom";
import { useState } from "react"; //
import { C, T } from "../Styles/theme";
import { Building2 } from "lucide-react"; // modern icon

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // mobile hamburger state
  const [registerOpen, setRegisterOpen] = useState(false); //register dropdown state
  const [loginOpen, setLoginOpen] = useState(false); //login dropdown state

  //close all dropdowns when navigating
  const goTo = (path) => {
    navigate(path);
    setRegisterOpen(false);
    setLoginOpen(false);
    setMenuOpen(false);
  };

  //reusable nav link style
  const navLink = {
    color: C.muted,
    textDecoration: "none",
    fontSize: "0.9rem",
    letterSpacing: "0.04em",
    padding: "4px 0",
    transition: "color .2s",
  };

  //dropdown menu style
  const dropdownMenu = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "10px",
    minWidth: "180px",
    zIndex: 200,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  };

  //dropdown item style
  const dropdownItem = {
    display: "block",
    width: "100%",
    padding: "11px 18px",
    background: "transparent",
    border: "none",
    color: C.text,
    textAlign: "left",
    fontSize: "0.88rem",
    cursor: "pointer",
    transition: "background .15s",
  };

  return (
    <nav style={T.topBar}>
      <Link
        to="/"
        style={{
          display: "flex", // ← ADDED: flex row
          alignItems: "center", // ← ADDED: vertically center icon + text
          gap: "10px", // ← ADDED: space between icon and text
          fontSize: "1.6rem",
          fontWeight: "700",
          color: "#c9a96e",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textDecoration: "none",
          fontFamily: "'Georgia', serif",
          flexShrink: 0, //prevents logo from shrinking
        }}
        onClick={() => setMenuOpen(false)}
      >
        <div
          style={{
            background: "rgba(201,169,110,0.12)",
            padding: "8px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(201,169,110,0.25)",
          }}
        >
          <Building2 size={24} color="#c9a96e" strokeWidth={2.2} />
        </div>
        <span>RentSys</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
            { label: "Help", to: "/help" },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              style={navLink}
              onMouseEnter={(e) => (e.target.style.color = C.accent)}
              onMouseLeave={(e) => (e.target.style.color = C.muted)}
            >
              {label}
            </Link>
          ))}
        </div>

        {/*custom styled dropdown */}
        <div style={{ position: "relative" }}>
          <button
            style={{
              ...T.btnOutline, // gold outline style
              padding: "8px 16px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => {
              setRegisterOpen(!registerOpen);
              setLoginOpen(false);
            }}
          >
            Register ▾
          </button>

          {/*custom dropdown menu */}
          {registerOpen && (
            <div style={dropdownMenu}>
              <button
                style={dropdownItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.border)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => goTo("/ownersignup")}
              >
                🏠 Register as Owner
              </button>
              <button
                style={dropdownItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.border)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => goTo("/tenantsignup")}
              >
                👤 Register as Tenant
              </button>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            style={{
              ...T.btnGold, // gold filled style
              padding: "8px 16px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => {
              setLoginOpen(!loginOpen);
              setRegisterOpen(false);
            }}
          >
            Log In ▾
          </button>

          {/*custom dropdown menu */}
          {loginOpen && (
            <div style={dropdownMenu}>
              <button
                style={dropdownItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.border)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => goTo("/ownerlogin")}
              >
                🏠 Login as Owner
              </button>
              <button
                style={dropdownItem}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.border)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() => goTo("/tenantlogin")}
              >
                👤 Login as Tenant
              </button>
            </div>
          )}
        </div>
      </div>

      {/*close dropdowns when clicking outside */}
      {(registerOpen || loginOpen) && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 199 }}
          onClick={() => {
            setRegisterOpen(false);
            setLoginOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
