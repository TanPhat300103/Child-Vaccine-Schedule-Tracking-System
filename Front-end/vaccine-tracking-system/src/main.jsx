import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"; // Import Router và Routes
import Home from "../src/pages/Home/Home.jsx";
import PaymentGateway from "../src/pages/Payment/Payment.jsx";
import App from "./App.jsx";
import "./components/index.css";
import StaffDashboard from "./pages/AdminPage/Dashboard/StaffDashboard.jsx";
import LoginPage from "./pages/Auth/Login/LoginPage.jsx";
import Register from "./pages/Auth/Register/Register.jsx";
import Child from "./pages/CustomerPage/Child.jsx";

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/child" element={<Child />} />
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
