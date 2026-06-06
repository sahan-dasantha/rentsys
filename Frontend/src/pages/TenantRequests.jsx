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
const IconCalendar = () => <Icon d="M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18" />;
const IconClock = () => (
  <Icon d="M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2" />
);
const IconCheck = () => <Icon d="M20 6L9 17l-5-5" />;
const IconX = () => <Icon d="M18 6L6 18 M6 6l12 12" />;
const IconInbox = () => (
  <Icon d="M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
);

// ── STATUS BADGE ─────────────────────────────────────────────────
// Shows a colored pill — orange/green/red based on request status
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: {
      bg: "#e09b5c22",
      border: "#e09b5c66",
      color: "#e09b5c",
      icon: "⏳",
      label: "Pending Review",
    },
    ACCEPTED: {
      bg: "#5ecb8a22",
      border: "#5ecb8a66",
      color: "#5ecb8a",
      icon: "✓",
      label: "Accepted",
    },
    REJECTED: {
      bg: "#e05c5c22",
      border: "#e05c5c66",
      color: "#e05c5c",
      icon: "✗",
      label: "Rejected",
    },
  };
  const s = styles[status] || styles.PENDING;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        borderRadius: "20px",
        padding: "5px 14px",
        fontSize: "0.78rem",
        fontWeight: "700",
      }}
    >
      {s.icon} {s.label}
    </div>
  );
};

// ── REQUEST CARD ─────────────────────────────────────────────────
// Shows one rental request — property info, dates, status, owner response
const RequestCard = ({ request }) => {
  // format "2024-01-15" → "Jan 15, 2024"
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  // border color changes based on status
  const borderColor =
    request.status === "ACCEPTED"
      ? "#5ecb8a44"
      : request.status === "REJECTED"
        ? "#e05c5c44"
        : `${C.accent}44`;

  // emoji for property type
  const typeEmoji =
    request.propertyType === "House"
      ? "🏠"
      : request.propertyType === "Apartment"
        ? "🏢"
        : request.propertyType === "Villa"
          ? "🏡"
          : "🚪";

  return (
    <div
      style={{
        ...T.card,
        marginBottom: "16px",
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* ── TOP ROW — property info + status badge ─────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* property type emoji box */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(201,169,110,0.1)",
              border: "1px solid rgba(201,169,110,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              flexShrink: 0,
            }}
          >
            {typeEmoji}
          </div>

          <div>
            {/* property type + ID */}
            <div
              style={{
                color: C.text,
                fontWeight: "700",
                fontFamily: "'Georgia', serif",
                fontSize: "1rem",
              }}
            >
              {request.propertyType || "Property"}
              <span
                style={{
                  color: C.muted,
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  fontWeight: "400",
                  marginLeft: "8px",
                }}
              >
                #{String(request.propertyId).padStart(4, "0")}
              </span>
            </div>
            {/* address */}
            <div
              style={{ color: C.muted, fontSize: "0.82rem", marginTop: "3px" }}
            >
              {request.propertyAddress || "—"}
            </div>
            {/* rent */}
            <div
              style={{
                color: C.accent,
                fontSize: "0.88rem",
                fontWeight: "700",
                marginTop: "3px",
                fontFamily: "'Georgia', serif",
              }}
            >
              Rs. {request.rentAmount?.toLocaleString()}
              <span
                style={{
                  color: C.muted,
                  fontSize: "0.75rem",
                  fontWeight: "400",
                }}
              >
                {" "}
                /month
              </span>
            </div>
          </div>
        </div>

        {/* status badge top right */}
        <StatusBadge status={request.status} />
      </div>

      {/* ── DATES ROW ──────────────────────────────────────────── */}
      {/* Shows the rental period the tenant proposed when submitting */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "16px",
          padding: "16px 0",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: "18px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              color: C.muted,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <IconCalendar /> Proposed Start
          </div>
          <div style={{ color: C.text, fontSize: "0.9rem" }}>
            {fmt(request.proposedStartDate)}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              color: C.muted,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <IconCalendar /> Proposed End
          </div>
          <div style={{ color: C.text, fontSize: "0.9rem" }}>
            {fmt(request.proposedEndDate)}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              color: C.muted,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <IconClock /> Submitted On
          </div>
          <div style={{ color: C.text, fontSize: "0.9rem" }}>
            {fmt(request.createdAt)}
          </div>
        </div>
      </div>

      {/* ── MESSAGE TENANT WROTE ───────────────────────────────── */}
      {/* Only renders if tenant included an optional message */}
      {request.message && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "16px",
            fontSize: "0.85rem",
            color: C.muted,
            fontStyle: "italic",
            lineHeight: "1.6",
          }}
        >
          Your message to owner: "{request.message}"
        </div>
      )}

      {/* ── OWNER RESPONSE BANNER ──────────────────────────────── */}
      {/* Shows a different colored banner depending on what owner decided */}

      {request.status === "PENDING" && (
        // Orange banner — still waiting
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#e09b5c11",
            border: "1px solid #e09b5c33",
            borderRadius: "10px",
            padding: "14px 16px",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>⏳</span>
          <div>
            <div
              style={{
                color: "#e09b5c",
                fontWeight: "700",
                fontSize: "0.88rem",
              }}
            >
              Waiting for owner response
            </div>
            <div
              style={{ color: C.muted, fontSize: "0.8rem", marginTop: "3px" }}
            >
              The owner has been notified and will respond to your request soon.
            </div>
          </div>
        </div>
      )}

      {request.status === "ACCEPTED" && (
        // Green banner — owner said yes
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#5ecb8a11",
            border: "1px solid #5ecb8a33",
            borderRadius: "10px",
            padding: "14px 16px",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>🎉</span>
          <div>
            <div
              style={{
                color: "#5ecb8a",
                fontWeight: "700",
                fontSize: "0.88rem",
              }}
            >
              Your request was accepted!
            </div>
            <div
              style={{ color: C.muted, fontSize: "0.8rem", marginTop: "3px" }}
            >
              The owner accepted your rental request. Contact them to finalize
              the agreement.
            </div>
          </div>
        </div>
      )}

      {request.status === "REJECTED" && (
        // Red banner — owner said no
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#e05c5c11",
            border: "1px solid #e05c5c33",
            borderRadius: "10px",
            padding: "14px 16px",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>😔</span>
          <div>
            <div
              style={{
                color: "#e05c5c",
                fontWeight: "700",
                fontSize: "0.88rem",
              }}
            >
              Your request was rejected
            </div>
            <div
              style={{ color: C.muted, fontSize: "0.8rem", marginTop: "3px" }}
            >
              The owner could not accept your request. Try searching for other
              properties.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────────
const TenantRequests = () => {
  const { residentId } = useParams(); // reads :residentId from the URL
  const navigate = useNavigate();

  // ── STATE ────────────────────────────────────────────────────────
  const [requests, setRequests] = useState([]); // all requests by this tenant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL"); // active tab filter

  // get logged-in tenant from localStorage (saved during TenantLogin)
  const tenant = JSON.parse(localStorage.getItem("tenant") || "{}");

  // ── LOGOUT ───────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("tenant");
    sessionStorage.removeItem("tenant");
    navigate("/tenantlogin");
  };

  // ── FETCH REQUESTS ───────────────────────────────────────────────
  // 1. GET /rental-request/tenant/{residentId} → all requests by this tenant
  // 2. For each request GET /property/{id}/detail → attach type, address, rent
  // 3. Sort newest first and store in state
  useEffect(() => {
    if (!tenant?.residentId) {
      navigate("/tenantlogin");
      return;
    }

    const fetchRequests = async () => {
      try {
        // Step 1 — fetch all requests this tenant has made
        const res = await axios.get(
          `http://localhost:8081/rental-request/tenant/${residentId}`,
        );
        const rawRequests = res.data;

        // nothing to enrich if no requests yet
        if (rawRequests.length === 0) {
          setRequests([]);
          setLoading(false);
          return;
        }

        // Step 2 — fetch property details for each request in parallel
        // this gives us type, address, rentAmount to show on the card
        const enriched = await Promise.all(
          rawRequests.map((req) =>
            axios
              .get(`http://localhost:8081/property/${req.propertyId}/detail`)
              .then((r) => ({
                ...req, // keep all request fields
                propertyType: r.data.type, // e.g. "House"
                propertyAddress: r.data.address, // e.g. "Colombo 03"
                rentAmount: r.data.rentAmount, // e.g. 12000
              }))
              .catch(() => ({
                // if property fetch fails, still show request with fallback
                ...req,
                propertyType: "Property",
                propertyAddress: "Address unavailable",
                rentAmount: null,
              })),
          ),
        );

        // Step 3 — sort newest first by createdAt date
        const sorted = enriched.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setRequests(sorted);
        setLoading(false);
      } catch (err) {
        // ── TEMPORARY DEBUG — remove after fixing ──
        console.log("ERROR OBJECT:", err);
        console.log("ERROR STATUS:", err.response?.status);
        console.log("ERROR DATA:", err.response?.data);
        console.log("ERROR URL:", err.config?.url);
        setError("Failed to load your requests. Please try again.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, [residentId]);

  // ── FILTERING ────────────────────────────────────────────────────
  // Returns only the requests matching the active tab
  const filteredRequests =
    filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  // count requests per status for tab labels
  const countOf = (status) =>
    requests.filter((r) => r.status === status).length;

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
          Loading your requests…
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
          Back to Profile
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
            Profile
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
        {/* ── PAGE TITLE ────────────────────────────────────────── */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
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
            <IconInbox /> My Rental Requests
          </h1>
          <p style={{ color: C.muted, fontSize: "0.88rem", margin: 0 }}>
            Track the status of all rental requests you have sent to property
            owners
          </p>
        </div>

        {/* ── STAT CARDS — pending / accepted / rejected counts ─── */}
        <div
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Pending", count: countOf("PENDING"), color: "#e09b5c" },
            { label: "Accepted", count: countOf("ACCEPTED"), color: "#5ecb8a" },
            { label: "Rejected", count: countOf("REJECTED"), color: "#e05c5c" },
          ].map((s) => (
            <div
              key={s.label}
              style={{ ...T.card, textAlign: "center", padding: "18px" }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  color: s.color,
                  fontFamily: "'Georgia', serif",
                }}
              >
                {s.count}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: C.muted,
                  marginTop: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTER TABS ───────────────────────────────────────── */}
        {/* Clicking a tab sets the filter and re-renders the list  */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: "7px 18px",
                borderRadius: "20px",
                border:
                  filter === tab
                    ? `1px solid ${C.accent}`
                    : `1px solid ${C.border}`,
                background: filter === tab ? `${C.accent}22` : "transparent",
                color: filter === tab ? C.accent : C.muted,
                fontSize: "0.82rem",
                fontWeight: filter === tab ? "700" : "400",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab === "ALL"
                ? `All (${requests.length})`
                : tab === "PENDING"
                  ? `Pending (${countOf("PENDING")})`
                  : tab === "ACCEPTED"
                    ? `Accepted (${countOf("ACCEPTED")})`
                    : `Rejected (${countOf("REJECTED")})`}
            </button>
          ))}
        </div>

        {/* ── REQUEST LIST ──────────────────────────────────────── */}
        <div className="fade-up-2">
          {filteredRequests.length === 0 ? (
            // empty state — no requests or none in this filter
            <div
              style={{
                ...T.card,
                textAlign: "center",
                padding: "48px 24px",
                color: C.muted,
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📭</div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: C.text,
                  marginBottom: "8px",
                }}
              >
                {filter === "ALL"
                  ? "No requests sent yet"
                  : `No ${filter.toLowerCase()} requests`}
              </div>
              <div style={{ fontSize: "0.85rem", marginBottom: "20px" }}>
                {filter === "ALL"
                  ? "Search for a property and send a rental request to get started."
                  : `Switch to "All" to see requests with other statuses.`}
              </div>
              {/* only show this button when truly empty, not just filtered */}
              {filter === "ALL" && (
                <button
                  onClick={() => navigate("/tenantprofile")}
                  style={{ ...T.btnGold, padding: "10px 24px" }}
                >
                  Search Properties
                </button>
              )}
            </div>
          ) : (
            // one RequestCard per filtered request
            filteredRequests.map((request) => (
              <RequestCard
                key={request.requestId} // unique key required by React for lists
                request={request}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default TenantRequests;
