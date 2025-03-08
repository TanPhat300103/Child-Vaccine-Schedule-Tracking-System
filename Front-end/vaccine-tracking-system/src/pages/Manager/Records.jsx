import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { getMedicalHistory, updateReaction } from "../../apis/api";
import { FiSearch, FiCalendar, FiFilter, FiEdit, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search
  const [searchMethod, setSearchMethod] = useState("id");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // State for reaction filter
  const [reactionFilter, setReactionFilter] = useState("all");

  // Modal for editing reaction
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editedReaction, setEditedReaction] = useState("");

  // Fetch Medical History
  const fetchRecords = async () => {
    try {
      const data = await getMedicalHistory();
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

  // Apply filters
  useEffect(() => {
    let filtered = records;

    // Filter by reaction
    if (reactionFilter === "hasReaction") {
      filtered = filtered.filter((rec) => rec.reaction);
    } else if (reactionFilter === "noReaction") {
      filtered = filtered.filter((rec) => !rec.reaction);
    }

    // Filter by search
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

  // Dropdown options for search method
  const searchOptions = [
    { key: "id", label: "ID", icon: <FiSearch /> },
    { key: "vaccine", label: "Vaccine", icon: <FiFilter /> },
    { key: "reaction", label: "Reaction", icon: <FiFilter /> },
    { key: "ngay", label: "Date", icon: <FiCalendar /> },
  ];

  // Open modal on card click
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

  // Save reaction changes
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

  // Status badge for reaction
  const ReactionBadge = ({ reaction }) => {
    if (!reaction) {
      return (
        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
          None
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
        Has Reaction
      </span>
    );
  };

  // Skeleton loader for loading state
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 border rounded-lg shadow-sm animate-pulse h-24"
        >
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  // Render each report card (horizontal)
  const renderRecordCard = (record) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      key={record.medicalHistoryId}
      className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between"
      onClick={() => openModal(record)}
    >
      <div className="flex-1">
        <h3 className="text-lg font-bold text-teal-700 mb-1">
          {record.child.firstName} {record.child.lastName}
        </h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Parent:</span>{" "}
          {record.child.customer.firstName} {record.child.customer.lastName}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Vaccine:</span>{" "}
          {record.vaccine.name}
        </p>
      </div>
      <div className="flex-shrink-0">
        <ReactionBadge reaction={record.reaction} />
      </div>
    </motion.div>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
        <p className="flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
        </p>
      </div>
    );

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Reaction Reports
        </h2>
        <p className="text-gray-500">
          Manage and track post-vaccination reactions
        </p>
      </header>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Reaction Filter */}
          <div className="mb-4 md:mb-0 flex space-x-2">
            <button
              onClick={() => setReactionFilter("all")}
              className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                reactionFilter === "all"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setReactionFilter("hasReaction")}
              className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                reactionFilter === "hasReaction"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-200 text-amber-800 hover:bg-amber-300"
              }`}
            >
              Has Reaction
            </button>
            <button
              onClick={() => setReactionFilter("noReaction")}
              className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                reactionFilter === "noReaction"
                  ? "bg-green-600 text-white"
                  : "bg-green-200 text-green-800 hover:bg-green-300"
              }`}
            >
              No Reaction
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {searchMethod !== "ngay" ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search by ${
                      searchOptions.find((opt) => opt.key === searchMethod)
                        ?.label || ""
                    }...`}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  <span className="absolute left-3 top-3.5 text-gray-400">
                    <FiSearch size={18} />
                  </span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <FiCalendar size={18} />
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    />
                    <span className="absolute left-3 top-3.5 text-gray-400">
                      <FiCalendar size={18} />
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full md:w-48">
              <select
                value={searchMethod}
                onChange={(e) => {
                  setSearchMethod(e.target.value);
                  setSearchText("");
                  setFromDate("");
                  setToDate("");
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                {searchOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reaction Reports List */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map((record) => renderRecordCard(record))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FiSearch size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">
            No reaction reports match your criteria.
          </p>
        </div>
      )}

      {/* Modal for editing reaction */}
      <AnimatePresence>
        {modalVisible && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors duration-200"
              >
                <FiX size={18} />
              </button>

              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Report Details
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-teal-700 text-lg mb-1">
                      {selectedRecord.child.firstName}{" "}
                      {selectedRecord.child.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Parent:</span>{" "}
                      {selectedRecord.child.customer.firstName}{" "}
                      {selectedRecord.child.customer.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Vaccine:</span>{" "}
                      {selectedRecord.vaccine.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Vaccination Date:</span>{" "}
                      {format(new Date(selectedRecord.date), "dd/MM/yyyy")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Reaction:</span>{" "}
                      {selectedRecord.reaction || "No reaction recorded"}
                    </p>
                    <textarea
                      value={editedReaction}
                      onChange={(e) => setEditedReaction(e.target.value)}
                      rows="2"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Update reaction..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReaction}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;