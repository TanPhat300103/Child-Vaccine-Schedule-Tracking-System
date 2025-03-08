import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
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
  ArrowLeft,
  Clock,
  User,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";

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

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-amber-500"; // Pending
      case 2:
        return "bg-emerald-500"; // Active
      case 3:
        return "bg-red-500"; // Inactive
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1:
        return <Clock className="text-amber-500" size={20} />;
      case 2:
        return <CheckCircle className="text-emerald-500" size={20} />;
      case 3:
        return <XCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin chi tiết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
            <XCircle className="text-red-500" size={32} />
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-amber-100">
            <Shield className="text-amber-500" size={32} />
          </div>
          <p className="text-gray-600">Không tìm thấy thông tin booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative px-6 py-8 md:px-10 md:py-12">
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full">
                <Syringe size={36} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Booking #{booking.bookingId}
                </h1>
                <div className="mt-4 flex flex-col md:flex-row gap-4 md:gap-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>
                      Ngày đặt:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} />
                    <span>
                      Tổng tiền: {booking.totalAmount.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={18} />
                    <span>
                      Trạng thái:
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )} text-white`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div
                className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white cursor-pointer"
                onClick={toggleDropdown}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={20} />
                  <span className="font-medium">Danh sách Booking</span>
                </div>
                {isDropdownOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>

              {isDropdownOpen && (
                <div className="max-h-64 overflow-y-auto">
                  {bookings.map((b) => (
                    <div
                      key={b.bookingId}
                      className={`px-5 py-3 border-b border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer ${
                        b.bookingId === parseInt(bookingId)
                          ? "bg-indigo-100"
                          : ""
                      }`}
                      onClick={() => handleBookingSelect(b.bookingId)}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-medium ${
                            b.bookingId === parseInt(bookingId)
                              ? "text-indigo-600"
                              : "text-gray-700"
                          }`}
                        >
                          Booking #{b.bookingId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(b.bookingDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => navigate("/customer/booking")}
                className="w-full flex items-center gap-2 px-5 py-4 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Quay về</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Syringe className="text-indigo-600" size={24} />
                Danh Sách Mũi Tiêm
              </h2>

              {bookingDetails.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-10 bottom-10 w-0.5 bg-gradient-to-b from-indigo-500 to-blue-500 hidden md:block"></div>

                  <div className="space-y-10">
                    {Object.keys(groupedDetails).map((date) => (
                      <div key={date} className="relative">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="inline-flex md:flex-col items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white z-10 md:mb-3">
                              <CalendarIcon size={16} />
                            </div>
                            <div className="md:text-center font-semibold text-indigo-600 text-sm ml-3 md:ml-0">
                              {date}
                            </div>
                          </div>

                          <div className="flex-1 md:ml-6 space-y-4">
                            {groupedDetails[date].map((detail) => {
                              const isExpanded =
                                detail.bookingDetailId === expandedDetailId;
                              const statusColor = getStatusColor(detail.status);
                              const isEditing =
                                editingReaction === detail.bookingDetailId;

                              return (
                                <div
                                  key={detail.bookingDetailId}
                                  className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all ${
                                    isExpanded ? "shadow-md" : "hover:shadow-md"
                                  }`}
                                >
                                  {/* Card header with left colored border */}
                                  <div
                                    className={`relative pl-4 ${
                                      isExpanded
                                        ? "border-b border-gray-100"
                                        : ""
                                    }`}
                                  >
                                    <div
                                      className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`}
                                    ></div>

                                    <div
                                      className="p-4 flex justify-between cursor-pointer"
                                      onClick={() =>
                                        toggleDetail(detail.bookingDetailId)
                                      }
                                    >
                                      <div className="flex items-start gap-4">
                                        <div>
                                          {getStatusIcon(detail.status)}
                                        </div>
                                        <div className="flex-1">
                                          <h3 className="font-semibold text-gray-800">
                                            {detail.vaccine.name} -{" "}
                                            {detail.child.firstName}{" "}
                                            {detail.child.lastName}
                                          </h3>
                                          <div className="mt-1 text-sm space-y-1">
                                            <p className="flex items-center gap-1 text-gray-500">
                                              <Calendar size={14} />
                                              <span>
                                                Dự kiến:{" "}
                                                {new Date(
                                                  detail.scheduledDate
                                                ).toLocaleDateString("vi-VN")}
                                              </span>
                                            </p>
                                            <p className="flex items-center gap-1 text-gray-600">
                                              <span>Trạng thái:</span>
                                              <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor} text-white`}
                                              >
                                                {getStatusText(detail.status)}
                                              </span>
                                              <span className="mx-1">|</span>
                                              <span>
                                                Combo:{" "}
                                                {detail.vaccineCombo?.name ||
                                                  "Không có"}
                                              </span>
                                            </p>
                                            {detail.administeredDate && (
                                              <p className="flex items-center gap-1 text-gray-500">
                                                <CheckCircle
                                                  size={14}
                                                  className="text-emerald-500"
                                                />
                                                <span>
                                                  Đã tiêm:{" "}
                                                  {new Date(
                                                    detail.administeredDate
                                                  ).toLocaleDateString("vi-VN")}
                                                </span>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-gray-400">
                                        {isExpanded ? (
                                          <ChevronUp size={20} />
                                        ) : (
                                          <ChevronDown size={20} />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Expanded content */}
                                  {isExpanded && (
                                    <div className="p-4 bg-gray-50 text-sm">
                                      <div className="grid md:grid-cols-2 gap-6">
                                        {/* Child Information */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <User
                                              size={16}
                                              className="text-indigo-600"
                                            />
                                            Thông Tin Trẻ
                                          </h4>
                                          <div className="rounded-lg bg-white p-4 shadow-sm">
                                            <div className="flex justify-between py-2">
                                              <span className="text-gray-500">
                                                Tên:
                                              </span>
                                              <span className="font-medium text-gray-800">
                                                {detail.child.firstName}{" "}
                                                {detail.child.lastName}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Vaccine Information */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <Syringe
                                              size={16}
                                              className="text-indigo-600"
                                            />
                                            Thông Tin Vaccine
                                          </h4>
                                          <div className="rounded-lg bg-white p-4 shadow-sm">
                                            <div className="flex justify-between py-2">
                                              <span className="text-gray-500">
                                                Tên Vaccine:
                                              </span>
                                              <span className="font-medium text-gray-800">
                                                {detail.vaccine.name} (Dose{" "}
                                                {detail.vaccine.doseNumber})
                                              </span>
                                            </div>
                                            <div className="flex justify-between py-2 border-t">
                                              <span className="text-gray-500">
                                                Combo:
                                              </span>
                                              <span className="font-medium text-gray-800">
                                                {detail.vaccineCombo?.name ||
                                                  "Không có"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div className="md:col-span-2 space-y-3">
                                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                            <FileText
                                              size={16}
                                              className="text-indigo-600"
                                            />
                                            Thông Tin Lịch Tiêm
                                          </h4>
                                          <div className="rounded-lg bg-white p-4 shadow-sm">
                                            <div className="grid md:grid-cols-2 gap-x-8">
                                              <div className="flex justify-between py-2">
                                                <span className="text-gray-500">
                                                  ID:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                  {detail.bookingDetailId}
                                                </span>
                                              </div>
                                              <div className="flex justify-between py-2">
                                                <span className="text-gray-500">
                                                  Ngày dự kiến:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                  {new Date(
                                                    detail.scheduledDate
                                                  ).toLocaleDateString("vi-VN")}
                                                </span>
                                              </div>
                                              <div className="flex justify-between py-2 border-t md:border-t-0">
                                                <span className="text-gray-500">
                                                  Ngày tiêm thực tế:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                  {detail.administeredDate
                                                    ? new Date(
                                                        detail.administeredDate
                                                      ).toLocaleDateString(
                                                        "vi-VN"
                                                      )
                                                    : "Chưa tiêm"}
                                                </span>
                                              </div>
                                              <div className="flex justify-between py-2 border-t md:border-t-0">
                                                <span className="text-gray-500">
                                                  Trạng thái:
                                                </span>
                                                <span
                                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} text-white`}
                                                >
                                                  {getStatusText(detail.status)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Reaction Note */}
                                        <div className="md:col-span-2 space-y-3">
                                          <h4 className="font-semibold text-gray-700">
                                            Ghi chú phản ứng sau tiêm
                                          </h4>

                                          {isEditing ? (
                                            <div className="space-y-3">
                                              <textarea
                                                value={reactionNote}
                                                onChange={handleReactionChange}
                                                placeholder="Nhập ghi chú phản ứng sau tiêm..."
                                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                rows={3}
                                              />
                                              <div className="flex justify-end">
                                                <button
                                                  onClick={() =>
                                                    updateReaction(
                                                      detail.bookingDetailId
                                                    )
                                                  }
                                                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
                                                >
                                                  <Save size={16} />
                                                  <span>Lưu</span>
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="rounded-lg bg-white p-4 shadow-sm">
                                              <p className="text-gray-800">
                                                {detail.reactionNote ||
                                                  "Không có ghi chú"}
                                              </p>

                                              {detail.status === 2 && (
                                                <div className="mt-4 flex justify-end">
                                                  <button
                                                    onClick={() =>
                                                      startEditingReaction(
                                                        detail.bookingDetailId,
                                                        detail.reactionNote
                                                      )
                                                    }
                                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm text-sm"
                                                  >
                                                    Cập Nhật Trạng Thái Sau Tiêm
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100">
                    <Syringe className="text-indigo-500" size={32} />
                  </div>
                  <p className="text-gray-500">
                    Không có mũi tiêm nào trong booking này.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;
