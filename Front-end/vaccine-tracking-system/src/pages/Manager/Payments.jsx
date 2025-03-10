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

  const [isLoading, setIsLoading] = useState(false);
  // State hiển thị modal xác nhận thanh toán
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    paymentId: null,
  });

  // State cho modal thêm coupon
  const [couponModal, setCouponModal] = useState({
    show: false,
    paymentId: null,
    couponCode: "",
  });

  // State để lưu danh sách coupon từ API
  const [coupons, setCoupons] = useState([]);

  // Lấy danh sách payments và coupons từ API khi component load
  useEffect(() => {
    // Lấy danh sách payments
    axios
      .get("http://localhost:8080/payment", { withCredentials: true })
      .then((response) => {
        console.log("Nhận response từ GET /payment:", response.data);
        setPayments(response.data);
      })
      .catch((error) => console.error("Error fetching payments:", error));

    // Lấy danh sách coupons
    axios
      .get("http://localhost:8080/marketing", { withCredentials: true })
      .then((response) => {
        console.log("Nhận response từ GET /marketing:", response.data);
        setCoupons(response.data);
      })
      .catch((error) => console.error("Error fetching coupons:", error));
  }, []);

  // **Thêm useEffect để lắng nghe sự kiện popstate**
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        if (event.state.step === 1) {
          // Quay về bước 2: danh sách hóa đơn của khách hàng
          setSelectedCustomer(event.state.customerId);
          setSelectedPayment(null);
        } else if (event.state.step === 0) {
          // Quay về bước 1: danh sách khách hàng
          setSelectedCustomer(null);
          setSelectedPayment(null);
        }
      } else {
        // Nếu không có state (trang trước Payments), có thể xử lý tùy ý
        setSelectedCustomer(null);
        setSelectedPayment(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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
  // Lọc theo trạng thái
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
    window.history.pushState({ step: 1, customerId }, "", window.location.href);
  };

  // **Thêm hàm handlePaymentSelect để đẩy state khi chọn hóa đơn**
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    window.history.pushState(
      { step: 2, customerId: selectedCustomer, paymentId: payment.paymentId },
      "",
      window.location.href
    );
  };

  // **Sửa nút Quay Lại để dùng window.history.back()**
  const handleBack = () => {
    window.history.back();
  };

  const handleFilterChange = (filter) => {
    setPaymentFilter(filter);
    setSelectedPayment(null);
  };

  // Khi bấm nút xác nhận thanh toán, mở modal confirm
  const openConfirmModal = (paymentId) => {
    setConfirmModal({ show: true, paymentId });
  };

  // Mở modal thêm coupon
  const openCouponModal = (paymentId) => {
    setCouponModal({ show: true, paymentId, couponCode: "" });
  };

  // Đóng modal thêm coupon
  const closeCouponModal = () => {
    setCouponModal({ show: false, paymentId: null, couponCode: "" });
  };

  // Xử lý thêm coupon
  const addCoupon = () => {
    const { paymentId, couponCode } = couponModal;
    if (!couponCode) {
      toast.error("Vui lòng nhập mã coupon");
      return;
    }

    // Kiểm tra coupon từ danh sách đã lấy
    const matchedCoupon = coupons.find(
      (coupon) => coupon.coupon.toLowerCase() === couponCode.toLowerCase()
    );

    if (!matchedCoupon) {
      toast.error("Không có coupon này");
      return;
    } else if (!matchedCoupon.active) {
      toast.error("Coupon này đã hết hạn");
      return;
    }

    // Coupon hợp lệ, cập nhật payment
    axios
      .post("http://localhost:8080/payment/update", null, {
        params: { paymentId, coupon: couponCode, method: false },
        withCredentials: true,
      })
      .then(() => {
        toast.success("Thêm coupon thành công");
        // Làm mới danh sách payments
        axios
          .get("http://localhost:8080/payment", { withCredentials: true })
          .then((res) => {
            setPayments(res.data);
            closeCouponModal();
          });
      })
      .catch((error) => {
        toast.error("Lỗi khi thêm coupon");
        console.error("Error updating payment:", error);
      });
  };

  // Xử lý khi xác nhận thanh toán
  // Ví dụ hàm validate coupon (theo tiêu chí: coupon phải là chữ in hoa và số, độ dài từ 1 đến 99 ký tự)// Hàm validate coupon (cho phép chữ hoa và chữ thường, số; độ dài từ 5 đến 10 ký tự)
  function isCouponValid(coupon) {
    const regex = /^[A-Za-z0-9]{1,99}$/;
    return regex.test(coupon);
  }

  // Xử lý khi xác nhận thanh toán
  const confirmPayment = () => {
    const { paymentId } = confirmModal;
    // Ẩn modal xác nhận
    setConfirmModal({ show: false, paymentId: null });

    // Lấy coupon hiện tại và validate (nếu có)
    const coupon = selectedPayment?.marketingCampaign?.coupon?.trim() || "";
    if (coupon && !isCouponValid(coupon)) {
      toast.error("Coupon không hợp lệ");
      return;
    }

    // Bật trạng thái loading để disable các thao tác giao diện
    setIsLoading(true);

    // Hiển thị toast loading
    const loadingToast = toast.loading("Đang xử lý thanh toán...");

    axios
      .post("http://localhost:8080/payment/update", null, {
        params: { paymentId, coupon, method: false },
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        console.log("Nhận response từ POST /payment/update:", data);

        // Nếu nhận được trường message với giá trị "COD" thì xử lý COD
        if (data.message === "COD") {
          // Làm mới danh sách payments
          axios
            .get("http://localhost:8080/payment", { withCredentials: true })
            .then((res) => {
              setPayments(res.data);
              setSelectedPayment(null);
            })
            .catch((err) => console.error("Error refreshing payments:", err));

          toast.update(loadingToast, {
            render: "Thanh Toán Thành Công",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else if (data.VNPAYURL) {
          // Trường hợp online (nếu có)
          window.location.href = data.VNPAYURL;
        } else {
          // Xử lý lỗi hoặc response không mong đợi
          toast.update(loadingToast, {
            render: data.message || "Thanh toán thất bại. Vui lòng thử lại.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error updating payment:", error);
        toast.update(loadingToast, {
          render:
            error.response?.data?.message ||
            "Đã có lỗi xảy ra. Vui lòng thử lại.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      marketingCampaign,
    } = selectedPayment;
    const {
      bookingId,
      bookingDate,
      totalAmount,
      status: bookingStatus,
      customer,
    } = booking;
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-teal-800">
            Chi tiết thanh toán
          </h3>
          <button
            onClick={handleBack} // **Sửa thành handleBack**
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1">Quay lại</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-teal-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-teal-700 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Thông tin thanh toán
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-teal-100 pb-2">
                <span className="text-gray-600">Mã thanh toán:</span>
                <span className="font-medium text-gray-800">{paymentId}</span>
              </div>
              <div className="flex justify-between border-b border-teal-100 pb-2">
                <span className="text-gray-600">Ngày thanh toán:</span>
                <span className="font-medium text-gray-800">{date}</span>
              </div>
              <div className="flex justify-between border-b border-teal-100 pb-2">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium text-teal-600">{total}</span>
              </div>
              <div className="flex justify-between border-b border-teal-100 pb-2">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="font-medium text-gray-800">
                  {method ? "Đã thanh toán" : "Thanh toán tại quầy"}
                </span>
              </div>
              <div className="flex justify-between border-b border-teal-100 pb-2">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span
                  className={`font-medium ${
                    status ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {status ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              <div className="flex justify-between border-b border-teal-100 pb-2">
                <span className="text-gray-600">ID giao dịch:</span>
                <span className="font-medium text-gray-800">
                  {transactionId || "—"}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-600">Coupon:</span>
                <span className="font-medium text-indigo-600">
                  {marketingCampaign ? marketingCampaign.coupon : "Không có"}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin đặt lịch
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-600">Mã đặt lịch:</span>
                  <span className="font-medium text-gray-800">{bookingId}</span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-600">Ngày đặt lịch:</span>
                  <span className="font-medium text-gray-800">
                    {bookingDate}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium text-blue-600">
                    {totalAmount}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-blue-600">
                    {bookingStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin khách hàng
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-indigo-100 pb-2">
                  <span className="text-gray-600">Mã khách hàng:</span>
                  <span className="font-medium text-gray-800">
                    {customer.customerId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-indigo-100 pb-2">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium text-gray-800">
                    {customer.firstName} {customer.lastName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-indigo-100 pb-2">
                  <span className="text-gray-600">SĐT:</span>
                  <span className="font-medium text-gray-800">
                    {customer.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between border-b border-indigo-100 pb-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">
                    {customer.email}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium text-gray-800">
                    {customer.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Thanh Toast */}
      <ToastContainer />

      {/* Modal xác nhận thanh toán */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-30">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-fadeIn">
            <div className="text-center mb-6">
              <div className="bg-teal-100 mx-auto rounded-full p-3 h-16 w-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Xác nhận thanh toán
              </h3>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xác nhận thanh toán này không?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelConfirm}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 py-2 px-4 bg-teal-600 rounded-lg text-white font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm coupon */}
      {couponModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-30">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-fadeIn">
            <div className="text-center mb-6">
              <div className="bg-teal-100 mx-auto rounded-full p-3 h-16 w-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Thêm Coupon
              </h3>
              <p className="text-gray-600">
                Nhập mã coupon để áp dụng cho thanh toán này.
              </p>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nhập mã coupon"
                value={couponModal.couponCode}
                onChange={(e) =>
                  setCouponModal({ ...couponModal, couponCode: e.target.value })
                }
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={closeCouponModal}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={addCoupon}
                className="flex-1 py-2 px-4 bg-teal-600 rounded-lg text-white font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
              >
                Thêm Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar: Danh sách khách hàng */}
      <div className="w-1/3 border-r border-gray-200 bg-white shadow-md p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Danh sách bệnh nhân
        </h2>

        {/* Thanh tìm kiếm customer */}
        <div className="relative mb-6 bg-gray-50 rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            value={customerSearchText}
            onChange={(e) => setCustomerSearchText(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border-0 rounded-lg bg-transparent focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <select
              className="h-full py-0 pl-2 pr-7 border-0 bg-transparent text-gray-500 focus:ring-0 focus:outline-none"
              value={customerSearchFilter}
              onChange={(e) => setCustomerSearchFilter(e.target.value)}
            >
              <option value="id">Mã</option>
              <option value="name">Tên</option>
              <option value="phone">SĐT</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>

        {/* Danh sách khách hàng */}
        <div className="space-y-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.customerId}
                onClick={() => handleCustomerSelect(customer.customerId)}
                className={`rounded-lg transition-all duration-200 cursor-pointer overflow-hidden ${
                  selectedCustomer === customer.customerId
                    ? "bg-teal-50 border-l-4 border-teal-500 shadow-md"
                    : "bg-white border border-gray-200 hover:border-teal-200 hover:bg-teal-50"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                        selectedCustomer === customer.customerId
                          ? "bg-teal-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {customer.firstName.charAt(0)}
                      {customer.lastName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.customerId}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="truncate">{customer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="mt-2 text-gray-500">Không tìm thấy bệnh nhân</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content: Thanh toán và chi tiết */}
      <div className="w-2/3 p-6 overflow-y-auto">
        {selectedCustomer ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Lịch sử thanh toán
              </h2>

              {/* Nút chuyển trạng thái */}
              <div className="flex bg-gray-100 p-1 rounded-lg shadow-sm">
                <button
                  onClick={() => handleFilterChange(false)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    paymentFilter === false
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Chưa thanh toán
                </button>
                <button
                  onClick={() => handleFilterChange(true)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    paymentFilter === true
                      ? "bg-white text-teal-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Đã thanh toán
                </button>
              </div>
            </div>

            {/* Thanh tìm kiếm payment */}
            <div className="relative mb-6 bg-gray-50 rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm thanh toán..."
                value={paymentSearchText}
                onChange={(e) => setPaymentSearchText(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border-0 rounded-lg bg-transparent focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  className="h-full py-0 pl-2 pr-7 border-0 bg-transparent text-gray-500 focus:ring-0 focus:outline-none"
                  value={paymentSearchFilter}
                  onChange={(e) => setPaymentSearchFilter(e.target.value)}
                >
                  <option value="bookingId">Mã đặt lịch</option>
                  <option value="date">Ngày thanh toán</option>
                  <option value="transactionId">ID giao dịch</option>
                </select>
              </div>
            </div>

            {/* Nội dung chính: Danh sách hoặc chi tiết thanh toán */}
            {selectedPayment ? (
              renderPaymentDetail()
            ) : filteredPayments.length > 0 ? (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.paymentId}
                    className="bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-teal-200"
                    onClick={() => handlePaymentSelect(payment)} // **Sửa thành handlePaymentSelect**
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-gray-800 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-teal-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9l-4-4H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Mã: {payment.paymentId}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Ngày: {payment.date}
                        </p>
                        <p className="text-sm text-teal-600 font-medium">
                          Tổng tiền: {payment.total}
                        </p>
                        {payment.marketingCampaign && (
                          <p className="text-sm text-indigo-600 font-medium">
                            Coupon: {payment.marketingCampaign.coupon}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        {payment.status ? (
                          <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
                            Chưa thanh toán
                          </span>
                        )}
                        {payment.method === false &&
                          payment.status === false && (
                            <>
                              {!payment.marketingCampaign && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCouponModal(payment.paymentId);
                                  }}
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-1.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                  Thêm Coupon
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openConfirmModal(payment.paymentId);
                                }}
                                className="bg-teal-500 hover:bg-teal-600 text-white text-sm py-1.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                Xác nhận
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-teal-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-lg text-gray-500 font-medium">
                  Không có thanh toán nào phù hợp
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-teal-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-lg text-gray-500 font-medium">
              Chưa chọn bệnh nhân
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Vui lòng chọn một bệnh nhân từ danh sách bên trái
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
