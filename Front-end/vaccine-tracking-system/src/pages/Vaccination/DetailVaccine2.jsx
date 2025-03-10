import React, { useEffect, useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookingDetailsByBookID } from "../../apis/api";
import Header from "../../components/header/header";
import Footer from "../../components/common/Footer";
import { Footprints } from "lucide-react";

const DetailVaccine2 = () => {
  const [expandedVaccine, setExpandedVaccine] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  //   const bookingId = state?.bookingId;
  const bookingId = "C001-B1";
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const toggleVaccine = (id) => {
    setExpandedVaccine(expandedVaccine === id ? null : id);
  };
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const data = await getBookingDetailsByBookID(bookingId);
        console.log("data la: ", data);
        setOrderData(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết booking:", error);
      }
    };
    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleSubmit = () => {
    navigate("/payment", { state: { bookingId } });
  };
  return (
    <div className="min-h-screen bg-blue-50 ">
      <Header/>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Chi Tiết Đơn Đặt Tiêm Chủng
          </h1>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-900 font-bold">
            Ngày đặt:{" "}
            {format(
              new Date(orderData?.[0]?.booking?.bookingDate || "2025-02-27"),
              "dd/MM/yyyy",
              { locale: vi }
            )}
          </p>
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Thông Tin Trẻ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Tên Trẻ</p>
              <p className="font-medium text-blue-900">
                {orderData?.[0]?.booking?.child?.firstName || "Nguyễn"}{" "}
                {orderData?.[0]?.booking?.child?.lastName || "Nam"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Ngày Sinh</p>
              <p className="font-medium text-blue-900">
                {format(
                  new Date(orderData?.[0]?.booking?.child?.dob || "2015-03-22"),
                  "dd/MM/yyyy",
                  {
                    locale: vi,
                  }
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Thông Tin Liên Hệ</p>
              <p className="font-medium text-blue-900">
                {orderData?.[0]?.booking?.customer?.phoneNumber ||
                  "Chưa có số điện thoại"}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {orderData.map((booking, index) => (
            <div key={index}>
              {/* Vaccine, Customer, Booking Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Thông tin Vaccine {index + 1}
                </h2>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-blue-900 mb-4">
                    Vaccine Đã Chọn
                  </h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg hover:shadow-md transition-shadow">
                      <div
                        className="p-4 cursor-pointer flex items-center"
                        onClick={() =>
                          toggleVaccine(booking.booking.vaccine?.vaccineId)
                        }
                      >
                        <img
                          src="https://www.gannett-cdn.com/-mm-/9e1f6e2ee20f44aa1f3be4f71e9f3e52b6ae2c7e/c=0-110-2121-1303/local/-/media/2021/05/07/USATODAY/usatsports/vaccine-vial-and-syringe.jpg?width=2121&height=1193&fit=crop&format=pjpg&auto=webp"
                          alt={booking.booking.vaccine?.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-blue-900">
                            {booking.booking.vaccine?.name || "Vaccine Detail"}
                          </h3>
                          <p className="text-gray-600">
                            Số lượng: {booking.booking.vaccine?.doseNumber || 2}
                          </p>
                          <p className="text-blue-800 font-semibold">
                            {formatCurrency(
                              booking.booking.vaccine?.price || 107000
                            )}
                          </p>
                        </div>
                        {expandedVaccine ===
                        booking.booking.vaccine?.vaccineId ? (
                          <IoChevronUpOutline className="text-blue-500 text-xl" />
                        ) : (
                          <IoChevronDownOutline className="text-blue-500 text-xl" />
                        )}
                      </div>
                      {expandedVaccine ===
                        booking.booking.vaccine?.vaccineId && (
                        <div className="px-4 pb-4 border-t">
                          <p className="text-gray-700 mt-2">
                            {booking.booking.vaccine?.description ||
                              "Vaccine phòng bệnh dịch"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-blue-900 mb-4">
                    Combo Tiêm Chủng
                  </h2>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <img
                          src="https://www.washingtonpost.com/rf/image_1484w/2010-2019/WashingtonPost/2015/01/26/Interactivity/Images/crop_358bigstock-vaccination-6365007.jpg?t=20170517"
                          alt={
                            booking.booking.vaccineCombo?.name ||
                            "Combo Vaccine Detail"
                          }
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <h3 className="font-medium text-blue-900">
                            {booking.booking.vaccineCombo?.name ||
                              "Combo Vaccine Detail"}
                          </h3>
                          <p className="text-gray-700 mt-1">
                            {booking.booking.vaccineCombo?.description ||
                              "Phòng bệnh dịch"}
                          </p>
                          <p className="text-blue-800 font-semibold mt-2">
                            {formatCurrency(
                              booking.booking.vaccineCombo?.priceCombo || 297000
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-8 flex justify-between items-center border-t pt-6">
            <button
              onClick={() => navigate(-1)} // Quay lại trang trước
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại
            </button>

            <button
              onClick={() => navigate("/payment")} // Chuyển đến trang thanh toán
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              Tiến hành thanh toán
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};
export default DetailVaccine2;
