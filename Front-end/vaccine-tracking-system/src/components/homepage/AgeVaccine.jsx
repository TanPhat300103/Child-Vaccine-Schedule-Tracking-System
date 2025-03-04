import React, { useEffect, useState } from "react";
import { FaSyringe } from "react-icons/fa";
import { MdChildCare } from "react-icons/md";
import { useCart } from "./AddCart";
import { useNavigate } from "react-router-dom";
import { getVaccinesByAge } from "../../apis/api";

const AgeVaccine = () => {
  const [selectedAge, setSelectedAge] = useState("0-2");
  const [agePackages, setAgePackages] = useState({
    "0-2": [],
    "2-9": [],
    "9-18": [],
  });
  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // take api vaccine by age
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data0to2 = await getVaccinesByAge(0, 2);
        const data2to9 = await getVaccinesByAge(2, 9);
        const data9to18 = await getVaccinesByAge(9, 18);

        setAgePackages({ "0-2": data0to2, "2-9": data2to9, "9-18": data9to18 });
        setSelectedPackage(data0to2);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchVaccines();
  }, []);

  // Cập nhật gói vắc xin khi thay đổi độ tuổi
  const vaccinesToDisplay = agePackages[selectedAge] || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-8">
        Gói Vắc Xin Theo Độ Tuổi Cho Trẻ
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.keys(agePackages).map((ageRange, index) => (
          <button
            key={ageRange}
            onClick={() => setSelectedAge(ageRange)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              selectedAge === ageRange
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-900 hover:bg-blue-50"
            } shadow-md`}
          >
            {<MdChildCare className="text-2xl" />}
            {ageRange}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaccinesToDisplay.map((vaccine) => (
          <div
            key={vaccine.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={1}
                alt={1}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1584362917165-526a968579e8";
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {vaccine.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FaSyringe />
                <span>Số lượng: {vaccine.doseNumber}</span>
              </div>
              <p className="text-gray-600 mb-4">
                Phòng bệnh {vaccine.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">
                  {vaccine.price} VND
                </span>
                <button
                  onClick={() =>
                    navigate("/specific-vaccine", {
                      state: { vaccineId: vaccine.vaccineId },
                    })
                  }
                  className="px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => {
                    addToCart(vaccine); // Thêm vắc xin vào giỏ
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedPackage.includes(vaccine.id)
                      ? "bg-[#5D90D4] text-white"
                      : "bg-gray-100 text-[#1A365D] hover:bg-[#2C5DA3] hover:text-white"
                  }`}
                >
                  {selectedPackage.includes(vaccine.id) ? "Đã chọn" : "Chọn"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeVaccine;
