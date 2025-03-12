import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../style/MyBookingsPage.css';
import { User, BookOpen, CreditCard, Calendar, Star, X } from 'lucide-react';

function MyBookingsPage() {
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
  const [comment, setComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [editFeedbackId, setEditFeedbackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError('Không tìm thấy ID người dùng');
        setLoading(false);
        return;
      }

      try {
        const customerResponse = await fetch(`http://localhost:8080/customer/findid?id=${userInfo.userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!customerResponse.ok) throw new Error('Không tìm thấy thông tin khách hàng');
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        const bookingsResponse = await fetch(`http://localhost:8080/booking/findbycustomer?customerId=${userInfo.userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!bookingsResponse.ok) throw new Error('Không tìm thấy thông tin booking');
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const feedbackPromises = bookingsData.map(booking =>
          fetch(`http://localhost:8080/feedback/getbybooking?bookingId=${booking.bookingId}`, {
            method: 'GET',
            credentials: 'include',
          })
            .then(res => res.ok ? res.json() : null)
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
        setError('Lỗi khi lấy thông tin: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleFeedbackClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setRating(0);
    setComment('');
    setShowFeedbackModal(true);
  };

  const handleRatingClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setEditRating(feedbacks[bookingId]?.ranking || 0);
    setEditComment(feedbacks[bookingId]?.comment || '');
    setEditFeedbackId(feedbacks[bookingId]?.id || null);
    setShowDetailModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedBookingId || rating === 0) return;

    const feedbackData = {
      booking: { bookingId: selectedBookingId },
      ranking: rating,
      comment: comment || 'none',
    };

    try {
      const response = await fetch('http://localhost:8080/feedback/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setFeedbacks(prev => ({ ...prev, [selectedBookingId]: newFeedback }));
        setShowFeedbackModal(false);
      } else {
        alert('Lỗi khi gửi feedback');
      }
    } catch (err) {
      alert('Lỗi khi gửi feedback: ' + err.message);
    }
  };

  const handleUpdateFeedback = async () => {
    if (!selectedBookingId || editRating === 0) return;

    const feedbackData = {
      id: editFeedbackId,
      booking: { bookingId: selectedBookingId },
      ranking: editRating,
      comment: editComment || 'none',
    };

    try {
      const response = await fetch('http://localhost:8080/feedback/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        const updatedFeedback = await response.json();
        setFeedbacks(prev => ({ ...prev, [selectedBookingId]: updatedFeedback }));
        setShowDetailModal(false);
      } else {
        const errorData = await response.json();
        alert('Lỗi khi cập nhật feedback: ' + (errorData.message || 'Bad Request'));
      }
    } catch (err) {
      alert('Lỗi khi cập nhật feedback: ' + err.message);
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
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-user-info">
          <div className="profile-avatar">
            {customer?.firstName?.charAt(0)}{customer?.lastName?.charAt(0)}
          </div>
          <div className="profile-user-text">
            <h1>{customer?.firstName} {customer?.lastName}</h1>
            <p>{customer?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-sidebar-item" onClick={() => navigate('/profile')}>
            <User size={18} />
            <span>Thông Tin Cá Nhân</span>
          </div>
          <div className="profile-sidebar-item" onClick={() => navigate('/child-info')}>
            <Calendar size={18} />
            <span>Thông Tin Con</span>
          </div>
          <div className="profile-sidebar-item active">
            <BookOpen size={18} />
            <span>My Booking</span>
          </div>
          <div className="profile-sidebar-item" onClick={() => navigate('/my-payments')}>
            <CreditCard size={18} />
            <span>My Payment</span>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-section" style={{ opacity: 1 }}>
            <div className="profile-section-header">
              <h2>My Booking</h2>
            </div>
            {bookings.length > 0 ? (
              <div className="profile-bookings-grid">
                {bookings.map((booking) => (
                  <div key={booking.bookingId} className="profile-booking-card">
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
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= feedbacks[booking.bookingId].ranking ? 'star-filled' : 'star-empty'}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="profile-booking-details">
                      <div className="profile-booking-detail-item">
                        <span className="profile-booking-detail-label">Trạng thái:</span>
                        <span
                          className={`profile-status ${booking.status === 1 ? 'active' : booking.status === 2 ? 'completed' : 'canceled'
                            }`}
                        >
                          {booking.status === 1
                            ? 'Đang tiến hành'
                            : booking.status === 2
                              ? 'Đã hoàn thành'
                              : booking.status === 3
                                ? 'Đã hủy'
                                : 'Không xác định'}
                        </span>
                      </div>
                      <div className="profile-booking-detail-item">
                        <span className="profile-booking-detail-label">Tổng tiền:</span>
                        <span className="profile-booking-detail-value">
                          {booking.totalAmount.toLocaleString('vi-VN')} VNĐ
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
                      {!feedbacks[booking.bookingId] && booking.status === 2 && (
                        <button
                          className="profile-feedback-btn"
                          onClick={() => handleFeedbackClick(booking.bookingId)}
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
                <p>Bạn chưa có booking nào. Vui lòng tạo booking để bắt đầu.</p>
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
              <button className="feedback-modal-close" onClick={() => setShowFeedbackModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="feedback-modal-body">
              <div className="feedback-rating">
                <label>Xếp hạng:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={24}
                      className={star <= rating ? 'star-filled' : 'star-empty'}
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
              <button className="feedback-submit-btn" onClick={handleSubmitFeedback}>
                Gửi đánh giá
              </button>
              <button className="feedback-cancel-btn" onClick={() => setShowFeedbackModal(false)}>
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
              <button className="feedback-modal-close" onClick={() => setShowDetailModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="feedback-modal-body">
              <div className="feedback-rating">
                <label>Xếp hạng:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={24}
                      className={star <= editRating ? 'star-filled' : 'star-empty'}
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
              <button className="feedback-submit-btn" onClick={handleUpdateFeedback}>
                Cập nhật
              </button>
              <button className="feedback-cancel-btn" onClick={() => setShowDetailModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;