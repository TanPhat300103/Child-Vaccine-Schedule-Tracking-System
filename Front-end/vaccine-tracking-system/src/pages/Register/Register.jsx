import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEnvelope,
  FaCalendarAlt,
  FaWallet,
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

  // Check validate data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Họ không được để trống";
    if (!formData.lastName) newErrors.lastName = "Tên không được để trống";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (
      !formData.phoneNumber ||
      !/^0\d{9}$/.test(formData.phoneNumber) // Kiểm tra số điện thoại 10 chữ số bắt đầu bằng 0
    )
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
    if (formData.gender === undefined)
      newErrors.gender = "Giới tính không được để trống";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms =
        "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit and handle API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await postUsers(formData);
        if (result.success) {
          toast.success(result.message); // Thông báo thành công
          navigate("/login");
        } else {
          toast.error(
            result.message ||
              "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
          );
          setErrors({ submit: result.message || "Đăng ký thất bại" });
        }
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
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
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Đăng Ký Lịch Tiêm Chủng
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=""
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=""
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.dob ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới Tính
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=""
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
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=""
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
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
                type={showPassword ? "text" : "password"} // Thay đổi loại nhập liệu dựa trên showPassword
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Thay đổi trạng thái showPassword khi nhấn
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zM12 10a2 2 0 10-2 2 2 2 0 002-2z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A7.931 7.931 0 0012 18c-1.314 0-2.563-.362-3.75-.98M5.636 5.636A9.938 9.938 0 0112 3c2.463 0 4.72.874 6.364 2.636m-6.364 12.728C8.48 20.398 6.037 21 4.5 21c-1.037 0-2.067-.254-2.915-.636l6.591-6.592M9 5.632a9.91 9.91 0 014.5-.632c3.457 0 6.5 2.303 7.22 5.518m-5.72-.9A5.968 5.968 0 0012 10c-2.211 0-4 1.79-4 4 0 2.211 1.79 4 4 4 1.768 0 3.291-.964 4.02-2.39"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FaMapMarkerAlt className="text-blue-500" />
              Địa Chỉ
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder=""
            />
          </div>

          {/* Banking Information */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <FaWallet className="text-blue-500" />
              Thông Tin Ngân Hàng
            </label>
            <input
              type="text"
              name="banking"
              value={formData.banking}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.banking ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=""
            />
            {errors.banking && (
              <p className="text-red-500 text-sm mt-1">{errors.banking}</p>
            )}
          </div>

          {/* Agree to Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <label className="ml-2 text-sm text-gray-600">
              Tôi đồng ý với{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/terms-of-service")}
              >
                Điều Khoản Dịch Vụ
              </button>{" "}
              và{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/privacy-policy")}
              >
                Chính Sách Bảo Mật
              </button>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Registering...</span>
              </div>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng Nhập
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
