import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { getBookingByCustomerId, getPaymentByBookingID } from "../../apis/api";
import { format } from "date-fns";
import { useAuth } from "../../components/common/AuthContext.jsx";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  ArrowUpDown,
  Stethoscope,
  PiggyBank,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";

const PaymentCustomer = () => {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(true);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const { userInfo } = useAuth();

  const location = useLocation();
  const customerId = location.state?.customerId || userInfo.userId;

  const fetchPayments = async () => {
    try {
      const bookings = await getBookingByCustomerId(customerId);
      const paymentsData = await Promise.all(
        bookings.map((booking) => getPaymentByBookingID(booking.bookingId))
      );
      const validPayments = paymentsData.filter((payment) => payment);
      setPayments(validPayments);
    } catch (err) {
      setError("Không thể lấy thông tin thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchPayments();
    }
  }, [customerId]);

  const filteredPayments = payments
    .filter((p) => p.status === selectedPaymentStatus)
    .filter(
      (p) =>
        p.paymentId.toString().includes(searchTerm) ||
        (p.marketingCampaign &&
          p.marketingCampaign.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.total,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-600 font-medium">
            Đang tải thông tin thanh toán...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">Đã xảy ra lỗi</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchPayments()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 text-blue-500">
            <CreditCard size={64} />
          </div>
          <h3 className="text-xl font-bold text-blue-700 mb-2">
            Chưa có thanh toán
          </h3>
          <p className="text-gray-600">Bạn chưa có lịch sử thanh toán nào</p>
          <NavLink
            to="/services"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            Đặt lịch khám ngay
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Lịch sử thanh toán
                </h1>
                <p className="text-gray-500">
                  Quản lý và theo dõi các thanh toán của bạn
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo mã thanh toán..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                }
                className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowUpDown size={18} className="mr-2" />
                <span>{sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-blue-100">Tổng thanh toán</p>
                  <h3 className="text-2xl font-bold">{payments.length}</h3>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-md">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-lg">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-green-100">Đã thanh toán</p>
                  <h3 className="text-2xl font-bold">
                    {payments.filter((p) => p.status === true).length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-md">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-lg">
                  <PiggyBank className="text-white" size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-purple-100">
                    Tổng tiền (
                    {selectedPaymentStatus
                      ? "đã thanh toán"
                      : "chưa thanh toán"}
                    )
                  </p>
                  <h3 className="text-2xl font-bold">
                    {totalAmount.toLocaleString()} VNĐ
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedPaymentStatus(true)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center
                ${
                  selectedPaymentStatus === true
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <CheckCircle size={18} className="mr-2" />
              Đã Thanh Toán ({payments.filter((p) => p.status === true).length})
            </button>
            <button
              onClick={() => setSelectedPaymentStatus(false)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center
                ${
                  selectedPaymentStatus === false
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <Clock size={18} className="mr-2" />
              Chưa Thanh Toán (
              {payments.filter((p) => p.status === false).length})
            </button>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPayments.map((payment) => (
              <div
                key={payment.paymentId}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`p-4 ${
                    payment.status ? "bg-green-500" : "bg-orange-500"
                  } text-white`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">
                      Mã thanh toán: #{payment.paymentId}
                    </h3>
                    {payment.status ? (
                      <span className="bg-green-400 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="bg-orange-400 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                        <Clock size={12} className="mr-1" />
                        Chưa thanh toán
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar
                        size={18}
                        className="text-gray-500 mt-0.5 mr-3 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-gray-500">Ngày thanh toán</p>
                        <p className="font-medium">
                          {format(new Date(payment.date), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <PiggyBank
                        size={18}
                        className="text-gray-500 mt-0.5 mr-3 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="font-bold text-blue-600">
                          {payment.total.toLocaleString()} VNĐ
                        </p>
                      </div>
                    </div>

                    {payment.booking && (
                      <div className="flex items-start">
                        <CalendarIcon
                          size={18}
                          className="text-gray-500 mt-0.5 mr-3 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-gray-500">Ngày đặt lịch</p>
                          <p className="font-medium">
                            {format(
                              new Date(payment.booking.bookingDate),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {payment.marketingCampaign && (
                      <div className="flex items-start">
                        <Stethoscope
                          size={18}
                          className="text-gray-500 mt-0.5 mr-3 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm text-gray-500">Chiến dịch</p>
                          <p className="font-medium">
                            {payment.marketingCampaign.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    {payment.status === false ? (
                      <NavLink
                        to="/paymentVnpay"
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                        onClick={() => {
                          const bookingData = {
                            paymentId: payment.paymentId,
                            bookingId: payment.booking.bookingId,
                            totalAmount: payment.booking.totalAmount,
                            bookingDate: payment.booking.bookingDate,
                          };
                          localStorage.setItem(
                            "bookingData",
                            JSON.stringify(bookingData)
                          );
                        }}
                      >
                        <CreditCard className="mr-2" size={18} />
                        Thanh Toán Ngay
                      </NavLink>
                    ) : (
                      <div className="flex items-center justify-center w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
                        <CheckCircle className="mr-2" size={18} />
                        Đã Thanh Toán
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Không tìm thấy giao dịch
            </h3>
            <p className="text-gray-500">
              Không có giao dịch nào phù hợp với trạng thái "
              {selectedPaymentStatus ? "Đã Thanh Toán" : "Chưa Thanh Toán"}"
              {searchTerm && ` và từ khóa "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCustomer;
