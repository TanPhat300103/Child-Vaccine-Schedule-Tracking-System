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
import "../../style/Staffs.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Staffs = () => {
  const [staffList, setStaffList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    address: "",
    mail: "",
    password: "",
    roleId: 2, // Mặc định là 2, BE sẽ xử lý nếu cần
    active: true,
  });
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [originalEditStaff, setOriginalEditStaff] = useState(null);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  const [message, setMessage] = useState(""); // Thông báo chung
  const [errors, setErrors] = useState({}); // Lưu lỗi chi tiết từ BE
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/staff`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
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
    console.log("Request active gửi đi:", { id: staffId });
    fetch(`${process.env.REACT_APP_API_BASE_URL}/staff/active?id=${staffId}`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
      },
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.text();
        console.log("Response active nhận về:", result);
        toast.success("Thay đổi trạng thái thành công!");
        fetchStaffList();
      })
      .catch((error) => {
        console.error("API Active lỗi:", error);
        toast.error("Không thể thay đổi trạng thái.");
      });
  };

  const handleEditOpen = (staff, e) => {
    e.stopPropagation();
    setMessage("");
    setErrors({});
    const temp = {
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      phone: staff.phone,
      dob: staff.dob ? staff.dob.split("T")[0] : "",
      address: staff.address,
      mail: staff.mail,
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
    setErrors({});
    console.log("Request gửi đi:", editStaff); // Log dữ liệu gửi đi
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/staff/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(editStaff),
        }
      );
      const result = await response.json();
      console.log("Response nhận về:", result); // Log dữ liệu nhận về

      if (response.ok) {
        toast.success("Cập nhật nhân viên thành công!");
        setEditStaff(null);
        setOriginalEditStaff(null);
        fetchStaffList(); // Tải lại danh sách
      } else {
        // Kiểm tra nếu result là object chứa các lỗi theo field
        if (result && typeof result === "object" && !Array.isArray(result)) {
          const translatedErrors = {};
          for (const [field, message] of Object.entries(result)) {
            translatedErrors[field] = translateError(message);
          }
          setErrors(translatedErrors); // Lưu lỗi để hiển thị dưới input
          const errorMessages = Object.values(translatedErrors).join(", ");
          toast.error(errorMessages); // Hiển thị tất cả lỗi qua toast
        } else {
          toast.error("Không thể cập nhật nhân viên.");
          setMessage("Không thể cập nhật nhân viên.");
        }
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      toast.error("Có lỗi xảy ra khi cập nhật nhân viên.");
      setMessage("Có lỗi xảy ra khi cập nhật nhân viên.");
    }
  };

  const handleEditCancel = () => {
    setEditStaff(null);
    setOriginalEditStaff(null);
    setErrors({});
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
    setErrors({});
    console.log("Request gửi đi:", newStaff); // Log dữ liệu gửi đi
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/staff/create`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(newStaff),
        }
      );
      const result = await response.json();
      console.log("Response nhận về:", result); // Log dữ liệu nhận về

      if (response.ok) {
        toast.success("Thêm nhân viên thành công!");
        setNewStaff({
          firstName: "",
          lastName: "",
          phone: "",
          dob: "",
          address: "",
          mail: "",
          password: "",
          roleId: 2,
          active: true,
        });
        fetchStaffList(); // Tải lại danh sách
        setShowAddModal(false);
      } else {
        // Kiểm tra nếu result là object chứa các lỗi theo field
        if (result && typeof result === "object" && !Array.isArray(result)) {
          const translatedErrors = {};
          for (const [field, message] of Object.entries(result)) {
            translatedErrors[field] = translateError(message);
          }
          setErrors(translatedErrors); // Lưu lỗi để hiển thị dưới input
          const errorMessages = Object.values(translatedErrors).join(", ");
          toast.error(errorMessages); // Hiển thị tất cả lỗi qua toast
        } else {
          toast.error("Không thể thêm nhân viên.");
          setMessage("Không thể thêm nhân viên.");
        }
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      toast.error("Có lỗi xảy ra khi thêm nhân viên.");
      setMessage("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  const translateError = (message) => {
    const errorMessages = {
      "Email is exist": "Email đã tồn tại",
      "Phone number is exist !!": "Số điện thoại đã tồn tại",
      "Invalid phone number format": "Định dạng số điện thoại không hợp lệ",
      "Phone number cannot be empty": "Số điện thoại không được để trống",
      "Email should be valid": "Email không hợp lệ",
      "Date of birth must be in the past":
        "Ngày sinh phải là ngày trong quá khứ",
      "Invalid Id": "ID vai trò không hợp lệ",
    };
    return errorMessages[message] || message; // Nếu không tìm thấy bản dịch, trả về nguyên gốc
  };
  return (
    <div className="container-staffs">
      <ToastContainer />
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

        {message && (
          <p
            className={`message-staffs ${
              message.includes("thành công") ? "success-staffs" : "error-staffs"
            }`}
          >
            {message}
          </p>
        )}

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
                  {errors.firstName && (
                    <p className="error-text-staffs">{errors.firstName}</p>
                  )}
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
                  {errors.lastName && (
                    <p className="error-text-staffs">{errors.lastName}</p>
                  )}
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">SĐT</label>
                  <input
                    type="text"
                    name="phone"
                    value={newStaff.phone}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                  />
                  {errors.phone && (
                    <p className="error-text-staffs">{errors.phone}</p>
                  )}
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
                  {errors.dob && (
                    <p className="error-text-staffs">{errors.dob}</p>
                  )}
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
                  {errors.address && (
                    <p className="error-text-staffs">{errors.address}</p>
                  )}
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Email</label>
                  <input
                    type="email"
                    name="mail"
                    value={newStaff.mail}
                    onChange={handleNewStaffChange}
                    className="form-input-staffs"
                  />
                  {errors.mail && (
                    <p className="error-text-staffs">{errors.mail}</p>
                  )}
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
                  {errors.password && (
                    <p className="error-text-staffs">{errors.password}</p>
                  )}
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
                  {errors.firstName && (
                    <p className="error-text-staffs">{errors.firstName}</p>
                  )}
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
                  {errors.lastName && (
                    <p className="error-text-staffs">{errors.lastName}</p>
                  )}
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">SĐT</label>
                  <input
                    type="text"
                    name="phone"
                    value={editStaff.phone}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                  />
                  {errors.phone && (
                    <p className="error-text-staffs">{errors.phone}</p>
                  )}
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
                  {errors.dob && (
                    <p className="error-text-staffs">{errors.dob}</p>
                  )}
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
                  {errors.address && (
                    <p className="error-text-staffs">{errors.address}</p>
                  )}
                </div>
                <div className="form-group-staffs">
                  <label className="form-label-staffs">Email</label>
                  <input
                    type="email"
                    name="mail"
                    value={editStaff.mail}
                    onChange={handleEditChange}
                    className="form-input-staffs"
                  />
                  {errors.mail && (
                    <p className="error-text-staffs">{errors.mail}</p>
                  )}
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
                  {errors.password && (
                    <p className="error-text-staffs">{errors.password}</p>
                  )}
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
