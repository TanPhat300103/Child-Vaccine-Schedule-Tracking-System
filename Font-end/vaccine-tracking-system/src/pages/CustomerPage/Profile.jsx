// src/pages/Customer/Profile.jsx
import React, { useEffect, useState } from "react";
import { getCustomerById } from "../../api/api"; // điều chỉnh đường dẫn cho đúng
import "./CustomerPage.css";

const Profile = () => {
  // Giả sử customerId được lấy từ context hoặc một nguồn nào đó; hiện tại hardcode "123"
  const customerId = "123";
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCustomerById(customerId);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching customer profile:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [customerId]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile.</div>;
  if (!profile) return <div>No profile data available.</div>;

  return (
    <div className="profile">
      <h2>Hồ Sơ Cá Nhân</h2>
      <table className="profile-table">
        <tbody>
          <tr>
            <td>Họ và tên:</td>
            <td>
              {profile.firstName} {profile.lastName}
            </td>
            <td>
              <button onClick={() => alert("Chức năng chỉnh sửa hồ sơ - TODO")}>
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td>Giới tính:</td>
            <td>{profile.gender ? "Nam" : "Nữ"}</td>
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
            <td>{new Date(profile.dob).toLocaleDateString()}</td>
            <td>
              <button
                onClick={() => alert("Chức năng chỉnh sửa ngày sinh - TODO")}
              >
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{profile.email}</td>
            <td>
              <button onClick={() => alert("Chức năng chỉnh sửa email - TODO")}>
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td>Số điện thoại:</td>
            <td>{profile.phoneNumber}</td>
            <td>
              <button
                onClick={() =>
                  alert("Chức năng chỉnh sửa số điện thoại - TODO")
                }
              >
                Edit
              </button>
            </td>
          </tr>
          <tr>
            <td>Địa chỉ:</td>
            <td>{profile.address}</td>
            <td>
              <button
                onClick={() => alert("Chức năng chỉnh sửa địa chỉ - TODO")}
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
