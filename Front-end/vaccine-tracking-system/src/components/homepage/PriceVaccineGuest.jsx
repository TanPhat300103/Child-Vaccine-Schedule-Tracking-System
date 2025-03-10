import React, { useState, useEffect, useRef } from "react";
import { getVaccineDetailByVaccineId, getVaccines } from "../../apis/api";
import { FiSearch, FiX, FiInfo } from "react-icons/fi";
import {
  FaGlobe,
  FaSyringe,
  FaUserClock,
  FaShieldVirus,
  FaChild,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

// PriceVaccineGuest Component
const PriceVaccineGuest = () => {
  const [pricePackages, setPricePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000); // Default max price set to 3,000,000 VND
  const [selectedCountry, setSelectedCountry] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const carouselRef = useRef(null);

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
    img: "https://www.cdc.gov/covid/media/images/2024/11/GettyImages-1773970411_1200x675.png",
    quantity: 100,
    status: true,
    tolerance: 5,
    day: 30,
  });

  // Fetch vaccine details when a vaccine is selected
  useEffect(() => {
    if (!selectedVaccine?.vaccineId) return;

    const fetchVaccineData = async () => {
      try {
        setLoading(true);
        const data = await getVaccineDetailByVaccineId(selectedVaccine.vaccineId);
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

    // Filter by country if selected
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

    return isPriceValid && isCountryValid && isTabValid;
  });

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVaccine(null);
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

  // Reset filters to show all vaccines
  const resetFilters = () => {
    setSelectedCountry("");
    setMinPrice(0);
    setMaxPrice(3000000);
    setSearchQuery("");
    setActiveTab("all");
  };

  // Handle price input changes
  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 3000000;
    setMaxPrice(value);
  };

  return (
    <div className="py-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="text-3xl font-bold text-blue-900 flex items-center">
          <FaShieldVirus className="mr-3 text-blue-600" />
          Danh mục vắc xin
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Theo dõi và lựa chọn vắc xin phù hợp cho lịch tiêm chủng của trẻ
        </p>
      </div>

      {/* Filter Section in a Single Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          {/* Price Range Filter */}
          <div className="flex items-center space-x-2 min-w-[240px]">
            <span className="text-sm text-gray-600">Giá</span>
            <input
              type="text"
              placeholder="Giá từ"
              value={minPrice.toLocaleString()}
              onChange={handleMinPriceChange}
              className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="text"
              placeholder="Giá đến"
              value={maxPrice.toLocaleString()}
              onChange={handleMaxPriceChange}
              className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Country Filter */}
          <div className="min-w-[120px]">
            <div className="flex items-center space-x-1">
              <FaGlobe className="text-blue-600 text-xs" />
              <select
                className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-all"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Quốc gia</option>
                <option value="USA">USA</option>
                <option value="Vietnam">Việt Nam</option>
                <option value="France">Pháp</option>
                <option value="Germany">Đức</option>
                <option value="Japan">Nhật Bản</option>
                <option value="UK">Anh Quốc</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm vắc xin theo tên hoặc mô tả..."
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-blue-400 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            </div>
          </div>

          {/* Age-based Tabs */}
          <div className="flex space-x-1">
            {[
              { id: "all", label: "Tất cả", icon: <FaShieldVirus /> },
              { id: "infant", label: "Trẻ sơ sinh (0-2)", icon: "👶" },
              { id: "child", label: "Trẻ nhỏ (2-9)", icon: "🧒" },
              { id: "adolescent", label: "Trẻ lớn (9+)", icon: "👦" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center whitespace-nowrap px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reset Filters Button (only visible if filters are applied) */}
          {(selectedCountry || minPrice > 0 || maxPrice < 3000000 || searchQuery) && (
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center shadow-sm hover:shadow-md"
            >
              <FiX className="mr-1" /> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Vaccines Horizontal Scrollable List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded-lg">
          <p className="text-gray-600 text-sm">
            Hiển thị{" "}
            <span className="font-semibold text-blue-600">
              {filteredVaccinesByPriceAndAge.length}
            </span>{" "}
            vắc xin
          </p>
        </div>

        {/* Vaccines Horizontal Scrollable List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredVaccinesByPriceAndAge.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <FiInfo className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-3 text-md font-medium text-gray-900">
              Không tìm thấy vắc xin
            </h3>
            <p className="mt-2 text-gray-500 text-sm">
              Không có vắc xin nào phù hợp với điều kiện tìm kiếm của bạn.
            </p>
            <button
              onClick={resetFilters}
              className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4" ref={carouselRef}>
              {filteredVaccinesByPriceAndAge.map((vaccine) => (
                <motion.div
                  key={vaccine.vaccineId}
                  className="flex-shrink-0 w-[280px] bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 cursor-pointer"
                  onClick={() => openModal(vaccine)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-semibold text-gray-800">{vaccine.name}</h3>
                    <span className="text-blue-600 font-bold text-md">
                      {vaccine.price.toLocaleString()} VND
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{vaccine.description}</p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={`px-2 py-1 rounded-full ${getBadgeColor(vaccine.country)}`}>
                      {vaccine.country}
                    </span>
                    <span className="text-gray-500 flex items-center">
                      <FaSyringe className="mr-1 text-sm" /> {vaccine.doseNumber} liều
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaChild className="mr-1 text-sm" /> {vaccine.ageMin}-{vaccine.ageMax} tuổi
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vaccine Detail Modal */}
      <AnimatePresence>
        {modalIsOpen && selectedVaccine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">{vaccineData?.vaccine.name}</h3>
              <div className="flex items-center space-x-2 mb-4">
                <FaChild className="text-blue-500" />
                <span className="text-gray-600 text-sm">
                  Độ tuổi: {vaccineData?.vaccine.ageMin} - {vaccineData?.vaccine.ageMax} tuổi
                </span>
              </div>
              <div className="text-blue-600 font-bold text-lg mb-4">
                {vaccineData?.vaccine.price.toLocaleString()} VND
              </div>
              <p className="text-gray-600 mb-4">{vaccineData?.vaccine.description}</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm flex items-center">
                    <FaSyringe className="mr-2 text-blue-500" />
                    Số liều:
                  </span>
                  <span className="font-medium">{vaccineData?.vaccine.doseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm flex items-center">
                    <FaGlobe className="mr-2 text-blue-500" />
                    Quốc gia:
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(vaccineData?.vaccine.country)}`}>
                    {vaccineData?.vaccine.country}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm flex items-center">
                    <FaUserClock className="mr-2 text-blue-500" />
                    Khoảng cách tiêm:
                  </span>
                  <span className="font-medium">{vaccineData?.day} ngày</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm flex items-center">
                    <FaUserClock className="mr-2 text-blue-500" />
                    Dung sai:
                  </span>
                  <span className="font-medium">±{vaccineData?.tolerance} ngày</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceVaccineGuest;