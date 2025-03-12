import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
//layout
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import VaccinationHandbook from "../layout/VaccinationHandbook";
import VaccinationFAQ from "../layout/VaccinationFAQ";
//main pages
import HomePage from "../pages/HomePage";
import CustomerPage from "../pages/CustomerPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import VaccinePage from "../pages/VaccinePage";
import LoginForm from "../pages/LoginForm";
import ProfilePage from "../pages/ProfilePage";
import BookingDetailPage from "../pages/BookingDetailPage";
import MyPaymentPage from "../pages/MyPaymentPage";
import PaymentProcessPage from "../pages/PaymentProcessPage";
import PaymentReturnPage from "../pages/PaymentReturnPage";
import BookingPage from "../pages/BookingPage";
import Overview from "../pages/Overview";
import NotificationDetail from "../pages/NotificationDetail";
import ChildInfoPage from "../pages/ChildInfoPage";
import VaccinationNotes from "../pages/VaccinationNotes";
import MyBookingsPage from "../pages/MyBookingsPage";
//components
import { AuthProvider } from "../components/AuthContext";
import Chatbox from "../components/Chatbox";
//Staff Page
import StaffPage from "../pages/Staff/StaffPage";
import Profile from "../pages/Staff/Profile";
//Manager Page
import Customers from "../pages/Manager/CustomerManager";
import Childs from "../pages/Manager/ChildManager";
import Bookings from "../pages/Manager/BookingManager";
import BookingDetail from "../pages/Manager/BookingDetailManager";
import Records from "../pages/Manager/RecordManager";
import Feedbacks from "../pages/Manager/FeedbackManager";
import MarketingCampaigns from "../pages/Manager/MarketingCampaignManager";
import Payments from "../pages/Manager/PaymentManager";
import Vaccines from "../pages/Manager/VaccineManager";
import VaccineDetailManager from "../pages/Manager/VaccineDetailManager";
import VaccineCombos from "../pages/Manager/VaccineComboManager";
import ComboDetail from "../pages/Manager/ComboDetailManager";
//Admin Page
import AdminPage from "../pages/Admin/AdminPage";
import Staffs from "../pages/Admin/StaffManager";
import Dashboard from "../pages/Admin/Dashboard";
const Layout = ({ children }) => {
  const location = useLocation();
  const isStaffPage = location.pathname.startsWith("/staff");

  return (
    <>
      {!isStaffPage && <Header />}
      {children}
      {!isStaffPage && <Chatbox />}
      {!isStaffPage && <Footer />}
    </>
  );
};

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Các route không phải staff */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <LoginForm />
              </Layout>
            }
          />
          <Route
            path="/customer"
            element={
              <Layout>
                <CustomerPage />
              </Layout>
            }
          />
          <Route
            path="/customer/detail/:id"
            element={
              <Layout>
                <CustomerDetailPage />
              </Layout>
            }
          />
          <Route
            path="/vaccine"
            element={
              <Layout>
                <VaccinePage />
              </Layout>
            }
          />

          <Route
            path="/profile"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
          <Route
            path="/booking-detail/:bookingId"
            element={
              <Layout>
                <BookingDetailPage />
              </Layout>
            }
          />
          <Route
            path="/my-payment"
            element={
              <Layout>
                <MyPaymentPage />
              </Layout>
            }
          />
          <Route
            path="/my-payments"
            element={
              <Layout>
                <MyPaymentPage />
              </Layout>
            }
          />
          <Route
            path="/payment-process/:paymentId"
            element={
              <Layout>
                <PaymentProcessPage />
              </Layout>
            }
          />
          <Route
            path="/payment-return"
            element={
              <Layout>
                <PaymentReturnPage />
              </Layout>
            }
          />
          <Route
            path="/booking"
            element={
              <Layout>
                <BookingPage />
              </Layout>
            }
          />
          <Route
            path="/overview"
            element={
              <Layout>
                <Overview />
              </Layout>
            }
          />
          <Route
            path="/notification/:notificationId"
            element={
              <Layout>
                <NotificationDetail />
              </Layout>
            }
          />
          <Route
            path="/child-info"
            element={
              <Layout>
                <ChildInfoPage />
              </Layout>
            }
          />
          <Route
            path="/handbook/vaccination-process"
            element={
              <Layout>
                <VaccinationHandbook />
              </Layout>
            }
          />
          <Route
            path="/handbook/pre-post-notes"
            element={
              <Layout>
                <VaccinationNotes />
              </Layout>
            }
          />
          <Route
            path="/handbook/faq"
            element={
              <Layout>
                <VaccinationFAQ />
              </Layout>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <Layout>
                <MyBookingsPage />
              </Layout>
            }
          />
          {/* Route cha cho staff với các route con */}
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Dashboard />} />
            <Route path="staffs" element={<Staffs />} />
            <Route path="customers" element={<Customers />} />
            <Route path="childs/:customerId" element={<Childs />} />
            <Route path="bookings" element={<Bookings />} />
            <Route
              path="booking-detail/:bookingId"
              element={<BookingDetail />}
            />
            <Route path="records" element={<Records />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route
              path="marketing-campaigns"
              element={<MarketingCampaigns />}
            />
            <Route path="payments" element={<Payments />} />
            <Route path="vaccines" element={<Vaccines />} />
            <Route
              path="vaccine-detail/:vaccineId"
              element={<VaccineDetailManager />}
            />
            <Route path="vaccine-combos" element={<VaccineCombos />} />
            <Route
              path="combo-detail/:vaccineComboId"
              element={<ComboDetail />}
            />
          </Route>

          {/* Route cha cho staff với các route con */}
          <Route path="/staff" element={<StaffPage />}>
            <Route index element={<Profile />} />
            <Route path="customers" element={<Customers />} />
            <Route path="childs/:customerId" element={<Childs />} />
            <Route path="bookings" element={<Bookings />} />
            <Route
              path="booking-detail/:bookingId"
              element={<BookingDetail />}
            />
            <Route path="records" element={<Records />} />
            <Route path="feedbacks" element={<Feedbacks />} />
            <Route
              path="marketing-campaigns"
              element={<MarketingCampaigns />}
            />
            <Route path="payments" element={<Payments />} />
            <Route path="vaccines" element={<Vaccines />} />
            <Route
              path="vaccine-detail/:vaccineId"
              element={<VaccineDetailManager />}
            />
            <Route path="vaccine-combos" element={<VaccineCombos />} />
            <Route
              path="combo-detail/:vaccineComboId"
              element={<ComboDetail />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;
