import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext";
import {
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  CreditCard,
  Eye,
  Clock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { FaMoneyCheckAlt } from "react-icons/fa";

function PaymentCustomer() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm xử lý thanh toán
  const handlePaymentClick = (booking) => {
    const bookingData = {
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      totalAmount: booking.totalAmount,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/paymentVNpay");
  };

  // Hàm xử lý tải xuống hóa đơn
  const handleDownload = (paymentId) => {
    // Placeholder cho chức năng tải hóa đơn
    alert(`Tải xuống hóa đơn #${paymentId} dưới dạng PDF...`);
  };

  // Fetch dữ liệu từ API
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
          throw new Error("Không tìm thấy danh sách lịch tiêm");
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const paymentsResponse = await fetch(
          `http://localhost:8080/payment/getbycustomerid?customerId=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!paymentsResponse.ok)
          throw new Error("Không tìm thấy danh sách hóa đơn");
        const paymentsData = await paymentsResponse.json();

        const sortedPayments = paymentsData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPayments(sortedPayments);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  // Mở/đóng chi tiết thanh toán
  const togglePaymentDetail = (paymentId) => {
    setExpandedPaymentId((prev) => (prev === paymentId ? null : paymentId));
  };

  // Lọc thanh toán theo trạng thái và tìm kiếm
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "paid"
        ? payment.status
        : !payment.status;

    const matchesSearch =
      searchQuery === ""
        ? true
        : payment.paymentId.toString().includes(searchQuery) ||
          payment.booking.bookingId.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  // Component hiển thị trạng thái
  const StatusBadge = ({ status }) => {
    return status ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Đã thanh toán
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <Clock className="w-3 h-3 mr-1" />
        Chưa thanh toán
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Đang tải danh sách hóa đơn...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 max-w-md">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Đã xảy ra lỗi!</span>
          </div>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-white" />
                <h1 className="ml-3 text-2xl font-bold text-white">
                  Danh Sách Hóa Đơn Tiêm Chủng
                </h1>
              </div>
              <div className="mt-4 md:mt-0 text-white text-sm">
                <p className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>Tổng số hóa đơn: {payments.length}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Filter và Search bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-1 items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                <div className="px-3 py-2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo ID hóa đơn hoặc ID lịch tiêm..."
                  className="w-full py-2 px-2 focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Tất cả hóa đơn</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="unpaid">Chưa thanh toán</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment list */}
          <div className="overflow-hidden">
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ngày
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tổng tiền
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phương thức
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                      const isExpanded =
                        payment.paymentId === expandedPaymentId;
                      return (
                        <React.Fragment key={payment.paymentId}>
                          <tr
                            className={`hover:bg-gray-50 transition-colors ${
                              isExpanded ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <div className="flex items-center">
                                <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                                #{payment.paymentId}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex flex-col">
                                <span>
                                  {new Date(payment.date).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(payment.date).toLocaleTimeString(
                                    "vi-VN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.total.toLocaleString("vi-VN")} VNĐ
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <StatusBadge status={payment.status} />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.method ? (
                                <span className="inline-flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1 text-indigo-500" />
                                  Chuyển khoản
                                </span>
                              ) : (
                                <span className="inline-flex items-center">
                                  <CreditCard className="w-4 h-4 mr-1 text-gray-500" />
                                  Tại quầy
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {!payment.status && (
                                  <button
                                    onClick={() =>
                                      handlePaymentClick(payment.booking)
                                    }
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <FaMoneyCheckAlt className="mr-1" /> Thanh
                                    toán
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleDownload(payment.paymentId)
                                  }
                                  className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <Download className="w-3.5 h-3.5 mr-1" /> PDF
                                </button>
                                <button
                                  onClick={() =>
                                    togglePaymentDetail(payment.paymentId)
                                  }
                                  className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1" /> Chi tiết
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 ml-1" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan="6" className="px-8 py-6 bg-blue-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Thông tin lịch tiêm */}
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                    <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                      <h3 className="text-md font-semibold text-gray-800">
                                        Thông Tin Lịch Tiêm
                                      </h3>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          ID Lịch tiêm:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {payment.booking.bookingId}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Ngày đặt lịch:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {new Date(
                                            payment.booking.bookingDate
                                          ).toLocaleDateString("vi-VN")}
                                        </span>
                                      </div>
                                      {/* Nếu có thêm thông tin về lịch tiêm, có thể thêm vào đây */}
                                      <div className="mt-3 pt-2 border-t border-gray-100">
                                        <button
                                          onClick={() =>
                                            navigate(
                                              `/booking-detail/${payment.booking.bookingId}`
                                            )
                                          }
                                          className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
                                        >
                                          Xem chi tiết lịch tiêm
                                          <ArrowRight className="w-3 h-3 ml-1" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Thông tin thanh toán */}
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                    <div className="flex items-center mb-3 pb-2 border-b border-gray-100">
                                      <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                                      <h3 className="text-md font-semibold text-gray-800">
                                        Thông Tin Thanh Toán
                                      </h3>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Mã hóa đơn:
                                        </span>
                                        <span className="text-sm font-medium">
                                          #{payment.paymentId}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Ngày thanh toán:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {payment.status
                                            ? new Date(
                                                payment.date
                                              ).toLocaleDateString("vi-VN")
                                            : "----"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Tổng tiền:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {payment.total.toLocaleString(
                                            "vi-VN"
                                          )}{" "}
                                          VNĐ
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Phương thức:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {payment.method
                                            ? "Chuyển khoản"
                                            : "Tại quầy"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Trạng thái:
                                        </span>
                                        <StatusBadge status={payment.status} />
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">
                                          Mã giao dịch:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {payment.transactionId || "Không có"}
                                        </span>
                                      </div>
                                      {payment.marketingCampaign &&
                                        payment.marketingCampaign.coupon && (
                                          <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">
                                              Mã khuyến mãi:
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                              {payment.marketingCampaign.coupon}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center">
                <div className="mb-4 bg-gray-100 p-4 rounded-full">
                  <CreditCard className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có hóa đơn nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === "all"
                    ? "Bạn chưa có hóa đơn nào trong hệ thống."
                    : filterStatus === "paid"
                    ? "Bạn chưa có hóa đơn đã thanh toán nào."
                    : "Bạn không có hóa đơn chưa thanh toán nào."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Hệ thống quản lý tiêm chủng trẻ em - © 2025 Bảo vệ sức khỏe trẻ thơ
            Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentCustomer;
