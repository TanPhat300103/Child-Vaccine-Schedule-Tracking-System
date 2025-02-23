// src/pages/Customer/Child.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Child = () => {
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchChild = async () => {
    try {
      const response = await axios.get(`${apiUrl}/child/findid`, {
        params: { id: childId },
      });
      setChild(response.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu trẻ:", err);
    }
  };

  useEffect(() => {
    fetchChild();
  }, [childId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Sử dụng PUT để cập nhật trẻ
      await axios.put(`${apiUrl}/child/update`, {
        ...child,
        ...editData,
      });
      alert("Cập nhật thành công!");
      setEditing(false);
      fetchChild();
    } catch (err) {
      console.error("Lỗi cập nhật trẻ:", err);
      alert("Lỗi cập nhật trẻ");
    }
  };

  if (!child) return <p>Đang tải dữ liệu trẻ em...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Hồ Sơ Tiêm Chủng Trẻ Em
      </h2>
      <table className="min-w-full bg-white border mb-4">
        <tbody className="text-gray-600 text-sm font-light">
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">Mã trẻ</td>
            <td className="py-3 px-6 text-left">{child.childId}</td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">Họ và tên</td>
            <td className="py-3 px-6 text-left">
              {editing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={child.firstName}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1 mr-2"
                  />
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={child.lastName}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                </>
              ) : (
                `${child.firstName} ${child.lastName}`
              )}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">Ngày sinh</td>
            <td className="py-3 px-6 text-left">
              {format(new Date(child.dob), "dd/MM/yyyy")}
            </td>
          </tr>
        </tbody>
      </table>

      {editing ? (
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Lưu
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Hủy
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setEditing(true);
              setEditData({
                firstName: child.firstName,
                lastName: child.lastName,
              });
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Chỉnh sửa
          </button>
        </div>
      )}

      {/* Bảng Vaccine Đã Tiêm */}
      <div>
        <h3 className="text-xl font-bold text-center mb-2">Vaccine Đã Tiêm</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">STT</th>
              <th className="py-3 px-6 text-left">Vaccine Đã Tiêm</th>
              <th className="py-3 px-6 text-left">Ngày tiêm</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {child.vaccinations &&
              child.vaccinations.map((vac, index) => (
                <tr
                  key={vac.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6 text-left">{vac.vaccine}</td>
                  <td className="py-3 px-6 text-left">
                    {format(new Date(vac.date), "dd/MM/yyyy")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Child;
