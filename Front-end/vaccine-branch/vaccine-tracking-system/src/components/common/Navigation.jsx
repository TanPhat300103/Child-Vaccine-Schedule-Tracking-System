// eslint-disable-next-line no-unused-vars
import React from "react";

// eslint-disable-next-line react/prop-types
const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-secondary  p-4 sticky top-20 z-50 shadow-lg">
      <div className="container mx-auto">
        <ul className="hidden md:flex justify-center space-x-8 p-4">
          {[
            "Giới thiệu",
            "Gói tiêm",
            "Bảng giá",
            "Quy trình",
            "Địa điểm",
            "Liên hệ",
          ].map((item) => (
            <li
              key={item}
              className={`cursor-pointer hover:text-primary transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300 ${
                activeTab === item.toLowerCase()
                  ? "text-primary font-bold"
                  : "text-secondary-foreground"
              }`}
              onClick={() => setActiveTab(item.toLowerCase())}
            >
              {item === "Giới thiệu" ? (
                <a href="#introduction">{item}</a>
              ) : item === "Gói tiêm" ? (
                <a href="#vaccinepackages">{item}</a>
              ) : item === "Quy trình" ? (
                <a href="#vaccineprocess">{item}</a>
              ) : item === "Địa điểm" ? (
                <a href="#location">{item}</a>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
