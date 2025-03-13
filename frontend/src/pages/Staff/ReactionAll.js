import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import "../../style/ReactionAll.css";

const ReactionAll = ({ onBack }) => {
  const [reactions, setReactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/staffdashboard/get-reaction",
          { method: "GET", credentials: "include" }
        );
        if (!response.ok) throw new Error("Lỗi khi lấy báo cáo phản ứng");
        const data = await response.json();
        setReactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReactions();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReactions = reactions.filter((reaction) => {
    const term = searchTerm.toLowerCase();
    return (
      reaction.vaccine.name.toLowerCase().includes(term) ||
      reaction.child.customer.customerId.toLowerCase().includes(term) ||
      `${reaction.child.customer.firstName} ${reaction.child.customer.lastName}`
        .toLowerCase()
        .includes(term) ||
      `${reaction.child.firstName} ${reaction.child.lastName}`
        .toLowerCase()
        .includes(term) ||
      reaction.date.toLowerCase().includes(term)
    );
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading)
    return <div className="loading-reactionall">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-reactionall">{error}</div>;

  return (
    <div className="reaction-all-container-reactionall">
      <div className="reaction-all-header-reactionall">
        <button className="back-button-reactionall" onClick={onBack}>
          <FaArrowLeft /> Quay Lại
        </button>
        <h2>Báo Cáo Phản Ứng</h2>
      </div>
      <div className="search-bar-reactionall">
        <FaSearch className="search-icon-reactionall" />
        <input
          type="text"
          placeholder="Tìm theo vaccine, mã khách hàng, tên khách hàng, tên trẻ, ngày tiêm..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input-reactionall"
        />
      </div>
      <div className="reaction-list-reactionall">
        {filteredReactions.length > 0 ? (
          filteredReactions.map((reaction) => (
            <div
              key={reaction.medicalHistoryId}
              className={`reaction-card-reactionall ${
                expandedId === reaction.medicalHistoryId
                  ? "expanded-reactionall"
                  : ""
              }`}
              onClick={() => toggleExpand(reaction.medicalHistoryId)}
            >
              <div className="reaction-card-header-reactionall">
                <h3>{reaction.vaccine.name}</h3>
                <span className="reaction-date-reactionall">
                  {new Date(reaction.date).toLocaleDateString()}
                </span>
              </div>
              <p>
                <strong>Trẻ:</strong> {reaction.child.firstName}{" "}
                {reaction.child.lastName}
              </p>
              <p>
                <strong>Khách hàng:</strong> {reaction.child.customer.firstName}{" "}
                {reaction.child.customer.lastName}
              </p>
              {expandedId === reaction.medicalHistoryId && (
                <div className="reaction-details-reactionall">
                  <p>
                    <strong>Mã khách hàng:</strong>{" "}
                    {reaction.child.customer.customerId}
                  </p>
                  <p>
                    <strong>Phản ứng:</strong> {reaction.reaction || "Không có"}
                  </p>
                  <p>
                    <strong>Liều:</strong> {reaction.dose}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data-reactionall">
            Không có báo cáo phản ứng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionAll;
