import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AddChild = ({ customerId, refreshChildren }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Chuẩn bị dữ liệu gửi đi theo đúng định dạng API của bạn
      const payload = {
        ...childData,
        // Thêm customerId vào payload theo cấu trúc API
        customerId: customerId,
      };
      // Gửi request đến API endpoint
      const { success, message } = await createChild(childData);

      if (success) {
        // Reset form sau khi thêm thành công
        setChildData({
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          contraindications: "",
          active: true,
        });

        // Hiển thị thông báo thành công
        alert(message);

        // Gọi function refresh danh sách trẻ em
        if (refreshChildren) refreshChildren();
      } else {
        // Hiển thị thông báo lỗi
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Thêm Hồ Sơ Trẻ Em</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Họ và tên đệm
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="Nhập họ và tên đệm"
            required
            value={childData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Nhập tên"
            required
            value={childData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới tính
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                required
                checked={childData.gender === "male"}
                onChange={handleChange}
                className="mr-2"
              />
              Nam
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                required
                checked={childData.gender === "female"}
                onChange={handleChange}
                className="mr-2"
              />
              Nữ
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ngày sinh
          </label>
          <input
            id="dob"
            type="date"
            name="dob"
            required
            value={childData.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="contraindications"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chống chỉ định (nếu có)
          </label>
          <input
            id="contraindications"
            type="text"
            name="contraindications"
            placeholder="Nhập các chống chỉ định nếu có"
            value={childData.contraindications}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white rounded-md transition-colors uppercase font-bold`}
        >
          {loading ? "Đang xử lý..." : "Thêm Hồ Sơ Trẻ Em"}
        </button>
      </form>
    </div>
  );
};

export default AddChild;
