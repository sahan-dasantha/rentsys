import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerSignup from "./pages/OwnerSignup";
import TenantLogin from "./pages/TenantLogin";
import TenantSignup from "./pages/TenantSignup";
import OwnerProfile from "./pages/OwnerProfile";
import OwnerProperties from "./pages/OwnerProperties";
import TenantProfile from "./pages/TenantProfile";
import PropertyProfile from "./pages/PropertyProfile";
import OwnerRequests from "./pages/OwnerRequests";
import TenantRequests from "./pages/TenantRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ownerlogin" element={<OwnerLogin />} />
        <Route path="/tenantlogin" element={<TenantLogin />} />
        <Route path="/ownersignup" element={<OwnerSignup />} />
        <Route path="/tenantsignup" element={<TenantSignup />} />
        <Route path="/ownerprofile" element={<OwnerProfile />} />
        <Route path="/ownerproperties" element={<OwnerProperties />} />
        <Route path="/tenantprofile" element={<TenantProfile />} />
        <Route path="/property/:propertyId" element={<PropertyProfile />} />
        <Route path="/owner/requests" element={<OwnerRequests />} />
        <Route
          path="/tenant/requests/:residentId"
          element={<TenantRequests />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
