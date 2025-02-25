import React, { useState, useEffect } from "react";
import { useCart } from "../homepage/AddCart"; // Sửa lại đường dẫn import đúng CartContext
import { getVaccinesByAge } from "../../apis/api";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AgeVaccine = () => {
  const [agePackages, setAgePackages] = useState({
    "0-2": [],
    "2-9": [],
    "9-18": [],
  });
  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart } = useCart(); // Sử dụng useCart để lấy addToCart từ CartContext
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data0to2 = await getVaccinesByAge(0, 2); // API cho nhóm tuổi 0-2
        const data2to9 = await getVaccinesByAge(2, 9); // API cho nhóm tuổi 2-9
        const data9to18 = await getVaccinesByAge(9, 18); // API cho nhóm tuổi 9-18

        setAgePackages({ "0-2": data0to2, "2-9": data2to9, "9-18": data9to18 });
        setSelectedPackage(data0to2); // Mặc định chọn nhóm tuổi 0-2
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };

    fetchVaccines();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[#1A365D] text-3xl md:text-4xl font-bold mb-8 text-center">
          Gói vắc xin theo độ tuổi
        </h1>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {Object.keys(agePackages).map((ageRange) => (
            <div
              key={ageRange}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div
                onClick={() => setSelectedPackage(agePackages[ageRange])}
                className="cursor-pointer bg-[#2C5DA3] text-white p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-xl font-semibold">{ageRange} tuổi</h2>
                  </div>
                </div>
                {selectedPackage === agePackages[ageRange] ? (
                  <IoMdArrowDropup className="text-2xl" />
                ) : (
                  <IoMdArrowDropdown className="text-2xl" />
                )}
              </div>

              {selectedPackage === agePackages[ageRange] && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-[#1A365D]">
                            Tên
                          </th>
                          <th className="text-left py-3 px-4 text-[#1A365D]">
                            Số lượng
                          </th>
                          <th className="text-left py-3 px-4 text-[#1A365D]">
                            Mô tả
                          </th>
                          <th className="text-left py-3 px-4 text-[#1A365D]">
                            Quốc gia
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
                        {agePackages[ageRange].map((vaccine) => (
                          <tr
                            key={vaccine.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">{vaccine.name}</td>
                            <td className="py-4 px-4">{vaccine.doseNumber}</td>
                            <td className="py-4 px-4">{vaccine.description}</td>
                            <td className="py-4 px-4">{vaccine.country}</td>
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
                              <button
                                onClick={() => navigate("/specific-vaccine")}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgeVaccine;
