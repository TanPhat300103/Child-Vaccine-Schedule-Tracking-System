import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CustomerPage/BookingCustomer.css";
import {
  User,
  BookOpen,
  CreditCard,
  Calendar,
  Star,
  X,
  Syringe,
} from "lucide-react";
import { useAuth } from "../../components/common/AuthContext";

function BookingCustomer() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  let ratingA, ratingB;

  // xu ly filter loc
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (booking) =>
          booking.bookingId.toString().includes(searchTerm) ||
          new Date(booking.bookingDate)
            .toLocaleDateString()
            .includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (booking) => booking.status === parseInt(statusFilter)
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      result = result.filter((booking) => {
        const feedback = feedbacks[booking.bookingId];
        return feedback && feedback.ranking === parseInt(ratingFilter);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.bookingDate) - new Date(b.bookingDate);
        case "date-desc":
          return new Date(b.bookingDate) - new Date(a.bookingDate);
        case "rating-asc":
          ratingA = feedbacks[a.bookingId]?.ranking || 0;
          ratingB = feedbacks[b.bookingId]?.ranking || 0;
          return ratingA - ratingB;
        case "rating-desc":
          ratingA = feedbacks[a.bookingId]?.ranking || 0;
          ratingB = feedbacks[b.bookingId]?.ranking || 0;
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, feedbacks, searchTerm, statusFilter, ratingFilter, sortBy]);

  // lay api customer
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        const customerResponse = await fetch(
          `http://localhost:8080/customer/findid?id=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!customerResponse.ok)
          throw new Error("Không tìm thấy thông tin khách hàng");
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        const bookingsResponse = await fetch(
          `http://localhost:8080/booking/findbycustomer?customerId=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!bookingsResponse.ok)
          throw new Error("Không tìm thấy thông tin booking");
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const feedbackPromises = bookingsData.map((booking) =>
          fetch(
            `http://localhost:8080/feedback/getbybooking?bookingId=${booking.bookingId}`,
            {
              method: "GET",
              credentials: "include",
            }
          )
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        );
        const feedbackResults = await Promise.all(feedbackPromises);
        const feedbackMap = {};
        bookingsData.forEach((booking, index) => {
          if (feedbackResults[index]) {
            feedbackMap[booking.bookingId] = feedbackResults[index];
          }
        });
        setFeedbacks(feedbackMap);
      } catch (err) {
        setError("Lỗi khi lấy thông tin: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleFeedbackClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setRating(0);
    setComment("");
    setShowFeedbackModal(true);
  };

  const handleRatingClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setEditRating(feedbacks[bookingId]?.ranking || 0);
    setEditComment(feedbacks[bookingId]?.comment || "");
    setEditFeedbackId(feedbacks[bookingId]?.id || null);
    setShowDetailModal(true);
  };

  // xu ly api submit feedback
  const handleSubmitFeedback = async () => {
    if (!selectedBookingId || rating === 0) return;

    const feedbackData = {
      booking: { bookingId: selectedBookingId },
      ranking: rating,
      comment: comment || "none",
    };

    try {
      const response = await fetch("http://localhost:8080/feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setFeedbacks((prev) => ({ ...prev, [selectedBookingId]: newFeedback }));
        setShowFeedbackModal(false);
      } else {
        alert("Lỗi khi gửi feedback");
      }
    } catch (err) {
      alert("Lỗi khi gửi feedback: " + err.message);
    }
  };

  // xu ly api update feedback
  const handleUpdateFeedback = async () => {
    if (!selectedBookingId || editRating === 0) return;

    const feedbackData = {
      id: editFeedbackId,
      booking: { bookingId: selectedBookingId },
      ranking: editRating,
      comment: editComment || "none",
    };

    try {
      const response = await fetch("http://localhost:8080/feedback/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const updatedFeedback = await response.json();
        setFeedbacks((prev) => ({
          ...prev,
          [selectedBookingId]: updatedFeedback,
        }));
        setShowDetailModal(false);
      } else {
        const errorData = await response.json();
        alert(
          "Lỗi khi cập nhật feedback: " + (errorData.message || "Bad Request")
        );
      }
    } catch (err) {
      alert("Lỗi khi cập nhật feedback: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="profile-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" fill="none">
            <defs>
              <pattern
                id="vaccine-pattern"
                patternUnits="userSpaceOnUse"
                width="60"
                height="60"
                patternTransform="rotate(45)"
              >
                <path d="M10 10L50 50" stroke="white" strokeWidth="2" />
                <circle cx="30" cy="30" r="5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vaccine-pattern)" />
          </svg>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path
              fill="#f9fafb"
              d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-section" style={{ opacity: 1 }}>
              {/* Search and Filter Bar with Tailwind CSS */}
              {bookings.length > 0 && (
                <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Tìm kiếm theo ID hoặc ngày..."
                          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="3">Đã hủy</option>
                        <option value="2">Đã hoàn thành</option>
                        <option value="1">Đã đặt</option>
                      </select>

                      {/* Rating Filter */}
                      <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Tất cả đánh giá</option>
                        <option value="5">5 sao</option>
                        <option value="4">4 sao</option>
                        <option value="3">3 sao</option>
                        <option value="2">2 sao</option>
                        <option value="1">1 sao</option>
                      </select>

                      {/* Sort By */}
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Display */}
              {filteredBookings.length > 0 ? (
                <div className="profile-bookings-grid">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="profile-booking-card"
                    >
                      <div className="profile-booking-header">
                        <div className="profile-booking-info">
                          <h3>Booking #{booking.bookingId}</h3>
                          <p className="profile-booking-date">
                            <Calendar size={14} />
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        {feedbacks[booking.bookingId] && (
                          <div
                            className="profile-booking-rating"
                            onClick={() => handleRatingClick(booking.bookingId)}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={
                                  star <= feedbacks[booking.bookingId].ranking
                                    ? "star-filled"
                                    : "star-empty"
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="profile-booking-details">
                        <div className="profile-booking-detail-item">
                          <span className="profile-booking-detail-label">
                            Trạng thái:
                          </span>
                          <span
                            className={`profile-status ${
                              booking.status === 1
                                ? "pending"
                                : booking.status === 2
                                ? "completed"
                                : "canceled"
                            }`}
                          >
                            {booking.status === 1
                              ? "Đã đặt"
                              : booking.status === 2
                              ? "Đã hoàn thành"
                              : "Đã hủy"}
                          </span>
                        </div>
                        <div className="profile-booking-detail-item">
                          <span className="profile-booking-detail-label">
                            Tổng tiền:
                          </span>
                          <span className="profile-booking-detail-value">
                            {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </div>
                      <div className="profile-booking-actions">
                        <Link
                          to={`/booking-detail/${booking.bookingId}`}
                          className="profile-booking-detail-btn"
                        >
                          Xem chi tiết
                        </Link>
                        {booking.status === 2 &&
                          !feedbacks[booking.bookingId] && (
                            <button
                              className="profile-feedback-btn"
                              onClick={() =>
                                handleFeedbackClick(booking.bookingId)
                              }
                            >
                              Viết đánh giá
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="profile-no-bookings">
                  <div className="profile-no-data-icon">📅</div>
                  <p>
                    {bookings.length === 0
                      ? "Bạn chưa có booking nào. Vui lòng tạo booking để bắt đầu."
                      : "Không tìm thấy booking phù hợp với bộ lọc."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Modal (Viết đánh giá) */}
        {showFeedbackModal && (
          <div className="feedback-modal-overlay">
            <div className="feedback-modal">
              <div className="feedback-modal-header">
                <h3>Đánh giá Booking #{selectedBookingId}</h3>
                <button
                  className="feedback-modal-close"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="feedback-modal-body">
                <div className="feedback-rating">
                  <label>Xếp hạng:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={
                          star <= rating ? "star-filled" : "star-empty"
                        }
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div className="feedback-comment">
                  <label>Bình luận:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn (tùy chọn)"
                  />
                </div>
              </div>
              <div className="feedback-modal-footer">
                <button
                  className="feedback-submit-btn"
                  onClick={handleSubmitFeedback}
                >
                  Gửi đánh giá
                </button>
                <button
                  className="feedback-cancel-btn"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Detail Modal (Xem và chỉnh sửa đánh giá) */}
        {showDetailModal && (
          <div className="feedback-modal-overlay">
            <div className="feedback-modal">
              <div className="feedback-modal-header">
                <h3>Chỉnh sửa đánh giá Booking #{selectedBookingId}</h3>
                <button
                  className="feedback-modal-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="feedback-modal-body">
                <div className="feedback-rating">
                  <label>Xếp hạng:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={
                          star <= editRating ? "star-filled" : "star-empty"
                        }
                        onClick={() => setEditRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div className="feedback-comment">
                  <label>Bình luận:</label>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn (tùy chọn)"
                  />
                </div>
              </div>
              <div className="feedback-modal-footer">
                <button
                  className="feedback-submit-btn"
                  onClick={handleUpdateFeedback}
                >
                  Cập nhật
                </button>
                <button
                  className="feedback-cancel-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCustomer;
