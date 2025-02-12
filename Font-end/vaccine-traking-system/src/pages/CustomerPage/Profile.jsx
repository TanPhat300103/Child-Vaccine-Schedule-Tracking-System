// src/pages/CustomerPage/Profile.jsx
import React from "react";

const Profile = () => {
  // Dummy data, thay thế bằng dữ liệu thật từ backend khi có.
  const dummyProfile = {
    fullname: "Nguyễn Văn A",
    gender: "Nam",
    dateOfBirth: "01/01/1990",
    email: "nguyenvana@example.com",
    phone: "0123-456-789",
    address: "123 Đường ABC, Quận XYZ, TP.HCM"
  };

  return (
    <div className="profile">
      <h2>Hồ Sơ Cá Nhân</h2>
      <table>
        <tbody>
          <tr>
            <td>Họ và tên:</td>
            <td>{dummyProfile.fullname}</td>
            <td>
              <button>Edit</button>
              {/* TODO: Kết nối API cập nhật hồ sơ */}
            </td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{dummyProfile.gender}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
          <tr>
            <td>Ngày sinh:</td>
            <td>{dummyProfile.dateOfBirth}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{dummyProfile.email}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td>{dummyProfile.phone}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{dummyProfile.address}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
