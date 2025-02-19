import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddChild from "./AddChild";
import { Children } from "react";
import Footer from "../../components/common/Footer";
import {
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

// Lấy base API từ biến môi trường VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL;

const CustomerPage = () => {
  // Lấy customerId từ localStorage - sẽ được thiết lập khi đăng nhập
  // const customerId = localStorage.getItem("customerId") || "cust001";
  const customerId = "cust001";
  const [activeSection, setActiveSection] = useState("profile");
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    dob: customer?.dob
      ? new Date(customer.dob).toISOString().split("T")[0]
      : "",
    gender: customer?.gender ? "male" : "female",
    email: customer?.email || "",
    phoneNumber: customer?.phoneNumber || "",
    address: customer?.address || "",
    password: "", // Để trống cho người dùng nhập mật khẩu mới
  });

  // Cập nhật formData khi customer data thay đổi
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        dob: new Date(customer.dob).toISOString().split("T")[0],
        gender: customer.gender ? "male" : "female",
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        password: "",
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        gender: formData.gender === "male",
        dob: new Date(formData.dob).toISOString(),
        // Chỉ gửi password nếu có thay đổi
        password: formData.password || undefined,
      };

      const response = await axios.put(
        `${apiUrl}/customers/${customerId}`,
        payload
      );

      // Cập nhật dữ liệu local
      setCustomer(response.data);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchCustomer(), fetchChildren()]);
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

  // Lấy thông tin customer
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/customer/findid?id=${customerId}`
      );
      setCustomer(response.data);
    } catch (err) {
      console.error("Lỗi lấy thông tin khách hàng:", err);
      setError("Không thể tải thông tin khách hàng");
    }
  };

  // Lấy thông tin trẻ em
  const fetchChildren = async () => {
    // try {
    //   const response = await axios.get(
    //     `${apiUrl}/child/findbycustomer?id=${customerId}`
    //   );
    //   // Kiểm tra dữ liệu trả về từ API, nếu không phải mảng thì gán là mảng rỗng
    //   if (Array.isArray(response.data)) {
    //     setChildren(response.data);
    //   } else {
    //     setChildren([]); // Nếu không phải mảng, gán children là mảng rỗng
    //   }
    // } catch (err) {
    //   console.error("Lỗi lấy thông tin trẻ em:", err);
    //   setChildren([]); // Nếu có lỗi, gán children là mảng rỗng
    // }
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

  if (!customer)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">
          Không tìm thấy thông tin khách hàng
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <button
              onClick={() => setActiveSection("profile")}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeSection === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              Hồ sơ của tôi
            </button>

            <div className="space-y-2">
              <h3 className="font-medium px-4">Hồ sơ trẻ em</h3>
              {children.slice(0, 5).map((child) => (
                <button
                  key={child.id}
                  onClick={() => setActiveSection(`child-${child.id}`)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
                >
                  {child.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveSection("add-child")}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Thêm hồ sơ
            </button>

            <button
              onClick={() => navigate("/schedule")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md"
            >
              Lịch tiêm chủng
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 rounded-md"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
          {activeSection === "profile" && customer && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              <form
                className="max-w-2xl mx-auto space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Họ"
                    />
                  </div>

                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tên"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Nam
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Nữ
                    </label>
                  </div>

                  <div className="relative">
                    <FiCalendar className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <FiMail className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative">
                    <FiPhone className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Số điện thoại"
                    />
                  </div>

                  <div className="relative">
                    <FiHome className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Địa chỉ"
                    />
                  </div>

                  <div className="relative">
                    <FiLock className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mật khẩu mới (để trống nếu không đổi)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition-colors"
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

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerPage;
