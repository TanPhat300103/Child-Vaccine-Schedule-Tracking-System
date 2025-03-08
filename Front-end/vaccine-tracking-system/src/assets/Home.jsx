import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaBell,
  FaBoxOpen,
  FaCalendarAlt,
  FaChartLine,
  FaHome,
  FaPhoneAlt,
  FaPlusCircle,
  FaShoppingCart,
  FaSignOutAlt,
  FaSyringe,
  FaUser,
  FaUserCircle,
  FaUserMd,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { slides, benefits, process } from "../stores/homedata.jsx";

import AgeVaccine from "../components/homepage/AgeVaccine.jsx";
import Footer from "../components/common/Footer";
import { useCart } from "../components/homepage/AddCart.jsx"; // Đảm bảo đúng đường dẫn đến CartContext
import { getChildByCustomerId, getCustomerId } from "../apis/api.js";
import { useAuth } from "../components/common/AuthContext.jsx";
import PriceVaccine from "../components/homepage/PriceVaccine.jsx";
import ComboVaccine from "../components/homepage/ComboVaccine.jsx";

import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import AgeVaccine2 from "../components/homepage/AgeVaccine2.jsx";
import AgeVaccine3 from "../components/homepage/AgeVaccine3.jsx";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const { userInfo } = useAuth();
  const { i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
  });
  const { cart } = useCart();
  const { logout } = useAuth();
  const [childData, setChildData] = useState([]);
  const navigate = useNavigate();
  const UserId = localStorage.getItem("userId");
  console.log("user id la: ", userInfo.authorities[0].authority);
  localStorage.setItem("userId", userInfo.userId);
  // cart
  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce(
      (total, vaccine) => total + vaccine.quantity,
      0
    );
  }, [cart]);

  const handleCartClick = () => {
    navigate("/book-vaccine", {
      state: { cartItems: cart }, // Truyền cart vào state
    });
  };

  // check auth
  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await fetch("http://localhost:8080/auth/myprofile", {
        method: "GET",
        credentials: "include", // Gửi cookie/session
      });
      if (response.status === 401) {
        setIsAuthenticated(false);
        navigate("/login"); // Redirect if not authenticated
      }
    };

    checkAuthentication();
  }, []);

  // navigate role
  useEffect(() => {
    if (userInfo) {
      if (userInfo.authorities[0].authority === "ROLE_CUSTOMER") {
        navigate("/home"); // Dẫn người dùng tới trang Home
      } else if (userInfo.authorities[0].authority === "ROLE_STAFF") {
        navigate("/staff"); // Dẫn người dùng tới trang Staff
      } else if (userInfo.authorities[0].authority === "ROLE_ADMIN") {
        console.log("admin on");
        navigate("/admin"); // Dẫn người dùng tới trang Admin
      }
    }
  }, [userInfo, navigate]); // Dependency array đảm bảo useEffect chỉ chạy khi userInfo thay đổi

  // handle logout
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setCustomerData(null);

    navigate("/");
  };

  // take api customerByid
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerId(userInfo.userId);
        setCustomerData(data);
        console.log("customerdata: ", customerData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchCustomer();
  }, []);
  // take name
  useEffect(() => {
    if (customerData && customerData.firstName && customerData.lastName) {
      localStorage.setItem(
        "userName",
        customerData.firstName + " " + customerData.lastName
      );
    }
  }, [customerData]);

  // take api childByCustomerId
  useEffect(() => {
    const fetchChild = async () => {
      try {
        const data = await getChildByCustomerId(userInfo.userId);
        setChildData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchChild();
  }, []);

  //move slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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

  const navItems = [
    { name: "Trang chủ", icon: <FaHome />, action: () => navigate("/home") },
    {
      name: "Đặt lịch",
      icon: <FaCalendarAlt />,
      action: () => navigate("/book-vaccine"),
    },
    { name: "Gói tiêm", icon: <FaBoxOpen />, action: scrollVaccinePricing },
    { name: "Liên lạc", icon: <FaPhoneAlt />, action: scrollToFooter },
    {
      name: "Xem lịch",
      icon: <FaChartLine />,
      action: () => navigate("/overview"),
    },
  ];

  const profileInitial = customerData?.firstName
    ? customerData.firstName.charAt(0).toUpperCase()
    : "U";

  return (
    <div>
      {" "}
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
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
                onClick={() => navigate("/home")}
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
                {/* Cart Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleCartClick}
                  className="relative p-2 text-blue-600 hover:text-blue-700 transition-colors"
                  aria-label="Shopping Cart"
                >
                  <FaShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </motion.button>

                {/* Notification Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => navigate("/bell")}
                  className="relative p-2 text-blue-600 hover:text-blue-700 transition-colors"
                  aria-label="Notifications"
                >
                  <FaBell size={20} />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    1
                  </span>
                </motion.button>

                {/* User Avatar */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="relative"
                    aria-label="User menu"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {profileInitial}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white ${
                        isUserMenuOpen ? "bg-blue-500" : ""
                      }`}
                    ></span>
                  </motion.button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {/* Header section */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                              {profileInitial}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-600">
                                Xin chào,
                              </h3>
                              <p className="text-base font-semibold text-blue-700">
                                {customerData?.firstName}{" "}
                                {customerData?.lastName}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <nav className="py-2">
                          {/* Main profile */}
                          <button
                            onClick={() => {
                              navigate("/customer");
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200"
                          >
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                              <FaUserCircle size={18} />
                            </div>
                            <span className="text-sm font-medium">
                              Hồ sơ của tôi
                            </span>
                          </button>

                          {/* Child profiles */}
                          {childData.map((child) => (
                            <button
                              key={child.childId}
                              onClick={() => {
                                navigate(`/customer/child/${child.childId}`);
                                setIsUserMenuOpen(false);
                              }}
                              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200"
                            >
                              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                                {child.firstName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-medium">
                                Hồ sơ của {child.firstName} {child.lastName}
                              </span>
                            </button>
                          ))}

                          {/* Add new child profile */}
                          <button
                            onClick={() => {
                              navigate("/customer/add-child");
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200"
                          >
                            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                              <FaPlusCircle size={16} />
                            </div>
                            <span className="text-sm font-medium">
                              Thêm hồ sơ mới cho con
                            </span>
                          </button>

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 transition duration-200 border-t border-gray-100 mt-1"
                          >
                            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
                              <FaSignOutAlt size={16} />
                            </div>
                            <span className="text-sm font-medium">
                              Đăng xuất
                            </span>
                          </button>
                        </nav>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
        {/* Banner */}
        <motion.section className="relative h-screen overflow-hidden">
          <motion.div
            animate={{ x: `-${currentSlide * 100}%` }}
            transition={{ type: "tween", duration: 0.5 }}
            className="flex h-full"
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="relative w-full h-full flex-shrink-0"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 animate-pulse"
                      onClick={() => navigate("/book-vaccine")}
                    >
                      Đăng ký tiêm
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Dots for Slide Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-6">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)} // Set current slide on click
                className={`w-5 h-5 rounded-full cursor-pointer ${
                  currentSlide === index ? "bg-blue-600" : "bg-gray-400"
                } transition-colors duration-300`}
              />
            ))}
          </div>
        </motion.section>
        {/* Benefit */}
        <motion.section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12 text-gray-800"
            >
              Lợi Ích Của Vắc-xin
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-blue-600 text-3xl mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        {/* Quality */}
        <motion.section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Bảo Vệ Gia Đình Bạn Với Dịch Vụ Chăm Sóc Sức Khỏe Chất Lượng
                </h2>
                <p className="text-gray-600 mb-8">
                  Trải nghiệm dịch vụ tiêm chủng đẳng cấp thế giới cùng đội ngũ
                  chuyên gia y tế của chúng tôi.
                </p>
                <div className="flex space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-blue-600"
                  >
                    <FaUserMd className="text-2xl mr-2" />
                    <span>Bác Sĩ Chuyên Gia</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center text-blue-600"
                  >
                    <FaSyringe className="text-2xl mr-2" />
                    <span>Vắc-xin Chất Lượng</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309"
                  alt="Healthcare"
                  className="rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>
        {/* Combo Vaccine */}
        <AgeVaccine3></AgeVaccine3>

        {/* Price Vaccine */}
        <motion.section className="py-20 bg-white" ref={vaccinePricingRef}>
          <PriceVaccine></PriceVaccine>
        </motion.section>
        {/* Age Vaccine */}

        {/* Processing */}
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Quy Trình Tiêm Chủng
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-4xl mb-4"
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-2xl font-bold mb-2">{`Bước ${item.step}`}</div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Footer */}
        <section ref={footerRef}>
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default Home;
