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
  FaHospital,
  FaHeartbeat,
  FaShieldAlt,
  FaStethoscope,
  FaMedkit,
  FaCheck,
  FaSearch,
  FaMapMarkerAlt,
  FaComments,
  FaRegClock,
  FaUserPlus,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { slides, benefits, process } from "../stores/homedata.jsx";
import Footer from "../components/common/Footer";
import PriceVaccineGuest from "../components/homepage/PriceVaccineGuest.jsx";
import AgeVaccine2 from "../components/homepage/AgeVaccine2.jsx";
import LanguageSwitcher from "../components/translate/LanguageSwitcher.jsx";

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const feedbackContainerRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);
  const animationRef = useRef(null);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false); // Thêm trạng thái cho dropdown "Cẩm nang" trong mobile

  // Move slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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

  // Auto scroll feedback
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsHandbookOpen(false);
  };

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
  ];

  const enhancedBenefits = [
    {
      icon: <FaShieldAlt className="text-blue-500" />,
      title: "Bảo Vệ Sức Khỏe",
      description:
        "Vắc-xin giúp ngăn ngừa các bệnh truyền nhiễm nguy hiểm, bảo vệ sức khỏe cộng đồng.",
    },
    {
      icon: <FaHeartbeat className="text-blue-500" />,
      title: "Tăng Cường Miễn Dịch",
      description:
        "Tiêm chủng giúp cơ thể tăng cường khả năng miễn dịch, giảm nguy cơ mắc bệnh.",
    },
    {
      icon: <FaChild className="text-blue-500" />,
      title: "An Toàn Cho Trẻ Em",
      description:
        "Vắc-xin được kiểm định nghiêm ngặt, đảm bảo an toàn cho trẻ em và người lớn.",
    },
    {
      icon: <FaUserMd className="text-blue-500" />,
      title: "Chăm Sóc Chuyên Nghiệp",
      description:
        "Đội ngũ y bác sĩ giàu kinh nghiệm, tận tâm chăm sóc sức khỏe của bạn.",
    },
    {
      icon: <FaHospital className="text-blue-500" />,
      title: "Cơ Sở Vật Chất Hiện Đại",
      description:
        "Hệ thống phòng tiêm hiện đại, vô trùng, đảm bảo tiêu chuẩn y tế quốc tế.",
    },
    {
      icon: <FaStethoscope className="text-blue-500" />,
      title: "Theo Dõi Sau Tiêm",
      description:
        "Hệ thống theo dõi sức khỏe sau tiêm chủng, hỗ trợ 24/7 khi cần thiết.",
    },
  ];

  const features = [
    {
      icon: <FaCalendarCheck className="text-white text-2xl" />,
      title: "Đặt Lịch Trực Tuyến",
      description:
        "Đặt lịch tiêm chủng trực tuyến dễ dàng, tiết kiệm thời gian chờ đợi.",
    },
    {
      icon: <FaMedkit className="text-white text-2xl" />,
      title: "Đa Dạng Vắc-xin",
      description:
        "Cung cấp đầy đủ các loại vắc-xin trong và ngoài chương trình tiêm chủng.",
    },
    {
      icon: <FaRegClock className="text-white text-2xl" />,
      title: "Linh Hoạt Thời Gian",
      description:
        "Hoạt động 7 ngày/tuần, sáng chiều tối để phục vụ mọi nhu cầu của khách hàng.",
    },
    {
      icon: <FaUserPlus className="text-white text-2xl" />,
      title: "Hồ Sơ Điện Tử",
      description:
        "Lưu trữ thông tin tiêm chủng trên hệ thống điện tử, dễ dàng tra cứu.",
    },
  ];

  const enhancedProcess = [
    {
      step: 1,
      icon: <FaUserPlus className="text-blue-600" />,
      title: "Đăng Ký Tài Khoản",
      description:
        "Tạo tài khoản trực tuyến để quản lý lịch tiêm và theo dõi hồ sơ sức khỏe.",
    },
    {
      step: 2,
      icon: <FaCalendarCheck className="text-blue-600" />,
      title: "Đặt Lịch Tiêm Chủng",
      description:
        "Chọn ngày giờ phù hợp và loại vắc-xin phù hợp với nhu cầu của bạn.",
    },
    {
      step: 3,
      icon: <FaUserMd className="text-blue-600" />,
      title: "Khám Sàng Lọc",
      description:
        "Bác sĩ khám sức khỏe, tư vấn và đánh giá trước khi tiêm chủng.",
    },
    {
      step: 4,
      icon: <FaSyringe className="text-blue-600" />,
      title: "Tiêm Vắc-xin",
      description:
        "Quy trình tiêm chủng an toàn, vô trùng theo tiêu chuẩn y tế quốc tế.",
    },
    {
      step: 5,
      icon: <FaRegClock className="text-blue-600" />,
      title: "Theo Dõi Sau Tiêm",
      description:
        "Theo dõi sức khỏe 30 phút sau tiêm tại trung tâm để đảm bảo an toàn.",
    },
    {
      step: 6,
      icon: <FaComments className="text-blue-600" />,
      title: "Nhận Thông Báo Nhắc Lịch",
      description:
        "Hệ thống tự động gửi thông báo nhắc lịch tiêm mũi tiếp theo.",
    },
  ];

  const stats = [
    {
      value: "50,000+",
      label: "Khách hàng",
      icon: <FaUser className="text-blue-500" />,
    },
    {
      value: "99.8%",
      label: "Độ hài lòng",
      icon: <FaHeartbeat className="text-blue-500" />,
    },
    {
      value: "30+",
      label: "Bác sĩ chuyên khoa",
      icon: <FaUserMd className="text-blue-500" />,
    },
    {
      value: "100+",
      label: "Loại vắc-xin",
      icon: <FaSyringe className="text-blue-500" />,
    },
  ];

  const faqs = [
    {
      question: "Tôi cần chuẩn bị gì trước khi đi tiêm chủng?",
      answer:
        "Bạn nên ăn uống đầy đủ, mang theo sổ tiêm chủng (nếu có), thẻ BHYT và giấy tờ tùy thân. Đối với trẻ em, phụ huynh nên mang theo sổ theo dõi sức khỏe của bé.",
    },
    {
      question: "Sau khi tiêm vắc-xin có thể có những phản ứng gì?",
      answer:
        "Sau tiêm chủng có thể xuất hiện một số phản ứng nhẹ như đau tại chỗ tiêm, sốt nhẹ, mệt mỏi. Các triệu chứng này thường tự khỏi sau 1-2 ngày và là dấu hiệu bình thường cho thấy cơ thể đang tạo ra phản ứng miễn dịch.",
    },
    {
      question: "Trung tâm có các gói vắc-xin nào cho trẻ em?",
      answer:
        "Chúng tôi cung cấp đầy đủ các gói vắc-xin trong và ngoài chương trình tiêm chủng mở rộng như: gói vắc-xin cơ bản, gói vắc-xin 5 trong 1, 6 trong 1, vắc-xin phòng Rotavirus, Thủy đậu, HPV, và nhiều loại khác.",
    },
    {
      question: "Làm thế nào để đặt lịch tiêm chủng online?",
      answer:
        "Bạn có thể đăng ký tài khoản trên trang web, sau đó chọn mục 'Đặt lịch tiêm', điền thông tin cá nhân, chọn loại vắc-xin và thời gian mong muốn. Hệ thống sẽ xác nhận lịch hẹn qua SMS hoặc email.",
    },
  ];

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

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 focus:outline-none hover:bg-blue-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <FaBars className="text-lg" />
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
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
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-16 left-0 right-0 z-40 bg-white shadow-lg rounded-b-xl overflow-hidden md:hidden"
              >
                <div className="p-4 flex flex-col space-y-4">
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
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                      >
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </button>
                      {/* Hiển thị dropdown trên mobile */}
                      {item.dropdown &&
                        isHandbookOpen &&
                        item.name === "Cẩm nang" && (
                          <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                            {item.dropdown.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                onClick={() => {
                                  subItem.action();
                                  closeAllMenus();
                                }}
                                className="w-full text-left p-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        navigate("/login");
                        closeAllMenus();
                      }}
                      className="p-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-center"
                    >
                      Đăng Nhập
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        closeAllMenus();
                      }}
                      className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                    >
                      Đăng Ký
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-white opacity-70 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4">
                Bảo vệ sức khỏe <br />
                <span className="text-blue-600">cho mọi gia đình</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                VaccineCare cung cấp dịch vụ tiêm chủng chất lượng cao với đội
                ngũ y bác sĩ chuyên nghiệp, giúp bảo vệ sức khỏe toàn diện cho
                bạn và gia đình.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Đặt lịch ngay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToVaccinePricing}
                  className="px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Xem gói vaccine
                </motion.button>
              </div>
              <div className="mt-8 flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/${
                          item % 2 === 0 ? "men" : "women"
                        }/${item * 10}.jpg`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-800">4.9/5</div>
                  <div className="text-gray-500">
                    Đánh giá từ hơn 10,000+ khách hàng
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309"
                  alt="Healthcare"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FaCheck className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      100% An toàn
                    </div>
                    <div className="text-xs text-gray-500">
                      Tiêu chuẩn quốc tế
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FaUserMd className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      Bác sĩ chuyên môn
                    </div>
                    <div className="text-xs text-gray-500">
                      Nhiều năm kinh nghiệm
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4"
            >
              Lợi Ích Vắc-xin
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              Tại sao nên tiêm vắc-xin tại VaccineCare?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Chúng tôi cam kết mang đến dịch vụ tiêm chủng chất lượng cao, an
              toàn và hiệu quả với đội ngũ y bác sĩ giàu kinh nghiệm.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {enhancedBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="p-4 bg-blue-50 rounded-full inline-block mb-4 text-3xl">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Dịch Vụ Nổi Bật
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/80 max-w-2xl mx-auto"
            >
              Khám phá những tiện ích vượt trội mà VaccineCare mang đến để nâng
              cao trải nghiệm chăm sóc sức khỏe của bạn.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Vaccine */}
      <AgeVaccine2 />

      {/* Price Vaccine */}
      <motion.section className="py-20 bg-white" ref={vaccinePricingRef}>
        <PriceVaccineGuest />
      </motion.section>

      {/* Process Section */}
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
            {enhancedProcess.map((item, index) => (
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Khách Hàng Nói Gì Về Chúng Tôi
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

      {/* FAQ Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            Câu Hỏi Thường Gặp
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
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
