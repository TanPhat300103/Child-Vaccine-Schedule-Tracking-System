import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { format } from "date-fns";

const apiUrl = import.meta.env.VITE_API_URL;
const VaccinePaymentPage = () => {
  const { state } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  if (!state) {
    return <p>Error: Không có dữ liệu từ trang trước!</p>;
  }

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
    if (validateForm()) {
      if (paymentMethod === "offline") {
        // Nếu thanh toán trực tiếp, thực hiện thanh toán và chuyển hướng về trang /home
        try {
          const response = await fetch("${apiUrl}/Schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...state, paymentMethod }),
          });

          if (!response.ok) throw new Error("Thanh toán thất bại");

          alert("Thanh toán thành công!");
          navigate("/status-schedule"); // Chuyển hướng về trang /home
        } catch (error) {
          alert(error.message);
        }
      } else if (paymentMethod === "online") {
        // Nếu thanh toán online, chuyển hướng đến trang /payment-online
        navigate("/payment-online");
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
                <p>
                  <strong>Họ và tên:</strong> {state.childName}
                </p>
                <p>
                  <strong>Ngày sinh:</strong>{" "}
                  {format(new Date(state.dateOfBirth), "dd/MM/yyyy")}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {state.phoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {state.email}
                </p>
                <p>
                  <strong>Trung tâm tiêm:</strong> {state.center}
                </p>
                <p>
                  <strong>Vắc-xin:</strong> {state.vaccine}
                </p>
                <p>
                  <strong>Ngày tiêm:</strong>{" "}
                  {format(new Date(state.appointmentDate), "dd/MM/yyyy")}
                </p>
                <p>
                  <strong>Khung giờ:</strong> {state.timeSlot}
                </p>
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

export default VaccinePaymentPage;
