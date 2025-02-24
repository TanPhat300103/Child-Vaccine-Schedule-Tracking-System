import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  //scroll to pricing
  const scrollVaccinePricing = () => {
    if (vaccinePricingRef.current) {
      vaccinePricingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  //scroll to footer
  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-md`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Vaccine Care */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          VaccineCare
        </motion.div>
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Navbar */}
          {["Trang chủ", "Đặt lịch", "Gói tiêm", "Liên lạc"].map((item) => (
            <motion.a
              key={item}
              onClick={() => {
                if (item === "Gói tiêm") {
                  scrollVaccinePricing(); // Cuộn đến phần VaccinePricingTable
                }
                if (item === "Liên lạc") {
                  scrollToFooter(); // Cuộn đến Footer
                }
                if (item === "Đặt lịch") {
                  navigate("/bookschedule-vaccine");
                }
                if (item === "Trang chủ") {
                  navigate("/home");
                }
              }}
              whileHover={{ scale: 1.05 }}
              className="text-gray-700 hover:text-blue-600 transition-colors relative group cursor-pointer"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform " />
            </motion.a>
          ))}{" "}
          {/* Login and signup */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            >
              <FaUser className="text-gray-700" />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => navigate("/manage-account")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Quản lý tài khoản
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
export default Header;
