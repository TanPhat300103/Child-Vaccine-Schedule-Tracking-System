import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../style/MyBookingsPage.css';
import { User, BookOpen, CreditCard, Calendar, Star, X, Search } from 'lucide-react';

function MyBookingsPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [children, setChildren] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [selectedChildId, setSelectedChildId] = useState(null); // Thêm state cho childId

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

        const childrenResponse = await fetch(`http://localhost:8080/child/findbycustomer?id=${userInfo.userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!childrenResponse.ok) throw new Error('Không tìm thấy thông tin con');
        const childrenData = await childrenResponse.json();
        setChildren(childrenData);

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

  useEffect(() => {
    const fetchBookingDetailsAndFilter = async () => {
      let result = [...bookings];

      // Lọc theo searchTerm
      if (searchTerm) {
        result = result.filter(booking =>
          booking.bookingId.toString().includes(searchTerm) ||
          new Date(booking.bookingDate).toLocaleDateString().includes(searchTerm)
        );
      }

      // Lọc theo statusFilter
      if (statusFilter !== 'all') {
        result = result.filter(booking => booking.status === parseInt(statusFilter));
      }

      // Lọc theo feedbackFilter
      if (feedbackFilter !== 'all') {
        result = result.filter(booking =>
          feedbackFilter === 'with' ? !!feedbacks[booking.bookingId] : !feedbacks[booking.bookingId]
        );
      }

      // Lọc theo selectedChildId (nếu có)
      if (selectedChildId) {
        const detailsPromises = result.map(booking =>
          fetch(`http://localhost:8080/bookingdetail/findbybooking?id=${booking.bookingId}`, {
            method: 'GET',
            credentials: 'include',
          }).then(res => res.ok ? res.json() : [])
        );
        const detailsResults = await Promise.all(detailsPromises);
        result = result.filter((booking, index) => {
          const details = detailsResults[index];
          return details.some(detail => detail.child.childId === selectedChildId);
        });
      }

      setFilteredBookings(result);
    };

    fetchBookingDetailsAndFilter();
  }, [searchTerm, statusFilter, feedbackFilter, bookings, feedbacks, selectedChildId]);

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

  // Hàm xử lý khi click vào child để lọc booking
  const handleChildClick = (childId) => {
    setSelectedChildId(childId === selectedChildId ? null : childId); // Toggle child selection
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

            <div className="profile-search-bar">
              <input
                type="text"
                className="profile-search-input"
                placeholder="Tìm kiếm theo ID hoặc ngày đặt (dd/mm/yyyy)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="profile-search-btn">
                <Search size={18} />
                Tìm kiếm
              </button>
            </div>

            <div className="profile-filter-and-children">
              <div className="profile-filters">
                <select
                  className="profile-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="1">Đang tiến hành</option>
                  <option value="2">Đã hoàn thành</option>
                  <option value="3">Đã hủy</option>
                </select>
                <select
                  className="profile-filter-select"
                  value={feedbackFilter}
                  onChange={(e) => setFeedbackFilter(e.target.value)}
                >
                  <option value="all">Tất cả feedback</option>
                  <option value="with">Có feedback</option>
                  <option value="without">Không có feedback</option>
                </select>
              </div>

              <div className="profile-children-container">
                {children.map(child => (
                  <div
                    key={child.childId}
                    className={`profile-child-card ${selectedChildId === child.childId ? 'selected' : ''}`}
                    onClick={() => handleChildClick(child.childId)}
                  >
                    <div className="profile-child-info">
                      <h4>{child.firstName} {child.lastName}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredBookings.length > 0 ? (
              <div className="profile-bookings-grid">
                {filteredBookings.map((booking) => (
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
                          className={`profile-status ${booking.status === 1 ? 'active' : booking.status === 2 ? 'completed' : 'canceled'}`}
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
                <p>Không tìm thấy booking nào phù hợp với bộ lọc.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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