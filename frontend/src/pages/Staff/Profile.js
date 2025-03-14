import React, { useState, useEffect } from "react";
import { FaNotesMedical, FaSyringe, FaUserMd } from "react-icons/fa";
import { FiCalendar, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../components/AuthContext";
import BookingToday from "./BookingToday";
import ReactionAll from "./ReactionAll";
import "../../style/Profile.css";

const StaffProfile = ({ initialStaffData }) => {
  const [staffData, setStaffData] = useState(initialStaffData);
  const [originalData, setOriginalData] = useState(initialStaffData);
  const [formData, setFormData] = useState(initialStaffData);
  const [formChanged, setFormChanged] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setStaffData(initialStaffData);
    setOriginalData(initialStaffData);
    setFormData(initialStaffData);
  }, [initialStaffData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    const changed = Object.keys(updatedData).some((key) => {
      if (key === "staffId" || key === "roleId" || key === "active")
        return false;
      return updatedData[key] !== originalData[key];
    });
    setFormChanged(changed);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/staff/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          withCredentials: true,
          body: JSON.stringify(formData),
        }
      );
      console.log("Request gửi đi:", JSON.stringify(formData));
      console.log("Response từ server:", response);
      if (!response.ok) throw new Error("Lỗi khi cập nhật thông tin");
      const updatedData = await response.json();
      console.log("Dữ liệu cập nhật nhận được:", updatedData);
      setStaffData(updatedData);
      setOriginalData(updatedData);
      setFormChanged(false);
      setNotification({ type: "success", message: "Cập nhật thành công!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Lỗi chi tiết khi cập nhật:", error);
      setNotification({ type: "error", message: "Cập nhật thất bại!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!formData) return null;

  return (
    <div className="staff-profile-container-profilestaffcss">
      <h2 className="staff-profile-title-profilestaffcss">
        <FaUserMd className="staff-profile-icon-profilestaffcss" /> Hồ Sơ Nhân
        Viên
      </h2>
      {notification && (
        <div
          className={`staff-profile-notification-profilestaffcss ${
            notification.type === "success"
              ? "notification-success-profilestaffcss"
              : "notification-error-profilestaffcss"
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}
      <form className="staff-profile-form-profilestaffcss">
        <div className="staff-profile-grid-profilestaffcss">
          <div>
            <label className="staff-profile-label-profilestaffcss">
              Mã nhân viên
            </label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId || ""}
              disabled
              className="staff-profile-input-profilestaffcss staff-profile-input-disabled-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">Họ</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">Tên</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">Email</label>
            <input
              type="email"
              name="mail"
              value={formData.mail || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="staff-profile-label-profilestaffcss">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="staff-profile-input-profilestaffcss"
            />
          </div>
        </div>
        <div className="staff-profile-button-container-profilestaffcss">
          <button
            type="button"
            onClick={handleSave}
            disabled={!formChanged}
            className={`staff-profile-save-btn-profilestaffcss ${
              formChanged
                ? "btn-active-profilestaffcss"
                : "btn-disabled-profilestaffcss"
            }`}
          >
            Lưu Thay Đổi
          </button>
        </div>
      </form>
    </div>
  );
};

const Profile = () => {
  const { userInfo } = useAuth();
  const staffId = userInfo.userId;

  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingTodayCount, setBookingTodayCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [vaccineCount, setVaccineCount] = useState(0);
  const [reactionCount, setReactionCount] = useState(0);
  const [currentView, setCurrentView] = useState("profile");

  useEffect(() => {
    if (!staffId) return;

    const fetchStaffData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu nhân viên
        const staffResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/staff/findid?id=${staffId}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        console.log(
          "Request lấy dữ liệu nhân viên:",
          `${process.env.REACT_APP_API_BASE_URL}/staff/findid?id=${staffId}`
        );
        console.log("Response từ API nhân viên:", staffResponse);
        if (!staffResponse.ok) throw new Error("Lỗi khi lấy dữ liệu nhân viên");
        const staffData = await staffResponse.json();
        console.log("Dữ liệu nhân viên nhận được:", staffData);
        setStaffData(staffData);

        // Kiểm tra số điện thoại
        if (!staffData.phone) {
          console.warn("Cảnh báo: Tài khoản không có số điện thoại!");
        }

        // Lấy lịch hẹn hôm nay
        const bookingResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/get-booking-today`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        console.log(
          "Request lấy lịch hẹn hôm nay:",
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/get-booking-today`
        );
        console.log("Response từ API lịch hẹn:", bookingResponse);

        if (!bookingResponse.ok) {
          // Lấy chi tiết lỗi từ response body
          const errorText = await bookingResponse.text();
          console.error(
            "Lỗi chi tiết từ API lịch hẹn:",
            bookingResponse.status,
            bookingResponse.statusText,
            errorText
          );
          throw new Error(
            `Lỗi khi lấy lịch hẹn hôm nay: ${
              errorText || "Không có thông tin chi tiết từ server"
            }`
          );
        }

        const bookingData = await bookingResponse.json();
        console.log("Dữ liệu lịch hẹn hôm nay nhận được:", bookingData);
        setBookingTodayCount(bookingData.length);

        // Lấy số lượng khách hàng
        const customerResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/count-customer`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        console.log(
          "Request đếm khách hàng:",
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/count-customer`
        );
        console.log("Response từ API khách hàng:", customerResponse);
        if (!customerResponse.ok) throw new Error("Lỗi khi đếm khách hàng");
        const customerData = await customerResponse.json();
        console.log("Dữ liệu khách hàng nhận được:", customerData);
        setCustomerCount(customerData);

        // Lấy số lượng vaccine
        const vaccineResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/count-active-vaccine`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        console.log(
          "Request đếm vaccine:",
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/count-active-vaccine`
        );
        console.log("Response từ API vaccine:", vaccineResponse);
        if (!vaccineResponse.ok) throw new Error("Lỗi khi đếm vaccine");
        const vaccineData = await vaccineResponse.json();
        console.log("Dữ liệu vaccine nhận được:", vaccineData);
        setVaccineCount(vaccineData);

        // Lấy báo cáo phản ứng
        const reactionResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/get-reaction`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        console.log(
          "Request lấy báo cáo phản ứng:",
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/get-reaction`
        );
        console.log("Response từ API phản ứng:", reactionResponse);
        if (!reactionResponse.ok)
          throw new Error("Lỗi khi lấy báo cáo phản ứng");
        const reactionData = await reactionResponse.json();
        console.log("Dữ liệu phản ứng nhận được:", reactionData);
        setReactionCount(reactionData.length);
      } catch (error) {
        console.error("Lỗi tổng quát:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (error)
      return (
        <div className="profile-error-profilestaffcss">
          Có lỗi xảy ra: {error}
        </div>
      );
    fetchStaffData();
  }, [staffId]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (loading)
    return (
      <div className="profile-loading-profilestaffcss">Đang tải dữ liệu...</div>
    );
  if (error)
    return <div className="profile-error-profilestaffcss">{error}</div>;
  if (!staffData)
    return (
      <div className="profile-no-data-profilestaffcss">Không có dữ liệu</div>
    );

  return (
    <div className="profile-container-profilestaffcss">
      <div className="profile-content-profilestaffcss">
        <div className="profile-stats-profilestaffcss">
          <div
            className="profile-stat-card-profilestaffcss profile-stat-teal-profilestaffcss"
            onClick={() => handleViewChange("booking-today")}
          >
            <div className="profile-stat-icon-container-profilestaffcss">
              <FiCalendar className="profile-stat-icon-profilestaffcss" />
            </div>
            <div className="profile-stat-text-profilestaffcss">
              <p className="profile-stat-label-profilestaffcss">
                Lịch hẹn hôm nay
              </p>
              <p className="profile-stat-value-profilestaffcss">
                {bookingTodayCount}
              </p>
            </div>
          </div>
          <div
            className="profile-stat-card-profilestaffcss profile-stat-green-profilestaffcss"
            onClick={() => (window.location.href = "/staff/customers")}
            style={{ cursor: "pointer" }}
          >
            <div className="profile-stat-icon-container-profilestaffcss">
              <FiUsers className="profile-stat-icon-profilestaffcss" />
            </div>
            <div className="profile-stat-text-profilestaffcss">
              <p className="profile-stat-label-profilestaffcss">
                Tổng khách hàng
              </p>
              <p className="profile-stat-value-profilestaffcss">
                {customerCount}
              </p>
            </div>
          </div>
          <div
            className="profile-stat-card-profilestaffcss profile-stat-blue-profilestaffcss"
            onClick={() => (window.location.href = "/staff/vaccines")}
            style={{ cursor: "pointer" }}
          >
            <div className="profile-stat-icon-container-profilestaffcss">
              <FaSyringe className="profile-stat-icon-profilestaffcss" />
            </div>
            <div className="profile-stat-text-profilestaffcss">
              <p className="profile-stat-label-profilestaffcss">
                Vaccine có sẵn
              </p>
              <p className="profile-stat-value-profilestaffcss">
                {vaccineCount}
              </p>
            </div>
          </div>
          <div
            className="profile-stat-card-profilestaffcss profile-stat-red-profilestaffcss"
            onClick={() => handleViewChange("reactions")}
          >
            <div className="profile-stat-icon-container-profilestaffcss">
              <FiAlertTriangle className="profile-stat-icon-profilestaffcss" />
            </div>
            <div className="profile-stat-text-profilestaffcss">
              <p className="profile-stat-label-profilestaffcss">
                Báo cáo phản ứng
              </p>
              <p className="profile-stat-value-profilestaffcss">
                {reactionCount}
              </p>
            </div>
          </div>
        </div>

        {currentView === "profile" && (
          <StaffProfile initialStaffData={staffData} />
        )}
        {currentView === "booking-today" && (
          <BookingToday onBack={() => handleViewChange("profile")} />
        )}
        {currentView === "reactions" && (
          <ReactionAll onBack={() => handleViewChange("profile")} />
        )}
      </div>
    </div>
  );
};

export default Profile;
