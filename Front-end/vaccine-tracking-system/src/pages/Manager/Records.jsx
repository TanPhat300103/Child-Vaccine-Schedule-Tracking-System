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

  // State cho tìm kiếm
  const [searchMethod, setSearchMethod] = useState("id");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modal chỉnh sửa phản ứng
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editedReaction, setEditedReaction] = useState("");

  // Lấy danh sách Medical History
  const fetchRecords = async () => {
    try {
      const data = await getMedicalHistory();
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error("Lỗi khi lấy báo cáo phản ứng:", err);
      setError("Không thể lấy thông tin báo cáo phản ứng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    let filtered = records;
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
  }, [records, searchMethod, searchText, fromDate, toDate]);

  // Dropdown options cho phương thức tìm kiếm
  const searchOptions = [
    { key: "id", label: "ID", icon: <FiSearch /> },
    { key: "vaccine", label: "Vaccine", icon: <FiFilter /> },
    { key: "reaction", label: "Phản ứng", icon: <FiFilter /> },
    { key: "ngay", label: "Ngày tiêm", icon: <FiCalendar /> },
  ];

  // Mở modal khi bấm vào thẻ
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

  // Lưu thay đổi phản ứng
  const handleSaveReaction = async () => {
    if (!selectedRecord) return;
    try {
      await updateReaction(selectedRecord.medicalHistoryId, editedReaction);
      // Sử dụng toast thay vì alert cho thông báo hiện đại hơn
      // toast.success("Cập nhật phản ứng thành công!"); - có thể thêm nếu dùng thư viện toast
      alert("Cập nhật phản ứng thành công!");
      fetchRecords();
      closeModal();
    } catch (err) {
      console.error("Lỗi cập nhật phản ứng:", err);
      alert("Cập nhật thất bại!");
    }
  };

  // Status badge cho phản ứng
  const ReactionBadge = ({ reaction }) => {
    if (!reaction) {
      return (
        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
          Chưa có
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
        Có phản ứng
      </span>
    );
  };

  // Skeleton loader cho lúc đang tải
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 border rounded-lg shadow-sm animate-pulse h-48"
        >
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        </div>
      ))}
    </div>
  );

  // Render từng thẻ báo cáo
  const renderRecordCard = (record) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={record.medicalHistoryId}
      className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => openModal(record)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs text-gray-500 font-medium">ID</span>
          <h4 className="text-sm font-semibold text-gray-800">
            {record.medicalHistoryId}
          </h4>
        </div>
        <ReactionBadge reaction={record.reaction} />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-teal-700 mb-1">
          {record.child.firstName} {record.child.lastName}
        </h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phụ huynh:</span>{" "}
          {record.child.customer.firstName} {record.child.customer.lastName}
        </p>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center mr-2">
            <span className="text-teal-600 text-xs">●</span>
          </div>
          <p className="text-gray-700">
            <span className="inline-block w-16 font-medium">Vaccine:</span>
            <span className="text-teal-800">{record.vaccine.name}</span>
          </p>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
            <span className="text-indigo-600 text-xs">●</span>
          </div>
          <p className="text-gray-700">
            <span className="inline-block w-16 font-medium">Ngày:</span>
            <span>{format(new Date(record.date), "dd/MM/yyyy")}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
        <div className="flex items-start">
          <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 mr-2">
            <span className="text-amber-600 text-xs">!</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Phản ứng:</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {record.reaction || "Chưa ghi nhận phản ứng"}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <FiEdit size={14} />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Báo Cáo Phản Ứng
        </h2>
        <p className="text-gray-500">
          Quản lý và theo dõi phản ứng sau tiêm chủng
        </p>
      </header>

      {/* Khung tìm kiếm */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            {searchMethod !== "ngay" ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Tìm theo ${
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

      {/* Danh sách báo cáo phản ứng */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecords.map((record) => renderRecordCard(record))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FiSearch size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">
            Không có báo cáo phản ứng nào phù hợp.
          </p>
        </div>
      )}

      {/* Modal chỉnh sửa phản ứng */}
      <AnimatePresence>
        {modalVisible && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 shadow-xl max-w-lg w-full relative overflow-hidden"
            >
              {/* Decorative background elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50"></div>

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors duration-200"
              >
                <FiX size={18} />
              </button>

              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  Chi tiết báo cáo
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  ID: {selectedRecord.medicalHistoryId}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-2">
                      <h4 className="font-semibold text-teal-700 text-lg mb-1">
                        {selectedRecord.child.firstName}{" "}
                        {selectedRecord.child.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phụ huynh:</span>{" "}
                        {selectedRecord.child.customer.firstName}{" "}
                        {selectedRecord.child.customer.lastName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Vaccine</p>
                        <p className="font-medium">
                          {selectedRecord.vaccine.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Ngày tiêm</p>
                        <p className="font-medium">
                          {format(new Date(selectedRecord.date), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phản ứng sau tiêm:
                    </label>
                    <textarea
                      value={editedReaction}
                      onChange={(e) => setEditedReaction(e.target.value)}
                      rows="4"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Mô tả phản ứng sau tiêm chủng..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveReaction}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                  >
                    Lưu thay đổi
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
