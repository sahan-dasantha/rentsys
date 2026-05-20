import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const TenantSignup = () => {
  const [dateRegistered, setDateRegistered] = useState(
    new Date().toISOString().split("T")[0],
  );
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container mt-3 flex-grow-1 pb-4">
        <h2>Tenant sign up</h2>
        <form>
          <div className="mb-3 mt-3">
            <label htmlFor="email">Full name:</label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              placeholder="Enter full name"
              name="full_name"
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="nic">NIC number:</label>
            <input
              type="text"
              className="form-control"
              id="nic"
              placeholder="Enter NIC number"
              name="nic"
            />
          </div>
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
            <label htmlFor="phone">Phone number:</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              placeholder="Enter phone number"
              name="phone"
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="address">Occupation:</label>
            <input
              type="text"
              className="form-control"
              id="occupation"
              placeholder="Enter occupation"
              name="address"
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="date">Date of registered:</label>
            <input
              type="date"
              className="form-control"
              value={dateRegistered}
              readOnly
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              name="password"
            />
          </div>

          <div>
            <button type="button" className="btn btn-dark ">
              Sign up
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};
export default TenantSignup;
