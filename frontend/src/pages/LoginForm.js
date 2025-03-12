import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../style/LoginForm.css';
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaHospital } from "react-icons/fa";
import { RiSyringeLine } from "react-icons/ri";
import { FaArrowLeft } from "react-icons/fa";

function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
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
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó trong lịch sử
};


  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
          username: phoneNumber,
          password,
        }).toString(),
      });

      if (response.ok) {
        console.log('Login successful - Updating status...');
        await checkLoginStatus();
        navigate('/');
      } else if (response.status === 401) {
        setError('Số điện thoại hoặc mật khẩu không đúng');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Đã xảy ra lỗi khi đăng nhập');
      }
    } catch (err) {
      setError(err.message);
      console.error('Lỗi đăng nhập:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  // Gửi yêu cầu OTP
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email }).toString(),
      });

      const result = await response.text();
      if (response.ok && result === 'OTP sent successfully') {
        setIsOtpSent(true);
        setResendCooldown(60);
      } else {
        setError(result || 'Không thể gửi OTP, vui lòng thử lại');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi OTP');
      console.error('Lỗi gửi OTP:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email }).toString(),
      });

      const result = await response.text();
      if (response.ok && result === 'OTP sent successfully') {
        setResendCooldown(60);
        setError('OTP đã được gửi lại');
      } else {
        setError(result || 'Không thể gửi OTP, vui lòng thử lại');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi OTP');
      console.error('Lỗi gửi OTP:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác nhận OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const otpValue = otp.join('');
    try {
      const response = await fetch(
        `http://localhost:8080/otp/verify?email=${encodeURIComponent(email)}&otp=${otpValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const result = await response.text();
      if (response.ok && result === 'OTP verified successfully') {
        setIsOtpVerified(true);
      } else {
        setError(result || 'Mã OTP không hợp lệ hoặc đã hết hạn');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xác nhận OTP');
      console.error('Lỗi xác nhận OTP:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      setIsLoading(false);
      return;
    }

    const otpValue = otp.join('');
    try {
      const response = await fetch('http://localhost:8080/otp/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          otp: otpValue,
          newPassword,
        }).toString(),
      });

      const result = await response.text();
      if (response.ok && result === 'Password reset successfully') {
        setError('Đặt lại mật khẩu thành công, vui lòng đăng nhập lại');
        setTimeout(() => {
          setIsForgotPassword(false);
          setIsOtpSent(false);
          setIsOtpVerified(false);
          setEmail('');
          setOtp(['', '', '', '', '', '']);
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        setError(result || 'Không thể đặt lại mật khẩu, vui lòng thử lại');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đặt lại mật khẩu');
      console.error('Lỗi đặt lại mật khẩu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thay đổi giá trị trong ô OTP
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // Xử lý phím Backspace
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
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
    <div className="login-form-container">
      <div className="login-form-content">
        {/* Left Side: Branding and Background */}
        <div className="login-form-left">
        
          <div className="login-form-icons">
            <RiSyringeLine className="login-form-icon" />
            <FaHospital className="login-form-icon" />
          </div>
          <div className="login-form-left-content">
            <h1 className="login-form-left-title">
              Theo dõi lịch tiêm chủng cho bé
            </h1>
            <p className="login-form-left-text">
              Đảm bảo bé yêu của bạn được bảo vệ với lịch tiêm chủng đầy đủ và
              đúng thời gian.
            </p>
            {/* Nút Back đặt ở dưới góc trái */}
            <button onClick={handleGoBack} className="login-form-back-button">
              <FaArrowLeft className="login-form-back-icon" />
            </button>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-right">
       
          <h2 className="login-form-title">
            {!isForgotPassword
              ? 'Đăng nhập'
              : isOtpVerified
                ? 'Đặt lại mật khẩu'
                : isOtpSent
                  ? 'Xác nhận OTP'
                  : 'Quên mật khẩu'}
          </h2>
          <p className="login-form-subtitle">
            {isForgotPassword ? (
              'Vui lòng nhập email để nhận mã OTP'
            ) : (
              <span>
                Bạn chưa có tài khoản?{' '}
                <a href="/register" className="login-form-link">
                  Đăng ký
                </a>
              </span>
            )}
          </p>

          {/* Error message */}
          {error && (
            <div className="login-form-error">
              <p className="login-form-error-text">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-form-group">
                <label className="login-form-label">Số điện thoại</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="login-form-group">
                <label className="login-form-label">Mật khẩu</label>
                <div className="login-form-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="login-form-input"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="login-form-eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEyeOff className="login-form-eye-icon" />
                    ) : (
                      <HiEye className="login-form-eye-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-form-button"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="login-form-loading-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="login-form-loading-circle"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="login-form-loading-path"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </div>

              <div className="login-form-divider">
                <hr className="login-form-hr" />
                <span className="login-form-divider-text">
                  Hoặc đăng nhập với
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="login-form-google-button"
                >
                  <FcGoogle className="login-form-google-icon" />
                  {isLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
                </button>
              </div>

              <div className="login-form-forgot">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  disabled={isLoading}
                  className="login-form-forgot-button"
                >
                  Quên mật khẩu?
                </button>
              
              </div>
            </form>
          ) : !isOtpSent ? (
            <form onSubmit={handleForgotPasswordSubmit} className="login-form">
              <div className="login-form-group">
                <label className="login-form-label">Email của bạn</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-form-button"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="login-form-loading-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="login-form-loading-circle"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="login-form-loading-path"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi OTP'
                  )}
                </button>
              </div>

              <div className="login-form-forgot">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  disabled={isLoading}
                  className="login-form-forgot-button"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          ) : !isOtpVerified ? (
            <form onSubmit={handleOtpSubmit} className="login-form">
              <div className="login-form-otp-group">
                <label className="login-form-label">
                  Nhập mã OTP đã gửi đến email của bạn
                </label>
                <p className="login-form-otp-subtitle">
                  Vui lòng kiểm tra hộp thư đến và spam
                </p>
                <div className="login-form-otp-inputs">
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
                      className="login-form-otp-input"
                    />
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-form-button"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="login-form-loading-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="login-form-loading-circle"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="login-form-loading-path"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xác nhận...
                    </>
                  ) : (
                    'Xác nhận'
                  )}
                </button>
              </div>

              <div className="login-form-forgot">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendCooldown > 0}
                  className={`login-form-forgot-button ${resendCooldown > 0 ? 'login-form-disabled' : ''
                    }`}
                >
                  {resendCooldown > 0
                    ? `Gửi lại OTP (${resendCooldown}s)`
                    : 'Gửi lại OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit} className="login-form">
              <div className="login-form-group">
                <label className="login-form-label">Mật khẩu mới</label>
                <div className="login-form-password-wrapper">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="login-form-input"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="login-form-eye-button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <HiEyeOff className="login-form-eye-icon" />
                    ) : (
                      <HiEye className="login-form-eye-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-form-label">Xác nhận mật khẩu mới</label>
                <div className="login-form-password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="login-form-input"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="login-form-eye-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="login-form-eye-icon" />
                    ) : (
                      <HiEye className="login-form-eye-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-form-button"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="login-form-loading-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="login-form-loading-circle"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="login-form-loading-path"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật mật khẩu'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;