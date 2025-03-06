import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUsers, FaSearch, FaPlus, FaPowerOff, FaEye, FaEyeSlash } from "react-icons/fa";
import { getStaffs, createStaff, updateStaff, deleteStaff } from "../../apis/api";

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
  // Lọc theo trạng thái
  const [filterStatus, setFilterStatus] = useState("all");

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-4">
            <FaUsers className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-light text-gray-800">Quản Lý Nhân Viên</h1>
          </div>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Tra cứu, quản lý và theo dõi danh sách nhân viên trong hệ thống
          </p>
        </header>

        <div className="bg-white shadow-xl rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full">
              <div className="relative flex-grow">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchTerm("");
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Tìm theo Tên</option>
                  <option value="code">Tìm theo Mã</option>
                  <option value="email">Tìm theo Email</option>
                  <option value="phone">Tìm theo SĐT</option>
                </select>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "active"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "inactive"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Ngưng
                </button>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                <span>Thêm Nhân Viên</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaUsers className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Không tìm thấy nhân viên nào phù hợp
              </p>
            </div>
          ) : (
            filteredStaff.map((staff) => (
              <div
                key={staff.staffId}
                onClick={(e) => handleEditOpen(staff, e)}
                className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaUsers className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {staff.firstName} {staff.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">Mã: {staff.staffId}</p>
                    <p className="text-sm text-gray-500">SĐT: {staff.phone}</p>
                    <p className="text-sm text-gray-500">Email: {staff.mail}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActive(staff.staffId, e);
                    }}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      staff.active
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    <FaPowerOff />
                    <span>{staff.active ? "Ngưng" : "Kích hoạt"}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStaff(staff.staffId);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal tạo mới nhân viên */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
            <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl ring-1 ring-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <h2 className="text-2xl font-semibold mb-6">Thêm Nhân Viên Mới</h2>
              <form onSubmit={handleAddStaff} className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newStaff.firstName}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newStaff.lastName}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newStaff.phoneNumber}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={newStaff.dob}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={newStaff.address}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newStaff.email}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    name="password"
                    value={newStaff.password}
                    onChange={handleNewStaffChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {newPasswordVisible ? (
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
                    checked={newStaff.active}
                    onChange={handleNewStaffChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Kích hoạt</label>
                </div>
                <div className="col-span-2 flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all text-sm font-medium flex items-center"
                  >
                    Thêm Nhân Viên
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa nhân viên */}
        {editStaff && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
            <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl ring-1 ring-gray-200">
              <button
                onClick={handleEditCancel}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <h2 className="text-2xl font-semibold mb-6">Chỉnh Sửa Nhân Viên</h2>
              <form onSubmit={handleEditSave} className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editStaff.firstName}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editStaff.lastName}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editStaff.phoneNumber}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Sinh</label>
                  <input
                    type="date"
                    name="dob"
                    value={editStaff.dob}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={editStaff.address}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editStaff.email}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input
                    type={editPasswordVisible ? "text" : "password"}
                    name="password"
                    value={editStaff.password}
                    onChange={handleEditChange}
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setEditPasswordVisible(!editPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                  <label className="text-sm font-medium text-gray-700">Kích hoạt</label>
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
    </div>
  );
};

export default Staffs;