import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { C, T } from "../Styles/theme";

// ── Property type options ─────────────────────────────────────────
const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Room"];

// ── Status badge colors ───────────────────────────────────────────
const statusColor = {
  Available: "#5ecb8a",
  "Not Available": "#e05c5c",
};

// ── Property Card Component ───────────────────────────────────────
const PropertyCard = ({ property, onDelete }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: "16px",
      overflow: "hidden",
      transition: "transform .2s, border-color .2s",
      position: "relative",
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
    {/* ── colored top bar by type ── */}
    <div
      style={{
        height: "4px",
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

    <div style={{ padding: "24px" }}>
      {/* ── type icon + title row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>
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
                fontSize: "1rem",
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

        {/* ── status badge ── */}
        <div
          style={{
            background: `${statusColor[property.status]}22`,
            border: `1px solid ${statusColor[property.status]}55`,
            color: statusColor[property.status],
            borderRadius: "20px",
            padding: "3px 12px",
            fontSize: "0.72rem",
            fontWeight: "700",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {property.status}
        </div>
      </div>

      {/* ── property details ── */}
      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "0.9rem", marginTop: "1px" }}>📍</span>
          <span
            style={{ color: C.muted, fontSize: "0.85rem", lineHeight: "1.5" }}
          >
            {property.address}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem" }}>💰</span>
          <span
            style={{
              color: C.accent,
              fontWeight: "700",
              fontSize: "1.05rem",
              fontFamily: "'Georgia', serif",
            }}
          >
            Rs. {property.rentAmount.toLocaleString()}
            <span
              style={{ color: C.muted, fontSize: "0.78rem", fontWeight: "400" }}
            >
              {" "}
              /month
            </span>
          </span>
        </div>
      </div>

      {/* ── delete button ── */}
      <button
        onClick={() => onDelete(property.propertyId)}
        style={{
          ...T.btnDanger,
          width: "100%",
          padding: "8px",
          fontSize: "0.82rem",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = `${C.danger}18`)
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        🗑 Remove Property
      </button>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────
const OwnerProperties = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ── form state ──
  const [form, setForm] = useState({
    address: "",
    type: "House",
    rentAmount: "",
    status: "Available",
  });

  // ── load owner + properties on mount ──
  useEffect(() => {
    const stored =
      localStorage.getItem("owner") || sessionStorage.getItem("owner");
    if (!stored) {
      navigate("/ownerlogin");
      return;
    }

    const parsed = JSON.parse(stored);
    setOwner(parsed);

    // fetch properties from backend
    axios
      .get(`http://localhost:8081/property/owner/${parsed.ownerId}`)
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  // ── handle form input changes ──
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── handle add property submit ──
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!form.address || !form.rentAmount) {
      alert("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:8081/property/${owner.ownerId}`,
        {
          address: form.address,
          type: form.type,
          rentAmount: parseFloat(form.rentAmount),
          status: form.status,
        },
      );

      // add new property to list instantly without page reload
      setProperties((prev) => [...prev, response.data]);

      // reset form
      setForm({
        address: "",
        type: "House",
        rentAmount: "",
        status: "Available",
      });
      setShowForm(false);
      alert("Property added successfully!");
    } catch (error) {
      alert(error.response?.data || "Failed to add property.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── handle delete property ──
  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to remove this property?"))
      return;

    try {
      await axios.delete(`http://localhost:8081/property/${propertyId}`);
      // remove from list instantly
      setProperties((prev) => prev.filter((p) => p.propertyId !== propertyId));
    } catch (error) {
      alert("Failed to delete property.");
    }
  };

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
      </div>
    );

  return (
    <div style={T.page}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
        input:focus, select:focus {
          border-color: ${C.accent} !important;
          box-shadow: 0 0 0 3px ${C.accent}22 !important;
        }
      `}</style>

      {/* ── Top Bar ── */}
      <nav style={T.topBar}>
        <span
          style={{ ...T.logo, cursor: "pointer" }}
          onClick={() => navigate("/ownerprofile")}
        >
          🏠 RentSys
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* back to profile button */}
          <button
            onClick={() => navigate("/ownerprofile")}
            style={{
              ...T.btnOutline,
              padding: "8px 16px",
              fontSize: "0.85rem",
            }}
          >
            ← Back to Profile
          </button>
          {/* logout button */}
          <button
            onClick={() => {
              localStorage.removeItem("owner");
              sessionStorage.removeItem("owner");
              navigate("/ownerlogin");
            }}
            style={{ ...T.btnDanger, padding: "8px 16px", fontSize: "0.85rem" }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main
        style={{
          flex: 1,
          maxWidth: "1100px",
          width: "100%",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        {/* ── Page Header ── */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1 style={{ ...T.heading, fontSize: "1.8rem", margin: "0 0 6px" }}>
              My Properties
            </h1>
            <p style={{ ...T.subtitle, margin: 0 }}>
              {owner?.fullName} · {properties.length} propert
              {properties.length === 1 ? "y" : "ies"} listed
            </p>
          </div>

          {/* ── Add Property toggle button ── */}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              ...T.btnGold,
              padding: "12px 24px",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add Property"}
          </button>
        </div>

        {/* ── ADD PROPERTY FORM ── */}
        {showForm && (
          <div
            className="fade-up"
            style={{
              ...T.card,
              marginBottom: "36px",
              border: `1px solid ${C.accent}44`,
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
                fontSize: "1.1rem",
                fontWeight: "700",
                margin: "0 0 24px",
                fontFamily: "'Georgia', serif",
              }}
            >
              + Add New Property
            </h3>

            <form onSubmit={handleAddProperty}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "18px",
                  marginBottom: "18px",
                }}
              >
                {/* Address */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={T.label}>Property Address</label>
                  <input
                    name="address"
                    type="text"
                    style={T.input}
                    placeholder="Enter full property address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label style={T.label}>Property Type</label>
                  <select
                    name="type"
                    style={{
                      ...T.input,
                      cursor: "pointer",
                    }}
                    value={form.type}
                    onChange={handleChange}
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rent Amount */}
                <div>
                  <label style={T.label}>Monthly Rent (Rs.)</label>
                  <input
                    name="rentAmount"
                    type="number"
                    style={T.input}
                    placeholder="e.g. 15000"
                    value={form.rentAmount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label style={T.label}>Status</label>
                  <select
                    name="status"
                    style={{ ...T.input, cursor: "pointer" }}
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...T.btnGold,
                  padding: "12px 32px",
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Adding..." : "Add Property →"}
              </button>
            </form>
          </div>
        )}

        {/* ── PROPERTIES GRID ── */}
        {properties.length === 0 ? (
          // ── empty state ──
          <div
            style={{
              ...T.card,
              textAlign: "center",
              padding: "60px 24px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏠</div>
            <h3
              style={{
                color: C.text,
                marginBottom: "8px",
                fontFamily: "'Georgia', serif",
              }}
            >
              No properties yet
            </h3>
            <p style={{ color: C.muted, marginBottom: "24px" }}>
              Click "Add Property" above to list your first property.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{ ...T.btnGold, padding: "10px 24px" }}
            >
              + Add Your First Property
            </button>
          </div>
        ) : (
          // ── property cards grid ──
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {properties.map((property) => (
              <div key={property.propertyId} className="fade-up">
                <PropertyCard property={property} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerProperties;
