import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, T } from "../Styles/theme";
import { createOwner } from "../api/ownerApi";
// 👆 This is your Axios API function that connects to Spring Boot

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

  //reusable field renderer to avoid repeating styled divs
  const Field = ({ label, name, type = "text", placeholder }) => (
    <div style={{ marginBottom: "18px" }}>
      <label style={T.label}>{label}</label> {/*styled lable*/}
      <input
        type={type}
        style={T.input}
        name={name}
        value={owner[name]}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div style={T.page}>
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
            />

            <Field
              label="NIC Number"
              name="nationalId"
              placeholder="Enter your NIC number"
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
              />
              <Field
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone"
              />
            </div>

            <Field
              label="Address"
              name="address"
              placeholder="Enter your address"
            />

            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
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
