import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(false); // false: Chưa thanh toán, true: Đã thanh toán
  const [selectedPayment, setSelectedPayment] = useState(null);

  // State tìm kiếm cho customer (bên trái)
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [customerSearchFilter, setCustomerSearchFilter] = useState("id"); // 'id', 'name', 'phone', 'email'

  // State tìm kiếm cho payment (bên phải)
  const [paymentSearchText, setPaymentSearchText] = useState("");
  const [paymentSearchFilter, setPaymentSearchFilter] = useState("bookingId"); // 'bookingId', 'date', 'transactionId'

  // State hiển thị modal xác nhận thanh toán
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    paymentId: null,
  });

  // Lấy danh sách payments từ API khi component load
  useEffect(() => {
    console.log("Gửi GET request tới: http://localhost:8080/payment");
    axios
      .get("http://localhost:8080/payment", { withCredentials: true })
      .then((response) => {
        console.log("Nhận response từ GET /payment:", response.data);
        setPayments(response.data);
        // Ban đầu, để bên phải trống cho đến khi chọn customer
      })
      .catch((error) => console.error("Error fetching payments:", error));
  }, []);

  // Nhóm payments theo customerId
  const groupedPayments = payments.reduce((acc, payment) => {
    const customerId = payment.booking.customer.customerId;
    if (!acc[customerId]) {
      acc[customerId] = [];
    }
    acc[customerId].push(payment);
    return acc;
  }, {});

  // Danh sách customers từ groupedPayments
  const customers = Object.keys(groupedPayments).map(
    (key) => groupedPayments[key][0].booking.customer
  );

  // Lọc danh sách customer theo tìm kiếm
  const filteredCustomers = customers.filter((customer) => {
    const search = customerSearchText.toLowerCase();
    if (customerSearchFilter === "id") {
      return customer.customerId.toLowerCase().includes(search);
    } else if (customerSearchFilter === "name") {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return fullName.includes(search);
    } else if (customerSearchFilter === "phone") {
      return customer.phoneNumber.toLowerCase().includes(search);
    } else if (customerSearchFilter === "email") {
      return customer.email.toLowerCase().includes(search);
    }
    return true;
  });

  // Lấy danh sách payments của customer được chọn
  const selectedPayments = selectedCustomer
    ? groupedPayments[selectedCustomer] || []
    : [];
  // Lọc theo trạng thái:
  // - Nếu filter = false: chỉ nhận payment có method === false và status === false (Chưa thanh toán)
  // - Nếu filter = true: nhận payment có status === true (Đã thanh toán)
  let filteredPayments = selectedPayments.filter((payment) => {
    if (paymentFilter === false) {
      return payment.method === false && payment.status === false;
    } else {
      return payment.status === true;
    }
  });

  // Áp dụng tìm kiếm cho payment
  filteredPayments = filteredPayments.filter((payment) => {
    const search = paymentSearchText.toLowerCase();
    if (paymentSearchFilter === "bookingId") {
      return payment.booking.bookingId.toLowerCase().includes(search);
    } else if (paymentSearchFilter === "date") {
      return payment.date.toLowerCase().includes(search);
    } else if (paymentSearchFilter === "transactionId") {
      return payment.transactionId.toLowerCase().includes(search);
    }
    return true;
  });

  // Khi chọn customer
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedPayment(null);
  };

  // Khi chuyển đổi filter (Chưa thanh toán / Đã thanh toán)
  const handleFilterChange = (filter) => {
    setPaymentFilter(filter);
    setSelectedPayment(null);
  };

  // Khi bấm nút xác nhận thanh toán, mở modal confirm
  const openConfirmModal = (paymentId) => {
    setConfirmModal({ show: true, paymentId });
  };

  // Xử lý khi xác nhận trong modal
  const confirmPayment = () => {
    const paymentId = confirmModal.paymentId;
    setConfirmModal({ show: false, paymentId: null });
    // Hiển thị toast ngay lập tức
    toast.info("Đang Thanh Toán...", { autoClose: 3000 });
    console.log(
      "Gửi POST request tới: http://localhost:8080/payment/update với paymentId:",
      paymentId
    );
    axios
      .post("http://localhost:8080/payment/update", null, {
        params: {
          paymentId: paymentId,
          coupon: "CONHAN", // Gửi coupon theo yêu cầu
          method: false, // Giữ nguyên method (COD)
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Nhận response từ POST /payment/update:", response.data);
        const { VNPAYURL } = response.data;
        if (VNPAYURL) {
          window.location.href = VNPAYURL;
        } else {
          // Sau 0,1 giây, refresh dữ liệu mà vẫn giữ lại customer được chọn
          axios
            .get("http://localhost:8080/payment", { withCredentials: true })
            .then((res) => {
              console.log("Làm mới danh sách payments:", res.data);
              setPayments(res.data);
              setSelectedPayment(null);
            })
            .catch((err) => console.error("Error refreshing payments:", err));
        }
      })
      .catch((error) => console.error("Error updating payment:", error));
  };

  // Hủy modal xác nhận
  const cancelConfirm = () => {
    setConfirmModal({ show: false, paymentId: null });
  };

  // Render chi tiết thanh toán của payment được chọn
  const renderPaymentDetail = () => {
    if (!selectedPayment) return null;
    const {
      paymentId,
      booking,
      date,
      total,
      method,
      status,
      transactionId,
      coupon,
    } = selectedPayment;
    const {
      bookingId,
      bookingDate,
      totalAmount,
      status: bookingStatus,
      customer,
    } = booking;
    return (
      <div className="border border-gray-300 rounded p-4 mt-4">
        <button
          onClick={() => setSelectedPayment(null)}
          className="mb-2 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
        >
          Back
        </button>
        <h3 className="text-xl font-semibold mb-2">Chi tiết thanh toán</h3>
        <p>
          <strong>Mã thanh toán:</strong> {paymentId}
        </p>
        <p>
          <strong>Ngày thanh toán:</strong> {date}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {total}
        </p>
        <p>
          <strong>Phương thức thanh toán:</strong>{" "}
          {method ? "Đã thanh toán" : "Thanh toán tại quầy"}
        </p>
        <p>
          <strong>Trạng thái thanh toán:</strong>{" "}
          {status ? "Đã thanh toán" : "Chưa thanh toán"}
        </p>
        <p>
          <strong>ID giao dịch:</strong> {transactionId}
        </p>
        <div className="mt-2">
          <h4 className="font-semibold">Thông tin Booking:</h4>
          <ul className="list-disc list-inside">
            <li>
              <strong>Mã booking:</strong> {bookingId}
            </li>
            <li>
              <strong>Ngày booking:</strong> {bookingDate}
            </li>
            <li>
              <strong>Tổng tiền booking:</strong> {totalAmount}
            </li>
            <li>
              <strong>Trạng thái booking:</strong> {bookingStatus}
            </li>
          </ul>
        </div>
        <div className="mt-2">
          <h4 className="font-semibold">Thông tin khách hàng:</h4>
          <ul className="list-disc list-inside">
            <li>
              <strong>Mã khách hàng:</strong> {customer.customerId}
            </li>
            <li>
              <strong>Tên:</strong> {customer.firstName} {customer.lastName}
            </li>
            <li>
              <strong>SĐT:</strong> {customer.phoneNumber}
            </li>
            <li>
              <strong>Email:</strong> {customer.email}
            </li>
            <li>
              <strong>Địa chỉ:</strong> {customer.address}
            </li>
          </ul>
        </div>
        <p>
          <strong>Coupon:</strong> {coupon || "None"}
        </p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Thanh Toast */}
      <ToastContainer />

      {/* Modal xác nhận thanh toán */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-2xl bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Xác nhận thanh toán</h3>
            <p className="mb-4">
              Bạn có chắc chắn muốn xác nhận thanh toán không?
            </p>
            <div className="flex justify-end">
              <button
                onClick={cancelConfirm}
                className="mr-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cột bên trái: Danh sách khách hàng */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Danh sách khách hàng</h2>
        {/* Thanh tìm kiếm customer */}
        <div className="mb-4">
          <select
            className="border border-gray-300 rounded p-1 mr-2"
            value={customerSearchFilter}
            onChange={(e) => setCustomerSearchFilter(e.target.value)}
          >
            <option value="id">Mã</option>
            <option value="name">Tên</option>
            <option value="phone">SĐT</option>
            <option value="email">Email</option>
          </select>
          <input
            type="text"
            placeholder="Tìm khách hàng..."
            value={customerSearchText}
            onChange={(e) => setCustomerSearchText(e.target.value)}
            className="border border-gray-300 rounded p-1 w-full"
          />
        </div>
        {filteredCustomers.map((customer) => (
          <div
            key={customer.customerId}
            onClick={() => handleCustomerSelect(customer.customerId)}
            className={`border border-gray-300 rounded p-4 mb-4 cursor-pointer hover:bg-gray-100 ${
              selectedCustomer === customer.customerId
                ? "bg-gray-200"
                : "bg-white"
            }`}
          >
            <p>
              <strong>Mã:</strong> {customer.customerId}
            </p>
            <p>
              <strong>Tên:</strong> {customer.firstName} {customer.lastName}
            </p>
            <p>
              <strong>SĐT:</strong> {customer.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
          </div>
        ))}
      </div>

      {/* Cột bên phải: Thanh toán và chi tiết */}
      <div className="w-2/3 p-4 overflow-y-auto">
        {selectedCustomer ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Thanh toán của khách {selectedCustomer}
            </h2>
            {/* Thanh tìm kiếm payment */}
            <div className="mb-4 flex items-center">
              <select
                className="border border-gray-300 rounded p-1 mr-2"
                value={paymentSearchFilter}
                onChange={(e) => setPaymentSearchFilter(e.target.value)}
              >
                <option value="bookingId">Mã đặt lịch</option>
                <option value="date">Ngày thanh toán</option>
                <option value="transactionId">ID giao dịch</option>
              </select>
              <input
                type="text"
                placeholder="Tìm thanh toán..."
                value={paymentSearchText}
                onChange={(e) => setPaymentSearchText(e.target.value)}
                className="border border-gray-300 rounded p-1 w-full"
              />
            </div>
            {/* Nút chuyển trạng thái */}
            <div className="mb-4">
              <button
                onClick={() => handleFilterChange(false)}
                className={`mr-4 py-2 px-4 rounded ${
                  paymentFilter === false
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Chưa thanh toán
              </button>
              <button
                onClick={() => handleFilterChange(true)}
                className={`py-2 px-4 rounded ${
                  paymentFilter === true
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Đã thanh toán
              </button>
            </div>
            {selectedPayment ? (
              renderPaymentDetail()
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="border border-gray-300 rounded p-4 mb-4 cursor-pointer hover:bg-gray-100"
                >
                  <div onClick={() => setSelectedPayment(payment)}>
                    <p>
                      <strong>Mã thanh toán:</strong> {payment.paymentId}
                    </p>
                    <p>
                      <strong>Ngày:</strong> {payment.date}
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong> {payment.total}
                    </p>
                  </div>
                  {/* Nếu payment chưa thanh toán (COD: method === false và status === false) thì hiển thị nút xác nhận */}
                  {payment.method === false && payment.status === false && (
                    <button
                      onClick={() => openConfirmModal(payment.paymentId)}
                      className="mt-2 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Xác nhận thanh toán
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>Không có thanh toán nào.</p>
            )}
          </>
        ) : (
          <div className="text-gray-500">
            Vui lòng chọn khách hàng để hiển thị thanh toán.
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
