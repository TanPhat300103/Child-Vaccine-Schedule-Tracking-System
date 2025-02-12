import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";    // Giả sử bạn có component Footer
import "./Payment.css"; // CSS cho trang thanh toán
const Payment = () => {
  // Hiện tại chỉ hỗ trợ thanh toán bằng tiền mặt
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Xử lý submit form thanh toán
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // TODO: Sửa URL endpoint và payload khi backend hoàn thiện
    try {
      const response = await axios.post("http://localhost:8080/api/payment", {
        method: paymentMethod,
        // TODO: Thêm các thông tin thanh toán cần thiết (ví dụ: orderId, amount, …)
      });
      // Kiểm tra phản hồi từ backend
      if (response.status === 200) {
        setSuccess(true);
        setError(null);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Payment processing error. Please try again later.");
    }
  };

  return (
    <>
      <Header />
      <div className="payment-container">
        <h1>Payment</h1>
        <form onSubmit={handlePaymentSubmit} className="payment-form">
          <div className="payment-method">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Cash Payment
            </label>
            {/* TODO: Nếu sau này có thêm các phương thức thanh toán khác, bạn có thể thêm các radio input ở đây */}
          </div>
          <button type="submit" className="payment-submit-btn">
            Pay Now
          </button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Payment successful!</p>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
