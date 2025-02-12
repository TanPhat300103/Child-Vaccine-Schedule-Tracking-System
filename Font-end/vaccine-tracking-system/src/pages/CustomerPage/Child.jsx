// src/pages/Customer/Child.jsx
import React, { useEffect, useState } from "react";
import { getChildById } from "../../api/api"; // điều chỉnh đường dẫn cho đúng
import "./CustomerPage.css"; // hoặc sử dụng file CSS riêng cho Child nếu cần

const Child = () => {
  // Giả sử childId được lấy từ context hoặc params; hardcode "child123" cho ví dụ
  const childId = "child123";
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const data = await getChildById(childId);
        setChild(data);
      } catch (err) {
        console.error("Error fetching child profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChild();
  }, [childId]);

  if (loading) return <div>Loading child profile...</div>;
  if (error) return <div>Error loading child profile.</div>;
  if (!child) return <div>No child data available.</div>;

  return (
    <div className="child-profile">
      <h2>Hồ Sơ Trẻ Em</h2>
      <table className="child-table">
        <tbody>
          <tr>
            <td>Họ và tên:</td>
            <td>
              {child.firstName} {child.lastName}
            </td>
            <td>
              <button
                onClick={() => alert("Chức năng chỉnh sửa hồ sơ trẻ - TODO")}
              >
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{child.gender ? "Nam" : "Nữ"}</td>
            <td>
              <button
                onClick={() => alert("Chức năng chỉnh sửa giới tính - TODO")}
              >
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td>{new Date(child.dob).toLocaleDateString()}</td>
            <td>
              <button
                onClick={() => alert("Chức năng chỉnh sửa ngày sinh - TODO")}
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Vaccine đã tiêm</h3>
      <table className="vaccination-table">
        <thead>
          <tr>
            <th>Mũi</th>
            <th>Ngày tiêm</th>
            <th>Vaccine</th>
          </tr>
        </thead>
        <tbody>
          {child.vaccinations &&
            child.vaccinations.map((item, index) => (
              <tr key={index}>
                <td>{item.dose}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.vaccine}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Child;
