import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/CustomerDetailPage.css";

function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchCustomerDetail = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/customer/findid?id=${id}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching customer detail - Status: ${response.status}`
        );
      }
      const data = await response.json();
      setCustomer(data);
      setIsAnimating(true);
    } catch (err) {
      setError(err);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/child/findbycustomer?id=${id}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching children - Status: ${response.status}`);
      }
      const data = await response.json();
      setChildrenList(data);
      setIsAnimating(true);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchCustomerDetail(), fetchChildren()]); // Gọi đồng thời 2 API
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error: {error.message}</p>;

  const toggleChildDetail = (childId) => {
    setIsAnimating(true);
    setExpandedChildId((prev) => (prev === childId ? null : childId));
  };

  return (
    <div className={`healthcare-container ${isAnimating ? "animate" : ""}`}>
      <header className="healthcare-header">
        <h1 className="header-title">Patient Profile</h1>
      </header>

      <div className="healthcare-content">
        <div className={`profile-section ${isAnimating ? "animate-in" : ""}`}>
          <div className="profile-card">
            <div className="avatar-section">
              <img
                src="https://avatars.githubusercontent.com/u/151855105?s=400&u=f3cf17c85ef8012beb3894ab9c2f9b12abaf3509&v=4"
                alt="Patient Avatar"
                className="profile-avatar"
              />
              {customer && (
                <div className="profile-info">
                  <h2 className="profile-name">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="profile-contact">
                    <span className="icon email">📧</span> {customer.email}
                  </p>
                  <p className="profile-contact">
                    <span className="icon phone">📞</span>{" "}
                    {customer.phoneNumber}
                  </p>
                </div>
              )}
            </div>
            {customer && (
              <div className="profile-details">
                <p>
                  <span className="icon id">🆔</span> <strong>ID:</strong>{" "}
                  {customer.customerId}
                </p>
                <p>
                  <span className="icon gender">♂️</span>{" "}
                  <strong>Gender:</strong> {customer.gender ? "Male" : "Female"}
                </p>
                <p>
                  <span className="icon dob">📅</span> <strong>DOB:</strong>{" "}
                  {new Date(customer.dob).toLocaleDateString()}
                </p>
                <p>
                  <span className="icon active">✅</span>{" "}
                  <strong>Active:</strong> {customer.active ? "Yes" : "No"}
                </p>
                {customer.address && (
                  <p>
                    <span className="icon location">📍</span>{" "}
                    <strong>Address:</strong> {customer.address}
                  </p>
                )}
                {customer.banking && (
                  <p>
                    <span className="icon bank">💳</span>{" "}
                    <strong>Banking:</strong> {customer.banking}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`children-section ${isAnimating ? "animate-in" : ""}`}>
          <h2 className="children-title">Child</h2>
          {childrenList.length === 0 ? (
            <p className="no-child">No dependent data available.</p>
          ) : (
            <div className="children-grid">
              {childrenList.map((child) => {
                const isExpanded = child.childId === expandedChildId;
                return (
                  <div
                    key={child.childId}
                    className={`child-card ${isExpanded ? "expanded" : ""} ${
                      isAnimating ? "animate-in" : ""
                    }`}
                    onClick={() => toggleChildDetail(child.childId)}
                  >
                    <div className="child-header">
                      <h3 className="child-name">
                        <span className="icon child">👶</span> {child.firstName}{" "}
                        {child.lastName}
                      </h3>
                      <p className="child-dob">
                        <span className="icon dob">📅</span>{" "}
                        {new Date(child.dob).toLocaleDateString()}
                      </p>
                    </div>
                    {isExpanded && (
                      <div className="child-details">
                        <p>
                          <span className="icon id">🆔</span>{" "}
                          <strong>ID:</strong> {child.childId}
                        </p>
                        <p>
                          <span className="icon gender">♂️</span>{" "}
                          <strong>Gender:</strong>{" "}
                          {child.gender ? "Male" : "Female"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailPage;
