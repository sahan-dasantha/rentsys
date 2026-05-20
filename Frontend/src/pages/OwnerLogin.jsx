import Footer from "../components/Footer";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; //imports the navigation hook
import { C, T } from "../Styles/theme"; //import theme colors and styles

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //initializes navigator

  //login function
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/owner/ownerlogin",

        { email, password },
      );

      localStorage.setItem("owner", JSON.stringify(response.data)); //saves owner data so profile page can read it
      navigate("/ownerprofile"); //Redirects to profile after login
    } catch (error) {
      alert(error.response?.data || "Login failed");
    }
  };

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
            welcome back - sign in to your acccount
          </p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "18px" }}>
              <label style={T.label}>Email Address:</label>

              <input
                type="email"
                style={T.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  name="remember"
                  style={{
                    accentColor: C.accent,
                    width: "15px",
                    height: "15px",
                  }}
                />
                Remember me
              </label>
            </div>

            <button type="submit" style={{ ...T.btnGold, width: "100%" }}>
              Login
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
            Don't have an account?{" "}
          </p>
        </div>
      </div>
    </div>
  );
};
export default OwnerLogin;
