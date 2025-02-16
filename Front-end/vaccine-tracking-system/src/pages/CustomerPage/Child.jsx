// src/pages/Dashboard/ChildDashboard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";

const API_BASE_URL =
  "https://5e98cacd-7394-4c32-8519-999883e59df3.mock.pstmn.io";

const ChildDashboard = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [formData, setFormData] = useState({
    childId: "",
    firstName: "",
    lastName: "",
    gender: true,
    dob: "",
    contraindications: "",
    active: true,
    // Chỉ sử dụng customerId cho ví dụ
    customer: { customerId: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET /child: Lấy danh sách Child
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/child`);
      setChildren(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching children:", err);
      setError("Error fetching children");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // POST /child/create: Tạo mới Child
  const handleCreate = async () => {
    try {
      await axios.post(`${API_BASE_URL}/child/create`, formData);
      alert("Child created successfully!");
      fetchChildren();
      setFormData({
        childId: "",
        firstName: "",
        lastName: "",
        gender: true,
        dob: "",
        contraindications: "",
        active: true,
        customer: { customerId: "" },
      });
    } catch (err) {
      console.error("Error creating child:", err);
      alert("Error creating child");
    }
  };

  // POST /child/update: Cập nhật Child
  const handleUpdate = async () => {
    try {
      await axios.post(`${API_BASE_URL}/child/update`, formData);
      alert("Child updated successfully!");
      fetchChildren();
      setSelectedChild(null);
    } catch (err) {
      console.error("Error updating child:", err);
      alert("Error updating child");
    }
  };

  // DELETE /child/delete?id=...: Xoá Child
  const handleDelete = async (childId) => {
    if (window.confirm("Are you sure to delete this child?")) {
      try {
        await axios.delete(`${API_BASE_URL}/child/delete`, {
          params: { id: childId },
        });
        alert("Child deleted successfully!");
        fetchChildren();
      } catch (err) {
        console.error("Error deleting child:", err);
        alert("Error deleting child");
      }
    }
  };

  // GET /child/findid?id=...: Lấy Child theo id
  const handleFindById = async (childId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/child/findid`, {
        params: { id: childId },
      });
      setSelectedChild(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Error fetching child by id:", err);
      alert("Error fetching child by id");
    }
  };

  // GET /child/findbycustomer?id=...: Lấy danh sách Child theo customer id
  const handleFindByCustomer = async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/child/findbycustomer`, {
        params: { id: customerId },
      });
      setChildren(response.data);
    } catch (err) {
      console.error("Error fetching children by customer id:", err);
      alert("Error fetching children by customer id");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6">Child Dashboard</h2>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Form CRUD */}
      <div className="bg-white shadow rounded p-6 max-w-xl mx-auto mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {selectedChild ? "Update Child" : "Create Child"}
        </h3>
        <div className="space-y-4">
          <input
            className="w-full border rounded p-2"
            type="text"
            name="childId"
            placeholder="Child ID"
            value={formData.childId}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded p-2"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded p-2"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded p-2"
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded p-2"
            type="text"
            name="contraindications"
            placeholder="Contraindications"
            value={formData.contraindications}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded p-2"
            type="text"
            name="customer"
            placeholder="Customer ID"
            value={formData.customer.customerId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer: { customerId: e.target.value },
              }))
            }
          />
        </div>
        <div className="flex justify-between mt-6">
          {selectedChild ? (
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={handleUpdate}
            >
              Update Child
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleCreate}
            >
              Create Child
            </button>
          )}
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            onClick={() =>
              setSelectedChild(null) ||
              setFormData({
                childId: "",
                firstName: "",
                lastName: "",
                gender: true,
                dob: "",
                contraindications: "",
                active: true,
                customer: { customerId: "" },
              })
            }
          >
            Clear
          </button>
        </div>
      </div>

      {/* Danh sách Child */}
      <div className="max-w-4xl mx-auto bg-white shadow rounded overflow-x-auto">
        <h3 className="text-xl font-semibold text-center py-4 border-b">
          List of Children
        </h3>
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Child ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">DOB</th>
              <th className="py-3 px-4 text-left">Active</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {children.map((child) => (
              <tr key={child.childId} className="hover:bg-gray-50">
                <td className="py-3 px-4">{child.childId}</td>
                <td className="py-3 px-4">
                  {child.firstName} {child.lastName}
                </td>
                <td className="py-3 px-4">
                  {new Date(child.dob).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">{child.active ? "Yes" : "No"}</td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    onClick={() => handleFindById(child.childId)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleDelete(child.childId)}
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

export default ChildDashboard;
