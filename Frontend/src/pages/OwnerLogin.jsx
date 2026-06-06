import axios from "axios"; //http library to call the springboot API
import { useState } from "react"; //react hook to manage component state
import { useNavigate, Link } from "react-router-dom"; //imports the navigation hook
import { C, T } from "../Styles/theme"; //import theme colors and styles
import { Building2 } from "lucide-react";

const OwnerLogin = () => {
  // ── State variables ──────────────────────────────────────────
  // Each useState() creates a variable + a function to update it.
  // React re-renders the component whenever any state changes.
  const [email, setEmail] = useState(""); // Stores what the user types in the email field
  const [password, setPassword] = useState(""); // Stores what the user types in the password field
  const [rememberMe, setRememberMe] = useState(false); // Tracks whether "Remember me" checkbox is ticked
  const [isLoading, setIsLoading] = useState(false); // True while waiting for the API response
  const [error, setError] = useState(""); //Holds any errror msg to show the user
  const navigate = useNavigate(); //initializes navigator

  // ── Validation ───────────────────────────────────────────────
  // Runs before the API call to catch obvious mistakes early.
  // Returns an error string if something is wrong, or null if everything is fine.

  const validate = () => {
    if (!email.trim()) return "Please enter your email address."; // email is empty or only spaces

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address."; // email doesn't match basic format (e.g. missing @)

    if (!password) return "Please enter your password."; // password field is empty

    if (password.length < 6) return "Password must be at least 6 characters."; // too short to be a real password

    return null; // no errors — validation passed
  };

  // ── Login handler ─────────────────────────────────────────────
  // Called when the form is submitted.
  // async/await lets us wait for the API response before continuing.
  const handleLogin = async (e) => {
    e.preventDefault(); // Stops the browser from refreshing the page on form submit

    setError(""); // Clear any previous error message before trying again

    // Run validation first — if it fails, show the error and stop here
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return; // Don't call the API if inputs are invalid
    }

    setIsLoading(true); // Show "Signing in..." on the button and disable inputs

    try {
      // Send POST request to the Spring Boot backend with email and password
      // Spring Boot is running on port 8081 in this project
      const response = await axios.post(
        "http://localhost:8081/owner/ownerlogin",

        { email, password },
      );
      console.log("Spring Boot returned:", response.data);

      // Destructure only the fields we need from the response
      // Avoid storing the full response — it may contain sensitive data we don't need
      const { ownerId, fullName, email: ownerEmail } = response.data;

      // "Remember me" logic:
      // - localStorage  → data stays saved even after closing the browser tab
      // - sessionStorage → data is cleared as soon as the tab is closed

      localStorage.setItem(
        "owner",
        JSON.stringify({ ownerId, fullName, email: ownerEmail }),
      );

      // Only difference for "remember me" — store a flag
      if (!rememberMe) {
        sessionStorage.setItem("ownerTemp", "true"); // marks session-only preference
      }

      navigate("/ownerprofile"); // Redirect to the owner's profile page on success
    } catch (err) {
      const errData = err.response?.data;

      if (typeof errData === "string") {
        setError(errData); // "Email not found!" or "Incorrect password!"
      } else if (errData?.message) {
        setError(errData.message); // Spring Boot 500 error object has a "message" field
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      // "finally" runs whether the request succeeded or failed
      // Always turn off the loading state so the button becomes clickable again
      setIsLoading(false);
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
        <div style={{ ...T.card, width: "100%", maxWidth: "420px" }}>
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
              marginBottom: "8px",
              fontSize: "2rem",
            }}
          >
            🏠
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
            Owner Login
          </h2>
          <p
            style={{
              color: C.muted,
              textAlign: "center",
              fontSize: "0.85rem",
              marginBottom: "28px",
            }}
          >
            welcome back - sign in to your account
          </p>

          {/* ── Error banner ──────────────────────────────────────
              Only renders if the error state is not an empty string.
              Shows validation errors and API errors in one place.      */}
          {error && (
            <div
              style={{
                background: "#fff0f0", // light red background
                border: "1px solid #ffcccc", // soft red border
                color: "#cc0000", // dark red text
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "0.85rem",
                marginBottom: "18px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div style={{ marginBottom: "18px" }}>
              <label style={T.label}>Email Address:</label>

              <input
                type="email"
                style={T.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // update state on every keystroke
                disabled={isLoading} // lock the field while the API call is in progress
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label style={T.label}>Password:</label>

              <input
                type="password"
                style={T.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

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
                  checked={rememberMe} // controlled checkbox
                  onChange={(e) => setRememberMe(e.target.checked)} // update state when ticked/unticked
                  style={{
                    accentColor: C.accent,
                    width: "15px",
                    height: "15px",
                  }}
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              style={{
                ...T.btnGold,
                width: "100%",
                opacity: isLoading ? 0.7 : 1, // visually dim while loading
                cursor: isLoading ? "not-allowed" : "pointer", // change cursor to show it's busy
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
              {/* Show different text depending on loading state */}
            </button>
          </form>

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
              onClick={() => navigate("/ownersignup")}
              style={{
                color: C.accent,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default OwnerLogin;
