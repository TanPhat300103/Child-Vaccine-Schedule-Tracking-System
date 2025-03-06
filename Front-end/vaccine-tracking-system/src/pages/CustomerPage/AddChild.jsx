import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { createChild } from "../../apis/api";
import {
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiPlus,
  FiLoader,
} from "react-icons/fi";
import { FaMars, FaVenus } from "react-icons/fa";
import { useAuth } from "../../components/common/AuthContext.jsx";
import { toast } from "react-toastify";

const AddChild = ({ refreshChildren }) => {
  const location = useLocation();
  const { userInfo } = useAuth();
  console.log(userInfo);
  const customerId = location.state?.customerId || userInfo.userId; // Lấy customerId từ state
  const [childData, setChildData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    contraindications: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Received customerId in AddChild:", customerId);
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === "radio" && name === "gender") {
      // Chuyển giá trị chuỗi thành boolean
      newValue = value === "true";
    }
    setChildData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError(null);
  };

  // Sử dụng useNavigate để chuyển hướng trang
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...childData,
        customer: { customerId },
      };

      console.log("🚀 Dữ liệu gửi lên API:", JSON.stringify(payload, null, 2));
      const { success, message, data } = await createChild(payload);

      if (success) {
        // Reset form sau khi tạo trẻ thành công
        setChildData({
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          contraindications: "",
          active: true,
        });
        toast(message);

        // Cập nhật danh sách trẻ em ở component cha
        if (refreshChildren) {
          // Có thể refreshChildren gọi lại API hoặc trực tiếp cập nhật state với data
          refreshChildren(data);
        }

        const childId = data.childId || data.id;
        if (childId) {
          toast("Đang chuyển hướng đến hồ sơ của trẻ...");
          setTimeout(() => {
            navigate(`/customer/child/${childId}`);
          }, 2000);
        } else {
          console.error("Không tìm thấy childId trong dữ liệu trả về:", data);
        }
      } else {
        setError(message);
      }
    } catch (err) {
      console.error("Lỗi thêm trẻ em:", err);
      setError(
        err.response?.data?.message ||
          "Không thể thêm hồ sơ trẻ em. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 mb-10">
      {/* Header với biểu tượng và tiêu đề */}
      <div className="bg-blue-600 text-white rounded-t-lg p-4 flex items-center gap-3 mb-6 shadow-md">
        <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
          <FiPlus className="text-blue-600 w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Thêm Hồ Sơ Sức Khỏe Trẻ Em</h2>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-start">
          <FiAlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Form chính */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Họ và tên đệm */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-blue-800"
              >
                Họ và tên đệm
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-blue-500" />
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Nhập họ và tên đệm"
                  required
                  value={childData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* Tên */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-blue-800"
              >
                Tên
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-blue-500" />
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Nhập tên"
                  required
                  value={childData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Giới tính */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-800">
              Giới tính
            </label>
            <div className="flex gap-6 mt-1">
              <label className="relative flex items-center bg-blue-50 p-3 rounded-md border border-blue-200 cursor-pointer transition-colors hover:bg-blue-100">
                <input
                  type="radio"
                  name="gender"
                  value="true"
                  required
                  checked={childData.gender === "true"}
                  onChange={handleChange}
                  className="opacity-0 absolute h-0 w-0"
                />
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    childData.gender === "true"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <FaMars className="w-5 h-5" />
                </span>
                <span
                  className={
                    childData.gender === "true"
                      ? "font-medium text-blue-800"
                      : "text-gray-600"
                  }
                >
                  Nam
                </span>
              </label>

              <label className="relative flex items-center bg-blue-50 p-3 rounded-md border border-blue-200 cursor-pointer transition-colors hover:bg-blue-100">
                <input
                  type="radio"
                  name="gender"
                  value="false"
                  required
                  checked={childData.gender === "false"}
                  onChange={handleChange}
                  className="opacity-0 absolute h-0 w-0"
                />
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    childData.gender === "false"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <FaVenus className="w-5 h-5" />
                </span>
                <span
                  className={
                    childData.gender === "false"
                      ? "font-medium text-blue-800"
                      : "text-gray-600"
                  }
                >
                  Nữ
                </span>
              </label>
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-2">
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-blue-800"
            >
              Ngày sinh
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-blue-500" />
              <input
                id="dob"
                type="date"
                name="dob"
                required
                value={childData.dob}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {/* Chống chỉ định */}
          <div className="space-y-2">
            <label
              htmlFor="contraindications"
              className="block text-sm font-medium text-blue-800"
            >
              Chống chỉ định y tế (nếu có)
            </label>
            <div className="relative">
              <FiAlertCircle className="absolute left-3 top-3 text-blue-500" />
              <input
                id="contraindications"
                type="text"
                name="contraindications"
                placeholder="Ví dụ: dị ứng, bệnh mãn tính, các lưu ý đặc biệt về sức khỏe"
                value={childData.contraindications}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Thông tin này sẽ được sử dụng để đảm bảo an toàn trong quá trình
              chăm sóc y tế.
            </p>
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-md transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            } text-white font-medium shadow-md mt-6`}
          >
            {loading ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FiPlus className="w-5 h-5" />
                Tạo Hồ Sơ Sức Khỏe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChild;
