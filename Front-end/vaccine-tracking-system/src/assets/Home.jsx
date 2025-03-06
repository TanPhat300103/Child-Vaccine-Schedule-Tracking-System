import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaBell,
  FaShoppingCart,
  FaSyringe,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { slides, benefits, process } from "../stores/homedata.jsx";
import PriceVaccine from "../components/homepage/PriceVaccine.jsx";
import AgeVaccine from "../components/homepage/AgeVaccine.jsx";
import Footer from "../components/common/Footer";
import { useCart } from "../components/homepage/AddCart.jsx"; // Đảm bảo đúng đường dẫn đến CartContext
import { getChildByCustomerId, getCustomerId } from "../apis/api.js";
import { useAuth } from "../components/common/AuthContext.jsx";

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
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const data = fetch("http://localhost:8080/auth/myprofile", {
      method: "GET",
      credentials: "include", // Gửi cookie/session
    })
      .then((response) => {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
      });
    setProFileData(data);
    console.log("my profile data: ", proFileData);
  }, []);
  // take data
  console.log("user id la: ", userInfo.authorities[0].authority);

  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((total, vaccine) => total + 1, 0);
  }, [cart]);
  localStorage.setItem("userId", userInfo.userId);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
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
                    navigate("/customer/booking");
                  }
                  if (item === "Trang chủ") {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth", // Cuộn mượt mà lên đầu trang
                    });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 hover:text-blue-600 transition-colors relative group cursor-pointer"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform " />
              </motion.a>
            ))}{" "}
            {/* User */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200"
              >
                <FaUser className="text-white" size={20} />
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-white border rounded-lg shadow-xl border-gray-200">
                  <button
                    onClick={() => navigate("/customer")}
                    className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                  >
                    {customerData.firstName} {customerData.lastName}
                  </button>
                  <button
                    onClick={() => navigate("/customer")}
                    className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                  >
                    Hồ sơ của tôi
                  </button>

                  {/* Loop through children from the API and display their profiles */}
                  {childData.map((child) => (
                    <button
                      key={child.childId}
                      onClick={() =>
                        navigate(`/customer/child/${child.childId}`)
                      }
                      className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                    >
                      Hồ sơ của {child.firstName} {child.lastName}
                    </button>
                  ))}

                  <button
                    onClick={() => navigate("/customer/add-child")}
                    className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                  >
                    Thêm hồ sơ mới cho con
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-b-lg hover:bg-gray-100 focus:outline-none"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
            {/* Icon Cart */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer ml-4"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart
                size={24}
                className="text-blue-600 hover:text-blue-700"
              />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </motion.div>
            {/* Icon Bell */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer ml-4"
              onClick={() => navigate("/bell")}
            >
              <FaBell size={24} className="text-blue-600 hover:text-blue-700" />
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </motion.div>
          </nav>
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
      <AgeVaccine></AgeVaccine>

      {/* Combo Vaccine */}
      {/* <ComboVaccine></ComboVaccine> */}

      {/* Price Vaccine */}
      <motion.section className="py-20 bg-white" ref={vaccinePricingRef}>
        <PriceVaccine></PriceVaccine>
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

export default Home;
