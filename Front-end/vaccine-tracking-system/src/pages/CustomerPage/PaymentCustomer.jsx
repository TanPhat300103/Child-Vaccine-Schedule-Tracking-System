// src/pages/Customer/PaymentCustomer.jsx
import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { getBookingByCustomerId, getPaymentByBookingID } from "../../apis/api";
import { format } from "date-fns";

const PaymentCustomer = () => {
  // Đặt mặc định filter là true ("Đã Thanh Toán")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(true);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const customerId = location.state?.customerId;
  console.log("Received customerId in PaymentCustomer:", customerId);

  // Lấy danh sách booking của customer, sau đó với mỗi booking lấy thông tin payment
  const fetchPayments = async () => {
    try {
      const bookings = await getBookingByCustomerId(customerId);
      console.log("Bookings:", bookings);
      const paymentsData = await Promise.all(
        bookings.map((booking) => getPaymentByBookingID(booking.bookingId))
      );
      const validPayments = paymentsData.filter((payment) => payment);
      setPayments(validPayments);
      console.log("Payments fetched:", validPayments);
    } catch (err) {
      console.error("Error fetching payments:", err);
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

  if (loading) return <p>Đang tải thông tin thanh toán...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (payments.length === 0) return <p>Không có thông tin thanh toán nào</p>;

  // Lọc payment theo trạng thái đã chọn
  const filteredPayments = payments.filter(
    (p) => p.status === selectedPaymentStatus
  );

  // Các nhãn và style cho các nút filter
  const paymentStatusLabels = {
    false: "Chưa Thanh Toán",
    true: "Đã Thanh Toán",
  };

  const paymentStatusButtonStyles = {
    false: "bg-red-500 hover:bg-red-600",
    true: "bg-green-500 hover:bg-green-600",
  };

  // Duyệt mảng theo thứ tự: "Đã Thanh Toán" (true) trước, sau đó "Đang Thanh Toán" (false)
  const statusOptions = [true, false];

  // Render từng thẻ payment, thêm thông tin "Ngày Đặt Lịch" và "Marketing Campaign" nếu có
  const renderPaymentCard = (payment) => (
    <div
      key={payment.paymentId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <p className="font-bold">Mã thanh toán: {payment.paymentId}</p>
      <p>Ngày thanh toán: {format(new Date(payment.date), "dd/MM/yyyy")}</p>
      <p>Tổng tiền: {payment.total.toLocaleString()} VNĐ</p>
      {payment.booking && (
        <p>
          Ngày đặt lịch:{" "}
          {format(new Date(payment.booking.bookingDate), "dd/MM/yyyy")}
        </p>
      )}
      {payment.marketingCampaign && (
        <p>Marketing Campaign: {payment.marketingCampaign.name}</p>
      )}
      <div className="mt-2">
        {payment.status === false ? (
          <NavLink
            to="/paymentVnpay2"
            state={{ paymentId: payment.paymentId }}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Thanh Toán
          </NavLink>
        ) : (
          <p className="text-green-600 font-bold">Đã Thanh Toán</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Thông Tin Thanh Toán</h2>
      {/* Các nút filter theo thứ tự: Đã Thanh Toán, Đang Thanh Toán */}
      <div className="flex space-x-4 mb-6">
        {statusOptions.map((status) => (
          <button
            key={String(status)}
            onClick={() => setSelectedPaymentStatus(status)}
            className={`px-4 py-2 rounded text-white ${
              paymentStatusButtonStyles[status]
            } ${
              selectedPaymentStatus === status
                ? "ring-4 ring-offset-2 ring-gray-300"
                : ""
            }`}
          >
            {paymentStatusLabels[status]}
          </button>
        ))}
      </div>
      {filteredPayments.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto">
          {filteredPayments.map((payment) => renderPaymentCard(payment))}
        </div>
      ) : (
        <p>
          Không có giao dịch cho trạng thái "
          {paymentStatusLabels[selectedPaymentStatus]}"
        </p>
      )}
    </div>
  );
};

export default PaymentCustomer;
