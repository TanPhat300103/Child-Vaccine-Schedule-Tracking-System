import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCcVisa } from "react-icons/fa";

const Footer = React.forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-blue-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Vaccine Care */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">VaccineCare</h3>
            <p className="text-blue-200">Chăm sóc sức khỏe tận tâm</p>
          </motion.div>

          {/* Contact */}
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

          {/* Payment */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">Thanh Toán</h3>
            <div className="flex space-x-4">
              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="cursor-pointer hover:text-blue-300 transition-colors"
              >
                <FaCcVisa size={38} /> {/* 👉 Đổi từ mặc định lên 48px */}
              </motion.span>

              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="cursor-pointer transition"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKI_9kyJ25O7eXCdYn9HwMWyEsW2KwAMF3BQ&s"
                  alt="ZaloPay"
                  className="w-10 h-9"
                />
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="cursor-pointer transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                  alt="MoMo"
                  className="w-10 h-10"
                />
              </motion.span>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  className="w-10 h-10"
                />
              </motion.a>

              <motion.a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer transition"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                  alt="Instagram"
                  className="w-10 h-10"
                />
              </motion.a>

              <motion.a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer transition"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ86SP3Qgs-uyKvxqd6owBa1UsVW5blMYEzlw&s"
                  alt="Zalo"
                  className="w-10 h-10"
                />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-800 text-center text-blue-200">
          © 2024 VaccineCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
});

export default Footer;
