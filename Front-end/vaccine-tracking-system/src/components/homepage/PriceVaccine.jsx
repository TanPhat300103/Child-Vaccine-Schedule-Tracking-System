import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import { useCart } from "../homepage/AddCart"; // Sử dụng useCart để lấy addToCart từ CartContext
import {
  getVaccineDetail,
  getVaccineDetailByVaccineId,
  getVaccines,
} from "../../apis/api"; // API lấy thông tin vắc xin
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  FaSyringe,
  FaCalendarAlt,
  FaFlask,
  FaGlobe,
  FaUserClock,
  FaDollarSign,
  FaBoxOpen,
  FaCalendarTimes,
  FaChartLine,
} from "react-icons/fa";

const PriceVaccine = () => {
  const [pricePackages, setPricePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vaccineData, setVaccineData] = useState({
    id: 6,
    vaccine: {
      vaccineId: "V001",
      name: "ROTARIX",
      description: "Rota virus",
      country: "USA",
      doseNumber: 2,
      price: 500000,
      ageMin: 0,
      ageMax: 2,
      active: true,
    },
    entryDate: "2025-01-01",
    expiredDate: "2027-01-01",
    img: "https://media.npr.org/assets/img/2020/12/02/gettyimages-1229766698-64a73144dc466cf359a800683891ac48eaa29966-s1200.jpg",
    quantity: 100,
    status: true,
    tolerance: 5,
    day: 30,
  });

  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart } = useCart(); // Lấy addToCart từ CartContext
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const filteredVaccines = pricePackages.filter(
    (vaccine) =>
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVaccinesByPriceAndCountry = filteredVaccines.filter(
    (vaccine) =>
      vaccine.price >= minPrice &&
      vaccine.price <= maxPrice &&
      (selectedCountry ? vaccine.country === selectedCountry : true)
  );

  useEffect(() => {
    if (!selectedVaccine?.vaccineId) return; // Kiểm tra nếu vaccineId tồn tại

    const fetchVaccineData = async () => {
      try {
        setLoading(true);
        const data = await getVaccineDetailByVaccineId(
          selectedVaccine.vaccineId
        );
        if (data?.length > 0) {
          setVaccineData(data[0]); // Cập nhật vaccineData khi có dữ liệu
          console.log("data vacccine: ", vaccineData);
        }
      } catch (error) {
        setError("Error fetching vaccine data");
        console.error("Error fetching vaccine data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccineData();
  }, [selectedVaccine]); // Chỉ gọi API khi selectedVaccine thay đổi

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await getVaccines();
        setPricePackages(data);
        setSelectedPackage(data); // Mặc định chọn tất cả các vắc xin
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bảng giá vắc xin:", error.message);
      }
    };

    fetchPriceData();
  }, []);

  const openModal = (vaccine) => {
    setSelectedVaccine(vaccine); // Cập nhật thông tin vắc xin được chọn
    setModalIsOpen(true); // Mở modal
  };

  const closeModal = () => {
    setModalIsOpen(false); // Đóng modal
    setSelectedVaccine(null); // Xóa thông tin vắc xin trong modal
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-gray-300"
            placeholder="Tìm kiếm vắc xin theo tên hoặc mô tả"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            className="w-1/2 p-3 rounded-lg border border-gray-300"
            placeholder="Giá tối thiểu"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(Math.floor(Number(e.target.value) / 100000) * 100000)
            } // Chỉ làm tròn theo bội số của 100000
            step="100000" // Điều này sẽ cho phép tăng giảm từng 100000
          />
          <input
            type="number"
            className="w-1/2 p-3 rounded-lg border border-gray-300 ml-4"
            placeholder="Giá tối đa"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(Math.floor(Number(e.target.value) / 100000) * 100000)
            } // Chỉ làm tròn theo bội số của 100000
            step="100000" // Điều này sẽ cho phép tăng giảm từng 100000
          />
        </div>

        <div className="mb-4">
          <select
            className="w-full p-3 rounded-lg border border-gray-300"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Chọn quốc gia</option>
            <option value="USA">USA</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Japan">Japan</option>
            <option value="Germany">Germany</option>
            <option value="UK">UK</option>
            <option value="France">France</option>
          </select>
        </div>

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
                <FaSyringe className="text-3xl" />
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
                      {filteredVaccinesByPriceAndCountry.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-4 text-gray-500"
                          >
                            Không có dữ liệu bảng giá vắc xin.
                          </td>
                        </tr>
                      ) : (
                        filteredVaccinesByPriceAndCountry.map((vaccine) => (
                          <tr
                            key={vaccine.vaccineId}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td
                              className="py-4 px-4 cursor-pointer"
                              onClick={() => openModal(vaccine)}
                            >
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
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal hiển thị chi tiết vắc xin */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Thông tin chi tiết vắc xin"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-30"
          ariaHideApp={false}
        >
          <div className="bg-white p-6 rounded-lg w-96">
            {selectedVaccine ? (
              <>
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-[#333333] flex items-center gap-3">
                    <FaSyringe className="text-[#4A90E2]" />
                    {vaccineData?.vaccine.name || "Vaccine Detail"}
                  </h1>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-[#333333]">
                  Thông tin chi tiết
                </h2>

                <div className="space-y-4">
                  <DetailRow
                    icon={<FaSyringe />}
                    label="Số liều"
                    value={vaccineData?.vaccine.doseNumber || "n"}
                  />
                  <DetailRow
                    icon={<FaFlask />}
                    label="Mô tả"
                    value={vaccineData?.vaccine.description || "n"}
                  />
                  <DetailRow
                    icon={<FaGlobe />}
                    label="Quốc gia sản xuất"
                    value={vaccineData?.vaccine.country || "n"}
                  />
                  <DetailRow
                    icon={<FaUserClock />}
                    label="Độ tuổi khuyến nghị"
                    value={`${vaccineData?.vaccine.ageMin} - ${vaccineData?.vaccine.ageMax} tuổi`}
                  />
                  <DetailRow
                    icon={<FaDollarSign />}
                    label="Giá vaccine"
                    value={vaccineData?.vaccine.price || "n"}
                  />
                </div>
              </>
            ) : (
              <div>Không có thông tin vắc xin</div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <span className="text-[#4A90E2] text-xl">{icon}</span>
    <span className="text-[#333333] min-w-[150px]">{label}:</span>
    <span className="text-[#333333] font-medium">{value}</span>
  </div>
);
export default PriceVaccine;
