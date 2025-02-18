// src/pages/Customer/AddChild.jsx
import React, { useState } from "react";

// Lấy base API từ .env nếu cần
const apiUrl = import.meta.env.VITE_API_URL;

const AddChild = () => {
  const [childData, setChildData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gọi API tạo mới trẻ em có thể được thêm tại đây
    alert("Đã thêm trẻ em: " + childData.firstName + " " + childData.lastName);
    setChildData({
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Thêm Hồ Sơ Trẻ Em</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="Họ và tên đệm"
          required
          value={childData.firstName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Tên"
          required
          value={childData.lastName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
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
        <input
          type="date"
          name="dob"
          required
          value={childData.dob}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors uppercase font-bold"
        >
          Thêm Hồ Sơ Trẻ Em
        </button>
      </form>
    </div>
  );
};

export default AddChild;
