import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaBell,
  FaBoxOpen,
  FaCalendarAlt,
  FaCalendarCheck,
  FaChartLine,
  FaChild,
  FaHome,
  FaInfo,
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
import { useNavigate } from "react-router-dom";
import { slides, benefits, process } from "../stores/homedata.jsx";
import Footer from "../components/common/Footer";
import PriceVaccineGuest from "../components/homepage/PriceVaccineGuest.jsx";
import AgeVaccine2 from "../components/homepage/AgeVaccine2.jsx";

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //move slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  //scroll to pricing
  const scrollToVaccinePricing = () => {
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

  const navItems = [
    {
      name: "Trang chủ",
      icon: <FaSyringe className="text-lg" />,
      action: () => navigate("/"),
    },
    {
      name: "Đặt lịch tiêm",
      icon: <FaCalendarCheck className="text-lg" />,
      action: () => navigate("/login"),
    },
    {
      name: "Gói vaccine",
      icon: <FaUserMd className="text-lg" />,
      action: scrollToVaccinePricing,
    },
    {
      name: "Liên hệ",
      icon: <FaInfo className="text-lg" />,
      action: scrollToFooter,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2 bg-white shadow-lg"
            : "py-3 bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              onClick={() => {
                navigate("/home");
                closeAllMenus();
              }}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-400 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 shadow-md">
                <FaSyringe className="text-white text-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-blue-700">
                  VaccineCare
                </span>
                <span className="text-xs text-blue-500 -mt-1">
                  Trung Tâm Tiêm Chủng
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    closeAllMenus();
                  }}
                  className="group flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium mt-1">{item.name}</span>
                  <span className="block h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-600 mt-1" />
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 focus:outline-none hover:bg-blue-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-lg" />
                ) : (
                  <FaBars className="text-lg" />
                )}
              </button>
            </div>

            {/* User Actions & Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  navigate("/login");
                  closeAllMenus();
                }}
                className="px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  closeAllMenus();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </header>

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
                    onClick={() => navigate("/login")}
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

      {/* Age Vaccine */}
      <AgeVaccine2></AgeVaccine2>
      {/* Price Vaccine */}
      <motion.section className="py-20 bg-white" ref={vaccinePricingRef}>
        <PriceVaccineGuest></PriceVaccineGuest>
      </motion.section>

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
  );
};

export default App;
