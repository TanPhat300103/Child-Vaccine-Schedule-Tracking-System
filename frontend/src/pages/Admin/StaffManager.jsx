import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaPowerOff,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../components/AuthContext";
import "../../style/Staffs.css"; // Import the CSS file

const Staffs = () => {
  const [staffList, setStaffList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    address: "",
    email: "",
    password: "",
    roleId: 2,
    active: true,
  });
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [originalEditStaff, setOriginalEditStaff] = useState(null);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await fetch("http://localhost:8080/staff", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch staff list");
      const data = await response.json();
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff list:", err);
      setMessage("Không thể tải danh sách nhân viên.");
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (searchType === "name") {
        matchesSearch =
          staff.firstName.toLowerCase().includes(term) ||
          staff.lastName.toLowerCase().includes(term);
      } else if (searchType === "code") {
        matchesSearch = staff.staffId.toLowerCase().includes(term);
      } else if (searchType === "email") {
        matchesSearch = staff.mail.toLowerCase().includes(term);
      } else if (searchType === "phone") {
        matchesSearch = staff.phone.toLowerCase().includes(term);
      }
    }
    let matchesStatus = true;
    if (filterStatus === "active") matchesStatus = staff.active;
    else if (filterStatus === "inactive") matchesStatus = !staff.active;
    return matchesSearch && matchesStatus;
  });

  const handleActive = (staffId, e) => {
    e.stopPropagation();
    fetch(`http://localhost:8080/staff/active?id=${staffId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then(() => fetchStaffList())
      .catch((error) => console.error("API Active lỗi:", error));
  };

  const handleEditOpen = (staff, e) => {
    e.stopPropagation();
    setMessage("");
    const temp = {
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      phoneNumber: staff.phone,
      dob: staff.dob ? staff.dob.split("T")[0] : "",
      address: staff.address,
      email: staff.mail,
      password: staff.password,
      roleId: staff.roleId,
      active: staff.active,
    };
    setEditStaff(temp);
    setOriginalEditStaff({ ...temp });
    setEditPasswordVisible(false);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isEditChanged = () => {
    return JSON.stringify(editStaff) !== JSON.stringify(originalEditStaff);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editStaff) return;
    setMessage("");
    try {
      const response = await fetch(
        `http://localhost:8080/staff/${editStaff.staffId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editStaff),
        }
      );
      const result = await response.json();
      if (result.success) {
        setMessage("Cập nhật nhân viên thành công!");
        setEditStaff(null);
        setOriginalEditStaff(null);
        fetchStaffList();
      } else {
        setMessage(result.message || "Không thể cập nhật nhân viên.");
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      setMessage("Có lỗi xảy ra khi cập nhật nhân viên.");
    }
  };

  const handleEditCancel = () => {
    setEditStaff(null);
    setOriginalEditStaff(null);
  };

  const handleNewStaffChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newStaff),
      });
      const result = await response.json();
      if (result.success) {
        setMessage("Thêm nhân viên thành công!");
        setNewStaff({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          dob: "",
          address: "",
          email: "",
          password: "",
          active: true,
        });
        fetchStaffList();
        setShowAddModal(false);
      } else {
        setMessage(result.message || "Không thể thêm nhân viên.");
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      setMessage("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  return (
    <div className="container-staffs">
      <div className="content-wrapper-staffs">
        <header className="header-staffs">
          <div className="header-title-staffs">
            <FaUsers className="header-icon-staffs" />
            <h1 className="header-text-staffs">Quản Lý Nhân Viên</h1>
          </div>
          <p className="header-description-staffs">
            Tra cứu, quản lý và theo dõi danh sách nhân viên trong hệ thống
          </p>
        </header>

        <div className="search-filter-container-staffs">
          <div className="search-bar-staffs">
            <div className="search-type-wrapper-staffs">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchTerm("");
                }}
                className="search-type-select-staffs"
              >
                <option value="name">Tìm theo Tên</option>
                <option value="code">Tìm theo Mã</option>
                <option value="email">Tìm theo Email</option>
                <option value="phone">Tìm theo SĐT</option>
              </select>
              <FaSearch className="search-icon-staffs" />
            </div>
            <input
              type="text"
              placeholder="Nhập từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-staffs"
            />
          </div>
          <div className="filter-actions-staffs">
            <div className="filter-buttons-staffs">
              <button
                onClick={() => setFilterStatus("all")}
                className={`filter-btn-staffs ${
                  filterStatus === "all" ? "filter-btn-active-staffs" : ""
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`filter-btn-staffs ${
                  filterStatus === "active"
                    ? "filter-btn-active-green-staffs"
                    : ""
                }`}
              >
                Hoạt động
              </button>
              <button
                onClick={() => setFilterStatus("inactive")}
                className={`filter-btn-staffs ${
                  filterStatus === "inactive"
                    ? "filter-btn-active-red-staffs"
                    : ""
                }`}
              >
                Ngưng
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="add-btn-staffs"
            >
              <FaPlus className="add-icon-staffs" />
              <span>Thêm Nhân Viên</span>
            </button>
          </div>
        </div>

        <div className="staff-list-staffs">
          {filteredStaff.length === 0 ? (
            <div className="no-results-staffs">
              <FaUsers className="no-results-icon-staffs" />
              <p className="no-results-text-staffs">
                Không tìm thấy nhân viên nào phù hợp
              </p>
            </div>
          ) : (
            filteredStaff.map((staff) => (
              <div
                key={staff.staffId}
                onClick={(e) => handleEditOpen(staff, e)}
                className="staff-card-staffs"
              >
                <div className="staff-info-staffs">
                  <div className="staff-icon-wrapper-staffs">
                    <FaUsers className="staff-icon-staffs" />
                  </div>
                  <div>
                    <h3 className="staff-name-staffs">
                      {staff.firstName} {staff.lastName}
                    </h3>
                    <p className="staff-detail-staffs">Mã: {staff.staffId}</p>
                    <p className="staff-detail-staffs">SĐT: {staff.phone}</p>
                    <p className="staff-detail-staffs">Email: {staff.mail}</p>
                  </div>
                </div>
                <div className="staff-actions-staffs">
                  <button
                    onClick={(e) => handleActive(staff.staffId, e)}
                    className={`toggle-btn-staffs ${
                      staff.active
                        ? "toggle-btn-deactivate-staffs"
                        : "toggle-btn-activate-staffs"
                    }`}
                  >
                    <FaPowerOff className="toggle-icon-staffs" />
                    <span>{staff.active ? "Ngưng" : "Kích hoạt"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showAddModal && (
          <div className="modal-overlay-staffs">
            <div className="modal-content-staffs">
              <button
                onClick={() => setShowAddModal(false)}
                className="modal-close-btn-staffs"
              >
                ×
              </button>
              <h2 className="modal-title-staffs">Thêm Nhân Viên Mới</h2>
              <form onSubmit={handleAddStaff} className="modal-form-staffs">
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Họ</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newStaff.firstName}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                    required
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newStaff.lastName}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                    required
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">SĐT</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newStaff.phoneNumber}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Ngày Sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={newStaff.dob}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={newStaff.address}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newStaff.email}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs form-group-password-staffs">
                  <label className="form-label-staffs">Mật khẩu</label>
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    name="password"
                    value={newStaff.password}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs form-input-password-staffs"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    className="password-toggle-btn-staffs"
                  >
                    {newPasswordVisible ? (
                      <FaEyeSlash size={20} className="password-icon-staffs" />
                    ) : (
                      <FaEye size={20} className="password-icon-staffs" />
                    )}
                  </button>
                </div>
                <div className="form-group-checkbox-staffs">
                  <input
                    type="checkbox"
                    name="active"
                    checked={newStaff.active}
                    onChange={handleNewStaffChange}
                    className="checkbox-staffs"
                  />
                  <label className="form-label-staffs">Kích hoạt</label>
                </div>
                <div className="form-actions-staffs">
                  <button type="submit" className="submit-btn-staffs">
                    Thêm Nhân Viên
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="cancel-btn-staffs"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editStaff && (
          <div className="modal-overlay-staffs">
            <div className="modal-content-staffs">
              <button
                onClick={handleEditCancel}
                className="modal-close-btn-staffs"
              >
                ×
              </button>
              <h2 className="modal-title-staffs">Chỉnh Sửa Nhân Viên</h2>
              <form onSubmit={handleEditSave} className="modal-form-staffs">
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Họ</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editStaff.firstName}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                    required
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editStaff.lastName}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                    required
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">SĐT</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editStaff.phoneNumber}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Ngày Sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={editStaff.dob}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={editStaff.address}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editStaff.email}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                  />
                </div>
                <div className="form-group-staffs form-group-password-staffs">
                  <label className="form-label-staffs">Mật khẩu</label>
                  <input
                    type={editPasswordVisible ? "text" : "password"}
                    name="password"
                    value={editStaff.password}
                    onChange={handleEditChange}
                    className="form-input-staffs form-input-password-staffs"
                  />
                  <button
                    type="button"
                    onClick={() => setEditPasswordVisible(!editPasswordVisible)}
                    className="password-toggle-btn-staffs"
                  >
                    {editPasswordVisible ? (
                      <FaEyeSlash size={20} className="password-icon-staffs" />
                    ) : (
                      <FaEye size={20} className="password-icon-staffs" />
                    )}
                  </button>
                </div>
                <div className="form-group-checkbox-staffs">
                  <input
                    type="checkbox"
                    name="active"
                    checked={editStaff.active}
                    onChange={handleEditChange}
                    className="checkbox-staffs"
                  />
                  <label className="form-label-staffs">Kích hoạt</label>
                </div>
                <div className="form-actions-staffs">
                  <button
                    type="submit"
                    disabled={!isEditChanged()}
                    className={`submit-btn-staffs ${
                      !isEditChanged()
                        ? "submit-btn-disabled-staffs"
                        : "submit-btn-edit-staffs"
                    }`}
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="cancel-btn-staffs"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default Staffs;
