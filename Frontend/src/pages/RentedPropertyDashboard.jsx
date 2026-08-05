import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
const IconMoney = () => (
  <Icon d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
);
const IconWrench = () => (
  <Icon d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
);
const IconDoc = () => (
  <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
);
const IconCalendar = () => <Icon d="M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18" />;
const IconLocation = () => (
  <Icon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
);

// ── MAIN COMPONENT ───────────────────────────────────────────────
const RentedPropertyDashboard = () => {
  // reads :propertyId from the URL
  // e.g. /tenant/rented/5 → propertyId = "5"
  const { propertyId } = useParams();
  const navigate = useNavigate();

  // ── STATE ────────────────────────────────────────────────────────
  const [property, setProperty] = useState(null); // property + owner details
  const [agreement, setAgreement] = useState(null); // agreement details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // get logged-in tenant
  const tenant = JSON.parse(localStorage.getItem("tenant") || "{}");

  // ── LOGOUT ───────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("tenant");
    sessionStorage.removeItem("tenant");
    navigate("/tenantlogin");
  };

  // ── FETCH PROPERTY + AGREEMENT ───────────────────────────────────
  // 1. GET /property/{propertyId}/detail → property + owner info
  // 2. GET /agreement/tenant/{residentId} → find the agreement
  //    for this specific property from the list
  useEffect(() => {
    if (!tenant?.residentId) {
      navigate("/tenantlogin");
      return;
    }

    const fetchData = async () => {
      try {
        // fetch both in parallel — faster than one after another
        const [propertyRes, agreementsRes] = await Promise.all([
          axios.get(`http://localhost:8081/property/${propertyId}/detail`),
          axios.get(
            `http://localhost:8081/agreement/tenant/${tenant.residentId}`,
          ),
        ]);

        setProperty(propertyRes.data);

        // find the specific agreement for this property
        // tenant may have agreements for multiple properties
        const found = agreementsRes.data.find(
          (a) => String(a.propertyId) === String(propertyId),
        );
        setAgreement(found || null);
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to load property details. Please go back and try again.",
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId, tenant?.residentId]);

  // format date helper
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

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
        <span style={{ color: C.muted, marginTop: "12px" }}>Loading…</span>
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
          onClick={() => navigate("/tenant/rented")}
          style={{ ...T.btnOutline, marginTop: "16px" }}
        >
          ← Back
        </button>
      </div>
    );

  // property type emoji
  const typeEmoji =
    property?.type === "House"
      ? "🏠"
      : property?.type === "Apartment"
        ? "🏢"
        : property?.type === "Villa"
          ? "🏡"
          : "🚪";

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
        .fade-up-3 { animation: fadeUp 0.5s ease 0.2s both; }
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
          <button
            onClick={() => navigate("/tenant/rented")}
            style={{
              ...T.btnOutline,
              padding: "8px 16px",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← My Properties
          </button>
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
          maxWidth: "860px",
          width: "100%",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        {/* ── HERO CARD — property overview ─────────────────────── */}
        <div
          className="fade-up"
          style={{
            ...T.card,
            background: `linear-gradient(135deg, ${C.card} 0%, #1a2a1f 100%)`,
            borderRadius: "20px",
            padding: "36px",
            marginBottom: "28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative green glow */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #5ecb8a22 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* property emoji box */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: "rgba(94,203,138,0.1)",
                border: "1px solid rgba(94,203,138,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.4rem",
                flexShrink: 0,
              }}
            >
              {typeEmoji}
            </div>

            <div style={{ flex: 1 }}>
              {/* property type + ID */}
              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: C.text,
                  fontFamily: "'Georgia', serif",
                  margin: "0 0 6px",
                }}
              >
                {property?.type}
                <span
                  style={{
                    color: C.muted,
                    fontSize: "1rem",
                    fontWeight: "400",
                    marginLeft: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  #{String(propertyId).padStart(4, "0")}
                </span>
              </h1>

              {/* address */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: C.muted,
                  fontSize: "0.9rem",
                  marginBottom: "8px",
                }}
              >
                <IconLocation /> {property?.address}
              </div>

              {/* rent */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: C.accent,
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  fontFamily: "'Georgia', serif",
                }}
              >
                <IconMoney />
                Rs. {agreement?.rentAmount?.toLocaleString()}
                <span
                  style={{
                    color: C.muted,
                    fontSize: "0.8rem",
                    fontWeight: "400",
                  }}
                >
                  /month
                </span>
              </div>
            </div>

            {/* RENTING badge */}
            <div
              style={{
                background: "#5ecb8a22",
                border: "1px solid #5ecb8a55",
                color: "#5ecb8a",
                borderRadius: "20px",
                padding: "6px 18px",
                fontSize: "0.8rem",
                fontWeight: "700",
                textTransform: "uppercase",
                alignSelf: "flex-start",
              }}
            >
              ✓ Active Rental
            </div>
          </div>
        </div>

        {/* ── AGREEMENT SUMMARY CARD ─────────────────────────────── */}
        {agreement && (
          <div
            className="fade-up-2"
            style={{
              ...T.card,
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                height: "4px",
                background: "linear-gradient(90deg, #5ecb8a, #8de8b0)",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            />
            <h3
              style={{
                color: "#5ecb8a",
                fontFamily: "'Georgia', serif",
                fontSize: "1rem",
                fontWeight: "700",
                margin: "0 0 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IconDoc /> Agreement Summary
            </h3>

            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              {/* Agreement ID */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                  }}
                >
                  Agreement ID
                </div>
                <div
                  style={{
                    color: C.accent,
                    fontFamily: "monospace",
                    fontSize: "1rem",
                  }}
                >
                  #{String(agreement.agreementId).padStart(5, "0")}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <IconCalendar /> Start Date
                </div>
                <div style={{ color: C.text, fontSize: "0.95rem" }}>
                  {fmt(agreement.startDate)}
                </div>
              </div>

              {/* End Date */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <IconCalendar /> End Date
                </div>
                <div style={{ color: C.text, fontSize: "0.95rem" }}>
                  {fmt(agreement.endDate)}
                </div>
              </div>

              {/* Monthly Rent */}
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: C.muted,
                    marginBottom: "3px",
                  }}
                >
                  Monthly Rent
                </div>
                <div
                  style={{
                    color: C.accent,
                    fontWeight: "700",
                    fontFamily: "'Georgia', serif",
                    fontSize: "1rem",
                  }}
                >
                  Rs. {agreement.rentAmount?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3 ACTION BUTTONS ──────────────────────────────────── */}
        {/* Payments, Maintenance, Agreement — coming in future sessions */}
        <div
          className="fade-up-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {/* Payments button */}
          <button
            onClick={() => alert("Payments feature coming soon!")}
            style={{
              ...T.card,
              border: `1px solid ${C.accent}44`,
              padding: "28px 20px",
              cursor: "pointer",
              textAlign: "center",
              background: "transparent",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.accent;
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${C.accent}44`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>
              <IconMoney />
            </div>
            <div
              style={{
                color: C.accent,
                fontWeight: "700",
                fontSize: "0.95rem",
                fontFamily: "'Georgia', serif",
              }}
            >
              Payments
            </div>
            <div
              style={{ color: C.muted, fontSize: "0.75rem", marginTop: "4px" }}
            >
              View & make payments
            </div>
          </button>

          {/* Maintenance button */}
          <button
            onClick={() => alert("Maintenance feature coming soon!")}
            style={{
              ...T.card,
              border: `1px solid #7eb8e844`,
              padding: "28px 20px",
              cursor: "pointer",
              textAlign: "center",
              background: "transparent",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#7eb8e8";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#7eb8e844";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "10px",
                color: "#7eb8e8",
              }}
            >
              <IconWrench />
            </div>
            <div
              style={{
                color: "#7eb8e8",
                fontWeight: "700",
                fontSize: "0.95rem",
                fontFamily: "'Georgia', serif",
              }}
            >
              Maintenance
            </div>
            <div
              style={{ color: C.muted, fontSize: "0.75rem", marginTop: "4px" }}
            >
              Submit repair requests
            </div>
          </button>

          {/* Agreement button */}
          <button
            onClick={() => alert("Agreement details coming soon!")}
            style={{
              ...T.card,
              border: `1px solid #5ecb8a44`,
              padding: "28px 20px",
              cursor: "pointer",
              textAlign: "center",
              background: "transparent",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#5ecb8a";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#5ecb8a44";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "10px",
                color: "#5ecb8a",
              }}
            >
              <IconDoc />
            </div>
            <div
              style={{
                color: "#5ecb8a",
                fontWeight: "700",
                fontSize: "0.95rem",
                fontFamily: "'Georgia', serif",
              }}
            >
              Agreement
            </div>
            <div
              style={{ color: C.muted, fontSize: "0.75rem", marginTop: "4px" }}
            >
              View rental agreement
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default RentedPropertyDashboard;
