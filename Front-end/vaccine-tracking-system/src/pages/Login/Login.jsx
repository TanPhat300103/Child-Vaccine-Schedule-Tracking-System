import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext.jsx";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaHospital } from "react-icons/fa";
import { RiSyringeLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();
  const otpRefs = useRef([]);

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({
          username: phoneNumber,
          password,
        }).toString(),
      });

      if (response.ok) {
        console.log("Login successful - Updating status...");
        await checkLoginStatus();
        navigate("/");
      } else if (!phoneNumber) {
        setError("Số điện thoại là bắt buộc");
      } else if (!/^0\d{9}$/.test(phoneNumber)) {
        setError("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0");
      }
      if (!password) {
        setError("Mật khẩu là bắt buộc");
      } else if (password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
      } else if (!/[a-z]/.test(password)) {
        setError("Mật khẩu phải có ít nhất một chữ cái thường");
      } else if (!/[A-Z]/.test(password)) {
        setError("Mật khẩu phải có ít nhất một chữ cái hoa");
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setError("Mật khẩu phải có ít nhất một ký tự đặc biệt");
      } else {
        throw new Error("Tài khoản hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không đúng");
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError("");

    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Gửi yêu cầu OTP
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }).toString(),
      });

      const result = await response.text();
      if (response.ok && result === "OTP sent successfully") {
        setIsOtpSent(true);
        setResendCooldown(60);
      } else {
        setError(result || "Không thể gửi OTP, vui lòng thử lại");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gửi OTP");
      console.error("Lỗi gửi OTP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }).toString(),
      });

      const result = await response.text();
      if (response.ok && result === "OTP sent successfully") {
        setResendCooldown(60);
        setError("OTP đã được gửi lại");
      } else {
        setError(result || "Không thể gửi OTP, vui lòng thử lại");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gửi OTP");
      console.error("Lỗi gửi OTP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác nhận OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const otpValue = otp.join("");
    try {
      const response = await fetch(
        `http://localhost:8080/otp/verify?email=${encodeURIComponent(
          email
        )}&otp=${otpValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const result = await response.text();
      if (response.ok && result === "OTP verified successfully") {
        setIsOtpVerified(true);
      } else {
        setError(result || "Mã OTP không hợp lệ hoặc đã hết hạn");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi xác nhận OTP");
      console.error("Lỗi xác nhận OTP:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      setIsLoading(false);
      return;
    }

    const otpValue = otp.join("");
    try {
      const response = await fetch("http://localhost:8080/otp/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          otp: otpValue,
          newPassword,
        }).toString(),
      });

      const result = await response.text();
      if (response.ok && result === "Password reset successfully") {
        setError("Đặt lại mật khẩu thành công, vui lòng đăng nhập lại");
        setTimeout(() => {
          setIsForgotPassword(false);
          setIsOtpSent(false);
          setIsOtpVerified(false);
          setEmail("");
          setOtp(["", "", "", "", "", ""]);
          setNewPassword("");
          setConfirmPassword("");
        }, 2000);
      } else {
        setError(result || "Không thể đặt lại mật khẩu, vui lòng thử lại");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi đặt lại mật khẩu");
      console.error("Lỗi đặt lại mật khẩu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thay đổi giá trị trong ô OTP
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // Xử lý phím Backspace
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Đếm ngược resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side: Branding and Background */}
        <div className="hidden lg:block w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 p-8 text-white relative">
          <div className="absolute top-6 left-6 flex items-center space-x-2">
            <RiSyringeLine className="text-3xl" />
            <FaHospital className="text-3xl" />
          </div>
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-3xl font-bold mb-4">
              Theo dõi lịch tiêm chủng cho bé
            </h1>
            <p className="text-lg">
              Đảm bảo bé yêu của bạn được bảo vệ với lịch tiêm chủng đầy đủ và
              đúng thời gian.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {!isForgotPassword
              ? "Đăng nhập"
              : isOtpVerified
              ? "Đặt lại mật khẩu"
              : isOtpSent
              ? "Xác nhận OTP"
              : "Quên mật khẩu"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isForgotPassword ? (
              "Vui lòng nhập email để nhận mã OTP"
            ) : (
              <span>
                Bạn chưa có tài khoản?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Đăng ký
                </a>
              </span>
            )}
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <hr className="w-full border-gray-300" />
                <span className="absolute bg-white px-4 text-gray-500 text-sm">
                  Hoặc đăng nhập với
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  {isLoading ? "Đang xử lý..." : "Đăng nhập bằng Google"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  disabled={isLoading}
                  className="text-blue-600 hover:underline text-sm font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </form>
          ) : !isOtpSent ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email của bạn
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi OTP"
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  disabled={isLoading}
                  className="text-blue-600 hover:underline text-sm font-medium transition-colors"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          ) : !isOtpVerified ? (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nhập mã OTP đã gửi đến email của bạn
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Vui lòng kiểm tra hộp thư đến và spam
                </p>
                <div className="flex justify-center items-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      ref={(el) => (otpRefs.current[index] = el)}
                      disabled={isLoading}
                      className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xác nhận...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendCooldown > 0}
                  className={`text-sm font-medium transition-colors ${
                    resendCooldown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:underline"
                  }`}
                >
                  {resendCooldown > 0
                    ? `Gửi lại OTP (${resendCooldown}s)`
                    : "Gửi lại OTP"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <HiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
