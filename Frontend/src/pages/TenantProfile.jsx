import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { C, T } from "../Styles/theme";
import { Building2 } from "lucide-react";

// ── ICON COMPONENTS ──────────────────────────────────────────────
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
const IconId = () => <Icon d="M2 5h20v14H2z M8 10h8 M8 14h4" />;
const IconLogout = () => (
  <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
);
const IconEdit = () => (
  <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z" />
);
const IconBriefcase = () => (
  <Icon d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
);
const IconCalendar = () => <Icon d="M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18" />;
const IconSearch = () => (
  <Icon d="M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35" />
);

// ── INFO ROW COMPONENT ───────────────────────────────────────────
// Reusable row — shows icon + label + value inside info cards
// "last" prop removes bottom border on the final row
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

// ── PROPERTY SEARCH RESULT CARD ──────────────────────────────────
// Displays a single property returned from search results
const PropertyCard = ({ property }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: "14px",
      overflow: "hidden",
      transition: "transform .2s, border-color .2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.borderColor = C.accent;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = C.border;
    }}
  >
    {/* colored top bar by property type */}
    <div
      style={{
        height: "3px",
        background:
          property.type === "House"
            ? `linear-gradient(90deg, ${C.accent}, ${C.accent2})`
            : property.type === "Apartment"
              ? "linear-gradient(90deg, #7eb8e8, #a8d4f5)"
              : property.type === "Villa"
                ? "linear-gradient(90deg, #5ecb8a, #8de8b0)"
                : "linear-gradient(90deg, #e09b5c, #f0be8a)",
      }}
    />

    <div style={{ padding: "20px" }}>
      {/* type icon + title + status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.4rem" }}>
            {property.type === "House"
              ? "🏠"
              : property.type === "Apartment"
                ? "🏢"
                : property.type === "Villa"
                  ? "🏡"
                  : "🚪"}
          </span>
          <div>
            <div
              style={{
                color: C.text,
                fontWeight: "700",
                fontFamily: "'Georgia', serif",
              }}
            >
              {property.type}
            </div>
            <div style={{ color: C.muted, fontSize: "0.75rem" }}>
              #{String(property.propertyId).padStart(4, "0")}
            </div>
          </div>
        </div>
        {/* AVAILABLE status badge */}
        <div
          style={{
            background: "#5ecb8a22",
            border: "1px solid #5ecb8a55",
            color: "#5ecb8a",
            borderRadius: "20px",
            padding: "3px 12px",
            fontSize: "0.72rem",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          {property.status}
        </div>
      </div>

      {/* address */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <span>📍</span>
        <span
          style={{ color: C.muted, fontSize: "0.85rem", lineHeight: "1.5" }}
        >
          {property.address}
        </span>
      </div>

      {/* rent amount */}
      <div style={{ display: "flex", gap: "8px" }}>
        <span>💰</span>
        <span
          style={{
            color: C.accent,
            fontWeight: "700",
            fontFamily: "'Georgia', serif",
          }}
        >
          Rs. {property.rentAmount?.toLocaleString()}
          <span
            style={{ color: C.muted, fontSize: "0.78rem", fontWeight: "400" }}
          >
            {" "}
            /month
          </span>
        </span>
      </div>
    </div>
  </div>
);

// ── MAIN COMPONENT ───────────────────────────────────────────────
const TenantProfile = () => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // what tenant types in search box
  const [searchResults, setSearchResults] = useState([]); // properties returned from backend
  const [searching, setSearching] = useState(false); // true while search API is running
  const [hasSearched, setHasSearched] = useState(false); // true after first search attempt
  const navigate = useNavigate();

  // ── FETCH TENANT DATA ON PAGE LOAD ───────────────────────────────
  useEffect(() => {
    const stored =
      localStorage.getItem("tenant") || sessionStorage.getItem("tenant");

    // if no tenant in storage, redirect to login
    if (!stored) {
      navigate("/tenantlogin");
      return;
    }

    const parsed = JSON.parse(stored);

    console.log("Stored tenant data:", JSON.stringify(parsed));

    // fetch fresh tenant data from backend
    axios
      .get(`http://localhost:8081/tenant/${parsed.residentId}`)
      .then((res) => {
        setTenant(res.data);
        setLoading(false);
      })
      .catch(() => {
        setTenant(parsed);
        setLoading(false);
      }); // fallback to localStorage
  }, [navigate]);

  // ── GET INITIALS FROM FULL NAME ──────────────────────────────────
  // e.g. "Kasun Perera" → "KP"
  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "T";

  // ── LOGOUT ───────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("tenant");
    sessionStorage.removeItem("tenant");
    navigate("/tenantlogin");
  };

  // ── PROPERTY SEARCH ──────────────────────────────────────────────
  // Sends GET request to backend searching properties by address or type
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setHasSearched(true);

    try {
      // GET all available properties — filter by search query on frontend
      // Later you can add a backend search endpoint for better performance
      const response = await axios.get("http://localhost:8081/property");

      // filter properties that match the search query (address or type)
      const filtered = response.data.filter(
        (p) =>
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setSearchResults(filtered);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ── FORMAT DATE ──────────────────────────────────────────────────
  // Converts ISO date string to readable format e.g. "2024-01-15" → "Jan 15, 2024"
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          onClick={() => navigate("/tenantlogin")}
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
        input:focus { border-color: ${C.accent} !important;
          box-shadow: 0 0 0 3px ${C.accent}22 !important; outline: none; }
      `}</style>

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <nav style={T.topBar}>
        {/* logo with building icon — same as OwnerProfile */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.4rem",
            fontWeight: "700",
            color: C.accent,
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
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
        </span>

        {/* logout button */}
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

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
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
            Avatar with initials, tenant name, badge, edit button    */}
        <div
          className="fade-up"
          style={{
            ...T.card,
            background: `linear-gradient(135deg, ${C.card} 0%, #1a1f30 100%)`,
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
          {/* decorative gold glow top-right */}
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

          {/* avatar with initials — soft blue for tenant instead of gold */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7eb8e8 0%, #a8d4f5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.6rem",
              fontWeight: "700",
              color: C.bg,
              flexShrink: 0,
              boxShadow: `0 0 0 4px ${C.bg}, 0 0 0 6px #7eb8e855`,
            }}
          >
            {initials(tenant.fullName)}
          </div>

          {/* tenant name + badge */}
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
              {tenant.fullName}
            </h1>
            {/* blue pill badge for tenant — different from owner's gold badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#7eb8e822",
                border: "1px solid #7eb8e855",
                color: "#7eb8e8",
                borderRadius: "20px",
                padding: "4px 14px",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              👤 Tenant
            </span>
          </div>

          {/* Edit Profile button */}
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
            onClick={() => navigate(`/tenant/edit/${tenant.residentId}`)}
          >
            <IconEdit /> Edit Profile
          </button>
        </div>

        {/* ── PROPERTY SEARCH SECTION ───────────────────────────────
            Main feature for tenants — search available properties   */}
        <div
          className="fade-up-2"
          style={{
            ...T.card,
            marginBottom: "28px",
            border: `1px solid ${C.accent}44`, // gold border to highlight main feature
          }}
        >
          {/* gold top bar */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
              borderRadius: "4px",
              marginBottom: "24px",
            }}
          />

          <h3
            style={{
              color: C.accent,
              fontFamily: "'Georgia', serif",
              fontSize: "1.1rem",
              fontWeight: "700",
              margin: "0 0 6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <IconSearch /> Search Properties
          </h3>
          <p
            style={{
              color: C.muted,
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            Search by location or property type (House, Apartment, Villa, Room)
          </p>

          {/* search form */}
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <input
              type="text"
              style={{ ...T.input, flex: 1, minWidth: "200px" }}
              placeholder="e.g. Colombo, House, Apartment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={searching}
              style={{
                ...T.btnGold,
                padding: "10px 24px",
                opacity: searching ? 0.7 : 1,
                cursor: searching ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {searching ? "Searching..." : "🔍 Search"}
            </button>
          </form>

          {/* ── SEARCH RESULTS ──────────────────────────────────── */}
          {hasSearched && (
            <div style={{ marginTop: "24px" }}>
              {searchResults.length === 0 ? (
                // no results found
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    color: C.muted,
                    fontSize: "0.9rem",
                  }}
                >
                  😔 No properties found for "{searchQuery}". Try a different
                  search.
                </div>
              ) : (
                <>
                  {/* result count */}
                  <p
                    style={{
                      color: C.muted,
                      fontSize: "0.82rem",
                      marginBottom: "16px",
                    }}
                  >
                    Found{" "}
                    <span style={{ color: C.accent, fontWeight: "700" }}>
                      {searchResults.length}
                    </span>{" "}
                    propert{searchResults.length === 1 ? "y" : "ies"}
                  </p>

                  {/* property cards grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(240px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {searchResults.map((property) => (
                      <PropertyCard
                        key={property.propertyId}
                        property={property}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── INFO CARDS GRID ───────────────────────────────────────
            Contact info + Personal details + Account info
            Same layout as OwnerProfile                              */}
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
              value={tenant.email}
            />
            <InfoRow
              icon={<IconPhone />}
              label="Phone Number"
              value={tenant.phoneNumber}
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
              value={tenant.nationalId}
            />
            <InfoRow
              icon={<IconBriefcase />}
              label="Occupation"
              value={tenant.occupation}
              last
            />
          </div>

          {/* Account Information — full width, spans both columns */}
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
              <IconId /> Account Information
            </div>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              {/* Tenant ID */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                  }}
                >
                  Resident ID
                </div>
                <div
                  style={{
                    color: C.accent,
                    fontFamily: "monospace",
                    fontSize: "1.05rem",
                  }}
                >
                  #{String(tenant.residentId).padStart(5, "0")}
                </div>
              </div>

              {/* Date Registered */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                  }}
                >
                  Date Registered
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: C.text,
                    fontSize: "0.95rem",
                  }}
                >
                  <IconCalendar />
                  {formatDate(tenant.dateRegistered)}
                </div>
              </div>

              {/* Account Status */}
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

export default TenantProfile;
