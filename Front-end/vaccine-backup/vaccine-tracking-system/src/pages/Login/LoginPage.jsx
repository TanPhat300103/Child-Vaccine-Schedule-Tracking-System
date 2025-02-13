import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = "Email không được để trống";
    else if (!validateEmail(email)) newErrors.email = "Email không hợp lệ";
    if (!password) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // API call simulation
      const response = await fetch(
        "https://67aa281d65ab088ea7e5d7ab.mockapi.io/user"
      );
      const data = await response.json();
      const user = data.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        toast.success("Đăng nhập thành công");
        console.log("Login successful");
        navigate("/home");
      } else {
        setErrors({ email: "Email hoặc Password không đúng" });
        toast.error("Email hoặc mật khẩu không đúng");
        console.error("Login failed: Incorrect email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success("Đăng nhập thành công");
      console.log("Google login successful", user);
      navigate("/home");
    } catch (error) {
      toast.error("Email hoặc mật khẩu không đúng");
      console.error("Google login failed:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-heading font-heading text-foreground">
            Đăng Nhập
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Email
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${
                  errors.email ? "border-destructive" : "border-input"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground`}
                placeholder="your@email.com"
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-2 border ${
                  errors.password ? "border-destructive" : "border-input"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground`}
                placeholder="Nhập mật khẩu"
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Quên Mật Khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[green] text-primary-foreground py-2 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Đang xử lý...</span>
              </div>
            ) : (
              "Đăng Nhập"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-accent">Hoặc</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-card border border-input text-foreground py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center gap-2 transition-colors"
          >
            <FcGoogle className="text-xl" />
            Đăng Nhập bằng Google
          </button>
        </form>

        <p className="text-center text-sm text-accent">
          Chưa có tài khoản?{" "}
          <Link to="/register">
            <button className="text-primary hover:underline font-semibold">
              Đăng Ký Ngay
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
