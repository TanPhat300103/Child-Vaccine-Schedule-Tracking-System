import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { getBookingByCustomerId, getPaymentByBookingID } from "../../apis/api";
import { format } from "date-fns";
import { FaCheckCircle, FaStethoscope, FaMoneyBillWave } from "react-icons/fa"; // Thêm icon từ react-icons
import { useAuth } from "../../components/common/AuthContext.jsx";
const PaymentCustomer = () => {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(true);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading)
    return (
      <p className="text-center text-blue-600 animate-pulse">
        Đang tải thông tin thanh toán...
      </p>
    );
  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  if (payments.length === 0)
    return (
      <p className="text-center text-gray-500">
        Không có thông tin thanh toán nào
      </p>
    );

  const filteredPayments = payments.filter(
    (p) => p.status === selectedPaymentStatus
  );

  const paymentStatusLabels = {
    false: "Chưa Thanh Toán",
    true: "Đã Thanh Toán",
  };

  const paymentStatusButtonStyles = {
    false: "bg-red-100 text-red-700 hover:bg-red-200",
    true: "bg-green-100 text-green-700 hover:bg-green-200",
  };

  const statusOptions = [true, false];

  const renderPaymentCard = (payment) => (
    <div
      key={payment.paymentId}
      className="p-5 bg-white border border-gray-200 rounded-lg shadow-md min-w-[280px] flex-shrink-0 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center mb-3">
        <FaStethoscope className="text-blue-500 mr-2" />
        <p className="font-semibold text-blue-700">
          Mã thanh toán: {payment.paymentId}
        </p>
      </div>
      <p className="text-gray-600">
        <span className="font-medium">Ngày thanh toán:</span>{" "}
        {format(new Date(payment.date), "dd/MM/yyyy")}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Tổng tiền:</span>{" "}
        <span className="text-blue-600 font-semibold">
          {payment.total.toLocaleString()} VNĐ
        </span>
      </p>
      {payment.booking && (
        <p className="text-gray-600">
          <span className="font-medium">Ngày đặt lịch:</span>{" "}
          {format(new Date(payment.booking.bookingDate), "dd/MM/yyyy")}
        </p>
      )}
      {payment.marketingCampaign && (
        <p className="text-gray-600">
          <span className="font-medium">Chiến dịch:</span>{" "}
          {payment.marketingCampaign.name}
        </p>
      )}
      <div className="mt-4">
        {payment.status === false ? (
          <NavLink
            to="/paymentVnpay2"
            state={{ paymentId: payment.paymentId }}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaMoneyBillWave className="mr-2" />
            Thanh Toán Ngay
          </NavLink>
        ) : (
          <p className="flex items-center text-green-600 font-semibold">
            <FaCheckCircle className="mr-2" />
            Đã Thanh Toán
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
        <FaStethoscope className="mr-3" />
        Lịch sử thanh toán
      </h2>
      <div className="flex space-x-4 mb-8">
        {statusOptions.map((status) => (
          <button
            key={String(status)}
            onClick={() => setSelectedPaymentStatus(status)}
            className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
              paymentStatusButtonStyles[status]
            } ${
              selectedPaymentStatus === status
                ? "ring-2 ring-blue-400 shadow-md"
                : "opacity-75"
            }`}
          >
            {paymentStatusLabels[status]}
          </button>
        ))}
      </div>
      {filteredPayments.length > 0 ? (
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
          {filteredPayments.map((payment) => renderPaymentCard(payment))}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          Không có giao dịch cho trạng thái "
          {paymentStatusLabels[selectedPaymentStatus]}"
        </p>
      )}
    </div>
  );
};

export default PaymentCustomer;
