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
const IconLocation = () => (
  <Icon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
);

const IconMail = () => <Icon d="M4 4h16v16H4z M22 6l-10 7L2 6" />;
const IconPhone = () => (
  <Icon d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17z" />
);
const IconUser = () => (
  <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z" />
);
const IconCalendar = () => <Icon d="M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18" />;

// ── MAIN COMPONENT ───────────────────────────────────────────────
const PropertyProfile = () => {
  // useParams reads the :propertyId from the URL e.g. /property/5 → propertyId = "5"
  const { propertyId } = useParams();
  const navigate = useNavigate();

  // ── STATE ────────────────────────────────────────────────────────
  const [property, setProperty] = useState(null); // property + owner details from backend
  const [loading, setLoading] = useState(true); // true while fetching
  const [error, setError] = useState(""); // error message if fetch fails

  // Agreement form fields
  const [startDate, setStartDate] = useState(""); // proposed start date
  const [endDate, setEndDate] = useState(""); // proposed end date
  const [message, setMessage] = useState(""); // optional note to owner

  // Submission state
  const [submitting, setSubmitting] = useState(false); // true while POST is running
  const [submitError, setSubmitError] = useState(""); // error from form submission
  const [submitted, setSubmitted] = useState(false); // true after successful submit

  // Get logged-in tenant from localStorage (set during login)
  const tenant = JSON.parse(localStorage.getItem("tenant") || "{}");

  // ── FETCH PROPERTY DETAILS ON LOAD ───────────────────────────────
  useEffect(() => {
    axios
      .get(`http://localhost:8081/property/${propertyId}/detail`)
      .then((res) => {
        setProperty(res.data); // res.data is our PropertyDetailDTO
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Could not load property details. Please go back and try again.",
        );
        setLoading(false);
      });
  }, [propertyId]); // re-runs if propertyId in URL changes

  // ── FORM VALIDATION ──────────────────────────────────────────────
  const validate = () => {
    if (!startDate) return "Please select a start date.";
    if (!endDate) return "Please select an end date.";
    if (new Date(endDate) <= new Date(startDate))
      return "End date must be after start date.";
    return null; // all good
  };

  // ── SUBMIT AGREEMENT REQUEST ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Stop early if validation fails
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    // Stop if tenant is not logged in
    if (!tenant?.residentId) {
      setSubmitError("You must be logged in as a tenant to send a request.");
      return;
    }

    // Stop if property is not available
    if (property.status !== "AVAILABLE") {
      setSubmitError("This property is no longer available.");
      return;
    }

    setSubmitting(true);

    try {
      // POST to /rental-request
      // Backend saves this with status = "PENDING" automatically (@PrePersist)
      await axios.post("http://localhost:8081/rental-request", {
        residentId: tenant.residentId,
        propertyId: property.propertyId,
        proposedStartDate: startDate,
        proposedEndDate: endDate,
        message: message,
      });

      setSubmitted(true); // show success message instead of form
    } catch (err) {
      setSubmitError("Failed to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        <span style={{ color: C.muted, marginTop: "12px" }}>
          Loading property…
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
          onClick={() => navigate(-1)}
          style={{ ...T.btnOutline, marginTop: "16px" }}
        >
          ← Go Back
        </button>
      </div>
    );

  // ── HELPERS ──────────────────────────────────────────────────────
  // True if property is available for renting
  const isAvailable = property.status === "AVAILABLE";

  // Property type → emoji
  const typeEmoji =
    property.type === "House"
      ? "🏠"
      : property.type === "Apartment"
        ? "🏢"
        : property.type === "Villa"
          ? "🏡"
          : "🚪";

  // ── MAIN RENDER ──────────────────────────────────────────────────
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
        input:focus, textarea:focus {
          border-color: ${C.accent} !important;
          box-shadow: 0 0 0 3px ${C.accent}22 !important;
          outline: none;
        }
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

        {/* back button — goes to previous page */}
        <button
          onClick={() => navigate(-1)}
          style={{
            ...T.btnOutline,
            padding: "8px 16px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back
        </button>
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
        {/* ── HERO CARD — property title + status ───────────────── */}
        <div
          className="fade-up"
          style={{
            ...T.card,
            background: `linear-gradient(135deg, ${C.card} 0%, #1a1f30 100%)`,
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative glow */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
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
            {/* big emoji icon */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: "rgba(201,169,110,0.1)",
                border: "1px solid rgba(201,169,110,0.25)",
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
                {property.type}
                <span
                  style={{
                    color: C.muted,
                    fontSize: "1rem",
                    fontWeight: "400",
                    marginLeft: "12px",
                    fontFamily: "monospace",
                  }}
                >
                  #{String(property.propertyId).padStart(4, "0")}
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
                  marginBottom: "10px",
                }}
              >
                <IconLocation /> {property.address}
              </div>

              {/* rent */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: C.accent,
                  fontWeight: "700",
                  fontSize: "1.2rem",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Rs. {property.rentAmount?.toLocaleString()}
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

            {/* availability badge — green if available, red if not */}
            <div
              style={{
                background: isAvailable ? "#5ecb8a22" : "#e05c5c22",
                border: `1px solid ${isAvailable ? "#5ecb8a55" : "#e05c5c55"}`,
                color: isAvailable ? "#5ecb8a" : "#e05c5c",
                borderRadius: "20px",
                padding: "6px 18px",
                fontSize: "0.8rem",
                fontWeight: "700",
                textTransform: "uppercase",
                alignSelf: "flex-start",
              }}
            >
              {isAvailable ? "✓ Available" : "✗ Not Available"}
            </div>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT — Owner Info + Agreement Form ───── */}
        <div
          className="fade-up-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* ── LEFT — Owner Contact Details ──────────────────────── */}
          <div style={T.card}>
            {/* gold top bar */}
            <div
              style={{
                height: "4px",
                background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            />

            <h3
              style={{
                color: C.accent,
                fontFamily: "'Georgia', serif",
                fontSize: "1rem",
                fontWeight: "700",
                margin: "0 0 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IconUser /> Owner Details
            </h3>

            {/* owner name */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: C.muted,
                  marginBottom: "4px",
                }}
              >
                Full Name
              </div>
              <div
                style={{
                  color: C.text,
                  fontSize: "0.97rem",
                  fontWeight: "600",
                }}
              >
                {property.ownerName || "—"}
              </div>
            </div>

            {/* owner email */}
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: C.muted,
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <IconMail /> Email
              </div>
              <div style={{ color: C.text, fontSize: "0.9rem" }}>
                {property.ownerEmail || "—"}
              </div>
            </div>

            {/* owner phone */}
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: C.muted,
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <IconPhone /> Phone
              </div>
              <div style={{ color: C.text, fontSize: "0.9rem" }}>
                {property.ownerPhone || "—"}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Agreement Request Form ────────────────────── */}
          <div
            style={{
              ...T.card,
              border: isAvailable
                ? `1px solid ${C.accent}44`
                : `1px solid ${C.border}`,
            }}
          >
            {/* gold top bar */}
            <div
              style={{
                height: "4px",
                background: isAvailable
                  ? `linear-gradient(90deg, ${C.accent}, ${C.accent2})`
                  : `linear-gradient(90deg, #666, #888)`,
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            />

            <h3
              style={{
                color: isAvailable ? C.accent : C.muted,
                fontFamily: "'Georgia', serif",
                fontSize: "1rem",
                fontWeight: "700",
                margin: "0 0 6px",
              }}
            >
              📋 Request Agreement
            </h3>
            <p
              style={{
                color: C.muted,
                fontSize: "0.82rem",
                marginBottom: "20px",
              }}
            >
              {isAvailable
                ? "Fill in your proposed rental period and send a request to the owner."
                : "This property is currently not available for rent."}
            </p>

            {/* ── SUCCESS STATE — shown after successful submission ── */}
            {submitted ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  background: "#5ecb8a11",
                  border: "1px solid #5ecb8a44",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
                <div
                  style={{
                    color: "#5ecb8a",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  Request Sent!
                </div>
                <div style={{ color: C.muted, fontSize: "0.82rem" }}>
                  The owner will review your request and respond soon.
                </div>
              </div>
            ) : isAvailable ? (
              /* ── FORM — only shown when property is available ───── */
              <form onSubmit={handleSubmit}>
                {/* error banner */}
                {submitError && (
                  <div
                    style={{
                      background: `${C.danger}15`,
                      border: `1px solid ${C.danger}55`,
                      color: C.danger,
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "0.82rem",
                      marginBottom: "16px",
                    }}
                  >
                    ⚠ {submitError}
                  </div>
                )}

                {/* proposed start date */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={T.label}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <IconCalendar /> Proposed Start Date
                    </span>
                  </label>
                  <input
                    type="date"
                    style={T.input}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // can't pick past dates
                    disabled={submitting}
                  />
                </div>

                {/* proposed end date */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={T.label}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <IconCalendar /> Proposed End Date
                    </span>
                  </label>
                  <input
                    type="date"
                    style={T.input}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    disabled={submitting}
                  />
                </div>

                {/* optional message to owner */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={T.label}>Message to Owner (optional)</label>
                  <textarea
                    style={{
                      ...T.input,
                      height: "80px",
                      resize: "vertical", // user can drag to resize vertically
                      fontFamily: "inherit",
                    }}
                    placeholder="Introduce yourself or ask a question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                {/* submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...T.btnGold,
                    width: "100%",
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "Sending..." : "📨 Send Request to Owner"}
                </button>
              </form>
            ) : (
              /* ── NOT AVAILABLE MESSAGE ──────────────────────────── */
              <div
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: C.muted,
                  fontSize: "0.9rem",
                }}
              >
                🔒 This property is currently occupied.
                <br />
                <span style={{ fontSize: "0.8rem" }}>
                  Check back later or search for other properties.
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyProfile;
