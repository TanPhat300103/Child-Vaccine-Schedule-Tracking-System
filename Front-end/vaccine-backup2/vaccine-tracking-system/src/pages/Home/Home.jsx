import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaBars,
  FaTimes,
  FaSyringe,
  FaRegCalendarCheck,
  FaUserMd,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309",
      title: "Protect Your Child's Future",
    },
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
      title: "Professional Healthcare Service",
    },
    {
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289",
      title: "Safe and Reliable Vaccines",
    },
  ];

  const benefits = [
    {
      icon: <FaSyringe />,
      title: "Safe Vaccines",
      description: "WHO-approved vaccines for children",
    },
    {
      icon: <FaRegCalendarCheck />,
      title: "Easy Scheduling",
      description: "Flexible appointment system",
    },
    {
      icon: <FaUserMd />,
      title: "Expert Care",
      description: "Professional medical staff",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollPosition > 50
            ? "bg-white/80 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold text-blue-600"
          >
            VaccineCare
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Services", "Schedule", "About"].map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ scale: 1.05 }}
                className="text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </motion.a>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                👤
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => navigate("/manage-account")}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Manage Account
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
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
                {["Home", "Services", "Schedule", "About"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    {item}
                  </a>
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
            Vaccine Benefits
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
                Protect Your Family With Quality Healthcare
              </h2>
              <p className="text-gray-600 mb-8">
                Experience world-class vaccination services with our team of
                expert healthcare professionals.
              </p>
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-blue-600"
                >
                  <FaUserMd className="text-2xl mr-2" />
                  <span>Expert Doctors</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-blue-600"
                >
                  <FaSyringe className="text-2xl mr-2" />
                  <span>Quality Vaccines</span>
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

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="space-y-4">
                {["Basic Package", "Standard Package", "Premium Package"].map(
                  (pkg, index) => (
                    <motion.div
                      key={pkg}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      {pkg}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-bold mb-4">Package Details</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Included Vaccines</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center">
                      <FaSyringe className="text-blue-500 mr-2" />
                      <span>Core Vaccinations</span>
                    </li>
                    <li className="flex items-center">
                      <FaSyringe className="text-blue-500 mr-2" />
                      <span>Booster Shots</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
            Pricing Details
          </motion.h2>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left">Vaccine Type</th>
                  <th className="px-6 py-4 text-left">Age Group</th>
                  <th className="px-6 py-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Basic Immunization",
                    age: "0-1 years",
                    price: "$100",
                  },
                  { type: "Booster Shots", age: "1-5 years", price: "$150" },
                  { type: "Advanced Package", age: "5+ years", price: "$200" },
                ].map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 border-t">{item.type}</td>
                    <td className="px-6 py-4 border-t">{item.age}</td>
                    <td className="px-6 py-4 border-t">{item.price}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

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
                description: "Thực hiện tiêm chủng an toàn",
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

      <footer className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold mb-4">VaccineCare</h3>
              <p className="text-blue-200">Chăm sóc sức khỏe tận tâm</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
              <p className="text-blue-200">Hotline: 1900 1234</p>
              <p className="text-blue-200">Email: info@vaccinecare.com</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold mb-4">Thanh Toán</h3>
              <div className="flex space-x-4">
                {["💳", "🏦", "📱"].map((icon, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-2xl cursor-pointer hover:text-blue-300 transition-colors"
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                {["📘", "📸", "🐦"].map((icon, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-2xl cursor-pointer hover:text-blue-300 transition-colors"
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-800 text-center text-blue-200">
            © 2024 VaccineCare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
