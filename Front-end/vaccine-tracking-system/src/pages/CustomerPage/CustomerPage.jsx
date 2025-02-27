import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import axios from "axios";
import AddChild from "./AddChild";
import { Children } from "react";
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

// Lấy base API từ biến môi trường VITE_API_URL

const CustomerPage = () => {
  // Lấy customerId từ localStorage - sẽ được thiết lập khi đăng nhập
  // const customerId = localStorage.getItem("customerId") || "cust001";
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
<<<<<<< HEAD
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    dob: customer?.dob
      ? new Date(customer.dob).toISOString().split("T")[0]
      : "",
    gender: customer?.gender ? "true" : "false",
    email: customer?.email || "",
    phoneNumber: customer?.phoneNumber || "",
    address: customer?.address || "",
    password: customer?.password || "", // Để trống cho người dùng nhập mật khẩu mới
  });

  // Cập nhật formData khi customer data thay đổi
=======
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
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
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
    formData.gender = formData.gender === "true"; // Chuyển đổi gender thành boolean
    setIsLoading(true);
    try {
<<<<<<< HEAD
      // Lấy id từ formData (giả sử formData đã chứa id người dùng hiện tại)
      const result = await updateUser(formData); // Truyền id và formData
      console.log("API Result:", result);

      if (result.success) {
        toast.success(result.message); // Thông báo thành công
        navigate("/customer"); // Điều hướng đến trang profile (hoặc trang khác)
=======
      const result = await updateUser(formData);
      if (result.success) {
        toast.success(result.message);
        setOriginalData({ ...formData });
        setIsChanged(false);
        navigate("/customer");
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
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

  // Lấy thông tin customer
  const loadCustomerData = async (customerId) => {
    try {
      const data = await fetchCustomer(customerId);
<<<<<<< HEAD
      setFormData(data); // Cập nhật dữ liệu vào formData
=======
      setCustomer(data);
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
    } catch (error) {
      toast.error("Không thể lấy thông tin khách hàng.");
    }
  };

  // Lấy thông tin trẻ em
  const loadChildrenData = async (customerId) => {
    try {
      const response = await fetchChildren(customerId);
<<<<<<< HEAD
      console.log("Dữ liệu trẻ em nhận được:", response);
      // Kiểm tra dữ liệu trả về từ API, nếu không phải mảng thì gán là mảng rỗng
=======
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
      if (Array.isArray(response)) {
        setChildren(response);
      } else {
        setChildren([]); // Nếu không phải mảng, gán children là mảng rỗng
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin trẻ em:", err);
      setChildren([]); // Nếu có lỗi, gán children là mảng rỗng
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
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
=======
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
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
<<<<<<< HEAD
                `w-full text-left px-4 py-2 rounded-md ${
                  isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
=======
                `flex items-center px-4 py-3 rounded-md font-bold text-xl transition-colors [text-shadow:1px_1px_2px_rgba(59,130,246,0.3)] ${
                  isActive ? "bg-blue-100" : "hover:bg-blue-50"
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
                }`
              }
            >
              <FiHome className="mr-2 w-6 h-6" />
              Hồ sơ của tôi
            </NavLink>

<<<<<<< HEAD
            <div className="space-y-2">
              <h3 className="font-medium px-4">Hồ sơ trẻ em</h3>
              {children.length > 0 ? (
                children.slice(0, 5).map((child) => (
                  <NavLink
                    key={child.childId}
                    to={`/customer/child/${child.childId}`}
                    state={{ customerId: customerId }}
                    className={({ isActive }) =>
                      "w-full text-left px-4 py-2 text-sm rounded-md " +
                      (isActive
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50")
                    }
                  >
                    {child.firstName} {child.lastName}
                  </NavLink>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-4">
                  Chưa có thông tin trẻ em
                </p>
              )}
            </div>
            <div className="space-y-2">
              <NavLink
                to="/customer/add-child"
                state={{ customerId: customerId }}
                className={({ isActive }) =>
                  `w-full px-4 py-2 text-center rounded-md transition-colors ${
                    isActive
                      ? "bg-green-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`
                }
              >
                Thêm hồ sơ
              </NavLink>
            </div>
            <div className="space-y-2">
              <NavLink
                to="/customer/booking"
                state={{ customerId: customerId }}
                className={({ isActive }) =>
                  `w-full px-4 py-2 text-center rounded-md transition-colors ${
                    isActive ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
                  } text-white`
                }
              >
                Xem đặt lịch
              </NavLink>
            </div>

=======
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
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
<<<<<<< HEAD
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 rounded-md"
=======
              className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors font-bold text-xl"
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
            >
              <FiLogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
<<<<<<< HEAD
        </div>
        {/* Right Content Area */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
          {isExactPath ? (
            // Nếu đúng /customer thì hiển thị nội dung Customer
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              <form
                className="max-w-2xl mx-auto space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Họ"
                    />
                  </div>

                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tên"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
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
                    <label className="flex items-center">
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

                  <div className="relative">
                    <FiCalendar className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <FiMail className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative">
                    <FiPhone className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Số điện thoại"
                    />
                  </div>

                  <div className="relative">
                    <FiHome className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Địa chỉ"
                    />
                  </div>

                  <div className="relative">
                    <FiLock className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mật khẩu mới (để trống nếu không đổi)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition-colors"
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
=======
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
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
<<<<<<< HEAD
                  Lưu thay đổi
                </button>
              </form>
            </div>
          ) : (
            // Nếu không phải /customer, mà là /customer/child, ta sẽ hiển thị Outlet
            <Outlet />
          )}
        </div>
=======
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
>>>>>>> f6c9b197bcd42eab3719c50404c2a079dfc18ecb
      </div>
      <Footer />
    </div>
  );
};

export default CustomerPage;
