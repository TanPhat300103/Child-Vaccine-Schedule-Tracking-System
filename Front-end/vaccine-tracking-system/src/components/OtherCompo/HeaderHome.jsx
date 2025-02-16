// src/components/Header.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const HeaderHome = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="bg-primary p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center transition-transform hover:scale-105">
          <img
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528"
            alt="Logo"
            className="h-12 w-auto cursor-pointer rounded-lg"
          />
        </div>

        <div className="hidden md:flex items-center flex-1 mx-8">
          <div className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring bg-white/90 backdrop-blur-sm"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-accent hover:text-primary cursor-pointer" />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/child">
            <button className="px-6 py-2 text-primary-foreground border-2 border-primary-foreground rounded-lg hover:bg-primary-foreground hover:text-primary transition-all duration-300 font-semibold">
              User
            </button>
          </Link>
        </div>

        <button
          className="md:hidden text-primary-foreground transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </header>
  );
};

export default HeaderHome;
