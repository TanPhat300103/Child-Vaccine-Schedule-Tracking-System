// src/pages/Customer/Child.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { getChild, updateChild, deleteChild } from "../../apis/api"; // Đảm bảo import các API

const Child = () => {
  const { childId } = useParams();
  const location = useLocation();
  const customerId = location.state?.customerId;

  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    console.log("Received customerId in Child:", customerId);
  }, [customerId]);
  const fetchChild = async () => {
    try {
      const data = await getChild(childId);
      setChild(data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu trẻ:", err);
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
      const response = await updateChild({
        ...child,
        ...editData,
        customer: {
          customerId: customerId,
        },
      });

      if (response.success) {
        alert("Cập nhật thành công!");
        setEditing(false);
        fetchChild();
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trẻ:", err);
      alert("Lỗi cập nhật trẻ");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ trẻ này không?")) {
      try {
        const response = await deleteChild(child.childId);
        if (response.success) {
          alert("Xóa thành công!");
          navigate("/customer");
        } else {
          alert(response.message);
        }
      } catch (err) {
        console.error("Lỗi xóa trẻ:", err);
        alert("Lỗi xóa trẻ");
      }
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
          {/* Không hiển thị mã trẻ theo yêu cầu */}
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
              {editing ? (
                <input
                  type="date"
                  name="dob"
                  defaultValue={child.dob.split("T")[0]}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1"
                />
              ) : (
                format(new Date(child.dob), "dd/MM/yyyy")
              )}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">Giới tính</td>
            <td className="py-3 px-6 text-left">
              {editing ? (
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="true"
                      checked={
                        editData.gender
                          ? editData.gender === "true"
                          : child.gender === true
                      }
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    Nam
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="false"
                      checked={
                        editData.gender
                          ? editData.gender === "false"
                          : child.gender === false
                      }
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    Nữ
                  </label>
                </div>
              ) : child.gender ? (
                "Nam"
              ) : (
                "Nữ"
              )}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">Chống chỉ định</td>
            <td className="py-3 px-6 text-left">
              {editing ? (
                <input
                  type="text"
                  name="contraindications"
                  defaultValue={child.contraindications}
                  onChange={handleEditChange}
                  className="border rounded px-2 py-1"
                />
              ) : (
                child.contraindications
              )}
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
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setEditing(true);
              setEditData({
                firstName: child.firstName,
                lastName: child.lastName,
                dob: child.dob.split("T")[0],
                gender: String(child.gender),
                contraindications: child.contraindications,
              });
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Xóa
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
