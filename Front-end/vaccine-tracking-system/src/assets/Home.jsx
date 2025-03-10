import React, { useState, useEffect, useRef, useMemo } from "react";

import {
  FaBullhorn,
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
import Header from "../components/header/header.jsx"// Import Header

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

  localStorage.setItem("userId", userInfo.userId);
  // cart
  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce(
      (total, vaccine) => total + vaccine.quantity,
      0
    );
  }, [cart]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const feedbackContainerRef = useRef(null);
  const animationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
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
  // Fetch feedback từ API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:8080/feedback", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/notification", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Lọc thông báo có roleId = 1 hoặc role.roleId = 1
          console.log("notification: ", data[21].role.roleId);
          const filteredNotifications = data.filter(
            (notification) => notification.role?.roleId?.toString() === "1"
          );

          // Sắp xếp theo ngày giảm dần
          filteredNotifications.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setNotifications(filteredNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  // Auto slide cho feedback
  useEffect(() => {
    if (feedbacks.length > 0) {
      const timer = setInterval(() => {
        setCurrentFeedbackSlide((prev) => (prev + 1) % feedbacks.length);
      }, 5000); // Thay đổi slide mỗi 5 giây
      return () => clearInterval(timer);
    }
  }, [feedbacks.length]);
  useEffect(() => {
    if (feedbacks.length === 0 || !feedbackContainerRef.current) return;

    const containerWidth = feedbackContainerRef.current.scrollWidth / 2;
    const speed = 1; // Tốc độ scroll (px per frame)

    const animate = () => {
      setTranslateX((prev) => {
        const newX = prev - speed;
        // Reset về 0 khi đi hết nửa đầu của container (vì đã nhân đôi data)
        if (Math.abs(newX) >= containerWidth) {
          return 0;
        }
        return newX;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [feedbacks]);
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
  const getLatestCampaign = () => {
    const campaigns = notifications.filter(
      (notification) => notification.role && notification.role.roleId === 1
    );
    if (campaigns.length > 0) {
      return campaigns[0]; // Lấy chiến dịch gần nhất
    }
    return null;
  };
  const renderStars = (ranking) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < ranking ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
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
    {
      name: "Trang chủ",
      icon: <FaSyringe className="text-lg" />,
      action: () => navigate("/home"),
    },
    {
      name: "Đặt lịch tiêm",
      icon: <FaCalendarCheck className="text-lg" />,
      action: () => navigate("/book-vaccine"),
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
    {
      name: "Theo dõi",
      icon: <FaChartLine className="text-lg" />,
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
       <Header/>
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
              Phụ Huynh Nói Gì
            </motion.h2>

            {feedbacks.length > 0 ? (
              <div className="overflow-hidden">
                <motion.div
                  ref={feedbackContainerRef}
                  style={{ x: translateX }}
                  className="flex gap-6 whitespace-nowrap"
                >
                  {feedbacks.map((feedback, index) => (
                    <div
                      key={`${feedback.id}-${index}`}
                      className="flex-shrink-0 w-[400px]"
                    >
                      <div className="bg-white p-6 rounded-xl shadow-lg h-full">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {feedback.booking.customer.firstName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold">
                              {feedback.booking.customer.firstName}{" "}
                              {feedback.booking.customer.lastName}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Ngày đặt: {feedback.booking.bookingDate}
                            </p>
                          </div>
                        </div>
                        <div className="mb-3">
                          {renderStars(feedback.ranking)}
                        </div>
                        <p className="text-gray-600 text-sm italic">
                          "{feedback.comment}"
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <p className="text-center text-gray-600">Chưa có đánh giá nào</p>
            )}
          </div>
        </section>
        {/* Latest News */}
        <motion.section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12 text-gray-800"
            >
              Tin Tức Mới Nhất
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Hiển thị 2 thông báo gần nhất */}
              {notifications.slice(0, 2).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <FaBullhorn className="text-blue-600 text-2xl mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {notification.tittle}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    Ngày: {notification.date}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Thiết kế lại Chiến dịch Marketing Gần Nhất */}
            {getLatestCampaign() && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-100 via-teal-50 to-green-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {/* Icon tiêm chủng hoặc trẻ em */}
                    <FaSyringe className="text-teal-600 text-3xl mr-4" />
                    <h3 className="text-2xl font-semibold text-teal-800">
                      Chiến Dịch Tiêm Chủng Gần Nhất
                    </h3>
                  </div>
                  {/* Badge nổi bật */}
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Mới
                  </span>
                </div>

                {/* Tiêu đề chiến dịch */}
                <p className="text-xl font-medium text-blue-700 mb-3 bg-blue-50 p-3 rounded-lg">
                  {getLatestCampaign().tittle}
                </p>

                {/* Nội dung chiến dịch */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {getLatestCampaign().message}
                </p>

                {/* Thông tin bổ sung */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Ngày:{" "}
                    <span className="font-medium">
                      {getLatestCampaign().date}
                    </span>
                  </p>
                  {/* Nút kêu gọi hành động */}
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors duration-300">
                    Tìm Hiểu Thêm
                  </button>
                </div>

                {/* Hình ảnh minh họa nhỏ */}
                <div className="mt-4 flex justify-end"></div>
              </motion.div>
            )}
          </div>
        </motion.section>
        {/* Footer */}
        <section ref={footerRef}>
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default Home;
