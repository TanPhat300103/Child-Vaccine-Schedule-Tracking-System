// src/pages/Staff/BookingDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { getBookingDetailsByBookID, confirmBooking } from "../../apis/api";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [groupedDetails, setGroupedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy booking detail và nhóm theo tên đứa trẻ
  const fetchBookingData = async () => {
    try {
      const detailsData = await getBookingDetailsByBookID(bookingId);
      setBookingDetails(detailsData);
      if (detailsData.length > 0) {
        setBooking(detailsData[0].booking);
      }
      // Nhóm theo tên trẻ (dùng firstName + " " + lastName làm key)
      const groups = detailsData.reduce((acc, detail) => {
        const childKey = detail.child.firstName + " " + detail.child.lastName;
        if (!acc[childKey]) {
          acc[childKey] = [];
        }
        acc[childKey].push(detail);
        return acc;
      }, {});
      setGroupedDetails(groups);
    } catch (err) {
      setError("Không thể lấy thông tin chi tiết đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  // Xử lý xác nhận ngày tiêm cho 1 booking detail (dùng API confirmBooking)
  const handleConfirm = async (detailId) => {
    try {
      const updatedDetail = await confirmBooking(detailId);
      // Cập nhật lại mảng bookingDetails
      setBookingDetails((prevDetails) =>
        prevDetails.map((detail) =>
          detail.bookingDetailId === detailId ? updatedDetail : detail
        )
      );
      // Cập nhật lại nhóm booking detail
      const updatedGroups = bookingDetails
        .map((detail) =>
          detail.bookingDetailId === detailId ? updatedDetail : detail
        )
        .reduce((acc, detail) => {
          const childKey = detail.child.firstName + " " + detail.child.lastName;
          if (!acc[childKey]) {
            acc[childKey] = [];
          }
          acc[childKey].push(detail);
          return acc;
        }, {});
      setGroupedDetails(updatedGroups);
    } catch (error) {
      console.error("Error confirming booking detail:", error);
    }
  };

  if (loading) return <p>Đang tải thông tin chi tiết đặt lịch...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!booking) return <p>Không tìm thấy thông tin đặt lịch.</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Thông tin đặt lịch</h1>
      <div className="flex gap-4">
        {/* Bên trái: Thông tin đặt lịch & khách hàng (chiếm 1/3) */}
        <div className="w-1/3 border p-4 rounded">
          <h2 className="text-2xl font-bold mb-2">Thông tin đặt lịch</h2>
          <p>
            <strong>Mã Đặt Lịch:</strong> {booking.bookingId}
          </p>
          <p>
            <strong>Ngày đặt:</strong>{" "}
            {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {booking.totalAmount.toLocaleString()}{" "}
            VNĐ
          </p>
          <div className="mt-4 border p-4 rounded">
            <h3 className="text-xl font-bold mb-2">Thông tin khách hàng</h3>
            <p>
              <strong>Mã khách hàng:</strong> {booking.customer.customerId}
            </p>
            <p>
              <strong>Tên:</strong> {booking.customer.firstName}{" "}
              {booking.customer.lastName}
            </p>
            <p>
              <strong>SĐT:</strong> {booking.customer.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {booking.customer.email}
            </p>
          </div>
        </div>
        {/* Bên phải: Chi tiết booking detail theo trẻ (chiếm 2/3) */}
        <div className="w-2/3 border p-4 rounded">
          {Object.keys(groupedDetails).length > 0 ? (
            Object.keys(groupedDetails).map((childKey) => (
              <div key={childKey} className="mb-6">
                {/* Thay vì tiêu đề "Chi tiết theo trẻ", hiển thị luôn tên trẻ */}
                <h2 className="text-2xl font-bold mb-2">{childKey}</h2>
                <div className="space-y-2">
                  {groupedDetails[childKey].map((detail) => (
                    <div
                      key={detail.bookingDetailId}
                      className="p-4 border rounded flex flex-row items-center justify-between"
                    >
                      <div>
                        <p>
                          <strong>Vaccine:</strong> {detail.vaccine.name}
                        </p>
                        <p>
                          <strong>Ngày dự kiến tiêm:</strong>{" "}
                          {format(new Date(detail.scheduledDate), "dd/MM/yyyy")}
                        </p>
                        <p>
                          <strong>Ngày tiêm:</strong>{" "}
                          {detail.administeredDate
                            ? format(
                                new Date(detail.administeredDate),
                                "dd/MM/yyyy"
                              )
                            : "Chưa tiêm"}
                        </p>
                        {detail.feedback && (
                          <p className="text-sm italic">
                            Feedback: {detail.feedback}
                          </p>
                        )}
                      </div>
                      {!detail.administeredDate && (
                        <button
                          onClick={() => handleConfirm(detail.bookingDetailId)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                        >
                          Xác nhận
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>Không có chi tiết đặt lịch nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
