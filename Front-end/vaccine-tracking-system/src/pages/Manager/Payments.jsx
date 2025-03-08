import React, { useState, useEffect } from "react";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Lấy danh sách payment từ API khi component load
  useEffect(() => {
    axios
      .get("http://localhost:8080/payment", {
        withCredentials: true,
      })
      .then((response) => {
        setPayments(response.data);
        // Nếu có dữ liệu, chọn khách hàng đầu tiên theo customerId
        if (response.data.length > 0) {
          const firstCustomerId = response.data[0].booking.customer.customerId;
          setSelectedCustomer(firstCustomerId);
        }
      })
      .catch((error) => console.error("Error fetching payments:", error));
  }, []);

  // Nhóm các payment theo customerId
  const groupedPayments = payments.reduce((acc, payment) => {
    const customerId = payment.booking.customer.customerId;
    if (!acc[customerId]) {
      acc[customerId] = [];
    }
    acc[customerId].push(payment);
    return acc;
  }, {});

  // Khi chọn một khách hàng từ bên trái
  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
  };

  // Lấy danh sách payment của khách hàng được chọn
  const selectedPayments = selectedCustomer
    ? groupedPayments[selectedCustomer] || []
    : [];

  // Phân chia theo trạng thái thanh toán: method = false/0 => chưa thanh toán, method khác => đã thanh toán.
  const unpaidPayments = selectedPayments.filter(
    (payment) => payment.method === false || payment.method === 0
  );
  const paidPayments = selectedPayments.filter(
    (payment) => payment.method !== false && payment.method !== 0
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Phần bên trái: danh sách khách hàng */}
      <div
        style={{
          flex: 1,
          borderRight: "1px solid #ccc",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <h2>Khách hàng</h2>
        {Object.keys(groupedPayments).map((customerId) => {
          const customer = groupedPayments[customerId][0].booking.customer;
          return (
            <div
              key={customerId}
              onClick={() => handleCustomerSelect(customerId)}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                backgroundColor:
                  selectedCustomer === customerId ? "#f0f0f0" : "#fff",
              }}
            >
              <div>
                <strong>Mã:</strong> {customer.customerId}
              </div>
              <div>
                <strong>Tên:</strong> {customer.firstName} {customer.lastName}
              </div>
              <div>
                <strong>SĐT:</strong> {customer.phoneNumber}
              </div>
              <div>
                <strong>Email:</strong> {customer.email}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phần bên phải: chi tiết hóa đơn của khách được chọn */}
      <div style={{ flex: 2, padding: "10px", overflowY: "auto" }}>
        {selectedCustomer ? (
          <>
            <h2>Hóa đơn của khách {selectedCustomer}</h2>
            <div>
              <h3>Chưa thanh toán</h3>
              {unpaidPayments.length > 0 ? (
                unpaidPayments.map((payment) => (
                  <div
                    key={payment.paymentId}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <strong>Mã hóa đơn:</strong> {payment.paymentId}
                    </div>
                    <div>
                      <strong>Ngày:</strong> {payment.date}
                    </div>
                    <div>
                      <strong>Tổng tiền:</strong> {payment.total}
                    </div>
                    <div>
                      <strong>Trạng thái:</strong> Chưa thanh toán
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có hóa đơn chưa thanh toán.</div>
              )}
            </div>
            <div>
              <h3>Đã thanh toán</h3>
              {paidPayments.length > 0 ? (
                paidPayments.map((payment) => (
                  <div
                    key={payment.paymentId}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <strong>Mã hóa đơn:</strong> {payment.paymentId}
                    </div>
                    <div>
                      <strong>Ngày:</strong> {payment.date}
                    </div>
                    <div>
                      <strong>Tổng tiền:</strong> {payment.total}
                    </div>
                    <div>
                      <strong>Trạng thái:</strong> Đã thanh toán
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có hóa đơn đã thanh toán.</div>
              )}
            </div>
          </>
        ) : (
          <div>Vui lòng chọn khách hàng từ bên trái.</div>
        )}
      </div>
    </div>
  );
};

export default Payments;
