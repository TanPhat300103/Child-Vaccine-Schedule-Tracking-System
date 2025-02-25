import React, { useState, useEffect } from "react";
import { useCart } from "../homepage/AddCart"; // Sử dụng useCart để lấy addToCart từ CartContext
import { getVaccines } from "../../apis/api"; // API lấy thông tin vắc xin
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaSyringe } from "react-icons/fa"; // Biểu tượng kim tiêm

const PriceVaccine = () => {
  const [pricePackages, setPricePackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart } = useCart(); // Lấy addToCart từ CartContext

  // Fetch price data from API
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await getVaccines(); // API lấy tất cả vắc xin
        setPricePackages(data);
        setSelectedPackage(data); // Mặc định chọn tất cả các vắc xin
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bảng giá vắc xin:", error.message);
      }
    };

    fetchPriceData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[#1A365D] text-3xl md:text-4xl font-bold mb-8 text-center">
          Bảng Giá Vắc Xin
        </h1>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div
              onClick={() => setSelectedPackage(pricePackages)}
              className="cursor-pointer bg-[#2C5DA3] text-white p-6 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <FaSyringe className="text-3xl" /> {/* Biểu tượng kim tiêm */}
                <h2 className="text-xl font-semibold">Tất cả vắc xin</h2>
              </div>
              {selectedPackage === pricePackages ? (
                <IoMdArrowDropup className="text-2xl" />
              ) : (
                <IoMdArrowDropdown className="text-2xl" />
              )}
            </div>

            {selectedPackage === pricePackages && (
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-[#1A365D]">
                          Tên
                        </th>
                        <th className="text-left py-3 px-4 text-[#1A365D]">
                          Phòng bệnh
                        </th>
                        <th className="text-left py-3 px-4 text-[#1A365D]">
                          Nước sản xuất
                        </th>
                        <th className="text-left py-3 px-4 text-[#1A365D]">
                          Số mũi
                        </th>
                        <th className="text-left py-3 px-4 text-[#1A365D]">
                          Giá
                        </th>
                        <th className="text-left py-3 px-4 text-[#1A365D]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricePackages.length > 0 ? (
                        pricePackages.map((vaccine) => (
                          <tr
                            key={vaccine.vaccineId}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              {/* Biểu tượng kim tiêm */}
                              {vaccine.name}
                            </td>
                            <td className="py-4 px-4">{vaccine.description}</td>
                            <td className="py-4 px-4">{vaccine.country}</td>
                            <td className="py-4 px-4">{vaccine.doseNumber}</td>
                            <td className="py-4 px-4">{vaccine.price}</td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => addToCart(vaccine)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  selectedPackage.includes(vaccine.id)
                                    ? "bg-[#5D90D4] text-white"
                                    : "bg-gray-100 text-[#1A365D] hover:bg-[#2C5DA3] hover:text-white"
                                }`}
                              >
                                {selectedPackage.includes(vaccine.id)
                                  ? "Selected"
                                  : "Select"}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-4 text-gray-500"
                          >
                            Không có dữ liệu bảng giá vắc xin.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceVaccine;
