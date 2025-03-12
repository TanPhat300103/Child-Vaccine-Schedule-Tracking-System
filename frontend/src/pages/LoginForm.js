import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../style/LoginForm.css';

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
  const navigate = useNavigate();
  const { checkLoginStatus } = useAuth();
  const otpRefs = useRef([]);

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
    // Chuyển hướng đến endpoint OAuth2 của backend
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

  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    setter(value);
    e.target.setAttribute('data-length', value.length);
    e.target.setAttribute('data-value', value);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-overlay"></div>
      <div className="login-form-card">
        <h1 className="login-form-welcome">
          Chào mừng đến với <br /> Trung tâm Tiêm chủng Hoàng Tử Gió
        </h1>
        <h2 className="login-form-title">
          {!isForgotPassword
            ? 'Đăng nhập'
            : isOtpVerified
            ? 'Đặt lại mật khẩu'
            : isOtpSent
            ? 'Xác nhận OTP'
            : 'Quên mật khẩu'}
        </h2>
        {error && <p className="login-form-error-message">{error}</p>}

        {!isForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="phoneNumber" className="login-form-label">
                Số điện thoại:
              </label>
              <div className="login-form-input-wrapper">
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => handleInputChange(e, setPhoneNumber)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  data-length="0"
                  data-value=""
                />
                <span className="login-form-input-highlight"></span>
              </div>
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">
                Mật khẩu:
              </label>
              <div className="login-form-input-wrapper">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  data-length="0"
                  data-value=""
                />
                <span className="login-form-input-highlight"></span>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="login-form-button">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <button
              type="button"
              className="login-form-google-button" // Class mới để tùy chỉnh giao diện nếu cần
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập bằng Google'}
            </button>
            <button
              type="button"
              className="login-form-forgot-button"
              onClick={() => setIsForgotPassword(true)}
              disabled={isLoading}
            >
              Quên mật khẩu?
            </button>
          </form>
        ) : !isOtpSent ? (
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                Nhập email của bạn:
              </label>
              <div className="login-form-input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  data-length="0"
                  data-value=""
                />
                <span className="login-form-input-highlight"></span>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="login-form-button">
              {isLoading ? 'Đang gửi...' : 'Gửi OTP'}
            </button>
            <button
              type="button"
              className="login-form-forgot-button"
              onClick={() => setIsForgotPassword(false)}
              disabled={isLoading}
            >
              Quay lại đăng nhập
            </button>
          </form>
        ) : !isOtpVerified ? (
          <form onSubmit={handleOtpSubmit}>
            <div className="login-form-group">
              <label className="login-form-label">Nhập mã OTP (6 chữ số):</label>
              <div className="otp-input-container">
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
                    className="otp-input"
                  />
                ))}
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="login-form-button">
              {isLoading ? 'Đang xác nhận...' : 'Xác nhận'}
            </button>
            <button
              type="button"
              className="login-form-forgot-button"
              onClick={handleResendOtp}
              disabled={isLoading || resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Gửi lại OTP (${resendCooldown}s)`
                : 'Gửi lại OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPasswordSubmit}>
            <div className="login-form-group">
              <label htmlFor="newPassword" className="login-form-label">
                Nhập mật khẩu mới:
              </label>
              <div className="login-form-input-wrapper">
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => handleInputChange(e, setNewPassword)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  data-length="0"
                  data-value=""
                />
                <span className="login-form-input-highlight"></span>
              </div>
            </div>
            <div className="login-form-group">
              <label htmlFor="confirmPassword" className="login-form-label">
                Xác nhận mật khẩu mới:
              </label>
              <div className="login-form-input-wrapper">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e, setConfirmPassword)}
                  required
                  disabled={isLoading}
                  className="login-form-input"
                  data-length="0"
                  data-value=""
                />
                <span className="login-form-input-highlight"></span>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="login-form-button">
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginForm;