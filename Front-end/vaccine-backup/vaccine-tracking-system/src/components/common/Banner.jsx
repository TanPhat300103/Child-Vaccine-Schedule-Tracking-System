import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
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
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Đăng ký tiêm
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Banner;
