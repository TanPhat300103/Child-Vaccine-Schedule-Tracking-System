import React, { useState } from "react";
import { signInWithGoogle } from "../../config/firebase.js";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaSyringe, FaHospital } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../apis/api.js";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //check validate phone and password
  const validateForm = () => {
    const newErrors = {};
    if (!phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Submit and handle API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const users = await getUsers();
        const user = users.find(
          (user) =>
            user.phoneNumber === phoneNumber && user.password === password
        );

        if (user) {
          console.log("User data:", user);
          localStorage.setItem("userId", user.customerId);
          console.log(
            "UserId đã được lưu vào localStorage:",
            localStorage.getItem("userId")
          ); // Kiểm tra lại userId trong localStorage

          toast.success("Đăng nhập thành công");
          navigate("/home");
        } else {
          setErrors({ phoneNumber: "Số điện thoại hoặc Mật khẩu không đúng" });
          toast.error("Số điện thoại hoặc mật khẩu không đúng");
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  //Login with Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Đăng nhập thành công");
      navigate("/home");
    } catch (error) {
      toast.error("Số điện thoại hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="grid grid-cols-6 gap-4 h-full">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 2 === 0 ? (
                <FaSyringe className="text-blue-500 text-4xl" />
              ) : (
                <FaHospital className="text-blue-400 text-4xl" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl relative z-10">
        <div>
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=100&h=100"
            alt="Logo"
            className="mx-auto h-16 w-16 rounded-full"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Trình Theo Dõi Lịch Tiêm Chủng
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Theo Dõi Hành Trình Tiêm Chủng Của Con Bạn
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                autoComplete="phoneNumber"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.phoneNumber ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Nhập số điện thoại "
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          {/* Forgot password */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Đăng nhập bằng Google
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500 text-sm bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Chưa có tài khoản? Hãy đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
