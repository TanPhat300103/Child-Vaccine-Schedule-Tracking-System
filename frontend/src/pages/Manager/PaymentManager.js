import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../style/PaymentManager.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(false); // false: Chưa thanh toán, true: Đã thanh toán
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [customerSearchText, setCustomerSearchText] = useState("");
  const [customerSearchFilter, setCustomerSearchFilter] = useState("id"); // 'id', 'name', 'phone', 'email'

  const [paymentSearchText, setPaymentSearchText] = useState("");
  const [paymentSearchFilter, setPaymentSearchFilter] = useState("bookingId"); // 'bookingId', 'date', 'transactionId'

  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    paymentId: null,
    couponCode: "", // Thêm trường để lưu mã coupon
  });

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/payment`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Nhận response từ GET /payment:", data);
        setPayments(data);
      })
      .catch((error) => console.error("Error fetching payments:", error));

    fetch(`${process.env.REACT_APP_API_BASE_URL}/marketing`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Nhận response từ GET /marketing:", data);
        setCoupons(data);
      })
      .catch((error) => console.error("Error fetching coupons:", error));
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        if (event.state.step === 1) {
          setSelectedCustomer(event.state.customerId);
          setSelectedPayment(null);
        } else if (event.state.step === 0) {
          setSelectedCustomer(null);
          setSelectedPayment(null);
        }
      } else {
        setSelectedCustomer(null);
        setSelectedPayment(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const groupedPayments = payments.reduce((acc, payment) => {
    const customerId = payment.booking.customer.customerId;
    if (!acc[customerId]) {
      acc[customerId] = [];
    }
    acc[customerId].push(payment);
    return acc;
  }, {});

  const customers = Object.keys(groupedPayments).map(
    (key) => groupedPayments[key][0].booking.customer
  );

  const filteredCustomers = customers.filter((customer) => {
    const search = customerSearchText.toLowerCase();
    if (customerSearchFilter === "id") {
      return customer.customerId.toLowerCase().includes(search);
    } else if (customerSearchFilter === "name") {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return fullName.includes(search);
    } else if (customerSearchFilter === "phone") {
      const phoneNumber = (customer.phoneNumber || "").toLowerCase();
      return phoneNumber.includes(search);
    } else if (customerSearchFilter === "email") {
      return customer.email.toLowerCase().includes(search);
    }
    return true;
  });

  const selectedPayments = selectedCustomer
    ? groupedPayments[selectedCustomer] || []
    : [];
  let filteredPayments = selectedPayments.filter((payment) => {
    if (paymentFilter === false) {
      return payment.method === false && payment.status === false;
    } else {
      return payment.status === true;
    }
  });

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

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedPayment(null);
    window.history.pushState({ step: 1, customerId }, "", window.location.href);
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    window.history.pushState(
      { step: 2, customerId: selectedCustomer, paymentId: payment.paymentId },
      "",
      window.location.href
    );
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleFilterChange = (filter) => {
    setPaymentFilter(filter);
    setSelectedPayment(null);
  };

  const openConfirmModal = (paymentId) => {
    setConfirmModal({ show: true, paymentId, couponCode: "" });
  };

  const confirmPayment = () => {
    const { paymentId, couponCode } = confirmModal;
    setConfirmModal({ show: false, paymentId: null, couponCode: "" });

    const coupon = couponCode.trim() || null;
    if (coupon) {
      const matchedCoupon = coupons.find(
        (c) => c.coupon.toLowerCase() === coupon.toLowerCase()
      );
      if (!matchedCoupon) {
        toast.error("Không có coupon này");
        return;
      } else if (!matchedCoupon.active) {
        toast.error("Coupon này đã hết hạn");
        return;
      }
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Đang xử lý thanh toán...");

    const url = `${process.env.REACT_APP_API_BASE_URL}/payment/update?paymentId=${paymentId}&coupon=${coupon}&method=false`;
    fetch(url, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json", // Bỏ qua warning page
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Nhận response từ POST /payment/update:", data);

        if (data.message === "COD") {
          fetch(`${process.env.REACT_APP_API_BASE_URL}/payment`, {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          })
            .then((res) => res.json())
            .then((res) => {
              setPayments(res);
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
          window.location.href = data.VNPAYURL;
        } else {
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

  const cancelConfirm = () => {
    setConfirmModal({ show: false, paymentId: null, couponCode: "" });
  };

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
      <div className="payment-detail-container-paymentmanager">
        <div className="payment-detail-header-paymentmanager">
          <h3 className="payment-detail-title-paymentmanager">
            Chi tiết thanh toán
          </h3>
          <button onClick={handleBack} className="back-button-paymentmanager">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="back-icon-paymentmanager"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Quay lại</span>
          </button>
        </div>

        <div className="payment-detail-grid-paymentmanager">
          <div className="payment-info-card-paymentmanager">
            <h4 className="card-title-paymentmanager">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="card-icon-paymentmanager"
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
            <div className="card-content-paymentmanager">
              <div className="card-item-paymentmanager">
                <span>Mã thanh toán:</span>
                <span>{paymentId}</span>
              </div>
              <div className="card-item-paymentmanager">
                <span>Ngày thanh toán:</span>
                <span>{date}</span>
              </div>
              <div className="card-item-paymentmanager">
                <span>Tổng tiền:</span>
                <span>{total}</span>
              </div>
              <div className="card-item-paymentmanager">
                <span>Phương thức thanh toán:</span>
                <span>{method ? "Đã thanh toán" : "Thanh toán tại quầy"}</span>
              </div>
              <div className="card-item-paymentmanager">
                <span>Trạng thái thanh toán:</span>
                <span
                  className={
                    status
                      ? "status-paid-paymentmanager"
                      : "status-pending-paymentmanager"
                  }
                >
                  {status ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              <div className="card-item-paymentmanager">
                <span>ID giao dịch:</span>
                <span>{transactionId || "—"}</span>
              </div>
              <div className="card-item-paymentmanager">
                <span>Coupon:</span>
                <span>
                  {marketingCampaign ? marketingCampaign.coupon : "Không có"}
                </span>
              </div>
            </div>
          </div>
          <div className="additional-info-paymentmanager">
            <div className="booking-info-card-paymentmanager">
              <h4 className="card-title-paymentmanager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="card-icon-paymentmanager"
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
              <div className="card-content-paymentmanager">
                <div className="card-item-paymentmanager">
                  <span>Mã đặt lịch:</span>
                  <span>{bookingId}</span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>Ngày đặt lịch:</span>
                  <span>{bookingDate}</span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>Tổng tiền:</span>
                  <span>{totalAmount}</span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>Trạng thái:</span>
                  <span>{bookingStatus}</span>
                </div>
              </div>
            </div>
            <div className="customer-info-card-paymentmanager">
              <h4 className="card-title-paymentmanager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="card-icon-paymentmanager"
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
              <div className="card-content-paymentmanager">
                <div className="card-item-paymentmanager">
                  <span>Mã khách hàng:</span>
                  <span>{customer.customerId}</span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>Tên:</span>
                  <span>
                    {customer.firstName} {customer.lastName}
                  </span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>SĐT:</span>
                  <span>{customer.phoneNumber}</span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>Email:</span>
                  <span>{customer.email}</span>
                </div>
                <div className="card-item-paymentmanager">
                  <span>Địa chỉ:</span>
                  <span>{customer.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-container-paymentmanager">
      <ToastContainer />

      {confirmModal.show && (
        <div className="modal-overlay-paymentmanager">
          <div className="modal-content-paymentmanager">
            <div className="modal-header-paymentmanager">
              <div className="modal-icon-container-paymentmanager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="modal-icon-paymentmanager"
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
              <h3 className="modal-title-paymentmanager">
                Xác nhận thanh toán
              </h3>
              <p className="modal-text-paymentmanager">
                Bạn có muốn thêm coupon không? Nếu có, vui lòng nhập mã coupon
                bên dưới.
              </p>
            </div>
            <div className="modal-input-container-paymentmanager">
              <input
                type="text"
                placeholder="Nhập mã coupon (nếu có)"
                value={confirmModal.couponCode}
                onChange={(e) =>
                  setConfirmModal({
                    ...confirmModal,
                    couponCode: e.target.value,
                  })
                }
                className="modal-input-paymentmanager"
              />
            </div>
            <div className="modal-buttons-paymentmanager">
              <button
                onClick={cancelConfirm}
                className="modal-cancel-button-paymentmanager"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="modal-confirm-button-paymentmanager"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar-paymentmanager">
        <h2 className="sidebar-title-paymentmanager">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="sidebar-icon-paymentmanager"
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
          Danh sách khách hàng
        </h2>

        <div className="search-container-paymentmanager">
          <div className="search-icon-container-paymentmanager">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon-paymentmanager"
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
            placeholder="Tìm kiếm khách hàng..."
            value={customerSearchText}
            onChange={(e) => setCustomerSearchText(e.target.value)}
            className="search-input-paymentmanager"
          />
          <select
            className="search-select-paymentmanager"
            value={customerSearchFilter}
            onChange={(e) => setCustomerSearchFilter(e.target.value)}
          >
            <option value="id">Mã</option>
            <option value="name">Tên</option>
            <option value="phone">SĐT</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div className="customer-list-paymentmanager">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.customerId}
                onClick={() => handleCustomerSelect(customer.customerId)}
                className={`customer-card-paymentmanager ${
                  selectedCustomer === customer.customerId
                    ? "selected-paymentmanager"
                    : ""
                }`}
              >
                <div className="customer-info-paymentmanager">
                  <div className="customer-avatar-paymentmanager">
                    {customer.firstName.charAt(0)}
                    {customer.lastName.charAt(0)}
                  </div>
                  <div className="customer-details-paymentmanager">
                    <p className="customer-name-paymentmanager">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="customer-id-paymentmanager">
                      {customer.customerId}
                    </p>
                  </div>
                </div>
                <div className="customer-contacts-paymentmanager">
                  <div className="contact-item-paymentmanager">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="contact-icon-paymentmanager"
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
                    <span>{customer.phoneNumber}</span>
                  </div>
                  <div className="contact-item-paymentmanager">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="contact-icon-paymentmanager"
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
                    <span>{customer.email}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results-paymentmanager">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="no-results-icon-paymentmanager"
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
              <p>Không tìm thấy khách hàng</p>
            </div>
          )}
        </div>
      </div>

      <div className="main-content-paymentmanager">
        {selectedCustomer ? (
          <>
            <div className="payment-header-paymentmanager">
              <h2 className="payment-title-paymentmanager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="payment-icon-paymentmanager"
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
              <div className="filter-buttons-paymentmanager">
                <button
                  onClick={() => handleFilterChange(false)}
                  className={`filter-button-paymentmanager ${
                    paymentFilter === false ? "active-paymentmanager" : ""
                  }`}
                >
                  Chưa thanh toán
                </button>
                <button
                  onClick={() => handleFilterChange(true)}
                  className={`filter-button-paymentmanager ${
                    paymentFilter === true ? "active-paymentmanager" : ""
                  }`}
                >
                  Đã thanh toán
                </button>
              </div>
            </div>

            <div className="search-container-paymentmanager">
              <div className="search-icon-container-paymentmanager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="search-icon-paymentmanager"
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
                className="search-input-paymentmanager"
              />
              <select
                className="search-select-paymentmanager"
                value={paymentSearchFilter}
                onChange={(e) => setPaymentSearchFilter(e.target.value)}
              >
                <option value="bookingId">Mã đặt lịch</option>
                <option value="date">Ngày thanh toán</option>
                <option value="transactionId">ID giao dịch</option>
              </select>
            </div>

            {selectedPayment ? (
              renderPaymentDetail()
            ) : filteredPayments.length > 0 ? (
              <div className="payment-list-paymentmanager">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.paymentId}
                    className="payment-card-paymentmanager"
                    onClick={() => handlePaymentSelect(payment)}
                  >
                    <div className="payment-card-content-paymentmanager">
                      <div className="payment-info-paymentmanager">
                        <p className="payment-id-paymentmanager">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="payment-id-icon-paymentmanager"
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
                        <p className="payment-date-paymentmanager">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="payment-date-icon-paymentmanager"
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
                        <p className="payment-total-paymentmanager">
                          Tổng tiền: {payment.total}
                        </p>
                        {payment.marketingCampaign && (
                          <p className="payment-coupon-paymentmanager">
                            Coupon: {payment.marketingCampaign.coupon}
                          </p>
                        )}
                      </div>
                      <div className="payment-actions-paymentmanager">
                        {payment.status ? (
                          <span className="payment-status-paid-paymentmanager">
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="payment-status-pending-paymentmanager">
                            Chưa thanh toán
                          </span>
                        )}
                        {payment.method === false &&
                          payment.status === false && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openConfirmModal(payment.paymentId);
                              }}
                              className="confirm-button-paymentmanager"
                            >
                              Xác nhận thanh toán
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-payments-paymentmanager">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="no-payments-icon-paymentmanager"
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
                <p className="no-payments-text-paymentmanager">
                  Không có thanh toán nào phù hợp
                </p>
                <p className="no-payments-subtext-paymentmanager">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="no-customer-selected-paymentmanager">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="no-customer-icon-paymentmanager"
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
            <p className="no-customer-text-paymentmanager">
              Chưa chọn khách hàng
            </p>
            <p className="no-customer-subtext-paymentmanager">
              Vui lòng chọn một khách hàng từ danh sách bên trái
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
