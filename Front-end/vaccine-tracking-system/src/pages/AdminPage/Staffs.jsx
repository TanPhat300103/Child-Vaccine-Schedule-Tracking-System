import React, { useEffect, useState } from "react";
import {
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../apis/api";

const Staffs = () => {
  // Danh sách staff
  const [staffList, setStaffList] = useState([]);
  // State để quản lý form tạo mới
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    address: "",
    email: "",
    password: "",
    roleId: 1,
    active: true,
  });
  // State để quản lý form chỉnh sửa
  const [editStaff, setEditStaff] = useState(null);
  // Thông báo lỗi hoặc thành công
  const [message, setMessage] = useState("");

  // Lấy danh sách staff khi component mount
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

  // Xử lý thay đổi input cho form tạo mới
  const handleNewStaffChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Thêm staff mới
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const { success, message } = await createStaff(newStaff);
      if (success) {
        setMessage("Thêm nhân viên thành công!");
        // Reset form
        setNewStaff({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          dob: "",
          address: "",
          email: "",
          password: "",
          roleId: 1,
          active: true,
        });
        // Refresh danh sách
        fetchStaffList();
      } else {
        setMessage(message || "Không thể thêm nhân viên.");
      }
    } catch (err) {
      console.error("Error creating staff:", err);
      setMessage("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  // Bắt đầu chỉnh sửa staff
  const handleEditClick = (staff) => {
    setMessage("");
    setEditStaff({
      staffId: staff.staffId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      phoneNumber: staff.phone, // staff trả về phone, FE dùng phoneNumber
      dob: staff.dob ? staff.dob.split("T")[0] : "",
      address: staff.address,
      email: staff.mail, // staff trả về mail, FE dùng email
      password: staff.password,
      roleId: staff.roleId,
      active: staff.active,
    });
  };

  // Xử lý thay đổi input cho form chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditStaff((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Lưu chỉnh sửa staff
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editStaff) return;
    setMessage("");
    try {
      const { success, message } = await updateStaff(editStaff);
      if (success) {
        setMessage("Cập nhật nhân viên thành công!");
        setEditStaff(null);
        fetchStaffList();
      } else {
        setMessage(message || "Không thể cập nhật nhân viên.");
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      setMessage("Có lỗi xảy ra khi cập nhật nhân viên.");
    }
  };

  // Hủy chỉnh sửa
  const handleEditCancel = () => {
    setEditStaff(null);
  };

  // Xóa staff
  const handleDeleteStaff = async (staffId) => {
    setMessage("");
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        const { success, message } = await deleteStaff(staffId);
        if (success) {
          setMessage("Xóa nhân viên thành công!");
          fetchStaffList();
        } else {
          setMessage(message || "Không thể xóa nhân viên.");
        }
      } catch (err) {
        console.error("Error deleting staff:", err);
        setMessage("Có lỗi xảy ra khi xóa nhân viên.");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Nhân Viên</h1>

      {message && (
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {/* Form chỉnh sửa nhân viên (nếu có dữ liệu chỉnh sửa) */}
      {editStaff && (
        <div className="border rounded p-4 bg-white shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Chỉnh sửa Nhân Viên</h2>
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
              <label className="block mb-1 font-medium">Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={editStaff.phoneNumber}
                onChange={handleEditChange}
                className="border rounded w-full px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Ngày sinh</label>
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
            <div>
              <label className="block mb-1 font-medium">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={editStaff.password}
                onChange={handleEditChange}
                className="border rounded w-full px-2 py-1"
              />
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Form thêm nhân viên */}
      <div className="border rounded p-4 bg-white shadow">
        <h2 className="text-xl font-semibold mb-2">Thêm Nhân Viên Mới</h2>
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
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={newStaff.phoneNumber}
              onChange={handleNewStaffChange}
              className="border rounded w-full px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ngày sinh</label>
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
          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={newStaff.password}
              onChange={handleNewStaffChange}
              className="border rounded w-full px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Role ID</label>
            <input
              type="number"
              name="roleId"
              value={newStaff.roleId}
              onChange={handleNewStaffChange}
              className="border rounded w-full px-2 py-1"
            />
          </div>
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

      {/* Danh sách staff */}
      <div className="border rounded p-4 bg-white shadow">
        <h2 className="text-xl font-semibold mb-2">Danh Sách Nhân Viên</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Mã NV</th>
                <th className="px-4 py-2 border">Họ</th>
                <th className="px-4 py-2 border">Tên</th>
                <th className="px-4 py-2 border">SĐT</th>
                <th className="px-4 py-2 border">Ngày Sinh</th>
                <th className="px-4 py-2 border">Địa chỉ</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Active</th>
                <th className="px-4 py-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <StaffRow
                  key={staff.staffId}
                  staff={staff}
                  onUpdate={() => handleEditClick(staff)}
                  onDelete={() => handleDeleteStaff(staff.staffId)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Row component để hiển thị mỗi staff
const StaffRow = ({ staff, onUpdate, onDelete }) => {
  return (
    <tr className="border-b">
      <td className="px-4 py-2 border text-center">{staff.staffId}</td>
      <td className="px-4 py-2 border">{staff.firstName}</td>
      <td className="px-4 py-2 border">{staff.lastName}</td>
      <td className="px-4 py-2 border">{staff.phone}</td>
      <td className="px-4 py-2 border">
        {staff.dob ? staff.dob.split("T")[0] : ""}
      </td>
      <td className="px-4 py-2 border">{staff.address}</td>
      <td className="px-4 py-2 border">{staff.mail}</td>
      <td className="px-4 py-2 border text-center">
        {staff.active ? "Yes" : "No"}
      </td>
      <td className="px-4 py-2 border text-center">
        <button
          onClick={() => {
            console.log("Button Edit clicked in StaffRow");
            onUpdate();
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Staffs;
