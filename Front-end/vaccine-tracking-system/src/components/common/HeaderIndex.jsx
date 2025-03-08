import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getChildByCustomerId, getCustomerId } from "../../apis/api";
import { IconContext } from "react-icons";
import {
  FaShoppingCart,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaPlusCircle,
  FaHome,
  FaCalendarAlt,
  FaBoxOpen,
  FaPhoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { useCart } from "../homepage/AddCart";

const HeaderIndex = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
  });
  const { cart, addToCart, removeFromCart } = useCart();
  const [childData, setChildData] = useState([]);
  const navigate = useNavigate();
  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce(
      (total, vaccine) => total + vaccine.quantity,
      0
    );
  }, [cart]);
  const UserId = localStorage.getItem("userId");
  const handleCartClick = () => {
    navigate("/book-vaccine", {
      state: { cartItems: cart }, // Truyền cart vào state
    });
  };
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerId(UserId);
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error.message);
      }
    };

    if (UserId) fetchCustomer();
  }, [UserId]);

  // Get child data
  useEffect(() => {
    const fetchChild = async () => {
      try {
        const data = await getChildByCustomerId(UserId);
        setChildData(data);
      } catch (error) {
        console.error("Error fetching child data:", error.message);
      }
    };

    if (UserId) fetchChild();
  }, [UserId]);

  // Navigation functions
  const scrollVaccinePricing = () => {
    const element = document.getElementById("vaccine-pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToFooter = () => {
    const element = document.getElementById("footer");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navItems = [
    { name: "Trang chủ", icon: <FaHome />, action: () => navigate("/") },
    {
      name: "Đặt lịch",
      icon: <FaCalendarAlt />,
      action: () => navigate("/login"),
    },
    { name: "Gói tiêm", icon: <FaBoxOpen />, action: scrollVaccinePricing },
    { name: "Liên lạc", icon: <FaPhoneAlt />, action: scrollToFooter },
  ];

  const profileInitial = customerData?.firstName
    ? customerData.firstName.charAt(0).toUpperCase()
    : "U";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white shadow-lg"
          : "py-4 bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-all duration-300">
              <span className="text-white text-xl font-bold">V</span>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              VaccineCare
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={item.action}
                className="group flex items-center space-x-1.5 text-gray-700 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-blue-500 group-hover:text-blue-600 transition-colors">
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                <span className="block h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-600" />
              </motion.button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 focus:outline-none"
            >
              <div className="w-6 flex flex-col items-center space-y-1.5">
                <span
                  className={`block h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-gray-700 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* User Actions & Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Login and Register buttons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng nhập
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng ký
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="py-2 space-y-2 border-t border-gray-100">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors rounded-lg"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-blue-500">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                ))}

                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                  {/* Mobile Cart Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      navigate("/cart");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <FaShoppingCart size={18} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Giỏ hàng
                    </span>
                  </motion.button>

                  {/* Mobile Notification Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      navigate("/bell");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center space-y-1 relative"
                  >
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600 relative">
                      <FaBell size={18} />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        1
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Thông báo
                    </span>
                  </motion.button>

                  {/* Mobile User Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      navigate("/customer");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                      <FaUserCircle size={18} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Hồ sơ
                    </span>
                  </motion.button>

                  {/* Mobile Logout Icon */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      navigate("/");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                      <FaSignOutAlt size={18} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Đăng xuất
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default HeaderIndex;
