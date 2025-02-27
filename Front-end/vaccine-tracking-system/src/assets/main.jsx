import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Import các trang khác
import Home from "./Home.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import ForgotPassword from "../pages/Login/ForgotPassword.jsx";
import TermsOfService from "../pages/Register/TermOfService.jsx";
import Policy from "../pages/Register/Policy.jsx";
import PaymentGatewayOnline from "../pages/Payment/PaymentOnline.jsx";
import { ToastContainer } from "react-toastify";

import BookVaccine from "../pages/Vaccination/BookVaccine.jsx";

import CustomerPage from "../pages/CustomerPage/CustomerPage.jsx";
import AddChild from "../pages/CustomerPage/AddChild.jsx";
import Child from "../pages/CustomerPage/Child.jsx";
import BookingCustomer from "../pages/CustomerPage/BookingCustomer.jsx";
import StaffPage from "../pages/StaffPage/StaffPage.jsx";

import Customers from "../pages/Manager/Customers.jsx";
import Childs from "../pages/Manager/Childs.jsx";
import Vaccines from "../pages/Manager/Vaccines.jsx";
import VaccineDetail from "../pages/Manager/VaccineDetail.jsx";
import MarketingCampains from "../pages/Manager/MarketingCampains.jsx";
import VaccineCombos from "../pages/Manager/VaccineCombos.jsx";
import ComboDetail from "../pages/Manager/ComboDetail.jsx";

import AdminPage from "../pages/AdminPage/AdminPage.jsx";
import Staffs from "../pages/AdminPage/Staffs.jsx";
import Dashboard from "../pages/AdminPage/Dasboard.jsx";

// Các import từ nhánh main
import DetailVaccine from "../pages/Vaccination/DetailVaccine.jsx";
import StatusVaccine from "../pages/Vaccination/StatusVaccine.jsx";
import ReactVaccine from "../pages/Vaccination/ReactVaccine.jsx";
import Payment from "../pages/Payment/Payment.jsx";
import { CartProvider } from "../components/homepage/AddCart";
import Cart from "../pages/CartPage/Carts.jsx";
import Error from "../components/common/Error.jsx";
import SpecificVaccine from "../pages/Vaccination/SpecificVaccine.jsx";
import SpecificCombo from "../pages/Vaccination/SpecificCombo.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";
import BookVaccine2 from "../pages/Vaccination/BookVaccine2.jsx";
import DetailVaccine2 from "../pages/Vaccination/DetailVaccine2.jsx";
import ReactVaccine2 from "../pages/Vaccination/ReactVaccine2.jsx";
import Feedback from "../pages/Feedback/Feedback.jsx";

const Main = () => {
  return (
    <StrictMode>
      <Router>
        <CartProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
          />
          <Routes>
            {/* Các route chính */}
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<Policy />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-online" element={<PaymentGatewayOnline />} />
            <Route path="/book-vaccine" element={<BookVaccine />} />
            <Route path="/book-vaccine2" element={<BookVaccine2 />} />
            <Route path="/detail-vaccine" element={<DetailVaccine />} />
            <Route path="/detail-vaccine2" element={<DetailVaccine2 />} />
            <Route path="/status-vaccine" element={<StatusVaccine />} />
            <Route path="/react-vaccine" element={<ReactVaccine />} />
            <Route path="/react-vaccine2" element={<ReactVaccine2 />} />
            <Route path="/specific-vaccine" element={<SpecificVaccine />} />
            <Route path="/specific-combo" element={<SpecificCombo />} />

            {/* Các route mới từ main */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/error" element={<Error />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Route /customer */}
            <Route path="/customer" element={<CustomerPage />}>
              <Route path="child/:childId" element={<Child />} />
              <Route path="add-child" element={<AddChild />} />
              <Route path="booking" element={<BookingCustomer />} />
            </Route>

            {/* Route /staff: giữ đầy đủ child route theo HEAD */}
            <Route path="/staff" element={<StaffPage />}>
              <Route path="customers" element={<Customers />} />
              <Route path="childs/:customerId" element={<Childs />} />
              <Route path="vaccines" element={<Vaccines />} />
              <Route
                path="vaccine-detail/:vaccineId"
                element={<VaccineDetail />}
              />
              <Route
                path="marketing-campains"
                element={<MarketingCampains />}
              />
              <Route path="vaccine-combos" element={<VaccineCombos />} />
              <Route
                path="combo-detail/:vaccineComboId"
                element={<ComboDetail />}
              />
            </Route>

            {/* Route /admin: giữ đầy đủ child route theo HEAD */}
            <Route path="/admin" element={<AdminPage />}>
              <Route path="customers" element={<Customers />} />
              <Route path="childs/:customerId" element={<Childs />} />
              <Route path="staffs" element={<Staffs />} />
              <Route path="vaccines" element={<Vaccines />} />
              <Route
                path="vaccine-detail/:vaccineId"
                element={<VaccineDetail />}
              />
              <Route
                path="marketing-campains"
                element={<MarketingCampains />}
              />
              <Route path="vaccine-combos" element={<VaccineCombos />} />
              <Route
                path="combo-detail/:vaccineComboId"
                element={<ComboDetail />}
              />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </CartProvider>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
