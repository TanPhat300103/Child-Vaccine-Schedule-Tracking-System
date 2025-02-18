// src/pages/Customer/AddChild.jsx
import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AddChild = ({ refreshChildren }) => {
  const [childData, setChildData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    contraindications: "",
    active: true,
    customer: { customerId: "cust001" }, // Giả sử customer hiện tại là cust001
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/child`, childData);
      alert("Thêm trẻ em thành công!");
      setChildData({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        contraindications: "",
        active: true,
        customer: { customerId: "cust001" },
      });
      if (refreshChildren) refreshChildren();
    } catch (err) {
      console.error("Lỗi thêm trẻ em:", err);
      alert("Lỗi thêm trẻ em");
    }
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
        <input
          type="text"
          name="contraindications"
          placeholder="Chống chỉ định (nếu có)"
          value={childData.contraindications}
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
