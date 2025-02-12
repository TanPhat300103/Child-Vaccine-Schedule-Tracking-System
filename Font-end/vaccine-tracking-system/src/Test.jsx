// src/Test.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Import các component (dù hiện tại có thể đang trống)
import Dashboard from "./pages/AdminPage/Dashboard/Dashboard";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ForgotPass from "./pages/Auth/ForgotPass/ForgotPass";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import Profile from "./pages/CustomerPage/Profile";
import CustomerLayout from "./pages/CustomerPage/CustomerLayout";
import Feedback from "./pages/Feedback/Feedback";
import AboutUs from "./pages/Home/AboutUs/AboutUs";
import HomePage from "./pages/Home/HomePage/Home";
import Payment from "./pages/Payment/Payment";
import Record from "./pages/StaffPage/Record";
import Child from "./pages/CustomerPage/Child";

// Đặt tên component bạn muốn test vào đây.
// Ví dụ: "Dashboard", "Header", "Footer", "Login", v.v.
const componentToTest = "CustomerLayout";

// Component Test: chuyển dữ liệu vào component cần test và render nó

function Test() {
  switch (componentToTest) {
    case "Dashboard":
      return <Dashboard />;
    case "Header":
      return <Header />;
    case "CustomerLayout":
      return <CustomerLayout />;
    case "Footer":
      return <Footer />;
    case "ForgotPass":
      return <ForgotPass />;
    case "Login":
      return <Login />;
    case "Signup":
      return <Signup />;
    case "Profile":
      return <Profile />;
    case "Child":
      return <Child />;
    case "Feedback":
      return <Feedback />;
    case "AboutUs":
      return <AboutUs />;
    case "HomePage":
      return <HomePage />;
    case "Payment":
      return <Payment />;
    case "Record":
      return <Record />;
    default:
      return <div>Vui lòng chọn component cần test.</div>;
  }
}

// Render Test.jsx vào element có id="root" (điều này giả định rằng file index.html đã có <div id="root"></div>)
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Test />
    </BrowserRouter>
  </React.StrictMode>
);

export default Test;
