import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaBell,
  FaShoppingCart,
  FaSyringe,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { slides, benefits, process } from "../stores/homedata.jsx";

import AgeVaccine from "../components/homepage/AgeVaccine.jsx";
import Footer from "../components/common/Footer";
import { useCart } from "../components/homepage/AddCart.jsx"; // Đảm bảo đúng đường dẫn đến CartContext
import { getChildByCustomerId, getCustomerId } from "../apis/api.js";
import { useAuth } from "../components/common/AuthContext.jsx";
import PriceVaccine from "../components/homepage/PriceVaccine.jsx";
import ComboVaccine from "../components/homepage/ComboVaccine.jsx";
import HeaderIndex from "../components/common/HeaderIndex.jsx";
import HeaderHome from "../components/common/HeaderHome.jsx";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState();
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();
  const [customerData, setCustomerData] = useState(null);
  const [childData, setChildData] = useState(null);
  const { userInfo } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [proFileData, setProFileData] = useState(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Thay đổi ngôn ngữ
  };
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

  // take data
  console.log("user id la: ", userInfo.authorities[0].authority);

  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce(
      (total, vaccine) => total + vaccine.quantity,
      0
    );
  }, [cart]);

  localStorage.setItem("userId", userInfo.userId);
  const handleCartClick = () => {
    navigate("/book-vaccine", {
      state: { cartItems: cart }, // Truyền cart vào state
    });
  };
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

  return (
    <div>
      <div>
        <h1>{t("welcome")}</h1>
        <p>{t("description")}</p>
        <button onClick={() => changeLanguage("en")}>Switch to English</button>
        <button onClick={() => changeLanguage("vi")}>
          Chuyển sang tiếng Việt
        </button>
      </div>{" "}
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <HeaderHome></HeaderHome>
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
        <ComboVaccine></ComboVaccine>
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
