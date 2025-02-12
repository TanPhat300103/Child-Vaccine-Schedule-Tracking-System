import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";    // Giả sử bạn có component Footer
import "./Payment.css"; // CSS cho trang thanh toán              // File CSS toàn cục

const Payment = () => {
  // State lưu thông tin người dùng nhập vào
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "cash", // Chỉ có "cash" (tiền mặt) lúc này
  });

  // State hiển thị thông báo lỗi và thành công
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Xử lý thay đổi các input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form thanh toán
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Cập nhật URL endpoint và payload khi backend hoàn thiện
      const response = await axios.post("http://localhost:8080/api/payment", {
        // Gửi payload theo định dạng mà backend yêu cầu
        ...formData,
        // Có thể thêm các trường khác như orderId, amount,... nếu cần
      });
      
      if (response.status === 200) {
        setSuccess(true);
        setError(null);
      } else {
        setError("Thanh toán thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi xử lý thanh toán, vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Header />
      <div className="payment-container">
        <h1>Thanh toán</h1>
        <form onSubmit={handlePaymentSubmit} className="payment-form">
          <div className="input-group">
            <label htmlFor="fullname">Họ và Tên:</label>
            <input 
              type="text" 
              id="fullname"
              name="fullname" 
              value={formData.fullname} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">SĐT:</label>
            <input 
              type="text" 
              id="phone"
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">Address:</label>
            <input 
              type="text" 
              id="address"
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === "cash"}
                onChange={handleChange}
              />
              Thanh toán (Tiền mặt)
            </label>
            {/* TODO: Nếu có thêm phương thức thanh toán khác, bổ sung thêm ở đây */}
          </div>

          <button type="submit" className="payment-button">
            Thanh toán
          </button>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Thanh toán thành công!</p>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Payment;
