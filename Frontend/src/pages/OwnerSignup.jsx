import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { C, T } from "../Styles/theme";
import { Building2 } from "lucide-react"; // modern icon
import { createOwner } from "../api/ownerApi";
// 👆 This is your Axios API function that connects to Spring Boot

// ── FIELD COMPONENT ──────────────────────────────────────────────
// ← FIXED: defined OUTSIDE OwnerSignup so React doesn't recreate
//   it on every keystroke — fixes the cursor focus loss bug
// ← value and onChange passed as props so the field stays controlled
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
    <label style={T.label}>{label}</label>
    <input
      type={type}
      name={name}
      style={{
        ...T.input,
        cursor: readOnly ? "not-allowed" : "text",
        opacity: readOnly ? 0.6 : 1,
      }}
      placeholder={placeholder}
      value={value} // ← FIXED: value comes from parent state
      onChange={onChange} // ← FIXED: onChange updates parent state
      readOnly={readOnly}
      required={!readOnly}
    />
  </div>
);

const OwnerSignup = () => {
  const navigate = useNavigate(); //initialize navigator
  //  State to store form data
  const [owner, setOwner] = useState({
    fullName: "",
    nationalId: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  // Handle input changes
  // This function runs whenever user types in any input field
  const handleChange = (e) => {
    setOwner({
      ...owner, // keep previous values
      [e.target.name]: e.target.value, // update only changed field
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); //stops page reload

    try {
      const response = await createOwner(owner); //  Send data to backend

      console.log("Success:", response.data);
      alert("Owner registered successfully!");

      //  Clear form after success
      setOwner({
        fullName: "",
        nationalId: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
      });
      navigate("/ownerlogin"); //redirect to login after successful signup
    } catch (error) {
      //  If backend fails
      console.log("Error:", error);
      alert("Registration failed!");
    }
  };

  return (
    <div style={T.page}>
      <nav style={T.topBar}>
        {/* logo — clicking takes user back to home */}

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

        {/* back to home button */}
        <button
          onClick={() => navigate("/")}
          style={{
            ...T.btnOutline,
            padding: "8px 16px",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to Home
        </button>
      </nav>

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
          {/*  gold accent bar at top */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
              borderRadius: "4px",
              marginBottom: "28px",
            }}
          />

          <div
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "8px",
            }}
          >
            🏠
          </div>

          {/* gold styled heading */}
          <h2 style={{ ...T.heading, textAlign: "center" }}>Create Account</h2>

          {/*  subtitle */}
          <p style={{ ...T.subtitle, textAlign: "center" }}>
            Register as a property owner
          </p>

          {/* Signnup form */}
          <form onSubmit={handleSubmit}>
            {/* ← CHANGED: all inputs now use Field component with theme styles */}
            <Field
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={owner.fullName}
              onChange={handleChange}
            />

            <Field
              label="NIC Number"
              name="nationalId"
              placeholder="Enter your NIC number"
              value={owner.nationalId}
              onChange={handleChange}
            />

            {/* ← ADDED: two-column row for Email and Phone */}
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
                value={owner.email}
                onChange={handleChange}
              />
              <Field
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone"
                value={owner.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <Field
              label="Address"
              name="address"
              placeholder="Enter your address"
              value={owner.address}
              onChange={handleChange}
            />

            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={owner.password}
              onChange={handleChange}
            />

            {/* ← CHANGED: replaced "btn btn-dark" with gold theme button */}
            <button
              type="submit"
              style={{ ...T.btnGold, width: "100%", marginTop: "8px" }}
            >
              Create Account
            </button>
          </form>
          {/* ← ADDED: link back to login */}
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
              onClick={() => navigate("/ownerlogin")}
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

export default OwnerSignup;
