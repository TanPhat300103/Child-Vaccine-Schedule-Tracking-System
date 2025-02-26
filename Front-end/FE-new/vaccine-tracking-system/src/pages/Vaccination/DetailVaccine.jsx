import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookingDetailsByBookID } from "../../apis/api";
import Header from "../../components/common/Header";

const DetailVaccine = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);

  // Sử dụng bookingId mặc định nếu không có từ state
  const bookingId = state?.bookingId;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const data = await getBookingDetailsByBookID(bookingId);
        setBookingData(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết booking:", error);
      }
    };
    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleSubmit = () => {
    console.log("Đang chuyển sang trang Payment với bookingId:", bookingId);
    navigate("/payment", { state: { bookingId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Chi Tiết Mũi Tiêm
          </h1>
          <p className="text-xl text-gray-600">
            Thông tin các mũi tiêm vừa đặt
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {bookingData.map((booking, index) => (
            <div key={index}>
              {/* Vaccine, Customer, Booking Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Thông tin Vaccine {index + 1}
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                  <p className="text-gray-700">
                    <strong>Tên Vaccine:</strong> {booking.vaccine.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Ngày Tiêm:</strong>{" "}
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <strong>Giờ Tiêm:</strong>{" "}
                    {new Date(booking.scheduledDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Thông Tin Liên Hệ
                </h2>
                <div className="bg-green-50 p-4 rounded-lg shadow-md">
                  <p className="text-gray-700">
                    <strong>Họ và Tên:</strong>{" "}
                    {booking.booking.customer.firstName}{" "}
                    {booking.booking.customer.lastName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Số Điện Thoại:</strong>{" "}
                    {booking.booking.customer.phoneNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {booking.booking.customer.email}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Thông Tin Đặt Lịch
                </h2>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                  <p className="text-gray-700">
                    <strong>Trung Tâm Tiêm:</strong> {booking.booking.center}
                  </p>
                  <p className="text-gray-700">
                    <strong>Ngày Sinh:</strong>{" "}
                    {new Date(
                      booking.booking.customer.dob
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Quay lại
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Tiến Hành Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailVaccine;
