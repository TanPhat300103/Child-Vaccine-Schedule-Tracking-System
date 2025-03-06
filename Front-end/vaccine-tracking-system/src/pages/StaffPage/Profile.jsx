import React, { useState, useEffect } from "react";
import { useParams, Outlet } from "react-router-dom";
import { FaNotesMedical, FaSyringe } from "react-icons/fa";
import { FiCalendar, FiUsers, FiAlertTriangle } from "react-icons/fi";
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
      setNotification({ type: "success", message: "Chỉnh sửa thành công" });
    } catch (error) {
      setNotification({ type: "error", message: "Chỉnh sửa thất bại" });
    }
  };

  if (!formData) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Hồ sơ của tôi</h2>
      {notification && (
        <div
          className={`mb-4 p-2 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã nhân viên - không cho chỉnh sửa */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã nhân viên
            </label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId || ""}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          {/* Họ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
          {/* Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="mail"
              value={formData.mail || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-teal-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={!formChanged}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
              formChanged
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

const Profile = () => {
  const { userInfo } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [proFileData, setProFileData] = useState(null);
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const data = fetch("http://localhost:8080/auth/myprofile", {
      method: "GET",
      credentials: "include", // Gửi cookie/session
    })
      .then((response) => {
        if (response.status === 401) {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
      });
    setProFileData(data);
    console.log("my profile data: ", proFileData);
  }, []);

  // take data
  console.log("user id la: ", userInfo.data);
  const staffId = userInfo.userId;

  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStaffProfile, setShowStaffProfile] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/staff/findid?id=${staffId}`,
          {
            method: "GET",
            credentials: "include",
            withCredentials: true, // Gửi cookie/session
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu staff");
        }
        const data = await response.json();
        console.log(data);
        setStaffData(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
      setLoading(false);
    };

    fetchStaffData();
  }, [staffId]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!staffData) return <div>Không có dữ liệu</div>;

  return (
    <>
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-teal-600 font-semibold">
              Trung tâm quản lý y tế
            </div>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              Chào mừng, {staffData.firstName + " " + staffData.lastName}!
            </h2>
            <p className="mt-2 text-gray-600">
              Chào mừng bạn đến với hệ thống quản lý tiêm chủng. Hãy xem các
              thông tin quan trọng trong ngày hôm nay.
            </p>
          </div>
          <div className="md:shrink-0 bg-teal-500 md:w-48 flex items-center justify-center">
            <FaNotesMedical className="h-24 w-24 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiCalendar className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Lịch hẹn hôm nay
              </p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiUsers className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Tổng bệnh nhân
              </p>
              <p className="text-2xl font-semibold text-gray-900">1,248</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaSyringe className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Vaccine có sẵn
              </p>
              <p className="text-2xl font-semibold text-gray-900">32</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiAlertTriangle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Báo cáo phản ứng
              </p>
              <p className="text-2xl font-semibold text-gray-900">7</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowStaffProfile(!showStaffProfile)}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          {showStaffProfile ? "Ẩn hồ sơ của tôi" : "Hiện hồ sơ của tôi"}
        </button>
      </div>

      {showStaffProfile && <StaffProfile initialStaffData={staffData} />}

      <div className="bg-white rounded-xl shadow-md p-6">
        <Outlet />
      </div>
    </>
  );
};

export default Profile;
