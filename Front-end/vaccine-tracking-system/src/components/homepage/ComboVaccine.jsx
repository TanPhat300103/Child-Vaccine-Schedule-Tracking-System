import React, { useEffect, useState } from "react";
import { FaSyringe, FaRegCalendarCheck, FaInfoCircle } from "react-icons/fa";
import { MdChildCare, MdClose } from "react-icons/md";
import { useCart } from "./AddCart";
import { useNavigate } from "react-router-dom";
import { getVaccineCombos, getVaccinesByAge } from "../../apis/api";

const ComboVaccine = () => {
  const [selectedAge, setSelectedAge] = useState("0-2");
  const [vaccineData, setVaccineData] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // take api vaccine by age
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data = await getVaccineCombos();
        setVaccineData(data);
        console.log("vaccine combo data: ", vaccineData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc xin:", error.message);
      }
    };
    fetchVaccines();
  }, []);
  const handleSelectVaccine = (e, vaccine) => {
    // Ngừng sự kiện mặc định khi click vào button chọn
    e.stopPropagation();

    // Kiểm tra vaccine có trong selectedPackage không
    if (selectedPackage.includes(vaccine.vaccineComboId)) {
      console.log("removed: ");
      // Nếu có, bỏ vaccine đó ra khỏi danh sách và xóa khỏi giỏ hàng
      setSelectedPackage((prev) =>
        prev.filter((id) => id !== vaccine.vaccineComboId)
      );
      removeFromCart(vaccine.vaccineComboId); // Gọi hàm để bỏ vaccine khỏi giỏ hàng
    } else {
      console.log("added");
      // Nếu không có, thêm vaccine vào danh sách và thêm vào giỏ hàng
      setSelectedPackage((prev) => [...prev, vaccine.vaccineComboId]);
      addToCart(vaccine); // Thêm vaccine vào giỏ hàng
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-8">
          Gói Combo Vắc Xin
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaccineData.map((vaccine) => (
            <div
              key={vaccine.vaccineComboId}
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

                <p className="text-gray-600 mb-4">
                  Phòng bệnh {vaccine.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">
                    {vaccine.priceCombo.toLocaleString()} VND
                  </span>
                  <button
                    onClick={() =>
                      navigate("/specific-combo", {
                        state: { vaccineComboId: vaccine.vaccineComboId },
                      })
                    }
                    className="px-4 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComboVaccine;
