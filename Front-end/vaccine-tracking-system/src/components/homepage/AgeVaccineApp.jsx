import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AgeVaccineApp = () => {
  const [combos, setCombos] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Fetch vaccine combos
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vaccinecombo");
        setCombos(response.data);

        // Chọn combo đầu tiên sau khi dữ liệu đã được tải về
        if (response.data.length > 0) {
          const firstCombo = response.data[0];
          setSelectedCombo(firstCombo);
          fetchComboDetails(firstCombo.vaccineComboId); // Lấy chi tiết cho combo đầu tiên
        }
      } catch (err) {
        setError("Không thể tải danh sách combo vaccine");
        console.error("Error fetching vaccine combos:", err);
      }
    };

    fetchCombos();
  }, []);

  // Fetch combo details when a combo is selected
  const fetchComboDetails = async (comboId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/combodetail/findcomboid?id=${comboId.toLowerCase()}`
      );
      setComboDetails(response.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải chi tiết combo vaccine");
      setLoading(false);
      console.error("Error fetching combo details:", err);
    }
  };

  const handleComboClick = (combo) => {
    setSelectedCombo(combo);
    fetchComboDetails(combo.vaccineComboId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredCombos = combos.filter(
    (combo) =>
      combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">
            Lịch Tiêm Chủng Cho Trẻ Em
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lựa chọn combo vaccine phù hợp cho trẻ từ các chuyên gia y tế hàng
            đầu
          </p>
        </div>

        {/* Alert for errors */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tìm kiếm combo vaccine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Combo List Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Combo Vaccine</h2>
                <p className="text-indigo-200 text-sm">
                  Chọn gói tiêm chủng phù hợp
                </p>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {filteredCombos.length > 0 ? (
                  filteredCombos.map((combo) => (
                    <div
                      key={combo.vaccineComboId}
                      className={`p-5 cursor-pointer transition-all ${
                        selectedCombo?.vaccineComboId === combo.vaccineComboId
                          ? "bg-indigo-50 border-l-4 border-indigo-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleComboClick(combo)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {combo.name}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {combo.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            combo.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {combo.active ? "Đang hoạt động" : "Không hoạt động"}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">
                          {formatPrice(combo.priceCombo)}
                        </span>
                        <button
                          className="inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComboClick(combo);
                          }}
                        >
                          Chi tiết
                          <svg
                            className="ml-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-4">Không tìm thấy combo vaccine phù hợp</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Combo Details Panel */}
          <div className="lg:col-span-8">
            {selectedCombo ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
                <div className="bg-indigo-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedCombo.name}
                      </h2>
                      <p className="text-indigo-200 text-sm">
                        {selectedCombo.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-800">
                      Danh sách vaccine trong combo
                    </h3>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {comboDetails.map((detail) => (
                        <div
                          key={detail.comboDetailId}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200">
                            <h4 className="font-semibold text-lg text-gray-800">
                              {detail.vaccine.name}
                            </h4>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
                              <div>
                                <p className="text-gray-500">Mô tả:</p>
                                <p className="font-medium">
                                  {detail.vaccine.description}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Xuất xứ:</p>
                                <p className="font-medium">
                                  {detail.vaccine.country}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Số liều:</p>
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {detail.vaccine.doseNumber}
                                  </span>
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    Liều
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-500">Độ tuổi:</p>
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {detail.vaccine.ageMin} -{" "}
                                    {detail.vaccine.ageMax}
                                  </span>
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    Tuổi
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <div className="flex items-center">
                                <svg
                                  className="h-5 w-5 text-green-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="ml-2 text-sm text-green-700">
                                  Phù hợp với trẻ em
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-indigo-600">
                                  {formatPrice(detail.vaccine.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Additional Info/Call to Action Section */}
                  {!loading && comboDetails.length > 0 && (
                    <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <h4 className="text-lg font-medium text-indigo-800">
                            Đặt lịch tiêm chủng
                          </h4>
                          <p className="text-indigo-600 text-sm mt-1">
                            Liên hệ với chúng tôi để đặt lịch tiêm chủng cho trẻ
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => (window.location.href = "/login")}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                          >
                            <svg
                              className="h-5 w-5 mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Đặt lịch ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <svg
                    className="h-12 w-12 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  Chọn Combo Vaccine
                </h2>
                <p className="text-gray-500 max-w-md">
                  Vui lòng chọn một gói combo vaccine từ danh sách bên trái để
                  xem thông tin chi tiết về các loại vaccine có trong gói
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Thông tin quan trọng về tiêm chủng
          </h3>
          <div className="flex justify-center items-center">
            <div className="grid md:grid-cols-2 gap-6 justify-center">
              <div className="flex justify-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">
                    Lợi ích của tiêm chủng
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Tiêm chủng giúp bảo vệ trẻ khỏi nhiều bệnh nguy hiểm và
                    phòng ngừa dịch bệnh trong cộng đồng.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-base font-medium text-gray-900">
                    Lịch tiêm chủng
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Tuân thủ lịch tiêm chủng đầy đủ và đúng thời điểm để đảm bảo
                    hiệu quả bảo vệ tối đa cho trẻ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVaccineApp;
