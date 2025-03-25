import React, { useEffect, useState } from "react";
import "../style/CustomerTable.css";
import { useNavigate } from "react-router-dom";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: false,
    password: "",
    address: "",
    banking: "",
    email: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKey, setFilterKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchCustomers = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/customer`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleStatus = (customerId) => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/customer/inactive?id=${customerId}`,
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json", // Bỏ qua warning page
        },
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update status");
        return response.json();
      })
      .then(() => {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.customerId === customerId
              ? { ...customer, active: !customer.active }
              : customer
          )
        );
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };

  const openUpdateModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      phoneNumber: customer.phoneNumber || "",
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      dob: customer.dob || "",
      gender: customer.gender || false,
      password: customer.password || "",
      address: customer.address || "",
      banking: customer.banking || "",
      email: customer.email || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/customer/update`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json", // Bỏ qua warning page
      },
      credentials: "include",

      body: JSON.stringify({ ...selectedCustomer, ...formData }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update customer");
        return response.json();
      })
      .then(() => {
        fetchCustomers();
        closeModal();
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };

  const filteredCustomers = customers.filter((customer) => {
    const fullName = (
      customer.firstName +
      " " +
      customer.lastName
    ).toLowerCase();
    const email = (customer.email || "").toLowerCase();
    const phone = (customer.phoneNumber || "").toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase())
    );
  });

  const compareDate = (a, b) => {
    const dateA = a ? new Date(a).getTime() : 0;
    const dateB = b ? new Date(b).getTime() : 0;
    return dateA - dateB;
  };

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (filterKey === "id") {
      return sortOrder === "asc"
        ? a.customerId.localeCompare(b.customerId)
        : b.customerId.localeCompare(a.customerId);
    } else {
      return sortOrder === "asc"
        ? compareDate(a.dob, b.dob)
        : compareDate(b.dob, a.dob);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleCardClick = (e, customerId) => {
    const target = e.target;
    if (
      target.closest(".switch-customer") ||
      target.closest(".btn-update-customer")
    ) {
      return;
    }
    navigate(`/customer/detail/${customerId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="page-container-customer">
      <div className="header-customer">
        <h1>Customer Management</h1>
      </div>

      <div className="filter-container-customer">
        <div className="filter-left-customer">
          <label htmlFor="sortKey">Sort By</label>
          <select
            id="sortKey"
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="dob">DOB</option>
          </select>
        </div>
        <div className="search-center-customer">
          <input
            type="text"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="icon-right-customer">
          <button className="btn-sort-customer" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? (
              <i className="fa-solid fa-arrow-up"></i>
            ) : (
              <i className="fa-solid fa-arrow-down"></i>
            )}
          </button>
        </div>
      </div>

      <div className="customer-grid-customer">
        {sortedCustomers.map((customer) => (
          <div
            key={customer.customerId}
            className="customer-card-customer"
            onClick={(e) => handleCardClick(e, customer.customerId)}
          >
            <div className="card-header-customer">
              <h3>
                {customer.firstName} {customer.lastName}
              </h3>
              <span
                className={`gender-icon-customer ${
                  customer.gender ? "male-customer" : "female-customer"
                }`}
              >
                {customer.gender ? (
                  <i className="fa-solid fa-mars"></i>
                ) : (
                  <i className="fa-solid fa-venus"></i>
                )}
              </span>
            </div>
            <div className="card-body-customer">
              <p>
                <i className="fa-solid fa-phone"></i> {customer.phoneNumber}
              </p>
              <p>
                <i className="fa-solid fa-envelope"></i> {customer.email}
              </p>
              <p>
                <i className="fa-solid fa-calendar"></i> {customer.dob}
              </p>
            </div>
            <div className="card-footer-customer">
              <label className="switch-customer">
                <input
                  type="checkbox"
                  checked={customer.active}
                  onChange={() => toggleStatus(customer.customerId)}
                />
                <span className="slider-customer"></span>
              </label>
              <button
                className="btn-update-customer"
                onClick={(e) => {
                  e.stopPropagation();
                  openUpdateModal(customer);
                }}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay-customer">
          <div className="modal-update-customer">
            <div className="modal-header-customer">
              <h3>Update Customer</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group-customer">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-customer">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-customer">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-customer">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-customer">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gender: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Male</option>
                  <option value="false">Female</option>
                </select>
              </div>
              <div className="form-group-customer">
                <label>Password</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-customer full-width-customer">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-customer full-width-customer">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-customer full-width-customer">
                <label>Banking</label>
                <input
                  type="text"
                  name="banking"
                  value={formData.banking}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-actions-customer">
                <button
                  type="button"
                  className="btn-cancel-customer"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-customer">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerTable;
