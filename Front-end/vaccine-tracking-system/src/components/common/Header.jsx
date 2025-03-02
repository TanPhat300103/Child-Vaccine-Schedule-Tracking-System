import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getChildByCustomerId, getCustomerId } from "../../apis/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [childData, setChildData] = useState(null);

  // take data
  const UserId = localStorage.getItem("userId");

  // take api customerByid
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerId(UserId);
        setCustomerData(data);
        console.log("customer data: ", customerData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchCustomer();
  }, []);

  // take api childByCustomerId
  useEffect(() => {
    const fetchChild = async () => {
      try {
        const data = await getChildByCustomerId(UserId);
        setChildData(data);
        console.log("child data: ", childData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchChild();
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
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-md`}
      style={{ marginTop: "-0px" }}
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
                  navigate("/book-vaccine3");
                }
                if (item === "Trang chủ") {
                  navigate("/home");
                }
              }}
              whileHover={{ scale: 1.05 }}
              className="text-gray-700 hover:text-blue-600 transition-colors relative group cursor-pointer"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform " />
            </motion.a>
          ))}{" "}
          {/* User */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              <FaUser className="text-white" size={20} />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-68 bg-white border rounded-lg shadow-xl border-gray-200">
                <button
                  onClick={() => navigate("/customer")}
                  className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                >
                  {customerData.firstName} {customerData.lastName}
                </button>
                <button
                  onClick={() => navigate("/customer")}
                  className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                >
                  Hồ sơ của tôi
                </button>

                {/* Loop through children from the API and display their profiles */}
                {childData.map((child) => (
                  <button
                    key={child.childId}
                    onClick={() => navigate(`/child/${child.childId}`)}
                    className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                  >
                    Hồ sơ của {child.firstName} {child.lastName}
                  </button>
                ))}

                <button
                  onClick={() => navigate("/child")}
                  className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-t-lg hover:bg-gray-100 focus:outline-none"
                >
                  Thêm hồ sơ mới cho con
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="block w-full px-4 py-3 text-gray-700 font-medium text-left rounded-b-lg hover:bg-gray-100 focus:outline-none"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
          {/* Icon Cart */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer ml-4"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart
              size={24}
              className="text-blue-600 hover:text-blue-700"
            />
          </motion.div>
          {/* Icon Bell */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer ml-4"
            onClick={() => navigate("/bell")}
          >
            <FaBell size={24} className="text-blue-600 hover:text-blue-700" />
            <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
};
export default Header;
