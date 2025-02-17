import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router và Routes
import App from "./App.jsx";
import "./index.css";
import Home from "../pages/Home/Home.jsx";
import LoginPage from "../pages/Login/LoginPage.jsx";
import Register from "../pages/Register/Register.jsx";
import ForgotPassword from "../pages/Login/ForgotPassword.jsx";
import TermsOfService from "../pages/Register/TermOfService.jsx";
import Policy from "../pages/Register/Policy.jsx";
import VaccineScheduling from "../pages/BookSchedule/BookSchedule.jsx";
import PaymentGateway from "../pages/Payment/Payment.jsx";
import ChildDashboard from "../pages/CustomerPage/Child.jsx";
import StaffDashboard from "../pages/AdminPage/Dashboard/StaffDashboard.jsx";

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/bookschedule-vaccine" element={<VaccineScheduling />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/child" element={<ChildDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
