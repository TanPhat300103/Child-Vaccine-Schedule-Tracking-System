import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FiSearch, FiCalendar, FiFilter, FiEdit, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../../style/Record.css";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy lịch sử y tế bằng fetch
  const getMedicalHistoryByChildId = async (childId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/medicalhistory/findbychildid?id=${childId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include", // Tương đương với withCredentials: true trong axios
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API Response (getMedicalHistoryByChildId):", data);
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử tiêm chủng:", error);
      throw error;
    }
  };

  // Hàm cập nhật phản ứng bằng fetch
  const updateReaction = async (id, reaction) => {
    console.log("Updating reaction for ID:", id, "and:", reaction);
    try {
      const response = await fetch(
        `http://localhost:8080/medicalhistory/updatereaction?id=${id}&reaction=${encodeURIComponent(
          reaction
        )}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include", // Tương đương với withCredentials: true trong axios
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API Response (updateReaction):", data);
      return data;
    } catch (error) {
      console.error("Lỗi khi cập nhật phản ứng:", error);
      throw error;
    }
  };

  const [searchMethod, setSearchMethod] = useState("id");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reactionFilter, setReactionFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editedReaction, setEditedReaction] = useState("");

  // Hàm fetch records (giả sử getMedicalHistory là hàm tổng quát)
  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/medicalhistory`, // Giả sử đây là endpoint tổng quát
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await response.json();
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error("Error fetching reaction reports:", err);
      setError("Failed to fetch reaction reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    let filtered = records;

    if (reactionFilter === "hasReaction") {
      filtered = filtered.filter((rec) => rec.reaction);
    } else if (reactionFilter === "noReaction") {
      filtered = filtered.filter((rec) => !rec.reaction);
    }

    if (searchMethod === "ngay") {
      if (fromDate) {
        const start = new Date(fromDate);
        filtered = filtered.filter((rec) => new Date(rec.date) >= start);
      }
      if (toDate) {
        const end = new Date(toDate);
        filtered = filtered.filter((rec) => new Date(rec.date) <= end);
      }
    } else if (searchText) {
      const lowerText = searchText.toLowerCase();
      if (searchMethod === "id") {
        filtered = filtered.filter((rec) =>
          rec.medicalHistoryId.toLowerCase().includes(lowerText)
        );
      } else if (searchMethod === "vaccine") {
        filtered = filtered.filter((rec) =>
          rec.vaccine.name.toLowerCase().includes(lowerText)
        );
      } else if (searchMethod === "reaction") {
        filtered = filtered.filter(
          (rec) =>
            rec.reaction && rec.reaction.toLowerCase().includes(lowerText)
        );
      }
    }
    setFilteredRecords(filtered);
  }, [records, searchMethod, searchText, fromDate, toDate, reactionFilter]);

  const searchOptions = [
    { key: "id", label: "ID", icon: <FiSearch /> },
    { key: "vaccine", label: "Vaccine", icon: <FiFilter /> },
    { key: "reaction", label: "Reaction", icon: <FiFilter /> },
    { key: "ngay", label: "Date", icon: <FiCalendar /> },
  ];

  const openModal = (record) => {
    setSelectedRecord(record);
    setEditedReaction(record.reaction || "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
    setEditedReaction("");
  };

  const handleSaveReaction = async () => {
    if (!selectedRecord) return;
    try {
      await updateReaction(selectedRecord.medicalHistoryId, editedReaction);
      alert("Reaction updated successfully!");
      fetchRecords();
      closeModal();
    } catch (err) {
      console.error("Error updating reaction:", err);
      alert("Update failed!");
    }
  };

  const ReactionBadge = ({ reaction }) => {
    if (!reaction) {
      return (
        <span className="reaction-badge-record reaction-badge-none-record">
          None
        </span>
      );
    }
    return (
      <span className="reaction-badge-record reaction-badge-has-reaction-record">
        Has Reaction
      </span>
    );
  };

  const SkeletonLoader = () => (
    <div className="skeleton-container-record">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-item-record"></div>
      ))}
    </div>
  );

  const renderRecordCard = (record) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      key={record.medicalHistoryId}
      className="record-card-record"
      onClick={() => openModal(record)}
    >
      <div className="record-card-content-record">
        <h3 className="record-card-title-record">
          {record.child.firstName} {record.child.lastName}
        </h3>
        <p className="record-card-text-record">
          <span className="record-card-label-record">Parent:</span>{" "}
          {record.child.customer.firstName} {record.child.customer.lastName}
        </p>
        <p className="record-card-text-record">
          <span className="record-card-label-record">Vaccine:</span>{" "}
          {record.vaccine.name}
        </p>
      </div>
      <div className="record-card-badge-record">
        <ReactionBadge reaction={record.reaction} />
      </div>
    </motion.div>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="error-container-record">
        <p className="error-text-record">⚠️ {error}</p>
      </div>
    );

  return (
    <div className="records-container-record">
      <header className="records-header-record">
        <h2 className="records-title-record">Reaction Reports</h2>
        <p className="records-subtitle-record">
          Manage and track post-vaccination reactions
        </p>
      </header>

      <div className="search-filter-container-record">
        <div className="filter-buttons-record">
          <button
            onClick={() => setReactionFilter("all")}
            className={`filter-button-record ${
              reactionFilter === "all" ? "filter-button-active-record" : ""
            }`}
          >
            All
          </button>
          <button
            onClick={() => setReactionFilter("hasReaction")}
            className={`filter-button-record ${
              reactionFilter === "hasReaction"
                ? "filter-button-has-reaction-record"
                : "filter-button-has-reaction-inactive-record"
            }`}
          >
            Has Reaction
          </button>
          <button
            onClick={() => setReactionFilter("noReaction")}
            className={`filter-button-record ${
              reactionFilter === "noReaction"
                ? "filter-button-no-reaction-record"
                : "filter-button-no-reaction-inactive-record"
            }`}
          >
            No Reaction
          </button>
        </div>

        <div className="search-container-record">
          {searchMethod !== "ngay" ? (
            <div className="search-input-wrapper-record">
              <input
                type="text"
                placeholder={`Search by ${
                  searchOptions.find((opt) => opt.key === searchMethod)
                    ?.label || ""
                }...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input-record"
              />
              <span className="search-icon-record">
                <FiSearch size={18} />
              </span>
            </div>
          ) : (
            <div className="date-input-container-record">
              <div className="date-input-wrapper-record">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="date-input-record"
                />
                <span className="date-icon-record">
                  <FiCalendar size={18} />
                </span>
              </div>
              <div className="date-input-wrapper-record">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="date-input-record"
                />
                <span className="date-icon-record">
                  <FiCalendar size={18} />
                </span>
              </div>
            </div>
          )}
          <select
            value={searchMethod}
            onChange={(e) => {
              setSearchMethod(e.target.value);
              setSearchText("");
              setFromDate("");
              setToDate("");
            }}
            className="search-select-record"
          >
            {searchOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="records-list-record">
          {filteredRecords.map((record) => renderRecordCard(record))}
        </div>
      ) : (
        <div className="no-records-container-record">
          <div className="no-records-icon-record">
            <FiSearch size={24} />
          </div>
          <p className="no-records-text-record">
            No reaction reports match your criteria.
          </p>
        </div>
      )}

      <AnimatePresence>
        {modalVisible && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay-record"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-container-record"
            >
              <button
                onClick={closeModal}
                className="modal-close-button-record"
              >
                <FiX size={18} />
              </button>
              <h3 className="modal-title-record">Report Details</h3>
              <div className="modal-content-record">
                <div>
                  <h4 className="modal-subtitle-record">
                    {selectedRecord.child.firstName}{" "}
                    {selectedRecord.child.lastName}
                  </h4>
                  <p className="modal-text-record">
                    <span className="modal-label-record">Parent:</span>{" "}
                    {selectedRecord.child.customer.firstName}{" "}
                    {selectedRecord.child.customer.lastName}
                  </p>
                </div>
                <div>
                  <p className="modal-text-record">
                    <span className="modal-label-record">Vaccine:</span>{" "}
                    {selectedRecord.vaccine.name}
                  </p>
                </div>
                <div>
                  <p className="modal-text-record">
                    <span className="modal-label-record">
                      Vaccination Date:
                    </span>{" "}
                    {format(new Date(selectedRecord.date), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="modal-text-record">
                    <span className="modal-label-record">Reaction:</span>{" "}
                    {selectedRecord.reaction || "No reaction recorded"}
                  </p>
                  <textarea
                    value={editedReaction}
                    onChange={(e) => setEditedReaction(e.target.value)}
                    rows="2"
                    className="modal-textarea-record"
                    placeholder="Update reaction..."
                  />
                </div>
              </div>
              <div className="modal-buttons-record">
                <button
                  onClick={closeModal}
                  className="modal-cancel-button-record"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReaction}
                  className="modal-save-button-record"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;
