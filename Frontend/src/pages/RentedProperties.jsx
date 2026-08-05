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
const IconLogout = () => (
  <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9" />
);
const IconCalendar = () => <Icon d="M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18" />;
const IconHome = () => (
  <Icon d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z M9 21V12h6v9" />
);

// ── RENTED PROPERTY CARD ─────────────────────────────────────────
// Shows one rented property with its agreement details
// Clicking the card navigates to the property dashboard
const RentedPropertyCard = ({ agreement, property }) => {
  const navigate = useNavigate();

  // format "2024-01-15" → "Jan 15, 2024"
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  // emoji based on property type
  const typeEmoji =
    property?.type === "House"
      ? "🏠"
      : property?.type === "Apartment"
        ? "🏢"
        : property?.type === "Villa"
          ? "🏡"
          : "🚪";

  return (
    <div
      onClick={() => navigate(`/tenant/rented/${agreement.propertyId}`)}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "#5ecb8a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      {/* green top bar — active rental */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #5ecb8a, #8de8b0)",
        }}
      />

      <div style={{ padding: "24px" }}>
        {/* ── PROPERTY TYPE + ID + STATUS BADGE ───────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* emoji icon box */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                background: "rgba(94,203,138,0.1)",
                border: "1px solid rgba(94,203,138,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                flexShrink: 0,
              }}
            >
              {typeEmoji}
            </div>

            <div>
              {/* property type */}
              <div
                style={{
                  color: C.text,
                  fontWeight: "700",
                  fontFamily: "'Georgia', serif",
                  fontSize: "1.05rem",
                }}
              >
                {property?.type || "Property"}
              </div>
              {/* property ID */}
              <div
                style={{
                  color: C.muted,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                }}
              >
                #{String(agreement.propertyId).padStart(4, "0")}
              </div>
            </div>
          </div>

          {/* RENTING badge — green */}
          <div
            style={{
              background: "#5ecb8a22",
              border: "1px solid #5ecb8a55",
              color: "#5ecb8a",
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "0.72rem",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            ✓ Renting
          </div>
        </div>

        {/* ── ADDRESS ─────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <span>📍</span>
          <span
            style={{ color: C.muted, fontSize: "0.85rem", lineHeight: "1.5" }}
          >
            {property?.address || "—"}
          </span>
        </div>

        {/* ── RENT AMOUNT ──────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <span>💰</span>
          <span
            style={{
              color: C.accent,
              fontWeight: "700",
              fontFamily: "'Georgia', serif",
              fontSize: "1.05rem",
            }}
          >
            Rs. {agreement.rentAmount?.toLocaleString()}
            <span
              style={{ color: C.muted, fontSize: "0.78rem", fontWeight: "400" }}
            >
              {" "}
              /month
            </span>
          </span>
        </div>

        {/* ── AGREEMENT DATES ──────────────────────────────────── */}
        {/* Shows the rental period from the agreement */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: "14px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                color: C.muted,
                marginBottom: "3px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <IconCalendar /> Start Date
            </div>
            <div style={{ color: C.text, fontSize: "0.88rem" }}>
              {fmt(agreement.startDate)}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                color: C.muted,
                marginBottom: "3px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <IconCalendar /> End Date
            </div>
            <div style={{ color: C.text, fontSize: "0.88rem" }}>
              {fmt(agreement.endDate)}
            </div>
          </div>
        </div>

        {/* click hint */}
        <div
          style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: `1px solid ${C.border}`,
            color: "#5ecb8a",
            fontSize: "0.75rem",
            textAlign: "right",
          }}
        >
          Manage property →
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────────
const RentedProperties = () => {
  const navigate = useNavigate();

  // ── STATE ────────────────────────────────────────────────────────
  const [agreements, setAgreements] = useState([]); // all agreements for this tenant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // get logged-in tenant from localStorage
  const tenant = JSON.parse(localStorage.getItem("tenant") || "{}");

  // ── LOGOUT ───────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("tenant");
    sessionStorage.removeItem("tenant");
    navigate("/tenantlogin");
  };

  // ── FETCH RENTED PROPERTIES ──────────────────────────────────────
  // Strategy:
  //   1. GET /agreement/tenant/{residentId} → get all agreements
  //   2. For each agreement, GET /property/{propertyId}/detail
  //      to get type, address (we already have rentAmount in agreement)
  //   3. Attach property details to each agreement object
  useEffect(() => {
    // guard — redirect to login if not logged in
    if (!tenant?.residentId) {
      navigate("/tenantlogin");
      return;
    }

    const fetchRentedProperties = async () => {
      try {
        // Step 1 — get all agreements for this tenant
        const agreementsRes = await axios.get(
          `http://localhost:8081/agreement/tenant/${tenant.residentId}`,
        );
        const rawAgreements = agreementsRes.data;

        // if no agreements yet, stop here
        if (rawAgreements.length === 0) {
          setAgreements([]);
          setLoading(false);
          return;
        }

        // Step 2 — fetch property details for each agreement in parallel
        const enriched = await Promise.all(
          rawAgreements.map((agreement) =>
            axios
              .get(
                `http://localhost:8081/property/${agreement.propertyId}/detail`,
              )
              .then((res) => ({
                agreement, // original agreement object
                property: res.data, // property details from DTO
              }))
              .catch(() => ({
                agreement,
                property: null, // show fallback if property fetch fails
              })),
          ),
        );

        setAgreements(enriched);
        setLoading(false);
      } catch (err) {
        setError("Failed to load your rented properties. Please try again.");
        setLoading(false);
      }
    };

    fetchRentedProperties();
  }, [tenant?.residentId]);

  // ── LOADING STATE ─────────────────────────────────────────────────
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
        <span style={{ color: C.muted, marginTop: "12px" }}>
          Loading your rented properties…
        </span>
      </div>
    );

  // ── ERROR STATE ───────────────────────────────────────────────────
  if (error)
    return (
      <div
        style={{ ...T.page, alignItems: "center", justifyContent: "center" }}
      >
        <span style={{ color: C.danger }}>{error}</span>
        <button
          onClick={() => navigate("/tenantprofile")}
          style={{ ...T.btnOutline, marginTop: "16px" }}
        >
          ← Back to Profile
        </button>
      </div>
    );

  // ── MAIN RENDER ───────────────────────────────────────────────────
  return (
    <div style={T.page}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <nav style={T.topBar}>
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

        <div style={{ display: "flex", gap: "10px" }}>
          {/* back to profile */}
          <button
            onClick={() => navigate("/tenantprofile")}
            style={{
              ...T.btnOutline,
              padding: "8px 16px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Profile
          </button>
          {/* logout */}
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
        </div>
      </nav>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          maxWidth: "960px",
          width: "100%",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        {/* ── PAGE HEADER ───────────────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: C.text,
              fontFamily: "'Georgia', serif",
              margin: "0 0 6px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <IconHome /> My Rented Properties
          </h1>
          <p style={{ color: C.muted, fontSize: "0.88rem", margin: 0 }}>
            {agreements.length === 0
              ? "No active rentals yet"
              : `You are currently renting ${agreements.length} propert${agreements.length === 1 ? "y" : "ies"}`}
          </p>
        </div>

        {/* ── EMPTY STATE ───────────────────────────────────────── */}
        {agreements.length === 0 ? (
          <div
            className="fade-up"
            style={{
              ...T.card,
              textAlign: "center",
              padding: "60px 24px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏠</div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: C.text,
                marginBottom: "8px",
              }}
            >
              No rented properties yet
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: C.muted,
                marginBottom: "24px",
              }}
            >
              Once an owner accepts your rental request, your property will
              appear here.
            </div>
            {/* shortcut to search for properties */}
            <button
              onClick={() => navigate("/tenantprofile")}
              style={{ ...T.btnGold, padding: "10px 28px" }}
            >
              🔍 Search Properties
            </button>
          </div>
        ) : (
          // ── PROPERTIES GRID ────────────────────────────────────
          // responsive grid — 1 column on mobile, 2-3 on desktop
          <div
            className="fade-up-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {agreements.map(({ agreement, property }) => (
              <RentedPropertyCard
                key={agreement.agreementId}
                agreement={agreement}
                property={property}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RentedProperties;
