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
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { slides, benefits, process } from "../stores/homedata.jsx";
import AgeVaccine from "../components/homepage/AgeVaccine.jsx";
import Footer from "../components/common/Footer";
import { useCart } from "../components/homepage/AddCart.jsx";
import { getChildByCustomerId, getCustomerId } from "../apis/api.js";
import { useAuth } from "../components/common/AuthContext.jsx";
import PriceVaccine from "../components/homepage/PriceVaccine.jsx";
import ComboVaccine from "../components/homepage/ComboVaccine.jsx";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import AgeVaccine2 from "../components/homepage/AgeVaccine2.jsx";
import AgeVaccine3 from "../components/homepage/AgeVaccine3.jsx";
import LanguageSwitcher from "../components/translate/LanguageSwitcher.jsx";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const [isHandbookOpen, setIsHandbookOpen] = useState(false); // Trạng thái cho dropdown "Cẩm nang" trong mobile
  localStorage.setItem("userId", userInfo.userId);

  // if (userInfo) {
  //   const role = userInfo.authorities?.[0]?.authority;
  //   if (role === "ROLE_STAFF") {
  //     navigate("/staff");
  //   } else if (role === "ROLE_ADMIN") {
  //     navigate("/admin");
  //   }
  //   // Nếu là ROLE_CUSTOMER hoặc không có vai trò khác, tiếp tục render trang Home
  // }

  // Cart
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
      state: { cartItems: cart },
    });
  };

  // Check auth
  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await fetch("http://localhost:8080/auth/myprofile", {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        navigate("/login");
      }
    };
    checkAuthentication();
  }, []);

  // Navigate role
  useEffect(() => {
    if (userInfo) {
      const role = userInfo.authorities[0].authority;
      if (role === "ROLE_STAFF") {
        navigate("/staff");
      } else if (role === "ROLE_ADMIN") {
        navigate("/admin");
      }
      setIsLoading(false); // Chỉ tắt loading khi đã xác định vai trò
    } else {
      setIsLoading(false); // Nếu không có userInfo, vẫn tắt loading để render Home
    }
  }, [userInfo, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setCustomerData(null);
    navigate("/");
  };

  // Take API customerById
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerId(userInfo.userId);
        setCustomerData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchCustomer();
  }, []);

  // Save name to localStorage
  useEffect(() => {
    if (customerData && customerData.firstName && customerData.lastName) {
      localStorage.setItem(
        "userName",
        customerData.firstName + " " + customerData.lastName
      );
    }
  }, [customerData]);

  // Fetch feedbacks từ API
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

  // Fetch notifications từ API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8080/notification", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const filteredNotifications = data.filter(
            (notification) => notification.role?.roleId?.toString() === "1"
          );
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
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [feedbacks.length]);

  useEffect(() => {
    if (feedbacks.length === 0 || !feedbackContainerRef.current) return;
    const containerWidth = feedbackContainerRef.current.scrollWidth / 2;
    const speed = 1;
    const animate = () => {
      setTranslateX((prev) => {
        const newX = prev - speed;
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

  // Take API childByCustomerId
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

  // Move slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to pricing
  const scrollToVaccinePricing = () => {
    if (vaccinePricingRef.current) {
      vaccinePricingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Scroll to footer
  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsHandbookOpen(false);
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
      return campaigns[0];
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
      name: "Cẩm nang",
      icon: <FaInfo className="text-lg" />,
      dropdown: [
        {
          name: "Quy trình tiêm chủng",
          action: () => navigate("/quytrinh"),
        },
        {
          name: "Những lưu ý trước và sau khi tiêm chủng",
          action: () => navigate("/luuy"),
        },
        {
          name: "Những câu hỏi thường gặp",
          action: () => navigate("/cauhoi"),
        },
      ],
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
                  <div key={index} className="relative group">
                    <button
                      onClick={() => item.action && item.action()}
                      className="group flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium mt-1">
                        {item.name}
                      </span>
                      <span className="block h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-600 mt-1" />
                    </button>

                    {/* Dropdown cho Cẩm nang */}
                    {item.dropdown && (
                      <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.dropdown.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => {
                              subItem.action();
                              closeAllMenus();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
              <div className="hidden md:flex items-center space-x-4">
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
                <button
                  onClick={() => {
                    navigate("/bell");
                    closeAllMenus();
                  }}
                  className="relative p-2 bg-blue-50 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                  aria-label="Thông báo"
                >
                  <FaBell className="text-lg" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    2
                  </span>
                </button>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 rounded-full pr-4 pl-1 py-1 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                      {profileInitial}
                    </div>
                    <span className="font-medium text-blue-700 text-sm">
                      {customerData?.firstName?.length > 0
                        ? `${customerData.firstName}`
                        : "Tài khoản"}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                            {profileInitial}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-600">
                              Xin chào,
                            </h3>
                            <p className="text-base font-semibold text-blue-700">
                              {customerData?.firstName} {customerData?.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                      <nav className="py-2">
                        <button
                          onClick={() => {
                            navigate("/customer");
                            closeAllMenus();
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200"
                        >
                          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                            <FaUserCircle className="text-lg" />
                          </div>
                          <span className="text-sm font-medium">
                            Hồ sơ của tôi
                          </span>
                        </button>
                        {childData.map((child) => (
                          <button
                            key={child.childId}
                            onClick={() => {
                              navigate(`/customer/child/${child.childId}`);
                              closeAllMenus();
                            }}
                            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200"
                          >
                            <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-3">
                              <FaChild className="text-lg" />
                            </div>
                            <span className="text-sm font-medium">
                              Hồ sơ của {child.firstName} {child.lastName}
                            </span>
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            navigate("/customer/add-child");
                            closeAllMenus();
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition duration-200"
                        >
                          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                            <FaPlusCircle className="text-lg" />
                          </div>
                          <span className="text-sm font-medium">
                            Thêm hồ sơ mới cho con
                          </span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 transition duration-200 border-t border-gray-100 mt-1"
                        >
                          <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
                            <FaSignOutAlt className="text-lg" />
                          </div>
                          <span className="text-sm font-medium">Đăng xuất</span>
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Navigation Items */}
                  <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100">
                    {navItems.map((item, index) => (
                      <div key={index}>
                        <button
                          onClick={() => {
                            if (item.dropdown) {
                              setIsHandbookOpen(!isHandbookOpen);
                            } else {
                              item.action();
                              closeAllMenus();
                            }
                          }}
                          className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mb-2">
                            {item.icon}
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {item.name}
                          </span>
                        </button>
                        {/* Hiển thị dropdown trên mobile */}
                        {item.dropdown &&
                          isHandbookOpen &&
                          item.name === "Cẩm nang" && (
                            <div className="col-span-3 bg-gray-50 p-2 rounded-lg">
                              {item.dropdown.map((subItem, subIndex) => (
                                <button
                                  key={subIndex}
                                  onClick={() => {
                                    subItem.action();
                                    closeAllMenus();
                                  }}
                                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-blue-50"
                                >
                                  {subItem.name}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* User Profile Section */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        {profileInitial}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">
                          Xin chào,
                        </h3>
                        <p className="text-base font-semibold text-blue-700">
                          {customerData?.firstName} {customerData?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => {
                          navigate("/customer");
                          closeAllMenus();
                        }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-1">
                          <FaUserCircle className="text-lg" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          Hồ sơ
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/customer/add-child");
                          closeAllMenus();
                        }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-1">
                          <FaPlusCircle className="text-lg" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          Thêm con
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/bell");
                          closeAllMenus();
                        }}
                        className="flex flex-col items-center relative"
                      >
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-1">
                          <FaBell className="text-lg" />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            2
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          Thông báo
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/cart");
                          closeAllMenus();
                        }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-1">
                          <FaShoppingCart className="text-lg" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          Giỏ hàng
                        </span>
                      </button>
                    </div>
                    {childData.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">
                          Hồ sơ con của bạn:
                        </h4>
                        <div className="space-y-2">
                          {childData.map((child) => (
                            <button
                              key={child.childId}
                              onClick={() => {
                                navigate(`/customer/child/${child.childId}`);
                                closeAllMenus();
                              }}
                              className="w-full flex items-center p-2 rounded-lg bg-white hover:bg-teal-50 transition-colors"
                            >
                              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mr-3">
                                <FaChild className="text-lg" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {child.firstName} {child.lastName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 mt-4 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <FaSignOutAlt className="text-red-600" />
                      <span className="font-medium text-red-600">
                        Đăng xuất
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                      onClick={() => navigate("/book-vaccine")}
                    >
                      Đăng ký tiêm
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-6">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentSlide(index)}
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
        <AgeVaccine3 />

        {/* Price Vaccine */}
        <motion.section className="py-20 bg-white" ref={vaccinePricingRef}>
          <PriceVaccine />
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
                    <FaSyringe className="text-teal-600 text-3xl mr-4" />
                    <h3 className="text-2xl font-semibold text-teal-800">
                      Chiến Dịch Tiêm Chủng Gần Nhất
                    </h3>
                  </div>
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Mới
                  </span>
                </div>
                <p className="text-xl font-medium text-blue-700 mb-3 bg-blue-50 p-3 rounded-lg">
                  {getLatestCampaign().tittle}
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {getLatestCampaign().message}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Ngày:{" "}
                    <span className="font-medium">
                      {getLatestCampaign().date}
                    </span>
                  </p>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors duration-300">
                    Tìm Hiểu Thêm
                  </button>
                </div>
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
