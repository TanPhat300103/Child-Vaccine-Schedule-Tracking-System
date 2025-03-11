import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaLock,
  FaEnvelope,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { postUsers } from "../../apis/api";
import { toast } from "react-toastify";

const Register = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    password: "",
    address: "",
    banking: "",
    email: "",
    agreeToTerms: false,
  });

  // Check validattion
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Họ không được để trống";
    if (!formData.lastName) newErrors.lastName = "Tên không được để trống";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.phoneNumber || !/^0\d{9}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một chữ cái thường";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một chữ cái hoa";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một ký tự đặc biệt";
    }
    if (!formData.dob) {
      newErrors.dob = "Ngày sinh không được để trống";
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      if (dob > today) {
        newErrors.dob = "Ngày sinh không được là ngày trong tương lai";
      }
    }
    if (formData.gender === "")
      newErrors.gender = "Giới tính không được để trống";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms =
        "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // xu ly api submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await postUsers(formData);
        if (result.success) {
          toast.success(result.message || "Đăng ký thành công!");
          navigate("/login");
        } else {
          toast.error(
            result.message ||
              "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
          );
          setErrors({ submit: result.message || "Đăng ký thất bại!" });
        }
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Đăng ký thất bại!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle change for form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Illustration */}
          <div className="hidden md:block md:w-5/12 bg-gradient-to-br from-blue-500 to-indigo-600 p-12 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center text-white hover:text-blue-200 transition mb-8"
                >
                  <FaArrowLeft className="mr-2" /> Quay lại trang chủ
                </button>
                <h2 className="text-3xl font-bold mb-6">
                  Hệ Thống Theo Dõi Tiêm Chủng
                </h2>
                <p className="mb-6 text-blue-100">
                  Chào mừng bạn đến với hệ thống quản lý tiêm chủng trẻ em. Hãy
                  tạo tài khoản để theo dõi lịch tiêm chủng một cách dễ dàng và
                  hiệu quả.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="font-semibold mb-2">Lợi ích khi đăng ký</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-blue-100">
                    <li>Nhắc nhở lịch tiêm tự động</li>
                    <li>Theo dõi lịch sử tiêm chủng</li>
                    <li>Truy cập thông tin vaccine</li>
                    <li>Đặt lịch tiêm nhanh chóng</li>
                  </ul>
                </div>
                <p className="text-sm text-blue-200">
                  &copy; 2025 KidVax - Hệ thống theo dõi tiêm chủng số 1 Việt
                  Nam
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-7/12 p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-blue-600">
                Đăng Ký Tài Khoản
              </h1>
              <p className="text-gray-600 mt-2">
                Điền thông tin để tạo tài khoản quản lý tiêm chủng
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields - side by side on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="text-blue-500" />
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập họ"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="text-blue-500" />
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập tên"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Date of Birth and Gender - side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="text-blue-500" />
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Chặn ngày tương lai
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.dob ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Giới Tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn Giới Tính</option>
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="text-blue-500" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="text-blue-500" />
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0xxxxxxxxx"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaLock className="text-blue-500" />
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Mật khẩu cần có ít nhất 6 ký tự, 1 chữ thường, 1 chữ hoa và
                    1 ký tự đặc biệt
                  </p>
                )}
              </div>

              {/* Agree to Terms with beautiful styling */}
              <div className="mt-6">
                <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Tôi đồng ý với{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      onClick={() => navigate("/terms-of-service")}
                    >
                      Điều Khoản Dịch Vụ
                    </button>{" "}
                    và{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      onClick={() => navigate("/privacy-policy")}
                    >
                      Chính Sách Bảo Mật
                    </button>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              {/* Submit Button with Animation */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg px-4 py-3 font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50 shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Đang xử lý...</span>
                  </div>
                ) : (
                  "Đăng ký ngay"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Đăng Nhập
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
