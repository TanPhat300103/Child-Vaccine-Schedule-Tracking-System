import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/ProfilePage.css";
import {
  User,
  BookOpen,
  CreditCard,
  Edit2,
  Save,
  XCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
} from "lucide-react";

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        const customerResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/customer/findid?id=${userInfo.userId}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        if (!customerResponse.ok)
          throw new Error("Không tìm thấy thông tin khách hàng");
        const customerData = await customerResponse.json();
        console.log("Dữ liệu từ server:", customerData);
        setCustomer({
          ...customerData,
          avatarUrl:
            customerData.avatarUrl ||
            "https://avatars.githubusercontent.com/u/151855105?s=400&u=f3cf17c85ef8012beb3894ab9c2f9b12abaf3509&v=4",
        });
      } catch (err) {
        setError("Lỗi khi lấy thông tin: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleUpdateClick = () => {
    console.log("customer.dob trước khi truyền:", customer.dob);
    setIsEditing(true);
    setFormData({
      customerId: customer.customerId,
      phoneNumber: customer.phoneNumber,
      firstName: customer.firstName,
      lastName: customer.lastName,
      dob: customer.dob || "",
      gender: customer.gender,
      password: customer.password,
      address: customer.address || "",
      banking: customer.banking || "",
      email: customer.email || "",
      roleId: customer.roleId,
      active: customer.active,
      avatarUrl:
        customer.avatarUrl ||
        "https://avatars.githubusercontent.com/u/151855105?s=400&u=f3cf17c85ef8012beb3894ab9c2f9b12abaf3509&v=4",
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    let errors = { ...formErrors };

    if (name === "phoneNumber") {
      if (!/^\d{10,11}$/.test(value) && value.length > 0) {
        errors.phoneNumber = "Số điện thoại phải là số và có 10-11 chữ số";
      } else {
        delete errors.phoneNumber;
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        errors.email = "Email không đúng định dạng";
      } else {
        delete errors.email;
      }
    }

    if (name === "dob") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        errors.dob = "Ngày sinh không được trong tương lai";
      } else {
        delete errors.dob;
      }
    }

    setFormErrors(errors);
  };

  const handleSave = async () => {
    if (Object.keys(formErrors).length > 0) {
      setError("Vui lòng sửa các lỗi trước khi lưu");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/customer/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setCustomer({ ...customer, ...formData, dob: formData.dob });
        setIsEditing(false);
        setFormErrors({});
      } else {
        const errorText = await response.text();
        setError("Lỗi khi cập nhật thông tin khách hàng: " + errorText);
      }
    } catch (err) {
      setError("Lỗi khi cập nhật: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="profile-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-user-info">
          <div className="profile-avatar">
            {customer?.avatarUrl ? (
              <img
                src={customer.avatarUrl}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="profile-avatar-img"
              />
            ) : (
              `${customer?.firstName?.charAt(0)}${customer?.lastName?.charAt(
                0
              )}`
            )}
          </div>
          <div className="profile-user-text">
            <h1>
              {customer?.firstName} {customer?.lastName}
            </h1>
            <p>{customer?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div
            className={`profile-sidebar-item ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            <span>Thông Tin Cá Nhân</span>
          </div>
          <div
            className="profile-sidebar-item"
            onClick={() => navigate("/child-info")}
          >
            <Calendar size={18} />
            <span>Thông Tin Con</span>
          </div>
          <div
            className={`profile-sidebar-item ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => navigate("/my-bookings")}
          >
            <BookOpen size={18} />
            <span>My Booking</span>
          </div>
          <div
            className="profile-sidebar-item"
            onClick={() => navigate("/my-payments")}
          >
            <CreditCard size={18} />
            <span>My Payment</span>
          </div>
        </div>

        <div className="profile-main">
          {activeTab === "profile" && (
            <div className="profile-section" style={{ opacity: 1 }}>
              <div className="profile-section-header">
                <h2>Thông Tin Cá Nhân</h2>
                {!isEditing && (
                  <button
                    className="profile-edit-btn"
                    onClick={handleUpdateClick}
                  >
                    <Edit2 size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="profile-edit-form">
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label>Họ</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ"
                      />
                    </div>
                    <div className="profile-form-group">
                      <label>Tên</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên"
                      />
                    </div>
                  </div>
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                      />
                      {formErrors.email && (
                        <span className="error-text">{formErrors.email}</span>
                      )}
                    </div>
                    <div className="profile-form-group">
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                      />
                      {formErrors.phoneNumber && (
                        <span className="error-text">
                          {formErrors.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split("T")[0]} // Vô hiệu hóa ngày trong tương lai
                      />
                      {formErrors.dob && (
                        <span className="error-text">{formErrors.dob}</span>
                      )}
                    </div>
                    <div className="profile-form-group full-width">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>
                  <div className="profile-form-row">
                    <div className="profile-form-group full-width">
                      <label>Ảnh đại diện (URL)</label>
                      <input
                        type="url"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleInputChange}
                        placeholder="Nhập URL ảnh đại diện"
                      />
                    </div>
                  </div>
                  <div className="profile-form-actions">
                    <button
                      className="profile-save-btn"
                      onClick={handleSave}
                      disabled={Object.keys(formErrors).length > 0} // Vô hiệu hóa nếu có lỗi
                    >
                      <Save size={16} />
                      <span>Lưu thông tin</span>
                    </button>
                    <button
                      className="profile-cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      <XCircle size={16} />
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info-card">
                  <div className="profile-info-items">
                    <div className="profile-info-item">
                      <Phone size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">
                          Số điện thoại
                        </span>
                        <span className="profile-info-value">
                          {customer?.phoneNumber || "Chưa có"}
                        </span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Mail size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Email</span>
                        <span className="profile-info-value">
                          {customer?.email || "Chưa có"}
                        </span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Calendar size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Ngày sinh</span>
                        <span className="profile-info-value">
                          {customer?.dob
                            ? new Date(customer.dob).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "Chưa có"}
                        </span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <MapPin size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Địa chỉ</span>
                        <span className="profile-info-value">
                          {customer?.address || "Chưa có"}
                        </span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Shield size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Trạng thái</span>
                        <span
                          className={`profile-status ${
                            customer?.active ? "active" : "inactive"
                          }`}
                        >
                          {customer?.active ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
