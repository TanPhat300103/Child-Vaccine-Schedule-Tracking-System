// src/pages/Customer/CustomerPage.jsx
import React, { useState } from "react";
import Child from "./Child"; // Component hiển thị thông tin trẻ em
import AddChild from "./AddChild"; // Component form thêm trẻ em
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiCalendar,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const CustomerPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Nguyễn Văn A",
    gender: "male",
    dob: "1990-01-01",
    email: "nguyenvana@example.com",
    phone: "+1234567890",
    address: "123 Đường Chính, Thành phố",
    password: "********",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar bên trái */}
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
              {/* Ví dụ, bạn có thể có danh sách trẻ em từ backend */}
              <button
                onClick={() => setActiveSection("child-1")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                Sarah Doe
              </button>
              <button
                onClick={() => setActiveSection("child-2")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
              >
                Mike Doe
              </button>
            </div>

            <button
              onClick={() => setActiveSection("add-child")}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Thêm trẻ em
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md">
              Lịch tiêm chủng
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 rounded-md"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Khu vực nội dung bên phải */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              <form className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Họ và tên"
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
                      name="phone"
                      value={formData.phone}
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
                      placeholder="Mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Lưu Thay Đổi
                </button>
              </form>
            </div>
          )}

          {activeSection.startsWith("child-") && <Child />}

          {activeSection === "add-child" && <AddChild />}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
