import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import Footer from "../../components/common/Footer";
import { toast } from "react-toastify";
import { updateUser, fetchChildren, fetchCustomer } from "../../apis/api";
import { format } from "date-fns";
import Header from "../../components/header/header";// Import Header


import {
  FiCalendar,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser as FiUserOutline,
  FiUser,
  FiLogOut,
  FiPlusCircle,
} from "react-icons/fi";
import { FaMars, FaVenus, FaChild } from "react-icons/fa";
import { AiOutlineHistory } from "react-icons/ai";
import { useAuth } from "../../components/common/AuthContext";

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
  const { state } = useLocation();
  const { vaccineIds, vaccineComboIds, childId, bookingDate } = state || {};

  console.log("Vaccine IDs:", vaccineIds);
  console.log("Vaccine Combo IDs:", vaccineComboIds);
  console.log("Child ID:", childId);
  console.log("Booking Date:", bookingDate);
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
  const { userInfo } = useAuth();
  console.log(userInfo);
  const customerId = userInfo.userId;
  console.log("userinfo: ", userInfo);
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [proFileData, setProFileData] = useState(null);
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const data = fetch("http://localhost:8080/auth/myprofile", {
      method: "GET",
      credentials: "include",
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
  const refreshChildren = () => {
    fetchChildren();
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
      <Header />
      <div className="container mx-auto px-1 py-30 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white border border-teal-200 rounded-xl shadow-md p-5 flex flex-col">
          {/* Phần header của sidebar */}
          <div className="mb-4 pb-3 border-b border-teal-100">
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg font-medium text-lg transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-teal-600 hover:bg-teal-50"
                }`
              }
            >
              <FiUser className="mr-3 w-5 h-5" />
              Hồ sơ của tôi
            </NavLink>
          </div>

          {/* Phần hồ sơ trẻ em - GIỮ NGUYÊN */}
          <div className="mt-3">
            <div className="flex items-center px-4 py-2 text-1sm font-bold uppercase tracking-wider [text-shadow:1px_1px_2px_rgba(59,130,246,0.3)]">
              <span>Hồ sơ trẻ em</span>
              {children.length > 0 && fetchChildren && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {children.length}
                </span>
              )}
            </div>
            {children.length > 0 ? (
              <>
                {(showAllChildren ? children : children.slice(0, 5)).map(
                  (child) =>
                    fetchChildren && (
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

          {/* Phần các chức năng chính - THIẾT KẾ LẠI */}
          <div className="space-y-3 mt-4">
            <NavLink
              to="/customer/add-child"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100 hover:shadow"
                }`
              }
            >
              <FiPlusCircle className="mr-3 w-5 h-5" />
              <span className="font-medium">Thêm hồ sơ</span>
            </NavLink>

            <NavLink
              to="/customer/booking"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100 hover:shadow"
                }`
              }
            >
              <FiCalendar className="mr-3 w-5 h-5" />
              <span className="font-medium">Xem đặt lịch</span>
            </NavLink>

            <NavLink
              to="/customer/payment"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow"
                }`
              }
            >
              <AiOutlineHistory className="mr-3 w-5 h-5" />
              <span className="font-medium">Lịch sử thanh toán</span>
            </NavLink>
          </div>

          {/* Nút đăng xuất - THIẾT KẾ LẠI */}
          <div className="mt-auto pt-4 border-t border-teal-100">
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="w-auto md:w-10/10 bg-gradient-to-b from-blue-50 to-white text-blue-800 border border-blue-200 rounded-lg shadow-md  flex flex-col justify-between">
          <div className="rounded-lg  p-2">
            {isExactPath ? (
              <div className="space-y-6">
                {/* Header thông tin bệnh nhân với biểu tượng y tế */}
                <div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-800">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-blue-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                        Mã BN: {customerId}
                      </p>
                    </div>
                  </div>
                  {/* Giới tính: thiết kế lại với biểu tượng y tế */}
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-blue-700">
                      Giới Tính:
                    </span>
                    <button
                      type="button"
                      onClick={toggleGender}
                      className="flex items-center justify-center w-12 h-12 rounded-full transition-colors shadow hover:shadow-lg"
                      title="Nhấn để đổi giới tính"
                      style={
                        formData.gender === "true"
                          ? { backgroundColor: "#4299E1" }
                          : { backgroundColor: "#F687B3" }
                      }
                    >
                      {formData.gender === "true" ? (
                        <FaMars className="w-6 h-6 text-white" />
                      ) : (
                        <FaVenus className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Form thông tin cá nhân với thiết kế y tế */}
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 bg-white p-5 rounded-lg shadow-sm"
                  onSubmit={handleSubmit}
                >
                  <h3 className="md:col-span-2 text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Thông tin cá nhân
                  </h3>

                  {/* Họ */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Họ
                    </label>
                    <div className="relative">
                      <FiUserOutline className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                        placeholder="Họ"
                      />
                    </div>
                  </div>

                  {/* Tên */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Tên
                    </label>
                    <div className="relative">
                      <FiUserOutline className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                        placeholder="Tên"
                      />
                    </div>
                  </div>

                  {/* Ngày sinh */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Ngày sinh
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                        placeholder="Số điện thoại"
                      />
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Mật khẩu mới (để trống nếu không đổi)
                    </label>
                    <div className="relative">
                      <FiLock className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                        placeholder="Mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 transition-colors"
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
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-blue-700 block">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <FiHome className="absolute top-3 left-3 text-blue-500" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-blue-50"
                        placeholder="Địa chỉ"
                      />
                    </div>
                  </div>

                  {/* Nút Lưu thay đổi */}
                  <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={!isChanged}
                      className={`px-5 py-2 rounded-md transition-colors font-medium flex items-center ${
                        isChanged
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
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
