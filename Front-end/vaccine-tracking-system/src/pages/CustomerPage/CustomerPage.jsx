import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import AddChild from "./AddChild";
import Footer from "../../components/common/Footer";
import { toast } from "react-toastify";
import { updateUser, fetchChildren, fetchCustomer } from "../../apis/api";

import {
  FiCalendar,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser as FiUserOutline,
  FiLogOut,
} from "react-icons/fi";
import { FaMars, FaVenus, FaChild } from "react-icons/fa";

// Hàm so sánh dữ liệu form và dữ liệu gốc
const isFormChanged = (formData, originalData) => {
  if (!originalData) return false;
  for (let key in formData) {
    if (formData[key] !== originalData[key]) {
      return true;
    }
  }
  return false;
};

const CustomerPage = () => {
  const customerId = "C002";
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const [showAllChildren, setShowAllChildren] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const isExactPath = location.pathname === "/customer";
  const [error, setError] = useState(null);

  // Lưu dữ liệu gốc để kiểm tra khi thay đổi
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "false", // mặc định nữ
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  // Khi customer thay đổi => set lại formData và originalData
  useEffect(() => {
    if (customer) {
      const newForm = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        dob: new Date(customer.dob).toISOString().split("T")[0],
        gender: customer.gender ? "true" : "false",
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        password: customer.password,
      };
      setFormData(newForm);
      setOriginalData(newForm);
    }
  }, [customer]);

  // Theo dõi thay đổi form để bật tắt nút lưu
  useEffect(() => {
    setIsChanged(isFormChanged(formData, originalData));
  }, [formData, originalData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle giới tính bằng icon
  const toggleGender = () => {
    setFormData((prev) => ({
      ...prev,
      gender: prev.gender === "true" ? "false" : "true",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.gender = formData.gender === "true";
    setIsLoading(true);
    try {
      const result = await updateUser(formData);
      if (result.success) {
        toast.success(result.message);
        setOriginalData({ ...formData });
        setIsChanged(false);
        navigate("/customer");
      } else {
        toast.error(
          result.message ||
            "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin."
        );
        setErrors({ submit: result.message || "Cập nhật thất bại" });
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          loadCustomerData(customerId),
          loadChildrenData(customerId),
        ]);
      } catch (err) {
        setError(
          "Không thể tải dữ liệu: " + (err.message || "Lỗi không xác định")
        );
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [customerId]);

  const loadCustomerData = async (customerId) => {
    try {
      const data = await fetchCustomer(customerId);
      setCustomer(data);
    } catch (error) {
      toast.error("Không thể lấy thông tin khách hàng.");
    }
  };

  const loadChildrenData = async (customerId) => {
    try {
      const response = await fetchChildren(customerId);
      if (Array.isArray(response)) {
        setChildren(response);
      } else {
        setChildren([]);
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin trẻ em:", err);
      setChildren([]);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );

  if (!formData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">
          Không tìm thấy thông tin khách hàng
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="text-xl font-bold">CRM</div>
        <div className="text-sm text-gray-500">Xin chào, Customer!</div>
      </div>

      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white text-blue-700 border border-blue-300 rounded-lg shadow p-6 flex flex-col justify-between">
          <nav className="space-y-3 text-base">
            {/* Mục “Hồ sơ của tôi” với icon nhà */}
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-md font-bold text-xl transition-colors [text-shadow:1px_1px_2px_rgba(59,130,246,0.3)] ${
                  isActive ? "bg-blue-100" : "hover:bg-blue-50"
                }`
              }
            >
              <FiHome className="mr-2 w-6 h-6" />
              Hồ sơ của tôi
            </NavLink>

            {/* Hồ sơ trẻ em */}
            <div className="mt-3">
              <div className="flex items-center px-4 py-2 text-1sm font-bold uppercase tracking-wider [text-shadow:1px_1px_2px_rgba(59,130,246,0.3)]">
                <span>Hồ sơ trẻ em</span>
                {children.length > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {children.length}
                  </span>
                )}
              </div>
              {children.length > 0 ? (
                <>
                  {(showAllChildren ? children : children.slice(0, 5)).map(
                    (child) => (
                      <NavLink
                        key={child.childId}
                        to={`/customer/child/${child.childId}`}
                        state={{ customerId }}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 rounded-lg transition-all transform hover:shadow-md text-1xl ${
                            isActive
                              ? "bg-blue-100"
                              : "hover:bg-blue-50 text-blue-700"
                          }`
                        }
                      >
                        <FaChild className="mr-2 w-5 h-5" />
                        {child.firstName} {child.lastName}
                      </NavLink>
                    )
                  )}
                  {children.length > 5 && (
                    <button
                      onClick={() => setShowAllChildren((prev) => !prev)}
                      className="block w-full text-left px-4 py-2 text-xl text-blue-500 hover:underline transition-colors"
                    >
                      {showAllChildren ? "Thu gọn" : "Xem thêm..."}
                    </button>
                  )}
                </>
              ) : (
                <p className="px-4 py-2 text-xl text-blue-300">
                  Chưa có thông tin
                </p>
              )}
            </div>

            {/* Thêm hồ sơ */}
            <NavLink
              to="/customer/add-child"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center justify-center px-4 py-3 mt-3 rounded-md font-bold text-xl transition-colors ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`
              }
            >
              ➕ Thêm hồ sơ
            </NavLink>

            {/* Xem đặt lịch */}
            <NavLink
              to="/customer/booking"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center justify-center px-4 py-3 mt-3 rounded-md font-bold text-xl transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`
              }
            >
              🗓 Xem đặt lịch
            </NavLink>
          </nav>

          {/* Nút Đăng xuất */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
              className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors font-bold text-xl"
            >
              <FiLogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="w-full md:w-10/10  bg-white text-blue-700 border border-blue-300 rounded-lg shadow p-6 flex flex-col justify-between">
          <div className="bg-white rounded-lg shadow p-6">
            {isExactPath ? (
              <div className="space-y-8">
                {/* Header thông tin khách hàng với avatar ở bên trái và giới tính bên phải */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUserOutline className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-base text-gray-500">
                        Mã KH: {customerId}
                      </p>
                    </div>
                  </div>
                  {/* Giới tính: đặt ở bên phải */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-700">
                      Giới Tính:
                    </span>
                    <button
                      type="button"
                      onClick={toggleGender}
                      className="flex items-center justify-center w-16 h-16 rounded-full transition-colors shadow hover:shadow-lg"
                      title="Nhấn để đổi giới tính"
                      style={
                        formData.gender === "true"
                          ? { backgroundColor: "#3B82F6" }
                          : { backgroundColor: "#EC4899" }
                      }
                    >
                      {formData.gender === "true" ? (
                        <FaMars className="w-8 h-8 text-white" />
                      ) : (
                        <FaVenus className="w-8 h-8 text-white" />
                      )}
                    </button>
                    <span className="text-lg font-semibold text-gray-800">
                      {formData.gender === "true" ? "" : ""}
                    </span>
                  </div>
                </div>

                {/* Form thông tin cá nhân */}
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                  onSubmit={handleSubmit}
                >
                  {/* Họ */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-600 block">
                      Họ
                    </label>
                    <div className="relative">
                      <FiUserOutline className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Họ"
                      />
                    </div>
                  </div>

                  {/* Tên */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-600 block">
                      Tên
                    </label>
                    <div className="relative">
                      <FiUserOutline className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Tên"
                      />
                    </div>
                  </div>

                  {/* Ngày sinh */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-600 block">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-600 block">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-600 block">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Số điện thoại"
                      />
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="space-y-3 ">
                    <label className="text-base font-medium text-gray-600 block">
                      Mật khẩu mới (để trống nếu không đổi)
                    </label>
                    <div className="relative">
                      <FiLock className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500 transition-colors"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showPassword ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="space-y-3 sm:col-span-2">
                    <label className="text-base font-medium text-gray-600 block">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <FiHome className="absolute top-3 left-3 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Địa chỉ"
                      />
                    </div>
                  </div>

                  {/* Nút Lưu thay đổi */}
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={!isChanged}
                      className={`px-6 py-3 rounded-md transition-colors font-semibold ${
                        isChanged
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerPage;
