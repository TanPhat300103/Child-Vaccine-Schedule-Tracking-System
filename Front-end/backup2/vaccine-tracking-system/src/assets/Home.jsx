import React, { useState, useEffect, useRef } from "react";
import { FaSyringe, FaUser, FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { slides, benefits, process, address } from "../stores/homedata.jsx";
import PriceVaccine from "../components/homepage/PriceVaccine.jsx";
import AgeVaccine from "../components/homepage/AgeVaccine.jsx";
import Footer from "../components/common/Footer";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const vaccinePricingRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();

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
                    navigate("/book-vaccine");
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
            {/* Login and signup */}
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

      {/* Vaccine Age */}
      <AgeVaccine></AgeVaccine>

      {/* Vaccine Price */}
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

      {/* Address */}
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
              {address.map((location, index) => (
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

      {/* Footer */}
      <section ref={footerRef}>
        <Footer />
      </section>
    </div>
  );
};

export default Home;
