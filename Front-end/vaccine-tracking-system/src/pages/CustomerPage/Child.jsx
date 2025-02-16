// src/pages/Dashboard/ChildDashboard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";

// Đặt baseURL cho axios
const API_BASE_URL = "http://localhost:8080";

const Child = () => {
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
    // customer có thể là một object; ở đây ta chỉ dùng customerId làm ví dụ
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

  // Hàm xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // POST /child/create: Tạo mới Child
  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/child/create`,
        formData
      );
      alert("Child created successfully!");
      fetchChildren();
    } catch (err) {
      console.error("Error creating child:", err);
      alert("Error creating child");
    }
  };

  // POST /child/update: Cập nhật Child
  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/child/update`,
        formData
      );
      alert("Child updated successfully!");
      fetchChildren();
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
    <div className="child-dashboard">
      <h2>Child Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form CRUD */}
      <div className="child-form">
        <h3>{selectedChild ? "Update Child" : "Create Child"}</h3>
        <input
          type="text"
          name="childId"
          placeholder="Child ID"
          value={formData.childId}
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
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contraindications"
          placeholder="Contraindications"
          value={formData.contraindications}
          onChange={handleChange}
        />
        <input
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
        <div>
          {selectedChild ? (
            <button onClick={handleUpdate}>Update Child</button>
          ) : (
            <button onClick={handleCreate}>Create Child</button>
          )}
          <button onClick={() => setSelectedChild(null)}>Clear</button>
        </div>
      </div>

      {/* Danh sách Child */}
      <div className="child-list">
        <h3>List of Children</h3>
        <table>
          <thead>
            <tr>
              <th>Child ID</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.childId}>
                <td>{child.childId}</td>
                <td>
                  {child.firstName} {child.lastName}
                </td>
                <td>{new Date(child.dob).toLocaleDateString()}</td>
                <td>{child.active ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleFindById(child.childId)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(child.childId)}>
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

export default Child;
