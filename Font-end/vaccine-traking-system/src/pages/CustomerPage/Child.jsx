// src/pages/CustomerPage/Child.jsx
import React from "react";

const Child = () => {
  // Dummy data, thay thế bằng dữ liệu thật từ backend khi có.
  const dummyChild = {
    fullname: "Trần Thị B",
    gender: "Nữ",
    dateOfBirth: "05/05/2015",
    vaccinations: [
      { dose: "Mũi 1", date: "10/10/2020", vaccine: "Vaccine A" },
      { dose: "Mũi 2", date: "10/10/2021", vaccine: "Vaccine B" }
    ]
  };

  return (
    <div className="child-profile">
      <h2>Hồ Sơ Trẻ Em</h2>
      <table>
        <tbody>
          <tr>
            <td>Họ và tên:</td>
            <td>{dummyChild.fullname}</td>
            <td>
              <button>Edit</button>
              {/* TODO: API cập nhật thông tin con */}
            </td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{dummyChild.gender}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td>{dummyChild.dateOfBirth}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Vaccine đã tiêm</h3>
      <table>
        <thead>
          <tr>
            <th>Mũi</th>
            <th>Ngày tiêm</th>
            <th>Vaccine</th>
          </tr>
        </thead>
        <tbody>
          {dummyChild.vaccinations.map((item, index) => (
            <tr key={index}>
              <td>{item.dose}</td>
              <td>{item.date}</td>
              <td>{item.vaccine}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Child;
