import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirect after signup
import axios from "axios"; //for API call to backend
import { C, T } from "../Styles/theme"; //gold/dark theme colors and styles

// ── REUSABLE FIELD COMPONENT ─────────────────────────────────────
// ← ADDED: avoids repeating the same div+label+input structure 7 times
// readOnly prop used for the date field so user can't edit it
const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  readOnly = false,
  value,
  onChange,
}) => (
  <div style={{ marginBottom: "18px" }}>
    <label style={T.label}>{label}</label>{" "}
    {/* ← CHANGED: styled label from theme */}
    <input
      type={type}
      name={name}
      style={{
        ...T.input, // ← CHANGED: replaced "form-control" className
        cursor: readOnly ? "not-allowed" : "text",
        opacity: readOnly ? 0.6 : 1, // dim the read-only date field
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      required={!readOnly}
    />
  </div>
);

const TenantSignup = () => {
  const navigate = useNavigate(); //  initialize navigator

  // ── FORM STATE ───────────────────────────────────────────────────
  // ← CHANGED: all fields combined into one state object (like OwnerSignup)
  // instead of separate useState for each field
  const [tenant, setTenant] = useState({
    fullName: "",
    nationalId: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    password: "",
    dateRegistered: new Date().toISOString().split("T")[0], // auto-filled today's date
  });

  // ── HANDLE INPUT CHANGES ─────────────────────────────────────────
  // ← CHANGED: single handleChange instead of separate onChange per field
  // spreads previous values and updates only the changed field
  const handleChange = (e) => {
    setTenant({ ...tenant, [e.target.name]: e.target.value });
  };

  // ── HANDLE FORM SUBMIT ───────────────────────────────────────────
  // ← ADDED: was missing entirely — form had no submit logic before
  const handleSubmit = async (e) => {
    e.preventDefault(); // stops page reload on submit

    try {
      await axios.post("http://localhost:8081/tenant", tenant); // POST to backend
      alert("Registered successfully!");

      // reset form after success
      setTenant({
        fullName: "",
        nationalId: "",
        email: "",
        phoneNumber: "",
        occupation: "",
        password: "",
        dateRegistered: new Date().toISOString().split("T")[0],
      });

      navigate("/tenantlogin"); // ← ADDED: redirect to login after signup
    } catch (error) {
      alert(error.response?.data || "Registration failed!");
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div style={T.page}>
      {/* ← ADDED: centers the card vertically and horizontally */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div style={{ ...T.card, width: "100%", maxWidth: "480px" }}>
          {/* ← ADDED: gold gradient bar at top of card */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
              borderRadius: "4px",
              marginBottom: "28px",
            }}
          />

          {/* ← ADDED: icon above heading */}
          <div
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "8px",
            }}
          >
            👤
          </div>

          {/* ← CHANGED: plain <h2> → gold styled heading */}
          <h2 style={{ ...T.heading, textAlign: "center" }}>Tenant Sign Up</h2>

          {/* ← ADDED: subtitle */}
          <p style={{ ...T.subtitle, textAlign: "center" }}>
            Create your tenant account
          </p>

          {/* ── FORM ──────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <Field
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={tenant.fullName} // ← tells React what to show
              onChange={handleChange} // ← tells React what to do on type
            />

            {/* NIC — changed label from "NIC number:" to "NIC Number" for consistency */}
            <Field
              label="NIC Number"
              name="nationalId"
              placeholder="Enter your NIC number"
              value={tenant.nationalId}
              onChange={handleChange}
            />

            {/* ← ADDED: Email + Phone in 2-column grid (same as OwnerSignup) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={tenant.email}
                onChange={handleChange}
              />
              <Field
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone"
                value={tenant.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Occupation — ← FIXED: name was "address" before, now correctly "occupation" */}
            <Field
              label="Occupation"
              name="occupation"
              placeholder="e.g. Engineer, Teacher"
              value={tenant.occupation}
              onChange={handleChange}
            />

            {/* Date Registered — read-only, auto-filled with today's date */}
            <Field
              label="Date of Registration"
              name="dateRegistered"
              type="date"
              value={tenant.dateRegistered}
              onChange={handleChange}
              readOnly={true}
            />

            {/* Password */}
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={tenant.password}
              onChange={handleChange}
            />

            {/* ← CHANGED: replaced "btn btn-dark" + type="button" with gold themed submit button
                Also fixed: was type="button" which never submitted — now type="submit"         */}
            <button
              type="submit"
              style={{ ...T.btnGold, width: "100%", marginTop: "8px" }}
            >
              Create Account
            </button>
          </form>

          {/* ← ADDED: link back to login page */}
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: C.muted,
              fontSize: "0.85rem",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/tenantlogin")}
              style={{
                color: C.accent,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantSignup;
