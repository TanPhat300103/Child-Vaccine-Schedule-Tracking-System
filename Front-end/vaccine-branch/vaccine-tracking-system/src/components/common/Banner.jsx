// src/components/Banner.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";

const Banner = () => {
  return (
    <section
      id="banner"
      className="bg-primary py-24 text-center text-primary-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584515933487-779824d29309')] bg-cover bg-center opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
          Chăm Sóc Sức Khỏe Của Bạn
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fadeIn delay-100">
          Dịch vụ tiêm chủng chất lượng cao
        </p>
        <button className="px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg">
          Đăng Ký Tiêm
        </button>
      </div>
    </section>
  );
};

export default Banner;
