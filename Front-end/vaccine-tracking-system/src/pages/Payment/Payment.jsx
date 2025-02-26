import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { getPaymentByBookID } from "../../apis/api"; // Import API

const Payment = () => {
  const { state } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // Default data
  const navigate = useNavigate();

  // Hardcode bookingId and customerId
  const hardcodedBookingId = "C001-B25"; // Hardcoded bookingId
  const hardcodedCustomerId = "C001"; // Hardcoded customerId

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        // Thử lấy dữ liệu từ API hoặc dùng dữ liệu mặc định nếu API không hoạt động
        const data = await getPaymentByBookID(hardcodedBookingId); // Sử dụng bookingId hardcoded
        if (data) {
          setPaymentData(data); // Lưu dữ liệu thanh toán
        } else {
          console.log("Không có dữ liệu từ API, sử dụng dữ liệu mặc định.");
          // Hardcode giá trị thanh toán mặc định
          setPaymentData({
            status: "Chưa thanh toán",
            amount: 0,
            customerId: hardcodedCustomerId, // Hardcode customerId
            bookingId: hardcodedBookingId, // Hardcode bookingId
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin thanh toán:", error);
        // Hardcode giá trị nếu gặp lỗi
        setPaymentData({
          status: "Chưa thanh toán",
          amount: 0,
          customerId: hardcodedCustomerId, // Hardcode customerId
          bookingId: hardcodedBookingId, // Hardcode bookingId
        });
      }
    };

    fetchPaymentData();
  }, []); // Không phụ thuộc vào state.bookingId nữa vì chúng ta đã hardcode

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [paymentMethod]);

  const validateForm = () => {
    const newErrors = {};
    if (!paymentMethod)
      newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      if (paymentMethod === "offline") {
        // Thanh toán trực tiếp, chuyển hướng tới trang /bill
        navigate("/status-vaccine", {
          state: { ...state, paymentMethod, bookingId: hardcodedBookingId },
        });
      } else if (paymentMethod === "online") {
        // Thanh toán online, chuyển hướng tới trang /payment-online
        navigate("/payment-online", {
          state: { ...state, paymentMethod, bookingId: hardcodedBookingId },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative px-6 py-8 sm:px-12">
          <div className="absolute inset-0 bg-opacity-10 bg-blue-100 z-0">
            <div
              className="w-full h-full opacity-15"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
                backgroundSize: "cover",
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-semibold text-gray-900 text-center mb-8">
              Thanh Toán Lịch Tiêm Chủng Cho Trẻ
            </h2>

            <div className="space-y-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800">
                Thông Tin Đặt Lịch Tiêm
              </h3>
              <div className="space-y-4 text-lg text-gray-700">
                <p className="mt-4 text-xl font-semibold">
                  <strong>Tổng Số Tiền:</strong> 207000 VND
                </p>
                {paymentData && <div className="mt-4"></div>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  Chọn Phương Thức Thanh Toán
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="offline"
                      name="paymentMethod"
                      checked={paymentMethod === "offline"}
                      onChange={() => handlePaymentMethodChange("offline")}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="offline"
                      className="ml-3 text-lg font-medium text-gray-800 flex items-center"
                    >
                      <FaMoneyBillWave className="mr-3 text-blue-500" />
                      Thanh toán trực tiếp
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      checked={paymentMethod === "online"}
                      onChange={() => handlePaymentMethodChange("online")}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="online"
                      className="ml-3 text-lg font-medium text-gray-800 flex items-center"
                    >
                      <FaCreditCard className="mr-3 text-blue-500" />
                      Thanh toán online
                    </label>
                  </div>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 rounded-lg shadow-lg text-xl font-medium text-white ${
                  isFormValid
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-800"
                    : "bg-gray-300 cursor-not-allowed"
                } transition duration-300 ease-in-out transform hover:scale-105`}
              >
                Thanh Toán Ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
