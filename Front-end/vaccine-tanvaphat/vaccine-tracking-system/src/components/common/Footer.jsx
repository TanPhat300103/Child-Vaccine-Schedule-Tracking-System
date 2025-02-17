// src/components/Footer.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">FOOTER</h2>
          <p className="mb-4">
            © 2024 Dịch Vụ Tiêm Chủng. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <FaPhone className="text-2xl cursor-pointer hover:text-opacity-80 transition-opacity" />
            <FaEnvelope className="text-2xl cursor-pointer hover:text-opacity-80 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
