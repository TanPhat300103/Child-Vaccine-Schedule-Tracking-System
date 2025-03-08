import React, { useState, useEffect } from "react";
import { useCart } from "./AddCart";
import { getVaccineDetailByVaccineId, getVaccines } from "../../apis/api";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  FaDollarSign,
  FaFlask,
  FaGlobe,
  FaSyringe,
  FaUserClock,
} from "react-icons/fa";
import Modal from "react-modal"; // Ensure Modal is imported
import { Slider } from "@mui/material";
import { styled } from "@mui/system";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const CustomSlider = styled(Slider)(`
  color: #1E90FF;
  height: 8px;
  .MuiSlider-thumb {
    height: 24px;
    width: 24px;
    background-color: #fff;
    border: 2px solid #1E90FF;
    &:focus, &:hover, &.Mui-active, &.Mui-focusVisible {
      boxShadow: inherit;
    }
  }
`);

const PriceVaccineGuest = () => {
  const [pricePackages, setPricePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const { addToCart, removeFromCart } = useCart();
  const [selectedAgeRange, setSelectedAgeRange] = useState("");

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
  // handle slider value change for price range
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };
  const CustomSlider = styled(Slider)(`
  color: #1E90FF;
  height: 8px;
  .MuiSlider-thumb {
    height: 24px;
    width: 24px;
    background-color: #fff;
    border: 2px solid #1E90FF;
    &:focus, &:hover, &.Mui-active, &.Mui-focusVisible {
      boxShadow: inherit;
    }
  }
`);
  // Fetch vaccine details when a vaccine is selected
  useEffect(() => {
    if (!selectedVaccine?.vaccineId) return;

    const fetchVaccineData = async () => {
      try {
        setLoading(true);
        const data = await getVaccineDetailByVaccineId(
          selectedVaccine.vaccineId
        );
        if (data?.length > 0) {
          setVaccineData(data[0]);
          console.log("data vacccine: ", vaccineData);
        }
      } catch (error) {
        console.error("Error fetching vaccine data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccineData();
  }, [selectedVaccine]);

  // Fetch list of vaccines on load
  useEffect(() => {
    const fetchVaccineData = async () => {
      try {
        setLoading(true);
        const data = await getVaccines();
        setPricePackages(data);
      } catch (error) {
        console.error("Error fetching vaccine price data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVaccineData();
  }, []);

  // Filter vaccines by name, description, price, and country
  const filteredVaccines = pricePackages.filter(
    (vaccine) =>
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVaccinesByPriceAndAge = filteredVaccines.filter((vaccine) => {
    let isPriceValid = vaccine.price >= minPrice && vaccine.price <= maxPrice;
    let isAgeValid = true;

    // Lọc theo độ tuổi nếu có lựa chọn
    if (selectedAgeRange) {
      const [minAge, maxAge] = selectedAgeRange.split("-").map(Number);
      isAgeValid = vaccine.ageMin >= minAge && vaccine.ageMax <= maxAge;
    }

    // Lọc theo quốc gia nếu có lựa chọn
    let isCountryValid = true;
    if (selectedCountry) {
      isCountryValid = vaccine.country === selectedCountry;
    }

    return isPriceValid && isAgeValid && isCountryValid;
  });

  // Open modal for vaccine details

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVaccine(null);
  };

  // Handle selecting vaccine and adding it to cart
  const handleSelectVaccine = (e, vaccine) => {
    // Ngừng sự kiện mặc định khi click vào button chọn
    e.stopPropagation();

    // Kiểm tra vaccine có trong selectedPackage không
    if (selectedPackage.includes(vaccine.vaccineId)) {
      console.log("removed: ");
      // Nếu có, bỏ vaccine đó ra khỏi danh sách và xóa khỏi giỏ hàng
      setSelectedPackage((prev) =>
        prev.filter((id) => id !== vaccine.vaccineId)
      );
      removeFromCart(vaccine.vaccineId); // Gọi hàm để bỏ vaccine khỏi giỏ hàng
    } else {
      console.log("added");
      // Nếu không có, thêm vaccine vào danh sách và thêm vào giỏ hàng
      setSelectedPackage((prev) => [...prev, vaccine.vaccineId]);
      addToCart(vaccine); // Thêm vaccine vào giỏ hàng
    }
  };

  // Mở modal chỉ khi click vào vaccine
  const openModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setModalIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <button
            className="md:hidden flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-lg"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <FiFilter className="mr-2" />
            Bộ lọc
          </button>

          <div
            className={`w-full md:w-64 ${
              isMobileFilterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Khoảng giá</h3>
                <CustomSlider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={3000000}
                  valueLabelFormat={(value) => `${value.toLocaleString()} VND`}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{priceRange[0].toLocaleString()} VND</span>
                  <span>{priceRange[1].toLocaleString()} VND</span>
                </div>
              </div>
              {/* Lọc theo độ tuổi */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Độ tuổi khuyến nghị
                </h3>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedAgeRange}
                  onChange={(e) => setSelectedAgeRange(e.target.value)}
                >
                  <option value="">Tất cả độ tuổi</option>
                  <option value="0-2">0 - 2 tuổi</option>
                  <option value="2-9">2 - 9 tuổi</option>
                  <option value="9-18">9 - 18 tuổi</option>
                </select>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quốc gia</h3>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Tất cả quốc gia</option>
                  <option value="USA">USA</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                  <option value="UK">UK</option>

                  {/* Thêm các quốc gia khác ở đây */}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm vắc xin..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="text-center text-xl text-gray-500">
                Loading...
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="grid gap-6">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="p-6">
                        <div className="overflow-x-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVaccinesByPriceAndAge.length === 0 ? (
                              <div>No vaccines available</div>
                            ) : (
                              filteredVaccinesByPriceAndAge.map((vaccine) => (
                                <div
                                  key={vaccine.vaccineId}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                  onClick={() => openModal(vaccine)} // Chỉ mở modal khi click vào vaccine
                                >
                                  <div className="py-4 px-4 cursor-pointer">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                      <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <h3 className="text-lg font-semibold text-blue-900">
                                            {vaccine.name}
                                          </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">
                                          {vaccine.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="font-medium text-blue-600">
                                            {vaccine.price.toLocaleString()} VND
                                          </span>
                                        </div>
                                        <div className="mt-4">
                                          <img
                                            src={
                                              "https://news.asu.edu/sites/default/files/35327061344_d199614bd8_k.jpg"
                                            } // Đảm bảo có ảnh cho mỗi vaccine
                                            alt={vaccine.name}
                                            className="w-92 h-52 object-cover rounded-lg" // Thay đổi kích thước ở đây
                                          />
                                        </div>
                                      </div>

                                      {/* Nút chọn ở phía bên phải */}
                                      <div className="flex justify-end mt-4"></div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalIsOpen && selectedVaccine && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Thông tin chi tiết vắc xin"
          className="fixed inset-0 flex items-center justify-center bg-transparent"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40"
          ariaHideApp={false}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-xl">
            {selectedVaccine ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-semibold text-[#333333] flex items-center gap-3">
                    <FaSyringe className="text-[#4A90E2]" />
                    {vaccineData?.vaccine.name || "Vaccine Detail"}
                  </h1>
                </div>

                {/* Thêm ảnh vaccine trong modal */}
                <div className="mb-4">
                  <img
                    src={
                      "https://news.asu.edu/sites/default/files/35327061344_d199614bd8_k.jpg"
                    } // Đảm bảo có ảnh vaccine
                    alt={vaccineData?.vaccine.name}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-6 text-[#333333]">
                  Thông tin chi tiết
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      icon: <FaSyringe />,
                      label: "Số liều",
                      value: vaccineData?.vaccine.doseNumber || "n",
                    },
                    {
                      icon: <FaFlask />,
                      label: "Mô tả",
                      value: vaccineData?.vaccine.description || "n",
                    },
                    {
                      icon: <FaGlobe />,
                      label: "Quốc gia sản xuất",
                      value: vaccineData?.vaccine.country || "n",
                    },
                    {
                      icon: <FaUserClock />,
                      label: "Độ tuổi khuyến nghị",
                      value: `${vaccineData?.vaccine.ageMin} - ${vaccineData?.vaccine.ageMax} tuổi`,
                    },
                    {
                      icon: <FaDollarSign />,
                      label: "Giá vaccine",
                      value: vaccineData?.vaccine.price || "n",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-5">
                      <span className="text-[#4A90E2] text-2xl">
                        {item.icon}
                      </span>
                      <span className="text-[#333333] min-w-[160px]">
                        {item.label}:
                      </span>
                      <span className="text-[#333333] font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-[#333333]">
                Không có thông tin vắc xin
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PriceVaccineGuest;
