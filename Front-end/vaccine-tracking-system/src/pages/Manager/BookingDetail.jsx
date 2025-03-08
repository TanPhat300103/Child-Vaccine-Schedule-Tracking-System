import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { getBookingDetailsByBookID, confirmBooking } from "../../apis/api";
import { CalendarIcon, UserIcon, DollarSignIcon, PhoneIcon, MailIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, MapPinIcon, ShieldIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [groupedDetails, setGroupedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho dropdown
  const [isBookingInfoOpen, setIsBookingInfoOpen] = useState(true); // Mặc định mở
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(true); // Mặc định mở

  // State cho bộ lọc trạng thái
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "administered", "notAdministered"

  const fetchBookingData = async () => {
    try {
      const detailsData = await getBookingDetailsByBookID(bookingId);
      setBookingDetails(detailsData);
      if (detailsData.length > 0) {
        setBooking(detailsData[0].booking);
      }
      
      const groups = detailsData.reduce((acc, detail) => {
        const childKey = detail.child.firstName + " " + detail.child.lastName;
        if (!acc[childKey]) {
          acc[childKey] = [];
        }
        acc[childKey].push(detail);
        return acc;
      }, {});
      setGroupedDetails(groups);
    } catch (err) {
      setError("Không thể lấy thông tin chi tiết đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  const handleConfirm = async (detailId) => {
    try {
      const updatedDetail = await confirmBooking(detailId);
      setBookingDetails((prevDetails) =>
        prevDetails.map((detail) =>
          detail.bookingDetailId === detailId ? updatedDetail : detail
        )
      );
      
      const updatedGroups = bookingDetails
        .map((detail) =>
          detail.bookingDetailId === detailId ? updatedDetail : detail
        )
        .reduce((acc, detail) => {
          const childKey = detail.child.firstName + " " + detail.child.lastName;
          if (!acc[childKey]) {
            acc[childKey] = [];
          }
          acc[childKey].push(detail);
          return acc;
        }, {});
      setGroupedDetails(updatedGroups);
    } catch (error) {
      console.error("Error confirming booking detail:", error);
    }
  };

  // Lọc booking details theo trạng thái
  const filteredGroupedDetails = Object.keys(groupedDetails).reduce((acc, childKey) => {
    const filteredDetails = groupedDetails[childKey].filter((detail) => {
      const isAdministered = !!detail.administeredDate;
      if (statusFilter === "all") return true;
      if (statusFilter === "administered") return isAdministered;
      if (statusFilter === "notAdministered") return !isAdministered;
      return true;
    });

    if (filteredDetails.length > 0) {
      acc[childKey] = filteredDetails;
    }
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg text-blue-800">Đang tải thông tin đặt lịch...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <AlertCircleIcon className="text-red-500 w-12 h-12 mx-auto mb-4" />
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      </div>
    </div>
  );
  
  if (!booking) return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <AlertCircleIcon className="text-orange-500 w-12 h-12 mx-auto mb-4" />
        <p className="text-center text-gray-700 text-lg font-medium">Không tìm thấy thông tin đặt lịch.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-blue-800 flex items-center">
            <ShieldIcon className="mr-2" /> 
            Chi Tiết Lịch Tiêm Chủng
          </h1>
        </div>
      </div>
      
      {/* Main content - split into 3:5 ratio */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Left sidebar - 3/8 width (Booking & Customer Info) */}
        <div className="w-3/8 pr-6">
          <div className="bg-white rounded-lg shadow-md sticky top-6">
            {/* Booking ID badge */}
            <div className="p-4 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Mã Đặt Lịch</span>
                <span className="font-bold">#{booking.bookingId}</span>
              </div>
            </div>
            
            {/* Booking info section with dropdown */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => setIsBookingInfoOpen(!isBookingInfoOpen)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Thông Tin Đặt Lịch
                </h3>
                {isBookingInfoOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {isBookingInfoOpen && (
                <div className="p-4 pt-0">
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500">Ngày đặt:</span>
                      <span className="font-medium">{format(new Date(booking.bookingDate), "dd/MM/yyyy")}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500">Tổng tiền:</span>
                      <span className="font-medium text-green-600">{booking.totalAmount.toLocaleString()} VNĐ</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Customer info section with dropdown */}
            <div>
              <button
                onClick={() => setIsCustomerInfoOpen(!isCustomerInfoOpen)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Thông Tin Khách Hàng
                </h3>
                {isCustomerInfoOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {isCustomerInfoOpen && (
                <div className="p-4 pt-0">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Họ và tên</div>
                      <div className="font-medium">{booking.customer.firstName} {booking.customer.lastName}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Mã khách hàng</div>
                      <div className="font-medium">#{booking.customer.customerId}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Số điện thoại</div>
                      <div className="font-medium flex items-center">
                        <PhoneIcon className="w-3 h-3 mr-1 text-gray-400" />
                        {booking.customer.phoneNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Email</div>
                      <div className="font-medium flex items-center overflow-hidden text-ellipsis">
                        <MailIcon className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{booking.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main content area - 5/8 width (Booking Details) */}
        <div className="w-5/8">
          {/* Status Filter (moved back to right column) */}
          <div className="mb-6 flex space-x-3">
            <button
              onClick={() => setStatusFilter("all")}
              className={`w-24 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                statusFilter === "all"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("administered")}
              className={`w-24 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                statusFilter === "administered"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Đã Tiêm
            </button>
            <button
              onClick={() => setStatusFilter("notAdministered")}
              className={`w-24 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                statusFilter === "notAdministered"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Chưa Tiêm
            </button>
          </div>

          {Object.keys(filteredGroupedDetails).length > 0 ? (
            <div className="space-y-6">
              {Object.keys(filteredGroupedDetails).map((childKey) => (
                <div key={childKey} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center">
                      <UserIcon className="mr-2" /> 
                      {childKey}
                    </h2>
                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                      {filteredGroupedDetails[childKey].length} mũi tiêm
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    {filteredGroupedDetails[childKey].map((detail) => {
                      const isAdministered = !!detail.administeredDate;
                      return (
                        <div
                          key={detail.bookingDetailId}
                          className={`border rounded-lg overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between ${
                            isAdministered ? "border-green-200" : "border-blue-200"
                          }`}
                        >
                          <div className={`px-4 py-3 flex items-center justify-between sm:w-1/3 ${
                            isAdministered ? "bg-green-50" : "bg-blue-50"
                          }`}>
                            <div className="font-medium text-gray-800">{detail.vaccine.name}</div>
                            <div className={`text-xs inline-flex items-center px-2 py-1 rounded-full ${
                              isAdministered 
                                ? "bg-green-100 text-green-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {isAdministered 
                                ? <CheckCircleIcon className="w-3 h-3 mr-1" /> 
                                : <ClockIcon className="w-3 h-3 mr-1" />
                              }
                              {isAdministered ? "Đã tiêm" : "Chưa tiêm"}
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                            <div className="flex-1 flex flex-col sm:flex-row sm:space-x-4">
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 mb-1">Ngày dự kiến</div>
                                <div className="text-sm flex items-center">
                                  <CalendarIcon className="w-3 h-3 mr-1 text-blue-400" />
                                  {format(new Date(detail.scheduledDate), "dd/MM/yyyy")}
                                </div>
                              </div>
                              {isAdministered && (
                                <div className="flex-1">
                                  <div className="text-xs text-gray-500 mb-1">Ngày tiêm</div>
                                  <div className="text-sm flex items-center">
                                    <CheckCircleIcon className="w-3 h-3 mr-1 text-green-500" />
                                    {format(new Date(detail.administeredDate), "dd/MM/yyyy")}
                                  </div>
                                </div>
                              )}
                            </div>
                            {detail.feedback && (
                              <div className="sm:w-1/3">
                                <div className="text-xs text-gray-500 mb-1">Ghi chú</div>
                                <div className="text-sm italic text-gray-600">
                                  "{detail.feedback}"
                                </div>
                              </div>
                            )}
                            {!isAdministered && (
                              <button
                                onClick={() => handleConfirm(detail.bookingDetailId)}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition duration-150"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Xác nhận tiêm
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Không có chi tiết đặt lịch nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;