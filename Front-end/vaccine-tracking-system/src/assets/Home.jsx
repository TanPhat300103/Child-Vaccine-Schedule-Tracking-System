import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaRegCalendarCheck,
  FaSyringe,
  FaTimes,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import VaccinationPackages from "../components/homepage/VaccineAge";
import VaccinePricingTable from "../components/homepage/VaccinePrice";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
      title: "Bảo Vệ Tương Lai Của Con Bạn",
    },
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
      title: "Dịch Vụ Chăm Sóc Sức Khỏe Chuyên Nghiệp",
    },
    {
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289",
      title: "Vắc-xin An Toàn và Đáng Tin Cậy",
    },
  ];

  const benefits = [
    {
      icon: <FaSyringe />,
      title: "Vắc-xin An Toàn",
      description: "Vắc-xin cho trẻ em được WHO phê duyệt",
    },
    {
      icon: <FaRegCalendarCheck />,
      title: "Đặt Lịch Dễ Dàng",
      description: "Hệ Thống Đặt Lịch Linh Hoạt",
    },
    {
      icon: <FaUserMd />,
      title: "Chăm Sóc Chuyên Sâu",
      description: "Đội Ngũ Y Tế Chuyên Nghiệp",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const scrollToVaccinePricingTable = () => {
    // Only scroll if ref is not null
    if (vaccinePricingRef.current) {
      vaccinePricingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
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
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-md`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            VaccineCare
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Trang chủ", "Đặt lịch", "Gói tiêm", "Liên lạc"].map((item) => (
              <motion.a
                key={item}
                onClick={() => {
                  if (item === "Gói tiêm") {
                    scrollToVaccinePricingTable(); // Cuộn đến phần VaccinePricingTable
                  }
                  if (item === "Liên lạc") {
                    scrollToFooter(); // Cuộn đến Footer
                  }
                  if (item === "Đặt lịch") {
                    navigate("/bookschedule-vaccine");
                  }
                }}
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 hover:text-blue-600 transition-colors relative group cursor-pointer"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform " />
              </motion.a>
            ))}
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

          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              Login
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {["Home", "Services", "Contact", "About"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === "Schedule") {
                        navigate("/bookschedule-vaccine");
                      } else if (item === "Home") {
                        navigate("/");
                      } else {
                        navigate(`/${item.toLowerCase()}`);
                      }
                    }}
                    className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    {item}
                  </button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors w-full"
                  onClick={() => navigate("/login")}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors w-full"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <section className="relative h-screen overflow-hidden">
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
                    onClick={() => navigate("/bookschedule-vaccine")}
                  >
                    Đăng ký tiêm
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="py-20 bg-white">
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
      </section>

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

      <VaccinationPackages></VaccinationPackages>

      <motion.section className="py-20 bg-white" ref={vaccinePricingRef}>
        <VaccinePricingTable />
      </motion.section>
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
            {[
              {
                step: 1,
                title: "Trước khi tiêm",
                icon: "💉",
                description: "Kiểm tra sức khỏe và tư vấn",
              },
              {
                step: 2,
                title: "Quá trình tiêm",
                icon: "👨‍⚕️",
                description: "Thực hiện tiêm chủng ở trung tâm",
              },
              {
                step: 3,
                title: "Sau khi tiêm",
                icon: "✅",
                description: "Theo dõi và chăm sóc sau tiêm",
              },
            ].map((item, index) => (
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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Địa Điểm Tiêm Chủng
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="h-[400px] bg-gray-100 rounded-xl overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.7!3d10.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzAwLjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1sen!2s!4v1629789456789!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </motion.div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  name: "Trung tâm Y tế Quận 1",
                  address: "123 Nguyễn Huệ, Quận 1",
                },
                { name: "Bệnh viện Nhi Đồng", address: "456 Lê Lợi, Quận 5" },
                { name: "Phòng khám Đa khoa", address: "789 CMT8, Quận 3" },
              ].map((location, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                  className="p-6 bg-blue-50 rounded-lg cursor-pointer"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {location.name}
                  </h3>
                  <p className="text-gray-600">{location.address}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={footerRef}>
        <Footer />
      </section>
    </div>
  );
};

export default App;
