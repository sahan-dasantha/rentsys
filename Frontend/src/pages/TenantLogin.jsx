import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Properties from "../components/Properties";

const TenantLogin = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div class="container mt-3 flex-grow-1">
        <h2>Log in as Tenant</h2>
        <form>
          <div className="mb-3 mt-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              name="email"
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Enter password"
              name="password"
            />
          </div>
          <div className="form-check mb-3">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember"
              />
              Remember me
            </label>
          </div>
          <div>
            <button type="button" className="btn btn-dark ">
              Log
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};
export default TenantLogin;
