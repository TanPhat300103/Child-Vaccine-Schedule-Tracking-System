// src/pages/Dashboard/StaffDashboard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8080";

const StaffDashboard = () => {
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    address: "",
    mail: "",
    password: "",
    roleId: 1,
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET /staff: Lấy danh sách staff
  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/staff`);
      setStaffs(response.data);
    } catch (err) {
      console.error("Error fetching staffs:", err);
      setError("Error fetching staffs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // POST /staff/create: Tạo mới Staff
  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/staff/create`,
        formData
      );
      alert("Staff created successfully!");
      fetchStaffs();
    } catch (err) {
      console.error("Error creating staff:", err);
      alert("Error creating staff");
    }
  };

  // POST /staff/update: Cập nhật Staff
  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/staff/update`,
        formData
      );
      alert("Staff updated successfully!");
      fetchStaffs();
    } catch (err) {
      console.error("Error updating staff:", err);
      alert("Error updating staff");
    }
  };

  // DELETE /staff/delete?id=...: Xoá Staff
  const handleDelete = async (staffId) => {
    if (window.confirm("Are you sure to delete this staff?")) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/delete`, {
          params: { id: staffId },
        });
        alert("Staff deleted successfully!");
        fetchStaffs();
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert("Error deleting staff");
      }
    }
  };

  // GET /staff/findid?id=...: Tìm Staff theo id
  const handleFindById = async (staffId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/findid`, {
        params: { id: staffId },
      });
      setSelectedStaff(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Error fetching staff by id:", err);
      alert("Error fetching staff by id");
    }
  };

  return (
    <div className="staff-dashboard">
      <h2>Staff Dashboard (Admin Only)</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form CRUD */}
      <div className="staff-form">
        <h3>{selectedStaff ? "Update Staff" : "Create Staff"}</h3>
        <input
          type="text"
          name="staffId"
          placeholder="Staff ID"
          value={formData.staffId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="email"
          name="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="number"
          name="roleId"
          placeholder="Role ID"
          value={formData.roleId}
          onChange={handleChange}
        />
        <div>
          {selectedStaff ? (
            <button onClick={handleUpdate}>Update Staff</button>
          ) : (
            <button onClick={handleCreate}>Create Staff</button>
          )}
          <button onClick={() => setSelectedStaff(null)}>Clear</button>
        </div>
      </div>

      {/* Danh sách Staff */}
      <div className="staff-list">
        <h3>List of Staff</h3>
        <table>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff) => (
              <tr key={staff.staffId}>
                <td>{staff.staffId}</td>
                <td>
                  {staff.firstName} {staff.lastName}
                </td>
                <td>{staff.phone}</td>
                <td>{staff.mail}</td>
                <td>{staff.active ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleFindById(staff.staffId)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(staff.staffId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDashboard;
