import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  MapPinIcon,
  ShieldIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import "../../style/BookingDetail.css";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [groupedDetails, setGroupedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getBookingDetailsByBookID = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/bookingdetail/findbybooking?id=${bookingId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch booking details");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/bookingdetail/confirmdate?id=${bookingId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to confirm booking");
      const data = await response.json();
      console.log("API Response (confirmBooking):", data);
      console.log("Xác nhận booking thành công.");
      return data;
    } catch (error) {
      console.error("Lỗi khi xác nhận booking:", error);
      throw error;
    }
  };

  const [isBookingInfoOpen, setIsBookingInfoOpen] = useState(true);
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [detailIdToConfirm, setDetailIdToConfirm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookingData = async () => {
    try {
      const detailsData = await getBookingDetailsByBookID(bookingId);
      setBookingDetails(detailsData);
      if (detailsData.length > 0) {
        setBooking(detailsData[0].booking);
      }

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

  const handleConfirm = (detailId) => {
    setDetailIdToConfirm(detailId);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    setShowConfirmModal(false);
    const loadingToast = toast.loading("Đang xử lý xác nhận tiêm...");

    try {
      const updatedDetail = await confirmBooking(detailIdToConfirm);
      setBookingDetails((prevDetails) =>
        prevDetails.map((detail) =>
          detail.bookingDetailId === detailIdToConfirm ? updatedDetail : detail
        )
      );

      const updatedGroups = bookingDetails
        .map((detail) =>
          detail.bookingDetailId === detailIdToConfirm ? updatedDetail : detail
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

      toast.update(loadingToast, {
        render: "Xác nhận tiêm thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error confirming booking detail:", error);
      toast.update(loadingToast, {
        render: "Xác nhận tiêm thất bại. Vui lòng thử lại.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const filteredGroupedDetails = Object.keys(groupedDetails).reduce(
    (acc, childKey) => {
      const filteredDetails = groupedDetails[childKey].filter((detail) => {
        const isAdministered = !!detail.administeredDate;
        if (statusFilter === "all") return true;
        if (statusFilter === "administered") return isAdministered;
        if (statusFilter === "notAdministered") return !isAdministered;
        return true;
      });

      if (filteredDetails.length > 0) {
        acc[childKey] = filteredDetails;
      }
      return acc;
    },
    {}
  );

  if (loading)
    return (
      <div className="loading-container-bookingdetailmanager">
        <div className="loading-content-bookingdetailmanager">
          <div className="spinner-bookingdetailmanager"></div>
          <p className="loading-text-bookingdetailmanager">
            Đang tải thông tin đặt lịch...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="error-container-bookingdetailmanager">
        <div className="error-content-bookingdetailmanager">
          <AlertCircleIcon className="error-icon-bookingdetailmanager" />
          <p className="error-text-bookingdetailmanager">{error}</p>
        </div>
      </div>
    );

  if (!booking)
    return (
      <div className="not-found-container-bookingdetailmanager">
        <div className="not-found-content-bookingdetailmanager">
          <AlertCircleIcon className="not-found-icon-bookingdetailmanager" />
          <p className="not-found-text-bookingdetailmanager">
            Không tìm thấy thông tin đặt lịch.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container-bookingdetailmanager">
      <div className="header-bookingdetailmanager">
        <div className="header-content-bookingdetailmanager">
          <h1 className="header-title-bookingdetailmanager">
            <ShieldIcon className="header-icon-bookingdetailmanager" />
            Chi Tiết Lịch Tiêm Chủng
          </h1>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay-bookingdetailmanager">
          <div className="modal-content-bookingdetailmanager">
            <h3 className="modal-title-bookingdetailmanager">Xác nhận tiêm</h3>
            <p className="modal-text-bookingdetailmanager">
              Bạn có chắc chắn muốn xác nhận tiêm không?
            </p>
            <div className="modal-buttons-bookingdetailmanager">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="modal-cancel-button-bookingdetailmanager"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className="modal-confirm-button-bookingdetailmanager"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-content-bookingdetailmanager">
        <div className="sidebar-bookingdetailmanager">
          <div className="sidebar-content-bookingdetailmanager">
            <div className="booking-id-section-bookingdetailmanager">
              <div className="booking-id-header-bookingdetailmanager">
                <span className="booking-id-label-bookingdetailmanager">
                  Mã Đặt Lịch
                </span>
                <span className="booking-id-value-bookingdetailmanager">
                  #{booking.bookingId}
                </span>
              </div>
            </div>

            <div className="section-bookingdetailmanager">
              <button
                onClick={() => setIsBookingInfoOpen(!isBookingInfoOpen)}
                className="section-toggle-bookingdetailmanager"
              >
                <h3 className="section-title-bookingdetailmanager">
                  <CalendarIcon className="section-icon-bookingdetailmanager" />
                  Thông Tin Đặt Lịch
                </h3>
                {isBookingInfoOpen ? (
                  <ChevronUpIcon className="toggle-icon-bookingdetailmanager" />
                ) : (
                  <ChevronDownIcon className="toggle-icon-bookingdetailmanager" />
                )}
              </button>
              {isBookingInfoOpen && (
                <div className="section-content-bookingdetailmanager">
                  <ul className="info-list-bookingdetailmanager">
                    <li className="info-item-bookingdetailmanager">
                      <span className="info-label-bookingdetailmanager">
                        Ngày đặt:
                      </span>
                      <span className="info-value-bookingdetailmanager">
                        {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
                      </span>
                    </li>
                    <li className="info-item-bookingdetailmanager">
                      <span className="info-label-bookingdetailmanager">
                        Tổng tiền:
                      </span>
                      <span className="info-value-price-bookingdetailmanager">
                        {booking.totalAmount.toLocaleString()} VNĐ
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="section-bookingdetailmanager">
              <button
                onClick={() => setIsCustomerInfoOpen(!isCustomerInfoOpen)}
                className="section-toggle-bookingdetailmanager"
              >
                <h3 className="section-title-bookingdetailmanager">
                  <UserIcon className="section-icon-bookingdetailmanager" />
                  Thông Tin Khách Hàng
                </h3>
                {isCustomerInfoOpen ? (
                  <ChevronUpIcon className="toggle-icon-bookingdetailmanager" />
                ) : (
                  <ChevronDownIcon className="toggle-icon-bookingdetailmanager" />
                )}
              </button>
              {isCustomerInfoOpen && (
                <div className="section-content-bookingdetailmanager">
                  <div className="customer-info-bookingdetailmanager">
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Họ và tên
                      </div>
                      <div className="info-value-bookingdetailmanager">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </div>
                    </div>
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Mã khách hàng
                      </div>
                      <div className="info-value-bookingdetailmanager">
                        #{booking.customer.customerId}
                      </div>
                    </div>
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Số điện thoại
                      </div>
                      <div className="info-value-with-icon-bookingdetailmanager">
                        <PhoneIcon className="small-icon-bookingdetailmanager" />
                        {booking.customer.phoneNumber}
                      </div>
                    </div>
                    <div className="info-block-bookingdetailmanager">
                      <div className="info-label-bookingdetailmanager">
                        Email
                      </div>
                      <div className="info-value-with-icon-bookingdetailmanager">
                        <MailIcon className="small-icon-bookingdetailmanager" />
                        <span className="truncate-bookingdetailmanager">
                          {booking.customer.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="details-content-bookingdetailmanager">
          <div className="filter-buttons-bookingdetailmanager">
            <button
              onClick={() => setStatusFilter("all")}
              className={`filter-button-bookingdetailmanager ${
                statusFilter === "all" ? "active-all-bookingdetailmanager" : ""
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("administered")}
              className={`filter-button-bookingdetailmanager ${
                statusFilter === "administered"
                  ? "active-administered-bookingdetailmanager"
                  : ""
              }`}
            >
              Đã Tiêm
            </button>
            <button
              onClick={() => setStatusFilter("notAdministered")}
              className={`filter-button-bookingdetailmanager ${
                statusFilter === "notAdministered"
                  ? "active-not-administered-bookingdetailmanager"
                  : ""
              }`}
            >
              Chưa Tiêm
            </button>
            <div className="back-button-container-bookingdetailmanager">
              <button
                onClick={() => navigate(-1)}
                className="back-button-bookingdetailmanager"
              >
                Quay Lại
              </button>
            </div>
          </div>

          {Object.keys(filteredGroupedDetails).length > 0 ? (
            <div className="details-list-bookingdetailmanager">
              {Object.keys(filteredGroupedDetails).map((childKey) => (
                <div key={childKey} className="child-section-bookingdetailmanager">
                  <div className="child-header-bookingdetailmanager">
                    <h2 className="child-title-bookingdetailmanager">
                      <UserIcon className="child-icon-bookingdetailmanager" />
                      {childKey}
                    </h2>
                    <span className="child-count-bookingdetailmanager">
                      {filteredGroupedDetails[childKey].length} mũi tiêm
                    </span>
                  </div>
                  <div className="child-details-bookingdetailmanager">
                    {filteredGroupedDetails[childKey].map((detail) => {
                      const isAdministered = !!detail.administeredDate;
                      return (
                        <div
                          key={detail.bookingDetailId}
                          className={`detail-item-bookingdetailmanager ${
                            isAdministered ? "administered" : "not-administered"
                          }`}
                        >
                          <div className="detail-header-bookingdetailmanager">
                            <div className="vaccine-info">
                              <span className="vaccine-name">{detail.vaccine.name}</span>
                              <span className={`status ${isAdministered ? "administered" : "not-administered"}`}>
                                {isAdministered ? (
                                  <CheckCircleIcon className="status-icon" />
                                ) : (
                                  <ClockIcon className="status-icon" />
                                )}
                                {isAdministered ? "Đã tiêm" : "Chưa tiêm"}
                              </span>
                            </div>
                            <button
                              onClick={() => !isAdministered && handleConfirm(detail.bookingDetailId)}
                              className={`confirm-button ${isAdministered ? "disabled" : ""}`}
                              disabled={isAdministered}
                            >
                              <CheckCircleIcon className="button-icon" />
                              Xác nhận tiêm
                            </button>
                          </div>
                          <div className="detail-body-bookingdetailmanager">
                            <div className="schedule-info">
                              <span className="schedule-label">Ngày dự kiến</span>
                              <span className="schedule-value">
                                <CalendarIcon className="schedule-icon" />
                                {format(new Date(detail.scheduledDate), "dd/MM/yyyy")}
                              </span>
                            </div>
                            {isAdministered && (
                              <div className="administered-info">
                                <span className="administered-label">Ngày tiêm</span>
                                <span className="administered-value">
                                  <CheckCircleIcon className="administered-icon" />
                                  {format(new Date(detail.administeredDate), "dd/MM/yyyy")}
                                </span>
                              </div>
                            )}
                            {detail.feedback && (
                              <div className="feedback-info">
                                <span className="feedback-label">Ghi chú</span>
                                <span className="feedback-value">"{detail.feedback}"</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-details-bookingdetailmanager">
              <AlertCircleIcon className="no-details-icon-bookingdetailmanager" />
              <p className="no-details-text-bookingdetailmanager">
                Không có chi tiết đặt lịch nào phù hợp.
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingDetail;