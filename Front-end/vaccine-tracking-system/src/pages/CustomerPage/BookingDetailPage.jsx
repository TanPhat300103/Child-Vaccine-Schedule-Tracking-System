import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../CustomerPage/BookingDetailPage.css";
import {
  Calendar,
  Shield,
  DollarSign,
  Syringe,
  BookOpen,
  CheckCircle,
  XCircle,
  Save,
  ChevronDown,
  ChevronUp,
  StepBack,
} from "lucide-react";
import { useAuth } from "../../components/common/AuthContext";

function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [booking, setBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDetailId, setExpandedDetailId] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingReaction, setEditingReaction] = useState(null);
  const [reactionNote, setReactionNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        const bookingsResponse = await fetch(
          `http://localhost:8080/booking/findbycustomer?customerId=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!bookingsResponse.ok)
          throw new Error("Không tìm thấy danh sách booking");
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const detailsResponse = await fetch(
          `http://localhost:8080/bookingdetail/findbybooking?id=${bookingId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!detailsResponse.ok)
          throw new Error("Không tìm thấy chi tiết booking");
        const detailsData = await detailsResponse.json();
        console.log("Booking details data:", detailsData);

        const sortedDetails = detailsData.sort(
          (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)
        );
        setBookingDetails(sortedDetails);

        if (detailsData.length > 0) {
          setBooking(detailsData[0].booking);
        }
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, userInfo]);

  const groupByDate = (details) => {
    const grouped = {};
    details.forEach((detail) => {
      const date = new Date(detail.scheduledDate).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(detail);
    });
    return grouped;
  };

  const groupedDetails = groupByDate(bookingDetails);

  const toggleDetail = (detailId) => {
    setExpandedDetailId((prev) => (prev === detailId ? null : detailId));
    setEditingReaction(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleBookingSelect = (selectedBookingId) => {
    navigate(`/booking-detail/${selectedBookingId}`);
    setIsDropdownOpen(false);
  };

  const startEditingReaction = (detailId, currentReaction) => {
    setEditingReaction(detailId);
    setReactionNote(currentReaction || "");
  };

  const handleReactionChange = (e) => {
    setReactionNote(e.target.value);
  };

  const updateReaction = async (detailId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/bookingdetail/updatereaction?id=${detailId}&reaction=${encodeURIComponent(
          reactionNote
        )}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật trạng thái sau tiêm");
      }

      const updatedDetail = await response.json();
      setBookingDetails((prev) =>
        prev.map((detail) =>
          detail.bookingDetailId === detailId
            ? { ...detail, reactionNote: updatedDetail.reactionNote }
            : detail
        )
      );
      setEditingReaction(null);
    } catch (err) {
      setError("Lỗi khi cập nhật trạng thái: " + err.message);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Chưa tiêm";
      case 2:
        return "Đã tiêm";
      case 3:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "pending";
      case 2:
        return "active";
      case 3:
        return "inactive";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="bookingdetail-loading">
        <div className="bookingdetail-loading-spinner"></div>
        <p>Đang tải chi tiết booking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookingdetail-error">
        <div className="bookingdetail-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bookingdetail-error">
        <div className="bookingdetail-error-icon">⚠️</div>
        <p>Không tìm thấy thông tin booking.</p>
      </div>
    );
  }

  return (
    <div className="bookingdetail-container">
      <div className="bookingdetail-header">
        <div className="bookingdetail-header-info">
          <div className="bookingdetail-avatar">
            <Syringe size={32} />
          </div>
          <div className="bookingdetail-header-text">
            <h1>Booking #{booking.bookingId}</h1>
            <div className="bookingdetail-header-details">
              <p>
                <Calendar size={16} /> Ngày đặt:{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p>
                <DollarSign size={16} /> Tổng tiền:{" "}
                {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
              </p>
              <p>
                <Shield size={16} /> Trạng thái:{" "}
                <span
                  className={`bookingdetail-status ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {getStatusText(booking.status)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bookingdetail-content">
        <div className="bookingdetail-sidebar">
          <div
            className={`bookingdetail-sidebar-item ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => handleTabChange("bookings")}
          >
            <div className="bookingdetail-sidebar-content">
              <BookOpen size={18} />
              <span>My Booking</span>
            </div>
            <button
              className="bookingdetail-dropdown-toggle"
              onClick={toggleDropdown}
            >
              {isDropdownOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
          {isDropdownOpen && (
            <div className="bookingdetail-dropdown">
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className={`bookingdetail-dropdown-item ${
                    b.bookingId === bookingId ? "selected" : ""
                  }`}
                  onClick={() => handleBookingSelect(b.bookingId)}
                >
                  <span>Booking #{b.bookingId}</span>
                  <span>{new Date(b.bookingDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bookingdetail-main">
          <div className="bookingdetail-section">
            <h2 className="bookingdetail-section-title">
              {" "}
              <div className="bookingdetail-sidebar-content">
                <StepBack size={30} />
                <h1>
                  <a href="/customer/booking">Quay về</a>
                </h1>
              </div>{" "}
              Danh Sách Mũi Tiêm{" "}
            </h2>

            {bookingDetails.length > 0 ? (
              <div className="bookingdetail-details-list">
                {Object.keys(groupedDetails).map((date) => (
                  <div key={date} className="bookingdetail-date-group">
                    <div className="bookingdetail-date-label">
                      <span>{date}</span>
                    </div>
                    <div className="bookingdetail-date-items">
                      {groupedDetails[date].map((detail) => {
                        const isExpanded =
                          detail.bookingDetailId === expandedDetailId;
                        const statusClass = getStatusClass(detail.status);
                        const isEditing =
                          editingReaction === detail.bookingDetailId;
                        return (
                          <div
                            key={detail.bookingDetailId}
                            className={`bookingdetail-card ${statusClass}`}
                          >
                            <div
                              className="bookingdetail-card-header"
                              onClick={() =>
                                toggleDetail(detail.bookingDetailId)
                              }
                            >
                              <div className="bookingdetail-card-info">
                                <div className="bookingdetail-card-icon-wrapper">
                                  {detail.status === 2 ? (
                                    <CheckCircle
                                      size={20}
                                      className="bookingdetail-card-icon active"
                                    />
                                  ) : detail.status === 3 ? (
                                    <XCircle
                                      size={20}
                                      className="bookingdetail-card-icon inactive"
                                    />
                                  ) : (
                                    <Syringe
                                      size={20}
                                      className="bookingdetail-card-icon pending"
                                    />
                                  )}
                                </div>
                                <div>
                                  <h3>
                                    {detail.vaccine.name} -{" "}
                                    {detail.child.firstName}{" "}
                                    {detail.child.lastName}
                                  </h3>
                                  <p className="bookingdetail-card-date">
                                    <Calendar size={14} /> Dự kiến:{" "}
                                    {new Date(
                                      detail.scheduledDate
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="bookingdetail-card-status">
                                    Trạng thái:{" "}
                                    <span
                                      className={`bookingdetail-status ${statusClass}`}
                                    >
                                      {getStatusText(detail.status)}
                                    </span>{" "}
                                    | Combo:{" "}
                                    {detail.vaccineCombo?.name || "Không có"}
                                  </p>

                                  <p className="bookingdetail-card-administered">
                                    {detail.administeredDate
                                      ? `Đã tiêm: ${new Date(
                                          detail.administeredDate
                                        ).toLocaleDateString()}`
                                      : "Chưa tiêm"}
                                  </p>
                                </div>
                              </div>
                              <button className="bookingdetail-toggle-btn">
                                {isExpanded ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="bookingdetail-card-details">
                                <div className="bookingdetail-detail-section">
                                  <h4>Thông Tin Trẻ</h4>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Tên:
                                    </span>
                                    <span className="bookingdetail-detail-value">
                                      {detail.child.firstName}{" "}
                                      {detail.child.lastName}
                                    </span>
                                  </div>
                                </div>
                                <div className="bookingdetail-detail-section">
                                  <h4>Thông Tin Vaccine</h4>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Tên Vaccine:
                                    </span>
                                    <span className="bookingdetail-detail-value">
                                      {detail.vaccine.name} (Dose{" "}
                                      {detail.vaccine.doseNumber})
                                    </span>
                                  </div>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Combo:
                                    </span>
                                    <span className="bookingdetail-detail-value">
                                      {detail.vaccineCombo?.name || "Không có"}
                                    </span>
                                  </div>
                                </div>
                                <div className="bookingdetail-detail-section">
                                  <h4>Thông Tin Lịch Tiêm</h4>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      ID:
                                    </span>
                                    <span className="bookingdetail-detail-value">
                                      {detail.bookingDetailId}
                                    </span>
                                  </div>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Ngày dự kiến:
                                    </span>
                                    <span className="bookingdetail-detail-value">
                                      {new Date(
                                        detail.scheduledDate
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Ngày tiêm thực tế:
                                    </span>
                                    <span className="bookingdetail-detail-value">
                                      {detail.administeredDate
                                        ? new Date(
                                            detail.administeredDate
                                          ).toLocaleDateString()
                                        : "Chưa tiêm"}
                                    </span>
                                  </div>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Trạng thái:
                                    </span>
                                    <span
                                      className={`bookingdetail-status ${statusClass}`}
                                    >
                                      {getStatusText(detail.status)}
                                    </span>
                                  </div>
                                  <div className="bookingdetail-detail-item">
                                    <span className="bookingdetail-detail-label">
                                      Ghi chú phản ứng:
                                    </span>
                                    <div className="bookingdetail-reaction-section">
                                      {isEditing ? (
                                        <div className="bookingdetail-reaction-form">
                                          <textarea
                                            value={reactionNote}
                                            onChange={handleReactionChange}
                                            placeholder="Nhập ghi chú phản ứng sau tiêm..."
                                            className="bookingdetail-reaction-input"
                                          />
                                          <button
                                            className="bookingdetail-reaction-save-btn"
                                            onClick={() =>
                                              updateReaction(
                                                detail.bookingDetailId
                                              )
                                            }
                                          >
                                            <Save size={16} />
                                            <span>Lưu</span>
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="bookingdetail-reaction-display">
                                          <span className="bookingdetail-detail-value">
                                            {detail.reactionNote || "Không có"}
                                          </span>
                                          {detail.status === 2 && (
                                            <button
                                              className="bookingdetail-reaction-edit-btn"
                                              onClick={() =>
                                                startEditingReaction(
                                                  detail.bookingDetailId,
                                                  detail.reactionNote
                                                )
                                              }
                                            >
                                              Cập Nhật Trạng Thái Sau Tiêm
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bookingdetail-no-details">
                <div className="bookingdetail-no-data-icon">💉</div>
                <p>Không có mũi tiêm nào trong booking này.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;
