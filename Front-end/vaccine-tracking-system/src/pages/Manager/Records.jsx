// src/pages/Staff/Records.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { getMedicalHistory, updateReaction } from "../../apis/api";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho tìm kiếm
  const [searchMethod, setSearchMethod] = useState("id"); // "id", "vaccine", "reaction", "ngay"
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

  // Áp dụng bộ lọc dựa trên phương thức tìm kiếm và giá trị nhập
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
    { key: "id", label: "Tìm Theo ID" },
    { key: "vaccine", label: "Tìm Theo Vaccine" },
    { key: "reaction", label: "Tìm Theo Phản ứng" },
    { key: "ngay", label: "Tìm Theo Ngày" },
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
      alert("Cập nhật phản ứng thành công!");
      fetchRecords();
      closeModal();
    } catch (err) {
      console.error("Lỗi cập nhật phản ứng:", err);
      alert("Cập nhật thất bại!");
    }
  };

  // Render từng thẻ báo cáo
  const renderRecordCard = (record) => (
    <div
      key={record.medicalHistoryId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
      onClick={() => openModal(record)}
    >
      <p className="font-bold">ID: {record.medicalHistoryId}</p>
      <p className="text-lg text-indigo-600 font-bold">
        Tên Khách Hàng: {record.child.customer.firstName}{" "}
        {record.child.customer.lastName}
      </p>
      <p className="text-lg">
        Trẻ em: {record.child.firstName} {record.child.lastName}
      </p>
      <p>Vaccine: {record.vaccine.name}</p>
      <p>Ngày tiêm: {format(new Date(record.date), "dd/MM/yyyy")}</p>
      <p>Phản ứng: {record.reaction ? record.reaction : "Chưa có"}</p>
    </div>
  );

  if (loading) return <p>Đang tải báo cáo phản ứng...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Quản Lý Báo Cáo Phản Ứng</h2>

      {/* Khung tìm kiếm */}
      <div className="mb-6 p-4 border rounded-md">
        <div className="flex items-center space-x-4 mb-4">
          <input
            type={searchMethod === "ngay" ? "hidden" : "text"}
            placeholder="Nhập từ khóa..."
            value={searchMethod === "ngay" ? "" : searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 border rounded-md flex-1"
          />
          <select
            value={searchMethod}
            onChange={(e) => {
              setSearchMethod(e.target.value);
              setSearchText("");
              setFromDate("");
              setToDate("");
            }}
            className="px-3 py-2 border rounded-md last"
          >
            {searchOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {searchMethod === "ngay" && (
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
              placeholder="Đến ngày"
            />
          </div>
        )}
      </div>

      {/* Danh sách báo cáo phản ứng */}
      {filteredRecords.length > 0 ? (
        <div className="flex space-x-4 ">
          {filteredRecords.map((record) => renderRecordCard(record))}
        </div>
      ) : (
        <p>Không có báo cáo phản ứng nào phù hợp.</p>
      )}

      {/* Modal chỉnh sửa phản ứng */}
      {modalVisible && selectedRecord && (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-2xl flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">
              Chi tiết báo cáo: {selectedRecord.medicalHistoryId}
            </h3>
            <p className="mb-2 font-bold">
              Tên Khách Hàng: {selectedRecord.child.customer.firstName}{" "}
              {selectedRecord.child.customer.lastName}
            </p>
            <p className="mb-2">
              Trẻ em: {selectedRecord.child.firstName}{" "}
              {selectedRecord.child.lastName}
            </p>
            <p className="mb-2">Vaccine: {selectedRecord.vaccine.name}</p>
            <p className="mb-2">
              Ngày tiêm: {format(new Date(selectedRecord.date), "dd/MM/yyyy")}
            </p>
            <div className="mb-4">
              <label className="font-bold block mb-1">Phản Ứng:</label>
              <textarea
                value={editedReaction}
                onChange={(e) => setEditedReaction(e.target.value)}
                rows="4"
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập phản ứng..."
              />
            </div>
            <button
              onClick={handleSaveReaction}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
