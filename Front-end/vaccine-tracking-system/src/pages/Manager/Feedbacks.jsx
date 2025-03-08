import React, { useEffect, useState } from "react";
import { getAllFeedback } from "../../apis/api";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiMessageSquare,
  FiCalendar,
  FiX,
  FiBookmark,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State tìm kiếm theo tiêu chí
  const [searchType, setSearchType] = useState("id");
  const [searchText, setSearchText] = useState("");
  const [rankingFilter, setRankingFilter] = useState(0);

  // Modal để xem chi tiết feedback (chỉ xem)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Lấy danh sách feedback
  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedback();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
    } catch (err) {
      console.error("Lỗi khi lấy feedback:", err);
      setError("Không thể lấy thông tin feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Áp dụng bộ lọc dựa trên tiêu chí tìm kiếm và ranking
  useEffect(() => {
    let filtered = feedbacks;
    if (searchText) {
      const lowerText = searchText.toLowerCase();
      switch (searchType) {
        case "id":
          filtered = filtered.filter((fb) =>
            String(fb.id).toLowerCase().includes(lowerText)
          );
          break;
        case "booking":
          filtered = filtered.filter((fb) =>
            fb.booking.bookingId.toLowerCase().includes(lowerText)
          );
          break;
        case "comment":
          filtered = filtered.filter(
            (fb) => fb.comment && fb.comment.toLowerCase().includes(lowerText)
          );
          break;
        case "customer":
          filtered = filtered.filter((fb) => {
            const customerName = (
              fb.booking.customer.firstName +
              " " +
              fb.booking.customer.lastName
            ).toLowerCase();
            return customerName.includes(lowerText);
          });
          break;
        default:
          break;
      }
    }
    if (rankingFilter > 0) {
      filtered = filtered.filter((fb) => fb.ranking === rankingFilter);
    }
    setFilteredFeedbacks(filtered);
  }, [feedbacks, searchType, searchText, rankingFilter]);

  // Render sao hiển thị ranking của feedback
  const renderStars = (ranking) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= ranking ? (
          <AiFillStar key={i} className="text-amber-400 inline-block" />
        ) : (
          <AiOutlineStar key={i} className="text-gray-300 inline-block" />
        )
      );
    }
    return stars;
  };

  // Component RankingFilter: hiển thị 5 sao cho việc lọc theo ranking
  const RankingFilter = () => {
    const handleStarClick = (star) => {
      // Nếu sao đã được chọn, toggle về 0 (xem tất cả)
      if (rankingFilter === star) {
        setRankingFilter(0);
      } else {
        setRankingFilter(star);
      }
    };

    return (
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Đánh giá:</span>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => handleStarClick(i)}
              className="focus:outline-none p-1 transition-transform hover:scale-110"
            >
              {i <= rankingFilter ? (
                <AiFillStar className="text-amber-400 text-xl" />
              ) : (
                <AiOutlineStar className="text-gray-300 text-xl hover:text-amber-200" />
              )}
            </button>
          ))}
          {rankingFilter > 0 && (
            <button
              onClick={() => setRankingFilter(0)}
              className="ml-1 p-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <FiX size={12} />
            </button>
          )}
        </div>
        {rankingFilter === 0 && (
          <span className="text-xs text-gray-500 -mt-1">Tất cả</span>
        )}
      </div>
    );
  };

  // Mở modal để xem chi tiết feedback
  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFeedback(null);
  };

  // Tạo màu gradient dựa trên ranking
  const getRankingGradient = (ranking) => {
    switch (ranking) {
      case 5:
        return "from-green-400 to-teal-500";
      case 4:
        return "from-teal-400 to-cyan-500";
      case 3:
        return "from-blue-400 to-indigo-500";
      case 2:
        return "from-amber-400 to-orange-500";
      case 1:
        return "from-red-400 to-rose-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  // Skeleton loader cho lúc đang tải
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 border rounded-lg shadow-sm animate-pulse h-48"
        >
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4 mb-3"></div>
          <div className="flex space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="h-4 w-4 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        </div>
      ))}
    </div>
  );

  // Render thẻ feedback
  const renderFeedbackCard = (fb) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={fb.id}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => openModal(fb)}
    >
      {/* Ranking stripe at top */}
      <div
        className={`h-2 w-full bg-gradient-to-r ${getRankingGradient(
          fb.ranking
        )}`}
      ></div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
            ID: {fb.id}
          </span>
          <div className="flex">{renderStars(fb.ranking)}</div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-teal-700 mb-1">
            {fb.booking.customer.firstName} {fb.booking.customer.lastName}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <FiBookmark className="mr-1" size={14} />
            <span>Booking: {fb.booking.bookingId}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-start">
            <FiMessageSquare
              className="text-teal-500 mt-1 mr-2 flex-shrink-0"
              size={16}
            />
            <p className="text-sm text-gray-600 line-clamp-3 font-light">
              {fb.comment ? fb.comment : "Khách hàng không để lại bình luận"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
        <p className="flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Đánh Giá & Phản Hồi
        </h2>
        <p className="text-gray-500">
          Quản lý và theo dõi đánh giá từ khách hàng
        </p>
      </header>

      {/* Thanh tìm kiếm và lọc */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Tìm kiếm theo ${
                searchType === "id"
                  ? "ID"
                  : searchType === "booking"
                  ? "mã đặt lịch"
                  : searchType === "comment"
                  ? "nội dung"
                  : "tên khách hàng"
              }...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 w-full py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchText("");
                }}
                className="w-full py-3 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none transition-all duration-200"
              >
                <option value="id">ID</option>
                <option value="booking">Mã đặt lịch</option>
                <option value="comment">Nội dung</option>
                <option value="customer">Khách hàng</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {searchType === "id" && <FiFilter className="text-gray-400" />}
                {searchType === "booking" && (
                  <FiBookmark className="text-gray-400" />
                )}
                {searchType === "comment" && (
                  <FiMessageSquare className="text-gray-400" />
                )}
                {searchType === "customer" && (
                  <FiUser className="text-gray-400" />
                )}
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.55-.24l-3.25-3.5a.75.75 0 111.1-1.02L10 15.148l2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <RankingFilter />
          </div>
        </div>
      </div>

      {/* Dashboard summary */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = feedbacks.filter((fb) => fb.ranking === star).length;
          const percentage = feedbacks.length
            ? Math.round((count / feedbacks.length) * 100)
            : 0;

          return (
            <div
              key={star}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <AiFillStar className="text-amber-400 mr-1" />
                  <span className="font-medium">{star}</span>
                </div>
                <span className="text-lg font-bold">{count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getRankingGradient(
                    star
                  )}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Danh sách feedback */}
      {filteredFeedbacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeedbacks.map((fb) => renderFeedbackCard(fb))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FiMessageSquare size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">
            Không có phản hồi nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      )}

      {/* Modal xem chi tiết feedback */}
      <AnimatePresence>
        {modalVisible && selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 shadow-xl max-w-lg w-full relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${getRankingGradient(
                  selectedFeedback.ranking
                )}`}
              ></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-50 rounded-full opacity-50"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-50 rounded-full opacity-50"></div>

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors duration-200"
              >
                <FiX size={18} />
              </button>

              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Đánh giá chi tiết
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {selectedFeedback.id}
                    </p>
                  </div>
                  <div className="flex">
                    {renderStars(selectedFeedback.ranking)}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">
                        Thông tin khách hàng
                      </span>
                      <h4 className="font-bold text-lg text-teal-700">
                        {selectedFeedback.booking.customer.firstName}{" "}
                        {selectedFeedback.booking.customer.lastName}
                      </h4>
                    </div>

                    <div className="flex items-center">
                      <FiBookmark className="text-teal-600 mr-2" size={16} />
                      <div>
                        <span className="text-sm text-gray-500">
                          Mã đặt lịch
                        </span>
                        <p className="font-medium">
                          {selectedFeedback.booking.bookingId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <FiMessageSquare
                        className="text-teal-600 mr-2"
                        size={16}
                      />
                      <h4 className="font-medium text-gray-700">
                        Nội dung đánh giá
                      </h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 italic">
                        {selectedFeedback.comment ? (
                          `"${selectedFeedback.comment}"`
                        ) : (
                          <span className="text-gray-400">
                            Khách hàng không để lại bình luận
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feedbacks;
