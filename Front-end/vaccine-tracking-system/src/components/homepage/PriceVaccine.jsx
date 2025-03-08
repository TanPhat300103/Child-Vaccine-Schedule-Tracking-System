import React, { useState, useEffect } from "react";
import { useCart } from "./AddCart";
import { getVaccineDetailByVaccineId, getVaccines } from "../../apis/api";
import { FiSearch, FiFilter, FiX, FiInfo } from "react-icons/fi";
import {
  FaDollarSign,
  FaFlask,
  FaGlobe,
  FaSyringe,
  FaUserClock,
  FaCalendarAlt,
  FaShieldVirus,
  FaCheckCircle,
} from "react-icons/fa";
import Modal from "react-modal";
import { Slider } from "@mui/material";
import { styled } from "@mui/system";

// Styled MUI slider with a more modern blue
const CustomSlider = styled(Slider)(`
  color: #3B82F6;
  height: 8px;
  .MuiSlider-thumb {
    height: 20px;
    width: 20px;
    background-color: #fff;
    border: 2px solid #3B82F6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    &:focus, &:hover, &.Mui-active, &.Mui-focusVisible {
      box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    }
  }
  .MuiSlider-track {
    height: 8px;
    border-radius: 4px;
  }
  .MuiSlider-rail {
    height: 8px;
    border-radius: 4px;
    background-color: #E5E7EB;
  }
`);

const PriceVaccine = () => {
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
  const [activeTab, setActiveTab] = useState("all");

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

    // Filter by tab
    let isTabValid = true;
    if (activeTab === "infant") {
      isTabValid = vaccine.ageMax <= 2;
    } else if (activeTab === "child") {
      isTabValid = vaccine.ageMin >= 2 && vaccine.ageMax <= 9;
    } else if (activeTab === "adolescent") {
      isTabValid = vaccine.ageMin >= 9;
    }

    return isPriceValid && isAgeValid && isCountryValid && isTabValid;
  });

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVaccine(null);
  };

  // Handle selecting vaccine and adding it to cart
  const handleSelectVaccine = (e, vaccine) => {
    e.stopPropagation();

    if (selectedPackage.includes(vaccine.vaccineId)) {
      setSelectedPackage((prev) =>
        prev.filter((id) => id !== vaccine.vaccineId)
      );
      removeFromCart(vaccine.vaccineId);
    } else {
      setSelectedPackage((prev) => [...prev, vaccine.vaccineId]);
      addToCart(vaccine);
    }
  };

  // Open modal for vaccine details
  const openModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setModalIsOpen(true);
  };

  const getBadgeColor = (country) => {
    const colors = {
      USA: "bg-blue-100 text-blue-800",
      Vietnam: "bg-red-100 text-red-800",
      France: "bg-indigo-100 text-indigo-800",
      Germany: "bg-yellow-100 text-yellow-800",
      Japan: "bg-pink-100 text-pink-800",
      UK: "bg-purple-100 text-purple-800",
    };
    return colors[country] || "bg-gray-100 text-gray-800";
  };

  const getAgeRangeIcon = (ageMin, ageMax) => {
    if (ageMax <= 2) return "👶";
    if (ageMin >= 2 && ageMax <= 9) return "🧒";
    return "👦";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center">
            <FaShieldVirus className="mr-3 text-blue-600" />
            Danh mục vắc xin
          </h1>
          <p className="mt-2 text-gray-600">
            Theo dõi và lựa chọn vắc xin phù hợp cho lịch tiêm chủng của trẻ
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center justify-center w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            {isMobileFilterOpen ? (
              <>
                <FiX className="mr-2" /> Đóng bộ lọc
              </>
            ) : (
              <>
                <FiFilter className="mr-2" /> Hiện bộ lọc
              </>
            )}
          </button>

          {/* Filter Sidebar */}
          <div
            className={`w-full md:w-64 transition-all duration-300 ease-in-out ${
              isMobileFilterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FiFilter className="mr-2 text-blue-600" />
                Bộ lọc
              </h2>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4">
                  Khoảng giá
                </h3>
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

              {/* Age Range Filter */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <FaUserClock className="mr-2 text-blue-600" />
                  Độ tuổi khuyến nghị
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "", label: "Tất cả độ tuổi" },
                    { value: "0-2", label: "0 - 2 tuổi", icon: "👶" },
                    { value: "2-9", label: "2 - 9 tuổi", icon: "🧒" },
                    { value: "9-18", label: "9 - 18 tuổi", icon: "👦" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedAgeRange === option.value
                          ? "bg-blue-100 border border-blue-300"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedAgeRange(option.value)}
                    >
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      <span className="text-gray-700">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Country Filter */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <FaGlobe className="mr-2 text-blue-600" />
                  Quốc gia sản xuất
                </h3>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Tất cả quốc gia</option>
                  <option value="USA">Hoa Kỳ (USA)</option>
                  <option value="Vietnam">Việt Nam</option>
                  <option value="France">Pháp</option>
                  <option value="Germany">Đức</option>
                  <option value="Japan">Nhật Bản</option>
                  <option value="UK">Anh Quốc</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setSelectedAgeRange("");
                  setSelectedCountry("");
                  setPriceRange([0, 3000000]);
                  setMinPrice(0);
                  setMaxPrice(3000000);
                  setSearchQuery("");
                }}
                className="w-full p-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center mt-4"
              >
                <FiX className="mr-2" />
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search and Tabs */}
            <div className="mb-6 flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm vắc xin theo tên hoặc mô tả..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>

              {/* Age-based Tabs */}
              <div className="flex overflow-x-auto py-2 space-x-1 sm:space-x-2 bg-white rounded-lg p-1 shadow-sm">
                {[
                  { id: "all", label: "Tất cả", icon: <FaShieldVirus /> },
                  { id: "infant", label: "Trẻ sơ sinh (0-2)", icon: "👶" },
                  { id: "child", label: "Trẻ nhỏ (2-9)", icon: "🧒" },
                  { id: "adolescent", label: "Trẻ lớn (9+)", icon: "👦" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count and Sorting Options */}
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-blue-600">
                  {filteredVaccinesByPriceAndAge.length}
                </span>{" "}
                vắc xin
              </p>
            </div>

            {/* Vaccines Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVaccinesByPriceAndAge.length === 0 ? (
                  <div className="col-span-full bg-white p-8 rounded-xl shadow text-center">
                    <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Không tìm thấy vắc xin
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Không có vắc xin nào phù hợp với điều kiện tìm kiếm của
                      bạn.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedAgeRange("");
                        setSelectedCountry("");
                        setPriceRange([0, 3000000]);
                        setMinPrice(0);
                        setMaxPrice(3000000);
                        setSearchQuery("");
                        setActiveTab("all");
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  filteredVaccinesByPriceAndAge.map((vaccine) => (
                    <div
                      key={vaccine.vaccineId}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                    >
                      {/* Vaccine Image */}
                      <div
                        className="relative h-48 cursor-pointer"
                        onClick={() => openModal(vaccine)}
                      >
                        <img
                          src={
                            vaccine.img
                              ? vaccine.img
                              : "https://news.asu.edu/sites/default/files/35327061344_d199614bd8_k.jpg"
                          }
                          alt={vaccine.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                              vaccine.country
                            )}`}
                          >
                            {vaccine.country}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 flex items-center">
                            {getAgeRangeIcon(vaccine.ageMin, vaccine.ageMax)}
                            <span className="ml-1">
                              {vaccine.ageMin}-{vaccine.ageMax} tuổi
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Vaccine Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className="text-lg font-semibold text-blue-900 cursor-pointer hover:text-blue-700"
                            onClick={() => openModal(vaccine)}
                          >
                            {vaccine.name}
                          </h3>
                          {selectedPackage.includes(vaccine.vaccineId) && (
                            <span className="text-green-500">
                              <FaCheckCircle />
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {vaccine.description}
                        </p>

                        {/* Info */}
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="font-medium text-blue-600 text-lg">
                            {vaccine.price.toLocaleString()} VND
                          </span>
                          <div className="flex items-center text-gray-500">
                            <FaSyringe className="mr-1" />
                            <span>{vaccine.doseNumber} liều</span>
                          </div>
                        </div>

                        {/* Select Button */}
                        <div className="flex mt-4">
                          <button
                            onClick={(e) => handleSelectVaccine(e, vaccine)}
                            className={`flex-1 px-4 py-2 rounded-lg text-center font-medium transition-all ${
                              selectedPackage.includes(vaccine.vaccineId)
                                ? "bg-green-600 text-white shadow-md hover:bg-green-700"
                                : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                            }`}
                          >
                            {selectedPackage.includes(vaccine.vaccineId) ? (
                              <>
                                <FaCheckCircle className="inline mr-2" /> Đã
                                chọn
                              </>
                            ) : (
                              "Chọn vắc xin"
                            )}
                          </button>
                          <button
                            onClick={() => openModal(vaccine)}
                            className="ml-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <FiInfo />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vaccine Detail Modal */}
      {modalIsOpen && selectedVaccine && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Thông tin chi tiết vắc xin"
          className="fixed inset-0 flex items-center justify-center bg-transparent"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          ariaHideApp={false}
        >
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
            <div className="relative h-64 bg-blue-600">
              <img
                src={
                  vaccine.img
                    ? vaccine.img
                    : "https://news.asu.edu/sites/default/files/35327061344_d199614bd8_k.jpg"
                }
                alt={vaccineData?.vaccine.name}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-6 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                    vaccineData?.vaccine.country
                  )}`}
                >
                  {vaccineData?.vaccine.country}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                    <FaSyringe className="text-blue-600" />
                    {vaccineData?.vaccine.name}
                  </h1>

                  <p className="text-gray-700 mb-6 text-lg">
                    {vaccineData?.vaccine.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        icon: <FaSyringe className="text-blue-600" />,
                        label: "Số liều",
                        value: vaccineData?.vaccine.doseNumber || "N/A",
                      },
                      {
                        icon: <FaUserClock className="text-blue-600" />,
                        label: "Độ tuổi khuyến nghị",
                        value: `${vaccineData?.vaccine.ageMin} - ${vaccineData?.vaccine.ageMax} tuổi`,
                      },
                      {
                        icon: <FaGlobe className="text-blue-600" />,
                        label: "Quốc gia sản xuất",
                        value: vaccineData?.vaccine.country || "N/A",
                      },
                      {
                        icon: <FaDollarSign className="text-blue-600" />,
                        label: "Giá vaccine",
                        value: `${vaccineData?.vaccine.price?.toLocaleString()} VND`,
                      },
                      {
                        icon: <FaCalendarAlt className="text-blue-600" />,
                        label: "Ngày nhập kho",
                        value: new Date(
                          vaccineData?.entryDate
                        ).toLocaleDateString("vi-VN"),
                      },
                      {
                        icon: <FaCalendarAlt className="text-blue-600" />,
                        label: "Hạn sử dụng",
                        value: new Date(
                          vaccineData?.expiredDate
                        ).toLocaleDateString("vi-VN"),
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border-b border-gray-100 pb-3"
                      >
                        <div className="text-xl">{item.icon}</div>
                        <div>
                          <p className="text-gray-500 text-sm">{item.label}</p>
                          <p className="font-medium text-gray-900">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin tiêm chủng
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Số lượng tồn kho</p>
                      <p className="font-medium text-gray-900">
                        {vaccineData?.quantity || "N/A"} liều
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Khoảng cách tiêm</p>
                      <p className="font-medium text-gray-900">
                        {vaccineData?.day || "N/A"} ngày
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Dung sai</p>
                      <p className="font-medium text-gray-900">
                        ±{vaccineData?.tolerance || "N/A"} ngày
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={(e) => {
                        handleSelectVaccine(e, selectedVaccine);
                        closeModal();
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-center font-medium transition-all ${
                        selectedPackage.includes(selectedVaccine.vaccineId)
                          ? "bg-green-600 text-white shadow-md hover:bg-green-700"
                          : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      }`}
                    >
                      {selectedPackage.includes(selectedVaccine.vaccineId) ? (
                        <>
                          <FaCheckCircle className="inline mr-2" /> Đã chọn vắc
                          xin
                        </>
                      ) : (
                        "Chọn vắc xin này"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PriceVaccine;
