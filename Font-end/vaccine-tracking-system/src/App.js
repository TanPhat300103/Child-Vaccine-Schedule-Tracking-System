// src/App.js
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Test from "./Test";
import AboutUs from "./pages/Home/AboutUs/AboutUs";
import CustomerLayout from "./pages/CustomerPage/CustomerLayout";
import Profile from "./pages/CustomerPage/Profile";
import Child from "./pages/CustomerPage/Child";

function App() {
  return (
    <>
      <Test />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="child" element={<Child />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
