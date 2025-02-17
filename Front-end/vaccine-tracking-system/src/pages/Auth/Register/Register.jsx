// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsGithub } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().split(" ").length < 2)
          return "Please enter both first and last name";
        if (!/^[a-zA-Z\s]*$/.test(value))
          return "Name should only contain letters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email";
        if (value.length > 254) return "Email is too long";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(value))
          return "Password must contain at least one special character";
        if (value.length > 50) return "Password is too long";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        return value !== formData.password ? "Passwords do not match" : "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^\+?[1-9]\d{9,14}$/.test(value))
          return "Please enter a valid phone number";
        return "";
      case "gender":
        return !value ? "Please select a gender" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (type !== "checkbox") {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "address") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      const response = await axios.post(
        "https://67aa281d65ab088ea7e5d7ab.mockapi.io/user",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender,
        }
      );
      if (response.status === 201) {
        console.log("Registration successful");
        navigate("/login");
      } else {
        setErrors({ submit: "Something went wrong, please try again." });
        console.error("Registration failed: ", response);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Failed to submit form. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      !errors.fullName &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.phone &&
      formData.agreeToTerms &&
      Object.values(formData).every((value) => value !== "")
    );
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-heading font-heading text-center text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-body text-center text-accent">
            Join us today and get started
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-body text-foreground"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.fullName ? "border-destructive" : "border-input"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-body text-foreground"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-body text-foreground"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-destructive" : "border-input"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-body text-foreground"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`block w-full px-3 py-2 border ${
                    errors.password ? "border-destructive" : "border-input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-accent" />
                  ) : (
                    <FiEye className="text-accent" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-body text-foreground"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-destructive"
                      : "border-input"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-accent" />
                  ) : (
                    <FiEye className="text-accent" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-body text-foreground"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.phone ? "border-destructive" : "border-input"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring`}
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-body text-foreground"
              >
                Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                className="h-4 w-4 text-primary border-input rounded"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm text-accent"
              >
                I agree to the Terms and Privacy Policy
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-body text-primary-foreground ${
                isFormValid() && !loading
                  ? "bg-[green] hover:bg-primary/90"
                  : "bg-primary/50 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-input"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-accent">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-card text-sm font-body text-foreground hover:bg-muted"
              >
                <FcGoogle className="text-xl" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-card text-sm font-body text-foreground hover:bg-muted"
              >
                <BsFacebook className="text-xl text-blue-600" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-card text-sm font-body text-foreground hover:bg-muted"
              >
                <BsGithub className="text-xl" />
              </button>
            </div>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-accent">
          Already have an account?{" "}
          <button className="font-body text-primary hover:text-primary/90">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
