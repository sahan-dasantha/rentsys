import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerSignup from "./pages/OwnerSignup";
import TenantLogin from "./pages/TenantLogin";
import TenantSignup from "./pages/TenantSignup";
import OwnerProfile from "./pages/OwnerProfile";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
