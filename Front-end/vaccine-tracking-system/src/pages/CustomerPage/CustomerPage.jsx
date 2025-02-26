import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import AddChild from "./AddChild";
import Footer from "../../components/common/Footer";
import { toast } from "react-toastify";
import {
  getUsers,
  postUsers,
  updateUser,
  fetchChildren,
  fetchCustomer,
} from "../../apis/api";

import {
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const CustomerPage = () => {
  const customerId = "C002";
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const isExactPath = location.pathname === "/customer";
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    dob: customer?.dob
      ? new Date(customer.dob).toISOString().split("T")[0]
      : "",
    gender: customer?.gender ? "true" : "false",
    email: customer?.email || "",
    phoneNumber: customer?.phoneNumber || "",
    address: customer?.address || "",
    password: customer?.password || "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        dob: new Date(customer.dob).toISOString().split("T")[0],
        gender: customer.gender ? "true" : "false",
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        password: customer.password,
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.gender = formData.gender === "true";
    setIsLoading(true);
    try {
      const result = await updateUser(formData);
      console.log("API Result:", result);
      if (result.success) {
        toast.success(result.message);
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
      setFormData(data);
    } catch (error) {
      toast.error("Không thể lấy thông tin khách hàng.");
    }
  };

  const loadChildrenData = async (customerId) => {
    try {
      const response = await fetchChildren(customerId);
      console.log("Dữ liệu trẻ em nhận được:", response);
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
      {/* Giả lập top bar, có thể tuỳ chỉnh thêm nếu muốn */}
      <div className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
        <div className="text-xl font-bold">CRM</div>
        <div className="text-sm text-gray-500">Xin chào, Customer!</div>
      </div>

      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <aside className="w-full md:w-1/4 bg-white rounded-lg shadow p-6 h-fit">
          <nav className="space-y-2">
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              Hồ sơ của tôi
            </NavLink>

            {/* Hồ Sơ Trẻ Em dưới dạng hover dropdown */}
            <div className="relative group px-4 py-2 rounded-md cursor-pointer font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              Hồ sơ trẻ em
              <div className="absolute left-0 mt-1 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-md w-48 z-10">
                {children.length > 0 ? (
                  children.map((child) => (
                    <NavLink
                      key={child.childId}
                      to={`/customer/child/${child.childId}`}
                      state={{ customerId: customerId }}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "hover:bg-gray-100 text-gray-600"
                        }`
                      }
                    >
                      {child.firstName} {child.lastName}
                    </NavLink>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-gray-400">
                    Chưa có thông tin
                  </p>
                )}
              </div>
            </div>

            <NavLink
              to="/customer/add-child"
              state={{ customerId: customerId }}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md font-semibold transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                } mt-2 text-center`
              }
            >
              Thêm hồ sơ
            </NavLink>
            <NavLink
              to="/customer/booking"
              state={{ customerId: customerId }}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md font-semibold transition-colors text-center ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                } mt-2`
              }
            >
              Xem đặt lịch
            </NavLink>
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
              className="w-full text-left px-4 py-3 mt-2 text-red-600 hover:bg-gray-100 rounded-md font-semibold transition-colors"
            >
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow p-6">
            {isExactPath ? (
              <div className="space-y-8">
                {/* Tiêu đề My Profile */}
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Thông Tin Khách Hàng
                </h2>
                {/* Ảnh đại diện */}
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Mã KH: {customerId}</p>
                  </div>
                </div>

                {/* Form thông tin cá nhân */}
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
                      Họ
                    </label>
                    <div className="relative">
                      <FiUser className="absolute top-3 left-3 text-gray-400" />
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
                      Tên
                    </label>
                    <div className="relative">
                      <FiUser className="absolute top-3 left-3 text-gray-400" />
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
                      Giới tính
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center text-gray-600">
                        <input
                          type="radio"
                          name="gender"
                          value="true"
                          checked={formData.gender === "true"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Nam
                      </label>
                      <label className="flex items-center text-gray-600">
                        <input
                          type="radio"
                          name="gender"
                          value="false"
                          checked={formData.gender === "false"}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Nữ
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600 block">
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

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-medium text-gray-600 block">
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

                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-semibold"
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
