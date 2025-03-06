// src/pages/Staffs.jsx
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaPowerOff, FaChild, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../apis/api";

const Staffs = () => {
  // Danh sách nhân viên
  const [staffList, setStaffList] = useState([]);
  // State cho modal tạo mới nhân viên
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    address: "",
    email: "",
    password: "",
    // roleId đã loại bỏ khỏi form, mặc định là 2 (Nhân viên)
    active: true,
  });
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  // State cho modal chỉnh sửa nhân viên
  const [editStaff, setEditStaff] = useState(null);
  const [originalEditStaff, setOriginalEditStaff] = useState(null);
  const [editPasswordVisible, setEditPasswordVisible] = useState(false);
  // Thông báo lỗi/thành công
  const [message, setMessage] = useState("");
  // Tìm kiếm
  const [searchType, setSearchType] = useState("name"); // name, code, email, phone
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách nhân viên khi component mount
  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const data = await getStaffs();
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff list:", err);
      setMessage("Không thể tải danh sách nhân viên.");
    }
  };

  // Xử lý tìm kiếm & lọc
  const filteredStaff = staffList.filter((staff) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (searchType === "name") {
      return (
        staff.firstName.toLowerCase().includes(term) ||
        staff.lastName.toLowerCase().includes(term)
      );
    } else if (searchType === "code") {
      return staff.staffId.toLowerCase().includes(term);
    } else if (searchType === "email") {
      return staff.mail.toLowerCase().includes(term);
    } else if (searchType === "phone") {
      return staff.phone.toLowerCase().includes(term);
    }
    return true;
  });

  // Xử lý Active/Inactive
  const handleActive = (staffId, e) => {
    e.stopPropagation();
    console.log("Gửi API cập nhật trạng thái active cho:", staffId);
    fetch(`http://localhost:8080/staff/active?id=${staffId}`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
    })
      .then((response) => response.json())
      .then((updatedStaff) => {
        setStaffList((prev) =>
          prev.map((staff) =>
            staff.staffId === updatedStaff.staffId ? updatedStaff : staff
          )
        );
      })
      .catch((error) => console.error("API Active lỗi:", error));
  };

  // Khi bấm vào card nhân viên, mở modal chỉnh sửa
  const handleEditOpen = (staff, e) => {
    e.stopPropagation();
    setMessage("");
    const temp = {
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      phoneNumber: staff.phone, // FE dùng phoneNumber
      dob: staff.dob ? staff.dob.split("T")[0] : "",
      address: staff.address,
      email: staff.mail, // FE dùng email
      password: staff.password,
      roleId: staff.roleId,
      active: staff.active,
    };
    setEditStaff(temp);
    setOriginalEditStaff({ ...temp });
    setEditPasswordVisible(false);
  };

  // Xử lý thay đổi input cho modal chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Kiểm tra có thay đổi so với dữ liệu ban đầu không
  const isEditChanged = () => {
    return JSON.stringify(editStaff) !== JSON.stringify(originalEditStaff);
  };

  // Gửi API cập nhật nhân viên
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editStaff) return;
    setMessage("");
    try {
      const { success, message: respMessage } = await updateStaff(editStaff);
      if (success) {
        setMessage("Cập nhật nhân viên thành công!");
        setEditStaff(null);
        setOriginalEditStaff(null);
        fetchStaffList();
      } else {
        setMessage(respMessage || "Không thể cập nhật nhân viên.");
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      setMessage("Có lỗi xảy ra khi cập nhật nhân viên.");
    }
  };

  // Hủy chỉnh sửa
  const handleEditCancel = () => {
    setEditStaff(null);
    setOriginalEditStaff(null);
  };

  // Xóa nhân viên
  const handleDeleteStaff = async (staffId) => {
    setMessage("");
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        const { success, message: respMessage } = await deleteStaff(staffId);
        if (success) {
          setMessage("Xóa nhân viên thành công!");
          fetchStaffList();
        } else {
          setMessage(respMessage || "Không thể xóa nhân viên.");
        }
      } catch (err) {
        console.error("Error deleting staff:", err);
        setMessage("Có lỗi xảy ra khi xóa nhân viên.");
      }
    }
  };

  // Xử lý input cho modal tạo mới nhân viên
  const handleNewStaffChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Thêm nhân viên mới
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const { success, message: respMessage } = await createStaff(newStaff);
      if (success) {
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
        setMessage(respMessage || "Không thể thêm nhân viên.");
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      setMessage("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">Quản lý Nhân Viên</h1>
      {message && (
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-center">
          {message}
        </div>
      )}
      {/* Thanh tìm kiếm */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchTerm("");
            }}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Tìm theo Tên</option>
            <option value="code">Tìm theo Mã</option>
            <option value="email">Tìm theo Email</option>
            <option value="phone">Tìm theo SĐT</option>
          </select>
          <input
            type="text"
            placeholder="Nhập từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-6 rounded-full hover:bg-yellow-500 hover:text-white transition-all"
          >
            Thêm Nhân Viên
          </button>
        </div>
      </div>

      {/* Danh sách nhân viên dạng card */}
      <div className="flex flex-col gap-2">
        {filteredStaff.map((staff) => (
          <div
            key={staff.staffId}
            onClick={(e) => handleEditOpen(staff, e)}
            className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
          >
            <div>
              <h2 className="text-xl font-extrabold text-blue-600">
                {staff.firstName} {staff.lastName}
              </h2>
              <p className="text-sm text-gray-600">Mã: {staff.staffId}</p>
              <p className="text-sm text-gray-600">SĐT: {staff.phone}</p>
              <p className="text-sm text-gray-600">Email: {staff.mail}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActive(staff.staffId, e);
                }}
                className={`text-white font-bold py-1 px-3 rounded flex items-center ${
                  staff.active
                    ? "bg-green-500 hover:bg-green-700"
                    : "bg-red-500 hover:bg-red-700"
                }`}
              >
                {staff.active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStaff(staff.staffId);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal tạo mới nhân viên */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6">Thêm Nhân Viên Mới</h2>
            <form onSubmit={handleAddStaff} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Họ</label>
                <input
                  type="text"
                  name="firstName"
                  value={newStaff.firstName}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={newStaff.lastName}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">SĐT</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={newStaff.phoneNumber}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Ngày Sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={newStaff.dob}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={newStaff.address}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newStaff.email}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="relative">
                <label className="block mb-1 font-medium">Mật khẩu</label>
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  name="password"
                  value={newStaff.password}
                  onChange={handleNewStaffChange}
                  className="border rounded w-full px-2 py-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  className="absolute inset-y-11 right-0 flex items-center pr-2"
                >
                  {newPasswordVisible ? (
                    <FaEyeSlash size={20} className="text-gray-600" />
                  ) : (
                    <FaEye size={20} className="text-gray-600" />
                  )}
                </button>
              </div>
              {/* Bỏ Role ID khỏi form tạo mới */}
              <div className="col-span-2 flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={newStaff.active}
                  onChange={handleNewStaffChange}
                  className="mr-2"
                />
                <label>Kích hoạt</label>
              </div>
              <div className="col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Thêm Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa nhân viên */}
      {editStaff && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
            <button
              onClick={handleEditCancel}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6">Chỉnh Sửa Nhân Viên</h2>
            <form onSubmit={handleEditSave} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Họ</label>
                <input
                  type="text"
                  name="firstName"
                  value={editStaff.firstName}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={editStaff.lastName}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">SĐT</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editStaff.phoneNumber}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Ngày Sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={editStaff.dob}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={editStaff.address}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editStaff.email}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1"
                />
              </div>
              <div className="relative">
                <label className="block mb-1 font-medium">Mật khẩu</label>
                <input
                  type={editPasswordVisible ? "text" : "password"}
                  name="password"
                  value={editStaff.password}
                  onChange={handleEditChange}
                  className="border rounded w-full px-2 py-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setEditPasswordVisible(!editPasswordVisible)}
                  className="absolute inset-y-11 right-0 flex items-center pr-2"
                >
                  {editPasswordVisible ? (
                    <FaEyeSlash size={20} className="text-gray-600" />
                  ) : (
                    <FaEye size={20} className="text-gray-600" />
                  )}
                </button>
              </div>
              <div className="col-span-2 flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={editStaff.active}
                  onChange={handleEditChange}
                  className="mr-2"
                />
                <label>Kích hoạt</label>
              </div>
              <div className="col-span-2 flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={!isEditChanged()}
                  className={`font-bold py-2 px-4 rounded-lg ${
                    !isEditChanged()
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-700 text-white"
                  }`}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
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
  );
};

export default Staffs;
