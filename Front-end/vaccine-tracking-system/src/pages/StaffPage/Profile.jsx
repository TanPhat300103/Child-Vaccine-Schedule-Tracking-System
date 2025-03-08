import React, { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { FaNotesMedical, FaSyringe, FaUserMd } from "react-icons/fa";
import {
  FiCalendar,
  FiUsers,
  FiAlertTriangle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useAuth } from "../../components/common/AuthContext.jsx";

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
      const response = await fetch("http://localhost:8080/staff/update", {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Lỗi khi cập nhật thông tin");
      const updatedData = await response.json();
      setStaffData(updatedData);
      setOriginalData(updatedData);
      setFormChanged(false);
      setNotification({ type: "success", message: "Cập nhật thành công!" });
      setTimeout(() => setNotification(null), 3000); // Auto-dismiss after 3s
    } catch (error) {
      setNotification({ type: "error", message: "Cập nhật thất bại!" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!formData) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6 transform transition-all animate-fadeIn">
      <h2 className="text-2xl font-semibold text-teal-600 mb-4 flex items-center">
        <FaUserMd className="mr-2" /> Hồ Sơ Nhân Viên
      </h2>
      {notification && (
        <div
          className={`mb-4 p-3 rounded-xl flex items-center ${
            notification.type === "success"
              ? "bg-teal-50 text-teal-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Mã nhân viên
            </label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId || ""}
              disabled
              className="mt-1 w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Họ
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Tên
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="mail"
              value={formData.mail || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-300 focus:border-teal-500 transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={!formChanged}
            className={`px-6 py-2 rounded-xl text-white font-medium transition-all ease-in-out ${
              formChanged
                ? "bg-teal-500 hover:bg-teal-600 hover:shadow-md"
                : "bg-gray-300 cursor-not-allowed"
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
  const [showStaffProfile, setShowStaffProfile] = useState(false);

  useEffect(() => {
    if (!staffId) return;

    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/staff/findid?id=${staffId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu nhân viên");
        const data = await response.json();
        setStaffData(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchStaffData();
  }, [staffId]);

  if (loading)
    return (
      <div className="text-center text-gray-600 py-12">Đang tải dữ liệu...</div>
    );
  if (error) return <div className="text-red-600 p-4 text-center">{error}</div>;
  if (!staffData)
    return (
      <div className="text-gray-600 p-4 text-center">Không có dữ liệu</div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-teal-400 hover:shadow-lg transition-all ease-in-out">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-50 text-teal-600">
                <FiCalendar className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Lịch hẹn hôm nay
                </p>
                <p className="text-2xl font-semibold text-gray-800">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-400 hover:shadow-lg transition-all ease-in-out">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <FiUsers className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Tổng bệnh nhân
                </p>
                <p className="text-2xl font-semibold text-gray-800">1,248</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400 hover:shadow-lg transition-all ease-in-out">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <FaSyringe className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Vaccine có sẵn
                </p>
                <p className="text-2xl font-semibold text-gray-800">32</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-400 hover:shadow-lg transition-all ease-in-out">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <FiAlertTriangle className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Báo cáo phản ứng
                </p>
                <p className="text-2xl font-semibold text-gray-800">7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Staff Profile */}
        <div className="mb-6">
          <button
            onClick={() => setShowStaffProfile(!showStaffProfile)}
            className="flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-all ease-in-out shadow-md"
          >
            <span>{showStaffProfile ? "Ẩn hồ sơ" : "Xem hồ sơ"}</span>
            {showStaffProfile ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {/* Staff Profile Section */}
        {showStaffProfile && <StaffProfile initialStaffData={staffData} />}

        {/* Outlet for Nested Routes */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
