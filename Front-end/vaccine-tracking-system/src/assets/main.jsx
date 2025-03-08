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

import CustomerPage from "../pages/CustomerPage/CustomerPage.jsx";
import AddChild from "../pages/CustomerPage/AddChild.jsx";
import Child from "../pages/CustomerPage/Child.jsx";
import BookingCustomer from "../pages/CustomerPage/BookingCustomer.jsx";
import PaymentCustomer from "../pages/CustomerPage/PaymentCustomer.jsx";

import StaffPage from "../pages/StaffPage/StaffPage.jsx";
import Profile from "../pages/StaffPage/Profile.jsx";

import Customers from "../pages/Manager/Customers.jsx";
import Childs from "../pages/Manager/Childs.jsx";
import Vaccines from "../pages/Manager/Vaccines.jsx";
import VaccineDetail from "../pages/Manager/VaccineDetail.jsx";
import MarketingCampains from "../pages/Manager/MarketingCampains.jsx";
import VaccineCombos from "../pages/Manager/VaccineCombos.jsx";
import ComboDetail from "../pages/Manager/ComboDetail.jsx";
import Bookings from "../pages/Manager/Bookings.jsx";
import BookingDetail from "../pages/Manager/BookingDetail.jsx";
import Records from "../pages/Manager/Records.jsx";
import Feedbacks from "../pages/Manager/Feedbacks.jsx";
import Payments from "../pages/Manager/Payments.jsx";

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
import SpecificVaccine from "../pages/Vaccination/SpecificVaccine.jsx";
import SpecificCombo from "../pages/Vaccination/SpecificCombo.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary.jsx";

import DetailVaccine2 from "../pages/Vaccination/DetailVaccine2.jsx";
import ReactVaccine2 from "../pages/Vaccination/ReactVaccine2.jsx";
import Feedback from "../pages/Feedback/Feedback.jsx";

import BookVaccine from "../pages/Vaccination/BookVaccine.jsx";
import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import { AuthProvider } from "../components/common/AuthContext.jsx";

import VNPAY from "../pages/Payment/VNPAY.jsx";

import CancelPayment from "../pages/Payment/CancelPayment.jsx";
import PriceVaccine from "../components/homepage/PriceVaccine.jsx";
import PaymentVnpay from "../pages/Payment/PaymentVNPay.jsx";
import Overview from "../components/common/OverviewPage.jsx";
import PaymentReturnPage from "../pages/Payment/PaymentReturnPage.jsx";
import BookingDetailPage from "../pages/CustomerPage/BookingDetailPage.jsx";

import ComboVaccine from "../components/homepage/ComboVaccine.jsx";

// import BookingPage from "../apis/test.jsx";

const Main = () => {
  return (
    <StrictMode>
      <Router>
        <AuthProvider>
          <CartProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar
            />
            <Routes>
              {/* Các route chính */}
              {/* <Route path="/test" element={<BookingPage />} /> */}
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<Policy />} />
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/payment-online"
                element={<PaymentGatewayOnline />}
              />

              <Route path="/book-vaccine" element={<BookVaccine />} />
              <Route path="/detail-vaccine" element={<DetailVaccine />} />
              <Route path="/detail-vaccine2" element={<DetailVaccine2 />} />
              <Route path="/status-vaccine" element={<StatusVaccine />} />
              <Route path="/react-vaccine" element={<ReactVaccine />} />
              <Route path="/react-vaccine2" element={<ReactVaccine2 />} />
              <Route path="/specific-vaccine" element={<SpecificVaccine />} />
              <Route path="/specific-combo" element={<SpecificCombo />} />

              {/* Các route mới từ main */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/feedback" element={<Feedback />} />

              <Route path="/price-vaccine" element={<PriceVaccine />} />
              <Route path="/header" element={<Header />} />

              <Route path="/footer" element={<Footer />} />
              <Route path="/auth" element={<AuthProvider />} />
              <Route path="/overview" element={<Overview />} />
              <Route
                path="/booking-detail/:bookingId"
                element={<BookingDetailPage />}
              />

              <Route path="/paymentVnpay" element={<PaymentVnpay />} />
              <Route path="/vnpay" element={<VNPAY />} />
              <Route path="/payment-return" element={<PaymentReturnPage />} />
              <Route path="/combo-vaccine" element={<ComboVaccine />} />
              {/* <Route path="/lichtiem" element={<LichTiemChung />} /> */}

              {/* Route /customer */}
              <Route path="/customer" element={<CustomerPage />}>
                <Route path="child/:childId" element={<Child />} />
                <Route path="add-child" element={<AddChild />} />
                <Route path="booking" element={<BookingCustomer />} />
                <Route path="payment" element={<PaymentCustomer />} />
              </Route>

              {/* Route /staff: giữ đầy đủ child route theo HEAD */}
              <Route path="/staff" element={<StaffPage />}>
                <Route index element={<Profile />} />
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
                <Route path="bookings" element={<Bookings />} />
                <Route
                  path="booking-detail/:bookingId"
                  element={<BookingDetail />}
                />

                <Route path="records" element={<Records />} />
                <Route path="feedbacks" element={<Feedbacks />} />
                <Route path="payments" element={<Payments />} />
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
                <Route path="bookings" element={<Bookings />} />
                <Route
                  path="booking-detail/:bookingId"
                  element={<BookingDetail />}
                />
                <Route path="records" element={<Records />} />
                <Route path="feedbacks" element={<Feedbacks />} />
                <Route path="payments" element={<Payments />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
