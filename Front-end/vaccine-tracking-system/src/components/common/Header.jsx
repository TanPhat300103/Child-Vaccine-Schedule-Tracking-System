import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChildByCustomerId, getCustomerId } from "../../apis/api";
import LanguageSwitcher from "../translate/LanguageSwitcher";
import {
  FaSyringe,
  FaCalendarCheck,
  FaUserMd,
  FaInfo,
  FaUserCircle,
  FaSignOutAlt,
  FaChild,
  FaPlusCircle,
  FaBell,
  FaShoppingCart,
  FaChartLine,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
  });
  const [childData, setChildData] = useState([]);
  const navigate = useNavigate();
  const UserId = localStorage.getItem("userId");

  // lay api customer
  useEffect(() => {
    const fetchData = async () => {
      if (UserId) {
        try {
          const customerRes = await getCustomerId(UserId);
          setCustomerData(customerRes);

          const childRes = await getChildByCustomerId(UserId);
          setChildData(childRes);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      }
    };

    fetchData();
  }, [UserId]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation functions
  const scrollToVaccinePricing = () => {
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

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
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
                  <span className="text-sm font-medium mt-1">{item.name}</span>
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
              {/* Notification badge */}
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
                  {/* Header section */}
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

                  {/* Menu items */}
                  <nav className="py-2">
                    {/* Main profile */}
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
                      <span className="text-sm font-medium">Hồ sơ của tôi</span>
                    </button>

                    {/* Child profiles */}
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

                    {/* Add new child profile */}
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

                    {/* Logout */}
                    <button
                      onClick={() => {
                        navigate("/");
                        closeAllMenus();
                      }}
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
            <LanguageSwitcher></LanguageSwitcher>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Navigation Items */}
              <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      closeAllMenus();
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

                {/* Action buttons */}
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

                {/* Child profiles section */}
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

                {/* Logout button */}
                <button
                  onClick={() => {
                    navigate("/");
                    closeAllMenus();
                  }}
                  className="w-full flex items-center justify-center space-x-2 mt-4 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <FaSignOutAlt className="text-red-600" />
                  <span className="font-medium text-red-600">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
