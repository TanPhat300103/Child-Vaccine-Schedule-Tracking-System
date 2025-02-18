import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-md"
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
          {["Trang chủ", "Dịch vụ", "Đặt lịch", "Giới thiệu"].map((item) => (
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
              <FaUser className="text-gray-700" />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => navigate("/customer")}
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
                <button
                  key={item}
                  onClick={() => navigate("/")}
                  className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
