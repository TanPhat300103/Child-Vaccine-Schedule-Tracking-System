// src/pages/Staff/Feedbacks.jsx
import React, { useEffect, useState } from "react";
import { getAllFeedback } from "../../apis/api";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State tìm kiếm theo tiêu chí
  const [searchType, setSearchType] = useState("id"); // "id", "booking", "comment", "customer"
  const [searchText, setSearchText] = useState("");
  // Ranking filter: 0 có nghĩa là "Tất cả", 1-5 là số sao cụ thể
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
          <AiFillStar key={i} className="text-yellow-500 inline-block" />
        ) : (
          <AiOutlineStar key={i} className="text-gray-400 inline-block" />
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

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleStarClick(i)}
          className="focus:outline-none"
        >
          {i <= rankingFilter ? (
            <AiFillStar className="text-yellow-500 text-2xl" />
          ) : (
            <AiOutlineStar className="text-gray-400 text-2xl" />
          )}
        </button>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <span className="font-bold">Xếp Hạng:</span>
        {stars}
        {rankingFilter === 0 && <span className="text-gray-500">ALL</span>}
      </div>
    );
  };

  // Mở modal để xem chi tiết feedback (chỉ xem)
  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFeedback(null);
  };

  // Render thẻ feedback
  const renderFeedbackCard = (fb) => (
    <div
      key={fb.id}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
      onClick={() => openModal(fb)}
    >
      <p className="font-bold">ID: {fb.id}</p>
      <p className="text-lg font-bold text-indigo-600">
        Tên Khách Hàng: {fb.booking.customer.firstName}{" "}
        {fb.booking.customer.lastName}
      </p>
      <p>Booking ID: {fb.booking.bookingId}</p>
      <p>Ranking: {renderStars(fb.ranking)}</p>
      <p>Comment: {fb.comment ? fb.comment : "Không có"}</p>
    </div>
  );

  if (loading) return <p>Đang tải feedback...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Quản Lý Feedback</h2>

      {/* Thanh tìm kiếm */}
      <div className="mb-6 p-4 border rounded-md flex flex-col md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-3 py-2 border rounded-md flex-1 mb-4 md:mb-0"
        />
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setSearchText("");
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="id">ID</option>
          <option value="booking">Booking ID</option>
          <option value="comment">Comment</option>
          <option value="customer">Customer</option>
        </select>
        <RankingFilter />
      </div>

      {/* Danh sách feedback */}
      {filteredFeedbacks.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto">
          {filteredFeedbacks.map((fb) => renderFeedbackCard(fb))}
        </div>
      ) : (
        <p>Không có feedback nào phù hợp.</p>
      )}

      {/* Modal xem chi tiết feedback */}
      {modalVisible && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">
              Chi tiết Feedback: {selectedFeedback.id}
            </h3>
            <p className="mb-2 font-bold">
              Tên Khách Hàng: {selectedFeedback.booking.customer.firstName}{" "}
              {selectedFeedback.booking.customer.lastName}
            </p>
            <p className="mb-2">
              Booking ID: {selectedFeedback.booking.bookingId}
            </p>
            <p className="mb-2">
              Ranking: {renderStars(selectedFeedback.ranking)}
            </p>
            <p className="mb-2">
              Comment:{" "}
              {selectedFeedback.comment ? selectedFeedback.comment : "Không có"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
