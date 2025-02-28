// src/pages/Customer/PaymentCustomer.jsx
import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { getBookingByCustomerId, getPaymentByBookingID } from "../../apis/api";
import { format } from "date-fns";

const PaymentCustomer = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const customerId = location.state?.customerId;
  console.log("Received customerId in PaymentCustomer:", customerId);

  // Lấy danh sách booking của customer, sau đó lấy payment cho từng booking
  const fetchPayments = async () => {
    try {
      // Lấy danh sách booking của customer
      const bookings = await getBookingByCustomerId(customerId);
      console.log("Danh sách booking:", bookings);

      // Với mỗi booking, gọi API getPaymentByBookingID
      const paymentsData = await Promise.all(
        bookings.map((booking) => getPaymentByBookingID(booking.bookingId))
      );
      // Loại bỏ những giá trị null nếu có (nếu booking chưa có payment)
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

  // Phân loại payment:
  // payment.status === false => "Đang Thanh Toán"
  // payment.status === true  => "Đã Thanh Toán"
  const paymentsPending = payments.filter((p) => p.status === false);
  const paymentsPaid = payments.filter((p) => p.status === true);

  // Render card cho giao dịch chưa thanh toán
  const renderPendingPaymentCard = (payment) => (
    <div
      key={payment.paymentId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <p className="font-bold">Mã thanh toán: {payment.paymentId}</p>
      <p>Ngày thanh toán: {format(new Date(payment.date), "dd/MM/yyyy")}</p>
      <p>Tổng tiền: {payment.total.toLocaleString()} VNĐ</p>
      <div className="mt-2">
        <NavLink
          to="/paymentC"
          state={{ paymentId: payment.paymentId }}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Thanh Toán
        </NavLink>
      </div>
    </div>
  );

  // Render card cho giao dịch đã thanh toán (chỉ hiển thị thông tin)
  const renderPaidPaymentCard = (payment) => (
    <div
      key={payment.paymentId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <p className="font-bold">Mã thanh toán: {payment.paymentId}</p>
      <p>Ngày thanh toán: {format(new Date(payment.date), "dd/MM/yyyy")}</p>
      <p>Tổng tiền: {payment.total.toLocaleString()} VNĐ</p>
      <p className="mt-2 text-green-600 font-bold">Đã Thanh Toán</p>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Thông Tin Thanh Toán</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Đang Thanh Toán</h3>
        {paymentsPending.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto">
            {paymentsPending.map((payment) =>
              renderPendingPaymentCard(payment)
            )}
          </div>
        ) : (
          <p>Không có giao dịch đang chờ thanh toán</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Đã Thanh Toán</h3>
        {paymentsPaid.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto">
            {paymentsPaid.map((payment) => renderPaidPaymentCard(payment))}
          </div>
        ) : (
          <p>Chưa có giao dịch nào được thanh toán</p>
        )}
      </section>
    </div>
  );
};

export default PaymentCustomer;
