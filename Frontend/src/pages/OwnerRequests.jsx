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
const IconUser = () => (
  <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" />
);
const IconHome = () => (
  <Icon d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z M9 21V12h6v9" />
);
const IconCheck = () => <Icon d="M20 6L9 17l-5-5" />;
const IconX = () => <Icon d="M18 6L6 18 M6 6l12 12" />;
const IconInbox = () => (
  <Icon d="M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
);

// ── STATUS BADGE ─────────────────────────────────────────────────
// Shows PENDING / ACCEPTED / REJECTED with matching colors
const StatusBadge = ({ status }) => {
  // pick color based on status string
  const colors = {
    PENDING: { bg: "#e09b5c22", border: "#e09b5c55", text: "#e09b5c" },
    ACCEPTED: { bg: "#5ecb8a22", border: "#5ecb8a55", text: "#5ecb8a" },
    REJECTED: { bg: "#e05c5c22", border: "#e05c5c55", text: "#e05c5c" },
  };
  const c = colors[status] || colors.PENDING;

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        borderRadius: "20px",
        padding: "3px 14px",
        fontSize: "0.72rem",
        fontWeight: "700",
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {status === "PENDING"
        ? "⏳ Pending"
        : status === "ACCEPTED"
          ? "✓ Accepted"
          : "✗ Rejected"}
    </div>
  );
};

// ── REQUEST CARD ─────────────────────────────────────────────────
// Displays one rental request with all its details + Accept/Reject buttons
// onRespond is called when owner clicks a button → triggers API call in parent
const RequestCard = ({ request, onRespond, responding }) => {
  // format date e.g. "2024-01-15" → "Jan 15, 2024"
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const isPending = request.status === "PENDING";

  return (
    <div
      style={{
        ...T.card,
        marginBottom: "16px",
        border: isPending
          ? `1px solid ${C.accent}44` // gold border for pending — needs attention
          : `1px solid ${C.border}`, // normal border for already-resolved
        transition: "border-color 0.2s",
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
          marginBottom: "18px",
        }}
      >
        {/* Property details */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "rgba(201,169,110,0.1)",
              border: "1px solid rgba(201,169,110,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
          >
            🏠
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
                  fontSize: "0.8rem",
                  fontWeight: "400",
                  marginLeft: "8px",
                }}
              >
                #{String(request.propertyId).padStart(4, "0")}
              </span>
            </div>
            {/* address */}
            <div
              style={{ color: C.muted, fontSize: "0.82rem", marginTop: "2px" }}
            >
              📍 {request.propertyAddress || "—"}
            </div>
          </div>
        </div>

        {/* Status badge — top right */}
        <StatusBadge status={request.status} />
      </div>

      {/* ── MIDDLE ROW — tenant info + dates ───────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
          padding: "16px 0",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: "18px",
        }}
      >
        {/* Tenant ID */}
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
            <IconUser /> Tenant ID
          </div>
          <div
            style={{
              color: C.text,
              fontSize: "0.9rem",
              fontFamily: "monospace",
            }}
          >
            #{String(request.residentId).padStart(5, "0")}
          </div>
        </div>

        {/* Proposed Start Date */}
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
            <IconCalendar /> Start Date
          </div>
          <div style={{ color: C.text, fontSize: "0.9rem" }}>
            {fmt(request.proposedStartDate)}
          </div>
        </div>

        {/* Proposed End Date */}
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
            <IconCalendar /> End Date
          </div>
          <div style={{ color: C.text, fontSize: "0.9rem" }}>
            {fmt(request.proposedEndDate)}
          </div>
        </div>

        {/* Request Date */}
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
            <IconCalendar /> Requested On
          </div>
          <div style={{ color: C.text, fontSize: "0.9rem" }}>
            {fmt(request.createdAt)}
          </div>
        </div>
      </div>

      {/* ── MESSAGE FROM TENANT ─────────────────────────────────── */}
      {/* Only shows if tenant wrote a message */}
      {request.message && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "18px",
            fontSize: "0.85rem",
            color: C.muted,
            fontStyle: "italic",
            lineHeight: "1.6",
          }}
        >
          💬 "{request.message}"
        </div>
      )}

      {/* ── ACCEPT / REJECT BUTTONS ─────────────────────────────── */}
      {/* Only show buttons if request is still PENDING */}
      {/* Once owner responds, show a simple resolved message instead */}
      {isPending ? (
        <div style={{ display: "flex", gap: "12px" }}>
          {/* ACCEPT button — green */}
          <button
            onClick={() => onRespond(request.requestId, "ACCEPTED")}
            disabled={responding === request.requestId} // disable while this specific request is loading
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #5ecb8a55",
              background: "#5ecb8a22",
              color: "#5ecb8a",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor:
                responding === request.requestId ? "not-allowed" : "pointer",
              opacity: responding === request.requestId ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.2s",
            }}
          >
            <IconCheck />
            {responding === request.requestId ? "Processing..." : "Accept"}
          </button>

          {/* REJECT button — red */}
          <button
            onClick={() => onRespond(request.requestId, "REJECTED")}
            disabled={responding === request.requestId}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #e05c5c55",
              background: "#e05c5c22",
              color: "#e05c5c",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor:
                responding === request.requestId ? "not-allowed" : "pointer",
              opacity: responding === request.requestId ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background 0.2s",
            }}
          >
            <IconX />
            {responding === request.requestId ? "Processing..." : "Reject"}
          </button>
        </div>
      ) : (
        // Already resolved — just show a quiet message
        <div
          style={{
            textAlign: "center",
            color: C.muted,
            fontSize: "0.82rem",
            padding: "8px",
          }}
        >
          {request.status === "ACCEPTED"
            ? "✓ You accepted this request — property marked as Not Available"
            : "✗ You rejected this request — property remains Available"}
        </div>
      )}
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────────
const OwnerRequests = () => {
  const navigate = useNavigate();

  // ── STATE ──────────────────────────────────────────────────────
  const [requests, setRequests] = useState([]); // all requests across all properties
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responding, setResponding] = useState(null); // requestId currently being processed
  // "filter" controls which tab is shown — "ALL", "PENDING", "ACCEPTED", "REJECTED"
  const [filter, setFilter] = useState("ALL");

  // get logged-in owner from localStorage (set during owner login)
  const owner = JSON.parse(localStorage.getItem("owner") || "{}");

  // ── LOGOUT ───────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("owner");
    sessionStorage.removeItem("owner");
    navigate("/ownerlogin");
  };

  // ── FETCH ALL REQUESTS ───────────────────────────────────────────
  // Strategy:
  //   1. Fetch all properties owned by this owner
  //   2. For each property, fetch its rental requests
  //   3. Attach property details (type, address) to each request
  //   4. Flatten into one list sorted newest first
  useEffect(() => {
    if (!owner?.ownerId) {
      navigate("/ownerlogin");
      return;
    }

    const fetchAllRequests = async () => {
      try {
        // Step 1 — get all properties for this owner
        const propertiesRes = await axios.get(
          `http://localhost:8081/property/owner/${owner.ownerId}`,
        );
        const properties = propertiesRes.data; // array of Property objects

        if (properties.length === 0) {
          setRequests([]);
          setLoading(false);
          return;
        }

        // Step 2 — for each property, fetch requests in parallel
        // Promise.all runs all requests at the same time instead of one by one
        const requestArrays = await Promise.all(
          properties.map(
            (property) =>
              axios
                .get(
                  `http://localhost:8081/rental-request/property/${property.propertyId}`,
                )
                .then((res) =>
                  // Step 3 — attach property info to each request object
                  // so RequestCard can display property type and address
                  res.data.map((req) => ({
                    ...req, // all request fields
                    propertyType: property.type, // e.g. "House"
                    propertyAddress: property.address, // e.g. "Colombo 03"
                  })),
                )
                .catch(() => []), // if one property fails, return empty array so others still load
          ),
        );

        // Step 4 — flatten [[...], [...]] into one array, sort newest first
        const allRequests = requestArrays
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRequests(allRequests);
        setLoading(false);
      } catch (err) {
        setError("Failed to load requests. Please try again.");
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, [owner?.ownerId]); // re-run if owner changes (e.g. different login)

  // ── RESPOND TO REQUEST ───────────────────────────────────────────
  // Called when owner clicks Accept or Reject on a RequestCard
  const handleRespond = async (requestId, decision) => {
    setResponding(requestId); // mark this card as loading

    try {
      // PUT /rental-request/{requestId}/respond?decision=ACCEPTED
      const res = await axios.put(
        `http://localhost:8081/rental-request/${requestId}/respond?decision=${decision}`,
      );

      // Update just this one request in the list — no full page reload needed
      // map through requests, replace the one that changed with updated data
      setRequests((prev) =>
        prev.map(
          (r) =>
            r.requestId === requestId
              ? {
                  ...r, // keep propertyType and propertyAddress we attached
                  status: res.data.status, // update status to ACCEPTED or REJECTED
                }
              : r, // all other requests unchanged
        ),
      );
    } catch (err) {
      alert("Failed to respond. Please try again."); // simple alert for now
    } finally {
      setResponding(null); // clear loading state regardless of success/failure
    }
  };

  // ── FILTER REQUESTS ──────────────────────────────────────────────
  // Filters the list based on selected tab
  const filteredRequests =
    filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  // ── COUNT HELPERS ────────────────────────────────────────────────
  const countOf = (status) =>
    requests.filter((r) => r.status === status).length;

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
        <span style={{ color: C.muted, marginTop: "12px" }}>
          Loading requests…
        </span>
      </div>
    );

  // ── ERROR STATE ──────────────────────────────────────────────────
  if (error)
    return (
      <div
        style={{ ...T.page, alignItems: "center", justifyContent: "center" }}
      >
        <span style={{ color: C.danger }}>{error}</span>
        <button
          onClick={() => navigate("/ownerprofile")}
          style={{ ...T.btnOutline, marginTop: "16px" }}
        >
          ← Back to Profile
        </button>
      </div>
    );

  // ── MAIN RENDER ──────────────────────────────────────────────────
  return (
    <div style={T.page}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
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
            onClick={() => navigate("/ownerprofile")}
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
          maxWidth: "860px",
          width: "100%",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        {/* ── PAGE HEADER ───────────────────────────────────────── */}
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
            <IconInbox /> Rental Requests
          </h1>
          <p style={{ color: C.muted, fontSize: "0.88rem", margin: 0 }}>
            Review and respond to tenant rental requests for your properties
          </p>
        </div>

        {/* ── SUMMARY STATS ROW ─────────────────────────────────── */}
        <div
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Pending count */}
          <div style={{ ...T.card, textAlign: "center", padding: "18px" }}>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#e09b5c",
                fontFamily: "'Georgia', serif",
              }}
            >
              {countOf("PENDING")}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "4px",
              }}
            >
              Pending
            </div>
          </div>

          {/* Accepted count */}
          <div style={{ ...T.card, textAlign: "center", padding: "18px" }}>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#5ecb8a",
                fontFamily: "'Georgia', serif",
              }}
            >
              {countOf("ACCEPTED")}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "4px",
              }}
            >
              Accepted
            </div>
          </div>

          {/* Rejected count */}
          <div style={{ ...T.card, textAlign: "center", padding: "18px" }}>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#e05c5c",
                fontFamily: "'Georgia', serif",
              }}
            >
              {countOf("REJECTED")}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: C.muted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "4px",
              }}
            >
              Rejected
            </div>
          </div>
        </div>

        {/* ── FILTER TABS ───────────────────────────────────────── */}
        {/* Lets owner filter by status */}
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
                    ? `1px solid ${C.accent}` // active tab — gold border
                    : `1px solid ${C.border}`, // inactive tab — normal border
                background:
                  filter === tab
                    ? `${C.accent}22` // active — slight gold tint
                    : "transparent",
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
        {filteredRequests.length === 0 ? (
          // empty state — different message for ALL vs filtered
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
                marginBottom: "6px",
              }}
            >
              {filter === "ALL"
                ? "No requests yet"
                : `No ${filter.toLowerCase()} requests`}
            </div>
            <div style={{ fontSize: "0.85rem" }}>
              {filter === "ALL"
                ? "When tenants request your properties, they'll appear here."
                : `Switch to "All" to see requests with other statuses.`}
            </div>
          </div>
        ) : (
          // render one RequestCard per filtered request
          filteredRequests.map((request) => (
            <RequestCard
              key={request.requestId}
              request={request}
              onRespond={handleRespond} // pass handler down to card
              responding={responding} // pass which requestId is loading
            />
          ))
        )}
      </main>
    </div>
  );
};

export default OwnerRequests;
