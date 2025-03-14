import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaUser,
  FaUserPlus,
  FaSearch,
  FaChild,
  FaPowerOff,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../../style/Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [originalEditingCustomer, setOriginalEditingCustomer] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: true,
    password: "",
    address: "",
    banking: "",
    email: "",
    active: true,
  });
  const [newCustomerError, setNewCustomerError] = useState(null);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);

  // Validation functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDob = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    return birthDate < today;
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/customer`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
      },
      credentials: "include",
      withCredentials: true,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API thành công. Dữ liệu khách hàng:", data);
        setCustomers(data);
      })
      .catch((error) =>
        console.error("GET API lỗi khi lấy dữ liệu khách hàng:", error)
      );
  }, []);

  const handleActive = (customerId, e) => {
    e.stopPropagation();
    console.log("Gửi API cập nhật trạng thái active cho:", customerId);
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/customer/inactive?id=${customerId}`,
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
        },
        credentials: "include",
        withCredentials: true,
      }
    )
      .then((response) => response.json())
      .then((updatedCustomer) => {
        console.log("API Active thành công:", updatedCustomer);
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === updatedCustomer.customerId
              ? updatedCustomer
              : customer
          )
        );
      })
      .catch((error) => console.error("API Active lỗi:", error));
  };

  const handleEdit = (customer, e) => {
    e.stopPropagation();
    console.log("Mở form cập nhật cho khách hàng:", customer);
    setEditingCustomer({ ...customer });
    setOriginalEditingCustomer({ ...customer });
    setUpdateError(null);
    setEditingPasswordVisible(false);
  };

  const isChanged = () => {
    return (
      JSON.stringify(editingCustomer) !==
      JSON.stringify(originalEditingCustomer)
    );
  };

  const handleSave = () => {
    // Validation before save
    if (!validatePhoneNumber(editingCustomer.phoneNumber)) {
      setUpdateError("Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)");
      return;
    }
    if (!validateEmail(editingCustomer.email)) {
      setUpdateError("Email không hợp lệ");
      return;
    }
    if (!validateDob(editingCustomer.dob)) {
      setUpdateError("Ngày sinh phải là ngày trong quá khứ");
      return;
    }

    console.log("Gửi API cập nhật khách hàng với dữ liệu:", editingCustomer);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/customer/update`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
      },
      credentials: "include",
      withCredentials: true,
      body: JSON.stringify(editingCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi không xác định khi cập nhật.");
          });
        }
        return response.json();
      })
      .then((updatedCustomer) => {
        console.log("Cập nhật thành công:", updatedCustomer);
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === updatedCustomer.customerId
              ? updatedCustomer
              : customer
          )
        );
        setEditingCustomer(null);
        setOriginalEditingCustomer(null);
        setUpdateError(null);
      })
      .catch((error) => {
        console.error("Cập nhật lỗi:", error);
        setUpdateError(error.message);
      });
  };

  const handleCreate = () => {
    // Validation before create
    if (!validatePhoneNumber(newCustomer.phoneNumber)) {
      setNewCustomerError(
        "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)"
      );
      return;
    }
    if (!validateEmail(newCustomer.email)) {
      setNewCustomerError("Email không hợp lệ");
      return;
    }
    if (!validateDob(newCustomer.dob)) {
      setNewCustomerError("Ngày sinh phải là ngày trong quá khứ");
      return;
    }

    console.log("Gửi API tạo khách hàng với dữ liệu:", newCustomer);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/customer/create`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
      },
      credentials: "include",
      withCredentials: true,
      body: JSON.stringify(newCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi không xác định khi tạo khách hàng.");
          });
        }
        return response.json();
      })
      .then((createdCustomer) => {
        console.log("Tạo khách hàng thành công:", createdCustomer);
        setCustomers((prev) => [...prev, createdCustomer]);
        setShowAddForm(false);
        setNewCustomer({
          phoneNumber: "",
          firstName: "",
          lastName: "",
          dob: "",
          gender: true,
          password: "",
          address: "",
          banking: "",
          email: "",
          roleId: 3,
          active: true,
        });
        setNewCustomerError(null);
        setNewPasswordVisible(false);
      })
      .catch((error) => {
        console.error("Tạo khách hàng lỗi:", error);
        setNewCustomerError(error.message);
      });
  };

  const filteredCustomers = customers.filter((customer) => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (searchType === "name") {
        matchesSearch =
          customer.firstName.toLowerCase().includes(term) ||
          customer.lastName.toLowerCase().includes(term);
      } else if (searchType === "code") {
        matchesSearch = customer.customerId.toLowerCase().includes(term);
      } else if (searchType === "email") {
        matchesSearch = customer.email.toLowerCase().includes(term);
      }
    }
    let matchesStatus = true;
    if (filterStatus === "active") matchesStatus = customer.active;
    else if (filterStatus === "inactive") matchesStatus = !customer.active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="customers-container">
      <div className="customers-wrapper">
        <header className="customers-header">
          <div className="header-title">
            <FaUser className="header-icon" />
            <h1 className="header-text">Quản Lý Khách Hàng</h1>
          </div>
          <p className="header-subtitle">
            Tra cứu, quản lý và theo dõi danh sách khách hàng trong hệ thống
          </p>
        </header>

        <div className="search-filter-container">
          <div className="search-filter-wrapper">
            <div className="search-container">
              <div className="search-type-wrapper">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchTerm("");
                  }}
                  className="search-type"
                >
                  <option value="name">Tìm theo Tên</option>
                  <option value="code">Tìm theo Mã</option>
                  <option value="email">Tìm theo Email</option>
                </select>
                <FaSearch className="search-icon" />
              </div>
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <div className="filter-buttons">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`filter-button ${
                    filterStatus === "all" ? "active-all" : ""
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`filter-button ${
                    filterStatus === "active" ? "active-active" : ""
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`filter-button ${
                    filterStatus === "inactive" ? "active-inactive" : ""
                  }`}
                >
                  Không hoạt động
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="add-customer-button"
                >
                  <FaUserPlus size={14} />{" "}
                  {/* Giảm kích thước icon xuống 14px */}
                  <span>Thêm Khách Hàng</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="customer-list">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.customerId}
              onClick={(e) => handleEdit(customer, e)}
              className="customer-card"
            >
              <div className="customer-info">
                <div className="customer-avatar">
                  <FaUser className="avatar-icon" />
                </div>
                <div>
                  <h2 className="customer-name">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="customer-id">
                    Mã Khách Hàng: {customer.customerId}
                  </p>
                </div>
              </div>
              <div className="customer-actions">
                <button
                  onClick={(e) => handleActive(customer.customerId, e)}
                  className={`status-button ${
                    customer.active ? "deactivate" : "activate"
                  }`}
                >
                  <FaPowerOff />
                  <span>{customer.active ? "Ngừng" : "Hoạt Động"}</span>
                </button>
                <Link
                  to={`../childs/${customer.customerId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="child-profile-button"
                >
                  <FaChild />
                  <span>Hồ Sơ Trẻ Em</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal chỉnh sửa khách hàng */}
        {editingCustomer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                onClick={() => setEditingCustomer(null)}
                className="modal-close-button"
              >
                ×
              </button>
              <h2 className="modal-title">Cập Nhật Khách Hàng</h2>
              <div className="modal-form">
                <div>
                  <label className="form-label">Họ</label>
                  <input
                    type="text"
                    value={editingCustomer.firstName}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        firstName: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    value={editingCustomer.lastName}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        lastName: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={editingCustomer.phoneNumber}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Ngày Sinh</label>
                  <input
                    type="date"
                    value={editingCustomer.dob}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        dob: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Giới Tính</label>
                  <select
                    value={editingCustomer.gender ? "true" : "false"}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        gender: e.target.value === "true",
                      })
                    }
                    className="form-input"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="password-field">
                  <label className="form-label">Mật Khẩu</label>
                  <input
                    type={editingPasswordVisible ? "text" : "password"}
                    value={editingCustomer.password}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        password: e.target.value,
                      })
                    }
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPasswordVisible(!editingPasswordVisible)
                    }
                    className="toggle-password"
                  >
                    {editingPasswordVisible ? (
                      <FaEyeSlash size={20} className="toggle-icon" />
                    ) : (
                      <FaEye size={20} className="toggle-icon" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="form-label">Địa Chỉ</label>
                  <input
                    type="text"
                    value={editingCustomer.address}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        address: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Số Tài Khoản Ngân Hàng</label>
                  <input
                    type="text"
                    value={editingCustomer.banking}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        banking: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        email: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>
              {updateError && <p className="error-text">{updateError}</p>}
              <div className="modal-actions">
                <button
                  onClick={handleSave}
                  disabled={!isChanged()}
                  className={`save-button ${!isChanged() ? "disabled" : ""}`}
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal thêm khách hàng */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                onClick={() => setShowAddForm(false)}
                className="modal-close-button"
              >
                ×
              </button>
              <h2 className="modal-title">Thêm Khách Hàng Mới</h2>
              <div className="modal-form">
                <div>
                  <label className="form-label">Họ</label>
                  <input
                    type="text"
                    value={newCustomer.firstName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        firstName: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    value={newCustomer.lastName}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        lastName: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={newCustomer.phoneNumber}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Ngày Sinh</label>
                  <input
                    type="date"
                    value={newCustomer.dob}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        dob: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Giới Tính</label>
                  <select
                    value={newCustomer.gender ? "true" : "false"}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        gender: e.target.value === "true",
                      })
                    }
                    className="form-input"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="password-field">
                  <label className="form-label">Mật Khẩu</label>
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    value={newCustomer.password}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        password: e.target.value,
                      })
                    }
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    className="toggle-password"
                  >
                    {newPasswordVisible ? (
                      <FaEyeSlash size={20} className="toggle-icon" />
                    ) : (
                      <FaEye size={20} className="toggle-icon" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="form-label">Địa Chỉ</label>
                  <input
                    type="text"
                    value={newCustomer.address}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Số Tài Khoản Ngân Hàng</label>
                  <input
                    type="text"
                    value={newCustomer.banking}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        banking: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        email: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>
              {newCustomerError && (
                <p className="error-text">{newCustomerError}</p>
              )}
              <div className="modal-actions">
                <button onClick={handleCreate} className="add-button">
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default Customers;
