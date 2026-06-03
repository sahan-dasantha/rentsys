import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { C, T } from "../Styles/theme";

const TenantLogin = () => {
  // ── STATE VARIABLES ──────────────────────────────────────────────
  const [email, setEmail] = useState(""); // stores email input
  const [password, setPassword] = useState(""); // stores password input
  const [rememberMe, setRememberMe] = useState(false); // tracks remember me checkbox
  const [isLoading, setIsLoading] = useState(false); // true while waiting for API
  const [error, setError] = useState(""); // holds error message to show user
  const navigate = useNavigate();

  // ── VALIDATION ───────────────────────────────────────────────────
  // Runs before API call to catch mistakes early
  // Returns an error string if something is wrong, null if all good
  const validate = () => {
    if (!email.trim()) return "Please enter your email address."; // empty or spaces only

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address."; // missing @ or domain

    if (!password) return "Please enter your password."; // empty password

    if (password.length < 6) return "Password must be at least 6 characters."; // too short

    return null; // all good — no errors
  };

  // ── LOGIN HANDLER ────────────────────────────────────────────────
  // Called when form is submitted
  // async/await lets us wait for the API response before continuing
  const handleLogin = async (e) => {
    e.preventDefault(); // stops browser from refreshing the page

    setError(""); // clear any previous error before trying again

    // run validation — stop here and show error if it fails
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true); // show "Signing in..." on button and disable inputs

    try {
      // POST request to Spring Boot tenant login endpoint
      const response = await axios.post(
        "http://localhost:8081/tenant/tenantlogin",
        { email, password },
      );

      console.log("Spring Boot returned:", response.data);

      // destructure only the fields we need from response
      // avoids storing unnecessary or sensitive data
      const { residentId, fullName, email: tenantEmail } = response.data;

      // ── Remember Me logic ────────────────────────────────────────
      // localStorage  → stays saved even after closing the browser
      // sessionStorage → cleared when the tab is closed
      localStorage.setItem(
        "tenant",
        JSON.stringify({ residentId, fullName, email: tenantEmail }),
      );

      // if "remember me" is NOT ticked, mark as session-only
      if (!rememberMe) {
        sessionStorage.setItem("tenantTemp", "true");
      }

      navigate("/tenantprofile"); // redirect to tenant profile on success
    } catch (err) {
      // ── Error handling ───────────────────────────────────────────
      // Spring Boot can return errors in different formats
      const errData = err.response?.data;

      if (typeof errData === "string") {
        setError(errData); // e.g. "Email not found!" or "Incorrect password!"
      } else if (errData?.message) {
        setError(errData.message); // Spring Boot 500 error object has a "message" field
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      // "finally" always runs whether request succeeded or failed
      // always turn off loading so button becomes clickable again
      setIsLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div style={T.page}>
      {/* ── TOP BAR — with back to home ───────────────────────────── */}
      <nav style={T.topBar}>
        {/* logo — clicking takes user back to home */}
        <span
          style={{ ...T.logo, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          🏠 RentSys
        </span>

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

      {/* ── LOGIN CARD ────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div style={{ ...T.card, width: "100%", maxWidth: "420px" }}>
          {/* gold gradient bar at top */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
              borderRadius: "4px",
              marginBottom: "28px",
            }}
          />

          {/* icon + heading + subtitle */}
          <div
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "8px",
            }}
          >
            👤
          </div>
          <h2
            style={{
              color: C.accent,
              textAlign: "center",
              fontSize: "1.6rem",
              fontWeight: "700",
              marginBottom: "6px",
            }}
          >
            Tenant Login
          </h2>
          <p
            style={{
              color: C.muted,
              textAlign: "center",
              fontSize: "0.85rem",
              marginBottom: "28px",
            }}
          >
            Welcome back — sign in to your account
          </p>

          {/* ── ERROR BANNER ──────────────────────────────────────────
              Only shows when error state is not empty
              Displays both validation errors and API errors          */}
          {error && (
            <div
              style={{
                background: `${C.danger}15`, // very transparent red background
                border: `1px solid ${C.danger}55`,
                color: C.danger,
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "0.85rem",
                marginBottom: "18px",
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* ── FORM ──────────────────────────────────────────────── */}
          <form onSubmit={handleLogin} noValidate>
            {/* Email input */}
            <div style={{ marginBottom: "18px" }}>
              <label style={T.label}>Email Address</label>
              <input
                type="email"
                style={T.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // update on every keystroke
                disabled={isLoading} // lock field while API is running
              />
            </div>

            {/* Password input */}
            <div style={{ marginBottom: "18px" }}>
              <label style={T.label}>Password</label>
              <input
                type="password"
                style={T.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Remember me checkbox */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: C.muted,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} // update on tick/untick
                  style={{
                    accentColor: C.accent,
                    width: "15px",
                    height: "15px",
                  }}
                />
                Remember me
              </label>
            </div>

            {/* Submit button — dims and shows "Signing in..." while loading */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...T.btnGold,
                width: "100%",
                opacity: isLoading ? 0.7 : 1, // visually dim while loading
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* link to signup */}
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: C.muted,
              fontSize: "0.85rem",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/tenantsignup")}
              style={{
                color: C.accent,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register here
            </span>
          </p>

          {/* ── DIVIDER — switch to owner login ───────────────────── */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              marginTop: "20px",
              paddingTop: "20px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: C.muted,
                fontSize: "0.8rem",
                marginBottom: "10px",
              }}
            >
              Are you a property owner?
            </p>
            <button
              onClick={() => navigate("/ownerlogin")}
              style={{
                ...T.btnOutline,
                width: "100%",
                padding: "9px",
                fontSize: "0.85rem",
              }}
            >
              Login as Owner instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;
