import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import "../CustomerPage/BookingDetailPage.css";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Syringe,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";
import { useAuth } from "../../components/common/AuthContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { FiCalendar, FiLogOut, FiPlusCircle, FiUser } from "react-icons/fi";
import { AiOutlineHistory } from "react-icons/ai";
import { fetchChildren } from "../../apis/api";

function BookingDetailPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { bookingId } = useParams();
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
  const [children, setChildren] = useState([]);
  const customerId = userInfo?.userId;

  // lay api children by customer id
  const loadChildrenData = async (customerId) => {
    try {
      const response = await fetchChildren(customerId);
      if (Array.isArray(response)) {
        setChildren(response);
      } else {
        setChildren([]);
        toast.error("Dữ liệu trẻ em không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin trẻ em:", err);
      setChildren([]);
      toast.error("Không thể lấy danh sách trẻ em.");
    }
  };

  // lay api customer va booking
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "profile") {
      navigate("/profile");
    } else if (tab === "children") {
      navigate("/profile");
    } else if (tab === "bookings") {
      setIsDropdownOpen(true);
    } else if (tab === "payments") {
      navigate("/my-payment");
    }
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

  // xu ly api update reaction
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
    <div>
      <Header></Header>
      {/* Banner giống UI mong muốn */}

      {/* Main content với Sidebar và Booking List */}
      <div className="container mx-auto px-1 py-30 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white border border-teal-200 rounded-xl shadow-md p-5 flex flex-col">
          {/* Phần header của sidebar */}
          <div className="mb-4 pb-3 border-b border-teal-100">
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg font-medium text-lg transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-teal-600 hover:bg-teal-50"
                }`
              }
            >
              <FiUser className="mr-3 w-5 h-5" />
              Hồ sơ của tôi
            </NavLink>
          </div>

          {/* Phần hồ sơ trẻ em - Sử dụng dữ liệu từ API */}
          <div className="mt-3">
            <div className="flex items-center px-4 py-2 text-1sm font-bold uppercase tracking-wider [text-shadow:1px_1px_2px_rgba(59,130,246,0.3)]">
              <span>Hồ sơ trẻ em</span>
              {children.length > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {children.length}
                </span>
              )}
            </div>
            {children.length > 0 ? (
              <>
                {(showAllChildren ? children : children.slice(0, 5)).map(
                  (child) => (
                    <NavLink
                      key={child.childId}
                      to={`/customer/child/${child.childId}`}
                      state={{ customerId }}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg transition-all transform hover:shadow-md text-1xl ${
                          isActive
                            ? "bg-blue-100"
                            : "hover:bg-blue-50 text-blue-700"
                        }`
                      }
                    >
                      <FaChild className="mr-2 w-5 h-5" />
                      {child.firstName} {child.lastName}
                    </NavLink>
                  )
                )}
                {children.length > 5 && (
                  <button
                    onClick={() => setShowAllChildren((prev) => !prev)}
                    className="block w-full text-left px-4 py-2 text-xl text-blue-500 hover:underline transition-colors"
                  >
                    {showAllChildren ? "Thu gọn" : "Xem thêm..."}
                  </button>
                )}
              </>
            ) : (
              <p className="px-4 py-2 text-xl text-blue-300">
                Chưa có thông tin
              </p>
            )}
          </div>

          {/* Phần các chức năng chính */}
          <div className="space-y-3 mt-4">
            <NavLink
              to="/customer/add-child"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100 hover:shadow"
                }`
              }
            >
              <FiPlusCircle className="mr-3 w-5 h-5" />
              <span className="font-medium">Thêm hồ sơ</span>
            </NavLink>

            <NavLink
              to="/customer/booking"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100 hover:shadow"
                }`
              }
            >
              <FiCalendar className="mr-3 w-5 h-5" />
              <span className="font-medium">Xem đặt lịch</span>
            </NavLink>

            <NavLink
              to="/customer/payment"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow"
                }`
              }
            >
              <AiOutlineHistory className="mr-3 w-5 h-5" />
              <span className="font-medium">Lịch sử thanh toán</span>
            </NavLink>
          </div>

          {/* Nút đăng xuất */}
          <div className="mt-auto pt-4 border-t border-teal-100">
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}

        <main className="w-full md:flex-1 bg-gradient-to-b from-blue-50 to-white text-blue-800 border border-blue-200 rounded-lg shadow-md flex flex-col justify-between">
          {" "}
          <div className="bookingdetail-container">
            <div className="bookingdetail-content">
              <div className="bookingdetail-main">
                <div className="bookingdetail-section">
                  <h2 className="bookingdetail-section-title">
                    Danh Sách Mũi Tiêm
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
                                          {detail.vaccineCombo?.name ||
                                            "Không có"}
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
                                            {detail.vaccineCombo?.name ||
                                              "Không có"}
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
                                                  onChange={
                                                    handleReactionChange
                                                  }
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
                                                  {detail.reactionNote ||
                                                    "Không có"}
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
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default BookingDetailPage;
