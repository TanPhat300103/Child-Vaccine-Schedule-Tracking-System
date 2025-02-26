// src/pages/Dashboard/StaffDashboard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const StaffDashboard = () => {
  const staffId = 1;
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
    roleId: 2,
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách staff (GET /staff)
  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/staff/findby?id=${staffId}`);
      setStaffs(response.data);
      setError("");
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

  // Tạo mới Staff (POST /staff/create)
  const handleCreate = async () => {
    try {
      await axios.post(`${apiUrl}/staff/create`, formData);
      alert("Staff created successfully!");
      fetchStaffs();
      setFormData({
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
    } catch (err) {
      console.error("Error creating staff:", err);
      alert("Error creating staff");
    }
  };

  // Cập nhật Staff (POST /staff/update)
  const handleUpdate = async () => {
    try {
      await axios.post(`${apiUrl}/staff/update`, formData);
      alert("Staff updated successfully!");
      fetchStaffs();
      setSelectedStaff(null);
    } catch (err) {
      console.error("Error updating staff:", err);
      alert("Error updating staff");
    }
  };

  // Xoá Staff (DELETE /staff/delete?id=...)
  const handleDelete = async (staffId) => {
    if (window.confirm("Are you sure to delete this staff?")) {
      try {
        await axios.delete(`${apiUrl}/staff/delete`, {
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

  // Tìm Staff theo id (GET /staff/findid?id=...)
  const handleFindById = async (staffId) => {
    try {
      const response = await axios.get(`${apiUrl}/staff/findid`, {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Staff Dashboard (Admin Only)
      </h2>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Form CRUD */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">
          {selectedStaff ? "Update Staff" : "Create Staff"}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            className="border rounded p-2"
            type="text"
            name="staffId"
            placeholder="Staff ID"
            value={formData.staffId}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="email"
            name="mail"
            placeholder="Email"
            value={formData.mail}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="border rounded p-2"
            type="number"
            name="roleId"
            placeholder="Role ID"
            value={formData.roleId}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between mt-4">
          {selectedStaff ? (
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={handleUpdate}
            >
              Update Staff
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleCreate}
            >
              Create Staff
            </button>
          )}
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            onClick={() => {
              setSelectedStaff(null);
              setFormData({
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
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Danh sách Staff */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-2 text-center">
          List of Staff
        </h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Staff ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Active</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {staffs.map((staff) => (
              <tr
                key={staff.staffId}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {staff.staffId}
                </td>
                <td className="py-3 px-6 text-left">
                  {staff.firstName} {staff.lastName}
                </td>
                <td className="py-3 px-6 text-left">{staff.phone}</td>
                <td className="py-3 px-6 text-left">{staff.mail}</td>
                <td className="py-3 px-6 text-left">
                  {staff.active ? "Yes" : "No"}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                    onClick={() => handleFindById(staff.staffId)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(staff.staffId)}
                  >
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
