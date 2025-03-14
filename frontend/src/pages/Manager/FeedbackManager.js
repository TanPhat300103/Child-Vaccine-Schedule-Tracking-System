import React, { useEffect, useState } from "react";
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
import "../../style/Feedbacks.css";

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("id");
  const [searchText, setSearchText] = useState("");
  const [rankingFilter, setRankingFilter] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const getAllFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch feedback");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedback();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
    } catch (err) {
      setError("Không thể lấy thông tin feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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

  const renderStars = (ranking) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= ranking ? (
          <AiFillStar key={i} className="star-filled-feedbackmanager" />
        ) : (
          <AiOutlineStar key={i} className="star-outline-feedbackmanager" />
        )
      );
    }
    return stars;
  };

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFeedback(null);
  };

  const getRankingGradient = (ranking) => {
    switch (ranking) {
      case 5:
        return "gradient-green-teal-feedbackmanager";
      case 4:
        return "gradient-teal-cyan-feedbackmanager";
      case 3:
        return "gradient-blue-indigo-feedbackmanager";
      case 2:
        return "gradient-amber-orange-feedbackmanager";
      case 1:
        return "gradient-red-rose-feedbackmanager";
      default:
        return "gradient-gray-feedbackmanager";
    }
  };

  const SkeletonLoader = () => (
    <div className="skeleton-container-feedbackmanager">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-card-feedbackmanager"></div>
      ))}
    </div>
  );

  const renderFeedbackCard = (fb) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      key={fb.id}
      className="feedback-card-feedbackmanager"
      onClick={() => openModal(fb)}
    >
      <div className="feedback-card-content-feedbackmanager">
        <span className="feedback-id-feedbackmanager">ID: {fb.id}</span>
        <h3 className="customer-name-feedbackmanager">
          {fb.booking.customer.firstName} {fb.booking.customer.lastName}
        </h3>
        <p className="booking-info-feedbackmanager">
          <span className="booking-label-feedbackmanager">Booking:</span>{" "}
          {fb.booking.bookingId}
        </p>
      </div>
      <div className="stars-display-feedbackmanager">
        {renderStars(fb.ranking)}
      </div>
    </motion.div>
  );

  const handleStarFilterClick = (star) => {
    if (rankingFilter === star) {
      setRankingFilter(0); // Reset filter nếu click lại vào cùng sao
    } else {
      setRankingFilter(star); // Set filter mới
    }
  };

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="error-container-feedbackmanager">
        <p className="error-text-feedbackmanager">
          <span className="error-icon-feedbackmanager">⚠️</span> {error}
        </p>
      </div>
    );

  return (
    <div className="main-container-feedbackmanager">
      <header className="header-feedbackmanager">
        <h2 className="title-feedbackmanager">Đánh Giá & Phản Hồi</h2>
        <p className="subtitle-feedbackmanager">
          Quản lý và theo dõi đánh giá từ khách hàng
        </p>
      </header>

      <div className="search-filter-container-feedbackmanager">
        <div className="search-grid-feedbackmanager">
          <div className="search-input-container-feedbackmanager">
            <FiSearch className="search-icon-feedbackmanager" />
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
              className="search-input-feedbackmanager"
            />
          </div>

          <div className="search-type-container-feedbackmanager">
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchText("");
              }}
              className="search-type-select-feedbackmanager"
            >
              <option value="id">ID</option>
              <option value="booking">Mã đặt lịch</option>
              <option value="comment">Nội dung</option>
              <option value="customer">Khách hàng</option>
            </select>
            <div className="search-type-icon-feedbackmanager">
              {searchType === "id" && <FiFilter />}
              {searchType === "booking" && <FiBookmark />}
              {searchType === "comment" && <FiMessageSquare />}
              {searchType === "customer" && <FiUser />}
            </div>
            <svg
              className="dropdown-arrow-feedbackmanager"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
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

      <div className="dashboard-summary-feedbackmanager">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = feedbacks.filter((fb) => fb.ranking === star).length;
          const percentage = feedbacks.length
            ? Math.round((count / feedbacks.length) * 100)
            : 0;
          const isActive = rankingFilter === star;

          return (
            <div
              key={star}
              className={`summary-card-feedbackmanager ${
                isActive ? "active-filter-feedbackmanager" : ""
              }`}
              onClick={() => handleStarFilterClick(star)}
              style={{ cursor: "pointer" }}
            >
              <div className="summary-header-feedbackmanager">
                <div className="star-count-feedbackmanager">
                  <AiFillStar className="star-filled-feedbackmanager" />
                  <span className="star-number-feedbackmanager">{star}</span>
                </div>
                <span className="count-feedbackmanager">{count}</span>
              </div>
              <div className="progress-bar-container-feedbackmanager">
                <div
                  className={`progress-bar-feedbackmanager ${getRankingGradient(
                    star
                  )}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="percentage-feedbackmanager">{percentage}%</div>
            </div>
          );
        })}
      </div>

      {filteredFeedbacks.length > 0 ? (
        <div className="feedback-list-feedbackmanager">
          {filteredFeedbacks.map((fb) => renderFeedbackCard(fb))}
        </div>
      ) : (
        <div className="no-feedback-container-feedbackmanager">
          <div className="no-feedback-icon-feedbackmanager">
            <FiMessageSquare size={24} />
          </div>
          <p className="no-feedback-text-feedbackmanager">
            Không có phản hồi nào phù hợp với điều kiện tìm kiếm.
          </p>
        </div>
      )}

      <AnimatePresence>
        {modalVisible && selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay-feedbackmanager"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-container-feedbackmanager"
            >
              <div
                className={`modal-header-gradient-feedbackmanager ${getRankingGradient(
                  selectedFeedback.ranking
                )}`}
              ></div>
              <div className="modal-decor-top-feedbackmanager"></div>
              <div className="modal-decor-bottom-feedbackmanager"></div>

              <button
                onClick={closeModal}
                className="modal-close-button-feedbackmanager"
              >
                <FiX size={18} />
              </button>

              <div className="modal-content-feedbackmanager">
                <div className="modal-header-content-feedbackmanager">
                  <div>
                    <h3 className="modal-title-feedbackmanager">
                      Đánh giá chi tiết
                    </h3>
                    <p className="modal-id-feedbackmanager">
                      ID: {selectedFeedback.id}
                    </p>
                  </div>
                  <div className="modal-stars-feedbackmanager">
                    {renderStars(selectedFeedback.ranking)}
                  </div>
                </div>

                <div className="modal-body-feedbackmanager">
                  <div className="customer-info-feedbackmanager">
                    <div className="customer-info-header-feedbackmanager">
                      <span className="info-label-feedbackmanager">
                        Thông tin khách hàng
                      </span>
                      <h4 className="customer-name-modal-feedbackmanager">
                        {selectedFeedback.booking.customer.firstName}{" "}
                        {selectedFeedback.booking.customer.lastName}
                      </h4>
                    </div>
                    <div className="booking-info-modal-feedbackmanager">
                      <FiBookmark
                        className="booking-icon-feedbackmanager"
                        size={16}
                      />
                      <div>
                        <span className="booking-label-modal-feedbackmanager">
                          Mã đặt lịch
                        </span>
                        <p className="booking-id-modal-feedbackmanager">
                          {selectedFeedback.booking.bookingId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="comment-section-feedbackmanager">
                    <div className="comment-header-feedbackmanager">
                      <FiMessageSquare
                        className="comment-icon-feedbackmanager"
                        size={16}
                      />
                      <h4 className="comment-title-feedbackmanager">
                        Nội dung đánh giá
                      </h4>
                    </div>
                    <div className="comment-content-feedbackmanager">
                      <p className="comment-text-feedbackmanager">
                        {selectedFeedback.comment ? (
                          `"${selectedFeedback.comment}"`
                        ) : (
                          <span className="no-comment-feedbackmanager">
                            Khách hàng không để lại bình luận
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer-feedbackmanager">
                  <button
                    onClick={closeModal}
                    className="close-button-feedbackmanager"
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
