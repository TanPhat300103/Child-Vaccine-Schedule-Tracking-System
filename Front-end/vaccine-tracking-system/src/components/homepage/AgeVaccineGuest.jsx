import React, { useState, useEffect } from "react";
import { useCart } from "./AddCart";
import { getVaccineDetailByVaccineId, getVaccines } from "../../apis/api";

// Icon imports
import {
  Search,
  Filter,
  X,
  Info,
  ChevronDown,
  Calendar,
  DollarSign,
  Globe,
  User,
  Activity,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle,
  Package,
} from "lucide-react";

const AgeVaccineGuest = () => {
  const [combos, setCombos] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const { addToCart, removeFromCart } = useCart();

  // Sample data for combos
  const sampleCombos = [
    {
      id: "combo1",
      name: "Combo cơ bản cho trẻ sơ sinh",
      description: "Bộ vaccine cần thiết cho trẻ từ 0-12 tháng tuổi",
      ageRange: "0-1",
      totalPrice: 2500000,
      discount: 15,
      totalDoses: 8,
      country: "Nhiều quốc gia",
      vaccines: ["V001", "V002", "V003"],
      coveragePeriod: "12 tháng",
      image: "https://cdn-icons-png.flaticon.com/512/351/351123.png",
    },
    {
      id: "combo2",
      name: "Combo toàn diện cho trẻ mầm non",
      description: "Bảo vệ toàn diện cho trẻ từ 1-5 tuổi",
      ageRange: "1-5",
      totalPrice: 3800000,
      discount: 20,
      totalDoses: 10,
      country: "Nhiều quốc gia",
      vaccines: ["V003", "V004", "V005", "V006"],
      coveragePeriod: "4 năm",
      image:
        "https://img.freepik.com/premium-vector/cute-baby-icon_24911-35442.jpg",
    },
    {
      id: "combo3",
      name: "Combo phòng ngừa cao cấp",
      description: "Bảo vệ toàn diện với các vaccine cao cấp nhập khẩu",
      ageRange: "0-10",
      totalPrice: 5200000,
      discount: 25,
      totalDoses: 15,
      country: "USA",
      vaccines: ["V001", "V004", "V007", "V008", "V009"],
      coveragePeriod: "10 năm",
      image:
        "https://www.shutterstock.com/image-vector/school-boy-orange-hair-reeding-600nw-1676263501.jpg",
    },
    {
      id: "combo4",
      name: "Combo cho trẻ tiền học đường",
      description: "Bảo vệ trẻ trong độ tuổi 5-12 trước khi vào học",
      ageRange: "5-12",
      totalPrice: 3200000,
      discount: 18,
      totalDoses: 6,
      country: "Nhiều quốc gia",
      vaccines: ["V006", "V007", "V010"],
      coveragePeriod: "7 năm",
      image:
        "https://img.freepik.com/free-vector/blonde-boy-blue-hoodie_1308-175828.jpg",
    },
  ];

  // Sample data to simulate individual vaccines
  const sampleVaccines = [
    {
      vaccineId: "V001",
      name: "ROTARIX",
      description: "Phòng ngừa rota virus gây tiêu chảy cấp ở trẻ em",
      country: "USA",
      doseNumber: 2,
      price: 500000,
      ageMin: 0,
      ageMax: 2,
      active: true,
      entryDate: "2025-01-01",
      expiredDate: "2027-01-01",
      quantity: 100,
    },
    {
      vaccineId: "V002",
      name: "PENTAXIM",
      description: "Phòng bạch hầu, ho gà, uốn ván, bại liệt và Hib",
      country: "France",
      doseNumber: 4,
      price: 750000,
      ageMin: 0,
      ageMax: 3,
      active: true,
      entryDate: "2025-01-05",
      expiredDate: "2027-01-05",
      quantity: 80,
    },
    {
      vaccineId: "V003",
      name: "VARIVAX",
      description: "Phòng bệnh thủy đậu",
      country: "USA",
      doseNumber: 1,
      price: 600000,
      ageMin: 1,
      ageMax: 12,
      active: true,
      entryDate: "2025-01-10",
      expiredDate: "2026-01-10",
      quantity: 90,
    },
    {
      vaccineId: "V004",
      name: "HAVRIX",
      description: "Phòng viêm gan A",
      country: "UK",
      doseNumber: 2,
      price: 450000,
      ageMin: 1,
      ageMax: 18,
      active: true,
      entryDate: "2025-01-15",
      expiredDate: "2027-01-15",
      quantity: 110,
    },
    {
      vaccineId: "V005",
      name: "VAXIGRIP",
      description: "Vaccine cúm mùa",
      country: "France",
      doseNumber: 1,
      price: 350000,
      ageMin: 6,
      ageMax: 18,
      active: true,
      entryDate: "2025-02-01",
      expiredDate: "2026-02-01",
      quantity: 200,
    },
    {
      vaccineId: "V006",
      name: "MMR II",
      description: "Phòng sởi, quai bị, rubella",
      country: "USA",
      doseNumber: 2,
      price: 550000,
      ageMin: 1,
      ageMax: 12,
      active: true,
      entryDate: "2025-02-05",
      expiredDate: "2027-02-05",
      quantity: 95,
    },
    {
      vaccineId: "V007",
      name: "GARDASIL 9",
      description: "Phòng HPV",
      country: "USA",
      doseNumber: 3,
      price: 1200000,
      ageMin: 9,
      ageMax: 26,
      active: true,
      entryDate: "2025-02-10",
      expiredDate: "2027-02-10",
      quantity: 60,
    },
    {
      vaccineId: "V008",
      name: "VERORAB",
      description: "Phòng dại",
      country: "France",
      doseNumber: 5,
      price: 400000,
      ageMin: 0,
      ageMax: 18,
      active: true,
      entryDate: "2025-02-15",
      expiredDate: "2027-02-15",
      quantity: 120,
    },
    {
      vaccineId: "V009",
      name: "PNEUMOVAX 23",
      description: "Phòng phế cầu khuẩn",
      country: "Germany",
      doseNumber: 1,
      price: 680000,
      ageMin: 2,
      ageMax: 18,
      active: true,
      entryDate: "2025-03-01",
      expiredDate: "2027-03-01",
      quantity: 75,
    },
    {
      vaccineId: "V010",
      name: "ENGERIX-B",
      description: "Phòng viêm gan B",
      country: "UK",
      doseNumber: 3,
      price: 420000,
      ageMin: 0,
      ageMax: 18,
      active: true,
      entryDate: "2025-03-05",
      expiredDate: "2027-03-05",
      quantity: 150,
    },
  ];

  // lấy api
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API calls when available
        // const comboData = await getVaccineCombos();
        // const vaccineData = await getVaccines();

        // Using sample data for now
        setCombos(sampleCombos);
        setVaccines(sampleVaccines);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter combos based on search, price, age, etc.
  const filteredCombos = combos.filter((combo) => {
    const matchesSearch =
      combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      combo.totalPrice >= priceRange[0] && combo.totalPrice <= priceRange[1];

    let matchesAge = true;
    if (selectedAgeRange) {
      const [minAge, maxAge] = selectedAgeRange.split("-").map(Number);
      const [comboMinAge, comboMaxAge] = combo.ageRange.split("-").map(Number);
      matchesAge = !(comboMaxAge < minAge || comboMinAge > maxAge);
    }

    let matchesTab = true;
    if (activeTab === "infant") {
      const [_, comboMaxAge] = combo.ageRange.split("-").map(Number);
      matchesTab = comboMaxAge <= 2;
    } else if (activeTab === "child") {
      const [comboMinAge, comboMaxAge] = combo.ageRange.split("-").map(Number);
      matchesTab = comboMinAge >= 1 && comboMaxAge <= 9;
    } else if (activeTab === "adolescent") {
      const [comboMinAge, _] = combo.ageRange.split("-").map(Number);
      matchesTab = comboMinAge >= 9;
    }

    return matchesSearch && matchesPrice && matchesAge && matchesTab;
  });

  // Get vaccine details by ID
  const getVaccineById = (id) => {
    return vaccines.find((v) => v.vaccineId === id) || null;
  };

  // Handle selecting a combo
  const handleSelectCombo = (combo) => {
    setSelectedCombo(combo);
    setOpenModal(true);
  };

  // Handle adding or removing a combo from cart
  const handleAddRemoveCombo = (combo) => {
    if (selectedVaccines.includes(combo.id)) {
      setSelectedVaccines((prev) => prev.filter((id) => id !== combo.id));
      removeFromCart(combo.id);
    } else {
      setSelectedVaccines((prev) => [...prev, combo.id]);
      addToCart({
        vaccineId: combo.id,
        name: combo.name,
        price: combo.totalPrice * (1 - combo.discount / 100),
        isCombo: true,
        vaccines: combo.vaccines.map((id) => getVaccineById(id)),
      });
    }
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  // Get badge color by country
  const getBadgeColor = (country) => {
    const colors = {
      USA: "bg-blue-100 text-blue-800",
      Vietnam: "bg-red-100 text-red-800",
      France: "bg-indigo-100 text-indigo-800",
      Germany: "bg-yellow-100 text-yellow-800",
      Japan: "bg-pink-100 text-pink-800",
      UK: "bg-purple-100 text-purple-800",
      "Nhiều quốc gia": "bg-green-100 text-green-800",
    };
    return colors[country] || "bg-gray-100 text-gray-800";
  };

  // Get age range icon
  const getAgeRangeIcon = (ageRange) => {
    const [min, max] = ageRange.split("-").map(Number);
    if (max <= 2) return "👶";
    if (min >= 1 && max <= 9) return "🧒";
    return "👦";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 flex items-center">
                <Package className="mr-3 text-indigo-600 h-8 w-8" />
                Gói Vaccine Combo
              </h1>
              <p className="mt-2 text-gray-600">
                Tiết kiệm chi phí với các gói vaccine combo được thiết kế phù
                hợp cho từng độ tuổi
              </p>
            </div>
            <div className="bg-indigo-600 rounded-lg px-4 py-2 text-white flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              <span>Tiết kiệm lên đến 25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center justify-center w-full bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <>
                <X className="mr-2 h-5 w-5" /> Đóng bộ lọc
              </>
            ) : (
              <>
                <Filter className="mr-2 h-5 w-5" /> Hiện bộ lọc
              </>
            )}
          </button>

          {/* Filter Sidebar */}
          <div
            className={`w-full md:w-64 transition-all duration-300 ease-in-out ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Filter className="mr-2 text-indigo-600 h-5 w-5" />
                Bộ lọc
              </h2>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <DollarSign className="mr-2 text-indigo-600 h-4 w-4" />
                  Khoảng giá
                </h3>
                <input
                  type="range"
                  min="0"
                  max="6000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0 VND</span>
                  <span className="font-medium text-indigo-600">
                    {priceRange[1].toLocaleString()} VND
                  </span>
                </div>
              </div>

              {/* Age Range Filter */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <User className="mr-2 text-indigo-600 h-4 w-4" />
                  Độ tuổi
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
                          ? "bg-indigo-100 border border-indigo-300"
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

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setSelectedAgeRange("");
                  setPriceRange([0, 6000000]);
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="w-full p-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center mt-4"
              >
                <X className="mr-2 h-4 w-4" />
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
                  placeholder="Tìm kiếm gói vaccine combo..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              {/* Age-based Tabs */}
              <div className="flex overflow-x-auto py-2 space-x-2 bg-white rounded-lg p-2 shadow-sm">
                {[
                  {
                    id: "all",
                    label: "Tất cả",
                    icon: <Shield className="h-4 w-4" />,
                  },
                  { id: "infant", label: "Trẻ sơ sinh (0-2)", icon: "👶" },
                  { id: "child", label: "Trẻ nhỏ (2-9)", icon: "🧒" },
                  { id: "adolescent", label: "Trẻ lớn (9+)", icon: "👦" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-indigo-600">
                  {filteredCombos.length}
                </span>{" "}
                gói combo
              </p>
            </div>

            {/* Combos Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredCombos.length === 0 ? (
                  <div className="col-span-full bg-white p-8 rounded-xl shadow text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Không tìm thấy gói combo
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Không có gói vaccine combo nào phù hợp với điều kiện tìm
                      kiếm của bạn.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedAgeRange("");
                        setPriceRange([0, 6000000]);
                        setSearchQuery("");
                        setActiveTab("all");
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  filteredCombos.map((combo) => (
                    <div
                      key={combo.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 flex flex-col"
                    >
                      <div
                        className="relative h-48 cursor-pointer"
                        onClick={() => handleSelectCombo(combo)}
                      >
                        <img
                          src={combo.image}
                          alt={combo.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Discount badge */}
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-bold">
                          -{combo.discount}%
                        </div>

                        {/* Age range tag */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 flex items-center">
                            {getAgeRangeIcon(combo.ageRange)}
                            <span className="ml-2">
                              {combo.ageRange.replace("-", "-")} tuổi
                            </span>
                          </span>
                        </div>

                        {/* Country badge */}
                        <div className="absolute bottom-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                              combo.country
                            )}`}
                          >
                            {combo.country}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3
                            className="text-xl font-bold text-indigo-900 cursor-pointer hover:text-indigo-700 mb-2"
                            onClick={() => handleSelectCombo(combo)}
                          >
                            {combo.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {combo.description}
                          </p>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center text-gray-700">
                              <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                              <span className="text-sm">
                                Thời gian: {combo.coveragePeriod}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Activity className="mr-2 h-4 w-4 text-indigo-500" />
                              <span className="text-sm">
                                {combo.totalDoses} liều tiêm
                              </span>
                            </div>
                          </div>

                          <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                            <div className="font-medium text-gray-700 mb-2">
                              Bao gồm {combo.vaccines.length} loại vaccine:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {combo.vaccines.map((vaccineId) => {
                                const vaccineInfo = getVaccineById(vaccineId);
                                return vaccineInfo ? (
                                  <span
                                    key={vaccineId}
                                    className="bg-white px-2 py-1 rounded-md text-xs text-gray-700 border border-gray-200"
                                  >
                                    {vaccineInfo.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <span className="text-gray-500 line-through text-sm">
                                {combo.totalPrice.toLocaleString()} VND
                              </span>
                              <div className="text-xl font-bold text-indigo-600">
                                {getDiscountedPrice(
                                  combo.totalPrice,
                                  combo.discount
                                ).toLocaleString()}{" "}
                                VND
                              </div>
                            </div>
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                              <DollarSign className="mr-1 h-3 w-3" />
                              Tiết kiệm{" "}
                              {(
                                (combo.totalPrice * combo.discount) /
                                100
                              ).toLocaleString()}{" "}
                              VND
                            </div>
                          </div>
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

      {/* Combo Detail Modal */}
      {/* Combo Detail Modal */}
      {openModal && selectedCombo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              <div className="h-64 relative">
                <img
                  src={selectedCombo.image}
                  alt={selectedCombo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCombo.name}
                  </h2>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold mr-2 ${getBadgeColor(
                        selectedCombo.country
                      )}`}
                    >
                      {selectedCombo.country}
                    </span>
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 flex items-center">
                      {getAgeRangeIcon(selectedCombo.ageRange)}
                      <span className="ml-2">
                        {selectedCombo.ageRange.replace("-", "-")} tuổi
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-2/3">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Mô tả
                      </h3>
                      <p className="text-gray-600">
                        {selectedCombo.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Thông tin chi tiết
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Calendar className="mr-3 h-5 w-5 text-indigo-500" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Thời gian bảo vệ
                            </div>
                            <div className="font-medium">
                              {selectedCombo.coveragePeriod}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Activity className="mr-3 h-5 w-5 text-indigo-500" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Tổng số liều
                            </div>
                            <div className="font-medium">
                              {selectedCombo.totalDoses} liều
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="mr-3 h-5 w-5 text-indigo-500" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Phù hợp độ tuổi
                            </div>
                            <div className="font-medium">
                              {selectedCombo.ageRange.replace("-", "-")} tuổi
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Globe className="mr-3 h-5 w-5 text-indigo-500" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Nguồn gốc
                            </div>
                            <div className="font-medium">
                              {selectedCombo.country}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Danh sách vaccine ({selectedCombo.vaccines.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedCombo.vaccines.map((vaccineId) => {
                          const vaccine = getVaccineById(vaccineId);
                          return vaccine ? (
                            <div
                              key={vaccineId}
                              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-indigo-900">
                                    {vaccine.name}
                                  </h4>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {vaccine.description}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                                    vaccine.country
                                  )}`}
                                >
                                  {vaccine.country}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                <div className="text-sm">
                                  <span className="text-gray-500">Giá lẻ:</span>
                                  <span className="ml-1 font-medium text-gray-700">
                                    {vaccine.price.toLocaleString()} VND
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">
                                    Số liều:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-700">
                                    {vaccine.doseNumber}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">
                                    Độ tuổi:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-700">
                                    {vaccine.ageMin}-{vaccine.ageMax} tuổi
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Lưu ý quan trọng
                      </h3>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                          <div>
                            <p className="text-yellow-800">
                              Lịch tiêm chủng có thể thay đổi tùy thuộc vào tình
                              trạng sức khỏe của trẻ. Vui lòng tham khảo ý kiến
                              bác sĩ trước khi quyết định lịch tiêm cụ thể.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/3">
                    <div className="bg-indigo-50 rounded-xl p-5 sticky top-6">
                      <h3 className="text-xl font-bold text-indigo-900 mb-4">
                        Tóm tắt gói combo
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Giá niêm yết:</span>
                          <span className="text-gray-700 line-through">
                            {selectedCombo.totalPrice.toLocaleString()} VND
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Giảm giá:</span>
                          <span className="text-red-600 font-medium">
                            -{selectedCombo.discount}% (-
                            {(
                              (selectedCombo.totalPrice *
                                selectedCombo.discount) /
                              100
                            ).toLocaleString()}{" "}
                            VND)
                          </span>
                        </div>
                        <div className="pt-3 border-t border-indigo-100">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-semibold">
                              Giá sau giảm:
                            </span>
                            <span className="text-xl font-bold text-indigo-600">
                              {getDiscountedPrice(
                                selectedCombo.totalPrice,
                                selectedCombo.discount
                              ).toLocaleString()}{" "}
                              VND
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-gray-700">
                            Giảm {selectedCombo.discount}% so với mua lẻ
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-gray-700">
                            Bảo vệ toàn diện {selectedCombo.coveragePeriod}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-gray-700">
                            Phù hợp cho trẻ{" "}
                            {selectedCombo.ageRange.replace("-", "-")} tuổi
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-gray-700">
                            Tư vấn lịch tiêm miễn phí
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Thời gian đặt lịch: 10-15 phút</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeVaccineGuest;
