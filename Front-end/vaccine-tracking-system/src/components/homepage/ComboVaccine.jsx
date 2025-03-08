import React, { useState, useEffect } from "react";
import { useCart } from "./AddCart";
import { getVaccineDetailByVaccineId, getVaccines } from "../../apis/api";
import {
  Search,
  Filter,
  X,
  Info,
  ChevronDown,
  ChevronRight,
  Calendar,
  Check,
  Shield,
  Globe,
  Award,
  AlertCircle,
  DollarSign,
  Droplet,
  Clock,
  Users,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ComboVaccine = () => {
  // State variables
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCombo, setExpandedCombo] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart, removeFromCart, cartItems } = useCart();

  // Sample combo data - In a real app, this would come from an API
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        // In a real app, replace with actual API call
        const data = await fetch("http://localhost:8080/vaccinecombo", {
          method: "GET",
          credentials: "include",
        })
          .then((response) => response.json()) // chuyển đổi dữ liệu trả về thành JSON
          .then((data) => {
            console.log("dataaccine: ", data); // xử lý dữ liệu ở đây
          })
          .catch((error) => {
            console.error("Error:", error); // xử lý lỗi nếu có
          });
        const dataFromApi = await data.json();
        console.log("datafromapi", dataFromApi);

        data = [
          {
            id: "combo-1",
            name: "Combo tiêm chủng cơ bản cho trẻ dưới 1 tuổi",
            description:
              "Bảo vệ trẻ khỏi 6 bệnh truyền nhiễm nguy hiểm phổ biến trong năm đầu đời",
            price: 2500000,
            discount: 15,

            origin: "WHO",
            popularity: 95,
            vaccines: [
              {
                id: "V001",
                name: "ROTARIX",
                disease: "Rota virus",
                doses: 2,
                price: 500000,
              },
              {
                id: "V002",
                name: "INFANRIX HEXA",
                disease: "Bạch hầu, Ho gà, Uốn ván, Bại liệt, Viêm gan B, Hib",
                doses: 3,
                price: 800000,
              },
              {
                id: "V003",
                name: "PREVENAR 13",
                disease: "Phế cầu khuẩn",
                doses: 2,
                price: 700000,
              },
              {
                id: "V004",
                name: "VAXIGRIP TETRA",
                disease: "Cúm mùa",
                doses: 1,
                price: 500000,
              },
            ],
            thumbnail:
              "https://tstarsonline.com/cdn/shop/products/a671182dit_kid_tshirt_11.jpg?v=1643538752",
          },
          {
            id: "combo-2",
            name: "Combo tiêm chủng toàn diện cho trẻ 1-5 tuổi",
            description:
              "Bảo vệ trẻ khỏi 8 bệnh truyền nhiễm nguy hiểm trong giai đoạn mầm non",
            price: 3500000,
            discount: 10,

            origin: "CDC",
            popularity: 88,
            vaccines: [
              {
                id: "V005",
                name: "MMR-II",
                disease: "Sởi, Quai bị, Rubella",
                doses: 1,
                price: 600000,
              },
              {
                id: "V006",
                name: "VARIVAX",
                disease: "Thủy đậu",
                doses: 1,
                price: 750000,
              },
              {
                id: "V007",
                name: "HAVRIX",
                disease: "Viêm gan A",
                doses: 2,
                price: 650000,
              },
              {
                id: "V003",
                name: "PREVENAR 13",
                disease: "Phế cầu khuẩn (nhắc lại)",
                doses: 1,
                price: 700000,
              },
              {
                id: "V008",
                name: "IPOL",
                disease: "Bại liệt (nhắc lại)",
                doses: 1,
                price: 800000,
              },
            ],
            thumbnail:
              "https://media.istockphoto.com/id/1398112744/photo/shot-of-an-adorable-little-boy-standing-outside.jpg?s=612x612&w=0&k=20&c=CekyxqAXuY7LfoGoFz37eTO3VhIDRblRyFncDlx0MOQ=",
          },
          {
            id: "combo-3",
            name: "Combo tiêm chủng cho trẻ vị thành niên",
            description:
              "Bảo vệ trẻ trong giai đoạn trưởng thành với các vắc xin quan trọng",
            price: 4200000,
            discount: 5,

            origin: "USA",
            popularity: 75,
            vaccines: [
              {
                id: "V009",
                name: "GARDASIL 9",
                disease: "HPV",
                doses: 2,
                price: 1500000,
              },
              {
                id: "V010",
                name: "MENACTRA",
                disease: "Não mô cầu",
                doses: 1,
                price: 1200000,
              },
              {
                id: "V011",
                name: "BOOSTRIX",
                disease: "Bạch hầu, Ho gà, Uốn ván (nhắc lại)",
                doses: 1,
                price: 800000,
              },
              {
                id: "V012",
                name: "ENGERIX-B",
                disease: "Viêm gan B (nhắc lại)",
                doses: 1,
                price: 700000,
              },
            ],
            thumbnail:
              "https://static4.depositphotos.com/1005730/289/i/450/depositphotos_2894527-stock-photo-9-years-old-kid-in.jpg",
          },
          {
            id: "combo-4",
            name: "Combo phòng bệnh truyền nhiễm mùa đông",
            description:
              "Bảo vệ trẻ khỏi các bệnh lây lan phổ biến trong mùa lạnh",
            price: 1800000,
            discount: 12,

            origin: "France",
            popularity: 82,
            vaccines: [
              {
                id: "V004",
                name: "VAXIGRIP TETRA",
                disease: "Cúm mùa",
                doses: 1,
                price: 500000,
              },
              {
                id: "V013",
                name: "PNEUMOVAX 23",
                disease: "Phế cầu khuẩn phổ rộng",
                doses: 1,
                price: 800000,
              },
              {
                id: "V014",
                name: "ROTATEQ",
                disease: "Rota virus",
                doses: 1,
                price: 500000,
              },
            ],
            thumbnail:
              "https://www.shutterstock.com/image-photo/portrait-guy-16-17-years-260nw-2059205381.jpg",
          },
          {
            id: "combo-5",
            name: "Combo vắc xin cho trẻ đi du lịch quốc tế",
            description:
              "Bảo vệ trẻ khỏi các bệnh đặc hữu tại vùng nhiệt đới và các điểm du lịch",
            price: 5000000,
            discount: 8,

            origin: "Germany",
            popularity: 65,
            vaccines: [
              {
                id: "V015",
                name: "IXIARO",
                disease: "Viêm não Nhật Bản",
                doses: 2,
                price: 1200000,
              },
              {
                id: "V016",
                name: "TYPHIM VI",
                disease: "Thương hàn",
                doses: 1,
                price: 800000,
              },
              {
                id: "V017",
                name: "YELLOW FEVER",
                disease: "Sốt vàng da",
                doses: 1,
                price: 1000000,
              },
              {
                id: "V018",
                name: "RABIPUR",
                disease: "Dại",
                doses: 3,
                price: 650000,
              },
              {
                id: "V019",
                name: "VIVAXIM",
                disease: "Viêm gan A và Thương hàn",
                doses: 1,
                price: 1350000,
              },
            ],
            thumbnail:
              "https://www.shutterstock.com/image-photo/young-boy-forest-sunset-man-260nw-568801543.jpg",
          },
        ];
        setCombos(data);
      } catch (error) {
        console.error("Error fetching vaccine combos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  // Filter combos based on search, age, price and origin
  const filteredCombos = combos.filter((combo) => {
    let nameMatch =
      combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchQuery.toLowerCase());

    let priceMatch =
      combo.price >= priceRange[0] && combo.price <= priceRange[1];

    let originMatch = true;
    if (selectedOrigin) {
      originMatch = combo.origin === selectedOrigin;
    }

    return nameMatch && priceMatch && originMatch && categoryMatch;
  });

  // Handle combo selection
  const handleSelectCombo = (combo) => {
    setSelectedCombo(combo);
    setIsModalOpen(true);
  };

  // Toggle combo expansion to show included vaccines
  const toggleComboExpansion = (id) => {
    setExpandedCombo(expandedCombo === id ? null : id);
  };

  // Calculate original price and discounted price
  const calculatePrice = (combo) => {
    const discountAmount = combo.price * (combo.discount / 100);
    return {
      original: combo.price,
      discounted: combo.price - discountAmount,
    };
  };

  // Check if combo is in cart
  const isComboInCart = (comboId) => {
    return (cartItems || []).some((item) => item.id === comboId);
  };

  // Handle add/remove combo to/from cart
  const handleCartAction = (combo) => {
    if (isComboInCart(combo.id)) {
      removeFromCart(combo.id);
    } else {
      addToCart({
        id: combo.id,
        name: combo.name,
        price: calculatePrice(combo).discounted,
        type: "combo",
        vaccines: combo.vaccines.map((v) => v.id),
      });
    }
  };

  // Get age range icon based on age

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 flex items-center">
                <Shield className="mr-3 text-blue-600 h-8 w-8" />
                Combo tiêm chủng
              </h1>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Bảo vệ toàn diện sức khỏe của trẻ với các gói tiêm chủng được
                thiết kế bởi chuyên gia
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Panel */}
          {showFilters && (
            <div className="w-full md:w-64 flex-shrink-0 transition-all duration-300 ease-in-out">
              <div className="bg-white p-6 rounded-xl shadow-md sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-blue-600" />
                  Bộ lọc
                </h2>

                {/* Age Range Filter */}

                {/* Price Range Slider */}
                <div className="mb-8">
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-blue-600" />
                    Khoảng giá (VND)
                  </h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="500000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>0 ₫</span>
                      <span>{priceRange[1].toLocaleString()} ₫</span>
                    </div>
                  </div>
                </div>

                {/* Origin Filter */}
                <div className="mb-8">
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-blue-600" />
                    Nguồn gốc
                  </h3>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                  >
                    <option value="">Tất cả nguồn gốc</option>
                    <option value="WHO">WHO</option>
                    <option value="CDC">CDC</option>
                    <option value="USA">Hoa Kỳ (USA)</option>
                    <option value="France">Pháp</option>
                    <option value="Germany">Đức</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setPriceRange([0, 5000000]);
                    setSelectedOrigin("");
                    setSearchQuery("");
                  }}
                  className="w-full p-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search and Tabs */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm combo vắc xin..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              {/* Age-based Category Tabs */}
              <div className="flex overflow-x-auto py-2 space-x-2 bg-white rounded-xl p-2 shadow-sm">
                {[
                  {
                    id: "all",
                    label: "Tất cả combo",
                    icon: <Shield className="h-4 w-4" />,
                  },
                  { id: "infant", label: "Trẻ sơ sinh (0-2)", icon: "👶" },
                  { id: "child", label: "Trẻ nhỏ (2-9)", icon: "🧒" },
                  { id: "teen", label: "Trẻ lớn (9+)", icon: "👦" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`flex items-center whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === tab.id
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

            {/* Results Stats */}
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-blue-600">
                  {filteredCombos.length}
                </span>{" "}
                combo vắc xin
              </p>
            </div>

            {/* Combos List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCombos.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl shadow text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Không tìm thấy combo vắc xin
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Không có combo vắc xin nào phù hợp với điều kiện tìm kiếm
                      của bạn.
                    </p>
                    <button
                      onClick={() => {
                        setPriceRange([0, 5000000]);
                        setSelectedOrigin("");
                        setSearchQuery("");
                        setActiveCategory("all");
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  filteredCombos.map((combo) => (
                    <div
                      key={combo.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                    >
                      <div className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Combo Image */}
                          <div className="md:w-1/3 flex-shrink-0 h-full">
                            <div
                              className="relative h-48 md:h-full min-h-64 cursor-pointer"
                              onClick={() => handleSelectCombo(combo)}
                            >
                              <img
                                src={combo.thumbnail}
                                alt={combo.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Age Badge */}

                              {/* Discount Badge */}
                              {combo.discount > 0 && (
                                <div className="absolute top-4 right-4">
                                  <span className="px-3 py-2 bg-red-600 text-white rounded-full text-sm font-bold">
                                    -{combo.discount}%
                                  </span>
                                </div>
                              )}
                              {/* Popularity Badge */}
                              <div className="absolute bottom-4 left-4">
                                <span className="px-3 py-2 bg-blue-600/80 backdrop-blur-sm text-white rounded-full text-sm font-medium flex items-center">
                                  <Award className="h-4 w-4 mr-1" />
                                  {combo.popularity}% lựa chọn
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Combo Info */}
                          <div className="md:w-2/3 p-6">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3
                                  className="text-xl font-bold text-blue-900 cursor-pointer hover:text-blue-700"
                                  onClick={() => handleSelectCombo(combo)}
                                >
                                  {combo.name}
                                </h3>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {combo.origin}
                                </span>
                              </div>

                              <p className="text-gray-600 mt-2 mb-3">
                                {combo.description}
                              </p>

                              {/* Price Section */}
                              <div className="flex items-end mt-4 mb-6">
                                <span className="text-3xl font-bold text-blue-600">
                                  {calculatePrice(
                                    combo
                                  ).discounted.toLocaleString()}{" "}
                                  ₫
                                </span>
                                {combo.discount > 0 && (
                                  <span className="ml-2 text-gray-500 line-through text-lg">
                                    {combo.price.toLocaleString()} ₫
                                  </span>
                                )}
                              </div>

                              {/* Combo Content Preview */}
                              <div className="mt-4">
                                <button
                                  onClick={() => toggleComboExpansion(combo.id)}
                                  className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                                >
                                  {expandedCombo === combo.id ? (
                                    <ChevronDown className="h-5 w-5 mr-1" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 mr-1" />
                                  )}
                                  Xem {combo.vaccines.length} vắc xin trong
                                  combo
                                </button>

                                {/* Expanded vaccine list */}
                                {expandedCombo === combo.id && (
                                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <ul className="space-y-3">
                                      {combo.vaccines.map((vaccine) => (
                                        <li
                                          key={vaccine.id}
                                          className="flex justify-between items-center"
                                        >
                                          <div>
                                            <span className="font-medium text-gray-900">
                                              {vaccine.name}
                                            </span>
                                            <p className="text-sm text-gray-600">
                                              {vaccine.disease}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                              {vaccine.doses} liều
                                            </span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex mt-6 space-x-3"></div>
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
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedCombo && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900 mb-2 flex items-center"
                      >
                        <Shield className="mr-3 text-blue-600 h-6 w-6" />
                        {selectedCombo.name}
                      </Dialog.Title>
                      <button
                        type="button"
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-500"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>

                      <div className="mt-6">
                        <div className="md:flex gap-8">
                          {/* Left column with image and pricing */}
                          <div className="md:w-2/5">
                            <div className="relative rounded-xl overflow-hidden mb-6">
                              <img
                                src={selectedCombo.thumbnail}
                                alt={selectedCombo.name}
                                className="w-full h-64 object-cover"
                              />
                              {/* Age Badge */}

                              {/* Discount Badge */}
                              {selectedCombo.discount > 0 && (
                                <div className="absolute top-4 right-4">
                                  <span className="px-3 py-2 bg-red-600 text-white rounded-full text-sm font-bold">
                                    -{selectedCombo.discount}%
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Price section */}
                            <div className="bg-gray-50 p-5 rounded-xl mb-6">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600">Giá gốc:</span>
                                <span className="text-lg font-medium text-gray-900">
                                  {selectedCombo.price.toLocaleString()} ₫
                                </span>
                              </div>
                              {selectedCombo.discount > 0 && (
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-gray-600">
                                    Giảm giá:
                                  </span>
                                  <span className="text-lg font-medium text-red-600">
                                    -{selectedCombo.discount}% (
                                    {(
                                      (selectedCombo.price *
                                        selectedCombo.discount) /
                                      100
                                    ).toLocaleString()}{" "}
                                    ₫)
                                  </span>
                                </div>
                              )}
                              <div className="border-t border-gray-200 my-2 pt-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-800 font-medium">
                                    Giá cuối:
                                  </span>
                                  <span className="text-2xl font-bold text-blue-600">
                                    {calculatePrice(
                                      selectedCombo
                                    ).discounted.toLocaleString()}{" "}
                                    ₫
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Origin & Information */}
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <Globe className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Nguồn gốc
                                  </p>
                                  <p className="font-medium">
                                    {selectedCombo.origin}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                              </div>
                              <div className="flex items-center">
                                <Award className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Mức độ phổ biến
                                  </p>
                                  <p className="font-medium">
                                    {selectedCombo.popularity}% phụ huynh lựa
                                    chọn
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Droplet className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Số lượng vắc xin
                                  </p>
                                  <p className="font-medium">
                                    {selectedCombo.vaccines.length} loại vắc xin
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column with details */}
                          <div className="md:w-3/5 mt-6 md:mt-0">
                            <div className="bg-blue-50 p-5 rounded-xl mb-6">
                              <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                                <Info className="h-5 w-5 mr-2" />
                                Thông tin combo
                              </h4>
                              <p className="text-gray-700">
                                {selectedCombo.description}
                              </p>
                            </div>

                            {/* Vaccines included */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                                Vắc xin trong combo
                              </h4>
                              <div className="space-y-4">
                                {selectedCombo.vaccines.map((vaccine) => (
                                  <div
                                    key={vaccine.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-semibold text-gray-900">
                                          {vaccine.name}
                                        </h5>
                                        <p className="text-gray-600">
                                          {vaccine.disease}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {vaccine.doses} liều
                                        </span>
                                        <span className="text-sm font-medium">
                                          {vaccine.price.toLocaleString()} ₫
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Benefits and guidelines */}
                            <div className="mt-8">
                              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Check className="h-5 w-5 mr-2 text-green-600" />
                                Lợi ích khi chọn combo
                              </h4>
                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>
                                    Tiết kiệm chi phí so với tiêm riêng lẻ
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>
                                    Lịch trình tiêm chủng đồng bộ, khoa học
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>
                                    Bảo vệ toàn diện cho trẻ khỏi các bệnh nguy
                                    hiểm
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span>
                                    Được tư vấn bởi đội ngũ y bác sĩ chuyên môn
                                    cao
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Đóng
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCartAction(selectedCombo)}
                            className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                              isComboInCart(selectedCombo.id)
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {isComboInCart(selectedCombo.id) ? (
                              <>
                                <Check className="inline h-5 w-5 mr-2" /> Đã
                                thêm vào giỏ hàng
                              </>
                            ) : (
                              "Thêm vào giỏ hàng"
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Return final closing tags for the component */}
    </div>
  );
};

export default ComboVaccine;
