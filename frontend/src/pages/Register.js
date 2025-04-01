import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEnvelope,
  FaCalendarAlt,
  FaWallet,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/Register.css";

export const postUsers = async (formData) => {
  console.log("Form data being sent to API:", formData);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/customer/create`,
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json", // Bỏ qua warning page
        },

        credentials: "include",
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          gender: formData.gender,
          password: formData.password,
          address: formData.address,
          banking: formData.banking,
          email: formData.email,
        }),
      }
    );

    const data = await response.json();
    console.log("API Response Status:", response.status);
    console.log("API Response Data:", data);

    if (response.status === 200) {
      return { success: true, message: "Đăng ký thành công" };
    } else {
      return {
        success: false,
        message: "Đăng ký thất bại",
      };
    }
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.response) {
      const errorData = await error.response.json();
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", errorData);

      if (errorData && errorData === "Email is exist") {
        return {
          success: false,
          message: "Email này đã được sử dụng",
        };
      }

      return {
        success: false,
        message:
          errorData || "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
      };
    }

    return {
      success: false,
      message: "Gửi biểu mẫu không thành công. Vui lòng thử lại.",
    };
  }
};

const Register = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container-register">
      <div className="form-wrapper-register">
        <div className="flex-container-register">
          {/* Left Side - Illustration */}
          <div className="illustration-side-register">
            <div className="illustration-content-register">
              <button
                onClick={() => navigate("/")}
                className="back-button-register"
              >
                <FaArrowLeft className="icon-register" /> Quay lại trang chủ
              </button>
              <h2 className="illustration-title-register">
                Hệ Thống Theo Dõi Tiêm Chủng
              </h2>
              <p className="illustration-text-register">
                Chào mừng bạn đến với hệ thống quản lý tiêm chủng trẻ em. Hãy
                tạo tài khoản để theo dõi lịch tiêm chủng một cách dễ dàng và
                hiệu quả.
              </p>
              <div className="benefits-box-register">
                <h3 className="benefits-title-register">Lợi ích khi đăng ký</h3>
                <ul className="benefits-list-register">
                  <li>Nhắc nhở lịch tiêm tự động</li>
                  <li>Theo dõi lịch sử tiêm chủng</li>
                  <li>Truy cập thông tin vaccine</li>
                  <li>Đặt lịch tiêm nhanh chóng</li>
                </ul>
              </div>
              <p className="footer-text-register">
                © 2025 KidVax - Hệ thống theo dõi tiêm chủng số 1 Việt Nam
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="form-side-register">
            <div className="form-header-register">
              <h1 className="form-title-register">Đăng ký tài khoản</h1>
              <p className="form-subtitle-register">
                Điền thông tin để tạo tài khoản quản lý tiêm chủng
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-content-register">
              {/* Name Fields */}
              <div className="grid-container-register">
                <div className="input-group-register">
                  <label className="label-register">
                    <FaUser className="icon-register" /> Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-register ${
                      errors.firstName ? "input-error-register" : ""
                    }`}
                    placeholder="Nhập họ"
                  />
                  {errors.firstName && (
                    <p className="error-text-register">{errors.firstName}</p>
                  )}
                </div>
                <div className="input-group-register">
                  <label className="label-register">
                    <FaUser className="icon-register" /> Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`input-register ${
                      errors.lastName ? "input-error-register" : ""
                    }`}
                    placeholder="Nhập tên"
                  />
                  {errors.lastName && (
                    <p className="error-text-register">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth and Gender */}
              <div className="grid-container-register">
                <div className="input-group-register">
                  <label className="label-register">
                    <FaCalendarAlt className="icon-register" /> Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className={`input-register ${
                      errors.dob ? "input-error-register" : ""
                    }`}
                  />
                  {errors.dob && (
                    <p className="error-text-register">{errors.dob}</p>
                  )}
                </div>
                <div className="input-group-register">
                  <label className="label-register">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-register"
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
                    className={`input-register ${
                      errors.gender ? "input-error-register" : ""
                    }`}
                  >
                    <option value="">Chọn Giới Tính</option>
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                  </select>
                  {errors.gender && (
                    <p className="error-text-register">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="input-group-register">
                <label className="label-register">
                  <FaEnvelope className="icon-register" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-register ${
                    errors.email ? "input-error-register" : ""
                  }`}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="error-text-register">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="input-group-register">
                <label className="label-register">
                  <FaPhone className="icon-register" /> Số Điện Thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`input-register ${
                    errors.phoneNumber ? "input-error-register" : ""
                  }`}
                  placeholder="0xxxxxxxxx"
                />
                {errors.phoneNumber && (
                  <p className="error-text-register">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div className="input-group-register">
                <label className="label-register">
                  <FaLock className="icon-register" /> Mật khẩu
                </label>
                <div className="password-container-register">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-register ${
                      errors.password ? "input-error-register" : ""
                    }`}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-register"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="icon-register" />
                    ) : (
                      <FaEye className="icon-register" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="error-text-register">{errors.password}</p>
                ) : (
                  <p className="password-hint-register">
                    Mật khẩu cần có ít nhất 6 ký tự, 1 chữ thường, 1 chữ hoa và
                    1 ký tự đặc biệt
                  </p>
                )}
              </div>

              {/* Agree to Terms */}
              <div className="terms-container-register">
                <div className="terms-wrapper-register">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="checkbox-register"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="terms-label-register"
                  >
                    Tôi đồng ý với{" "}
                    <button
                      type="button"
                      className="link-button-register"
                      onClick={() => navigate("/terms-of-service")}
                    >
                      Điều Khoản Dịch Vụ
                    </button>{" "}
                    và{" "}
                    <button
                      type="button"
                      className="link-button-register"
                      onClick={() => navigate("/privacy-policy")}
                    >
                      Chính Sách Bảo Mật
                    </button>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="error-text-register">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button-register"
              >
                {isLoading ? (
                  <div className="loading-container-register">
                    <div className="spinner-register"></div>
                    <span className="loading-text-register">Đang xử lý...</span>
                  </div>
                ) : (
                  "Đăng ký ngay"
                )}
              </button>
            </form>

            <div className="login-link-register">
              <p>
                Đã có tài khoản?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="link-button-register"
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
