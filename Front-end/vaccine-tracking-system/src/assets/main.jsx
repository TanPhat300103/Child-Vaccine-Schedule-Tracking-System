import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router và Routes
import App from "./App.jsx";
import "./index.css";

import Home from "./Home.jsx";
import LoginPage from "../pages/Login/LoginPage.jsx";
import Register from "../pages/Register/Register.jsx";
import ForgotPassword from "../pages/Login/ForgotPassword.jsx";
import TermsOfService from "../pages/Register/TermOfService.jsx";
import Policy from "../pages/Register/Policy.jsx";
import PaymentGateway from "../pages/Payment/Payment.jsx";
import PaymentGatewayOnline from "../pages/Payment/PaymentOnline.jsx";

import VaccineScheduling from "../pages/Vaccination/BookSchedule.jsx";
import VaccinationSchedule from "../pages/Vaccination/StatusSchedule.jsx";
import DetailVaccine from "../pages/Vaccination/ReactionVaccine.jsx";
import DetailVaccine2 from "../pages/Vaccination/DetailVaccine.jsx";

import CustomerPage from "../pages/CustomerPage/CustomerPage.jsx";
import AddChild from "../pages/CustomerPage/AddChild.jsx";
import Child from "../pages/CustomerPage/Child.jsx";
import BookingCustomer from "../pages/CustomerPage/BookingCustomer.jsx";

import StaffPage from "../pages/StaffPage/StaffPage.jsx";
import Customers from "../pages/StaffPage/Customers.jsx";

import AdminPage from "../pages/AdminPage/AdminPage.jsx";
// import Dashboard from "../pages/AdminPage/Dashboard.jsx";
// import Customers from "./pages/AdminPage/Customers.jsx";
// import Bookings from "./pages/AdminPage/Bookings.jsx";
import Staffs from "../pages/AdminPage/Staffs.jsx";
// import Incomes from "./pages/AdminPage/Incomes.jsx";
// import Vaccines from "./pages/AdminPage/Vaccines.jsx";

import { ToastContainer } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/payment-online" element={<PaymentGatewayOnline />} />

        <Route path="/bookschedule-vaccine" element={<VaccineScheduling />} />
        <Route path="/vaccine-page" element={<DetailVaccine />} />
        <Route path="/vaccine-page2" element={<DetailVaccine2 />} />
        <Route path="/status-schedule" element={<VaccinationSchedule />} />
        <Route path="/customer" element={<CustomerPage />}>
          <Route path="child/:childId" element={<Child />} />
          <Route path="add-child" element={<AddChild />} />
          <Route path="booking" element={<BookingCustomer />} />
        </Route>
        <Route path="/staff" element={<StaffPage />}>
          <Route path="customers" element={<Customers />} />
        </Route>
        <Route path="/admin" element={<AdminPage />}>
          {/* Các route con hiển thị qua Outlet */}
          {/* <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="bookings" element={<Bookings />} /> */}
          <Route path="staffs" element={<Staffs />} />
          {/* <Route path="incomes" element={<Incomes />} />
          <Route path="vaccines" element={<Vaccines />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
