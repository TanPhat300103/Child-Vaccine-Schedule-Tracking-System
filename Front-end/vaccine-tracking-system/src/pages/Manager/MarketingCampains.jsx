import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { FaPlus, FaSearch, FaFilter, FaEdit, FaPowerOff } from "react-icons/fa";

// Hàm parse/format thời gian
function parseLocalDateString(str) {
  if (!str) return null;
  return dayjs(str, "YYYY-MM-DDTHH:mm").toDate();
}

function formatLocalDateString(date) {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DDTHH:mm");
}

// --- Component ModalForm (cập nhật) ---
const ModalForm = ({ isOpen, onClose, onSubmit, initialData, isEditMode }) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          ...initialData,
          startTime: parseLocalDateString(initialData.startTime),
          endTime: parseLocalDateString(initialData.endTime),
        }
      : {
          name: "",
          startTime: null,
          endTime: null,
          coupon: "",
          discount: 0,
          description: "",
          active: true,
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleStartDateChange = (date) => {
    setFormData((prev) => ({ ...prev, startTime: date }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prev) => ({ ...prev, endTime: date }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      startTime: formatLocalDateString(formData.startTime),
      endTime: formatLocalDateString(formData.endTime),
    };
    await onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all animate-fadeIn">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">
          {isEditMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên sự kiện
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Tên sự kiện"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã coupon
            </label>
            <input
              type="text"
              name="coupon"
              value={formData.coupon}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Mã coupon"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bắt đầu
            </label>
            <DatePicker
              selected={formData.startTime}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kết thúc
            </label>
            <DatePicker
              selected={formData.endTime}
              onChange={handleEndDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giảm giá (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Giảm giá (%)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Mô tả sự kiện"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Kích hoạt
            </label>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              {isEditMode ? "Lưu" : "Tạo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Component CampaignItem ---
const CampaignItem = ({ campaign, onCampaignUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleActive = async () => {
    const toggled = { ...campaign, active: !campaign.active };
    try {
      const res = await fetch("http://localhost:8080/marketing/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toggled),
      });
      if (!res.ok) throw new Error("Lỗi khi toggle");
      const updated = await res.json();
      onCampaignUpdated(updated);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch("http://localhost:8080/marketing/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Lỗi khi cập nhật");
      const updated = await response.json();
      onCampaignUpdated(updated);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 transition-all hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-blue-700 mb-2 truncate">
          {campaign.name}
        </h3>
        <div className="text-sm text-gray-600 space-y-1 flex-1">
          <p>
            <span className="font-medium">Bắt đầu:</span>{" "}
            {campaign.startTime || "Chưa có"}
          </p>
          <p>
            <span className="font-medium">Kết thúc:</span>{" "}
            {campaign.endTime || "Chưa có"}
          </p>
          <p>
            <span className="font-medium">Coupon:</span> {campaign.coupon}
          </p>
          <p>
            <span className="font-medium">Giảm giá:</span> {campaign.discount}%
          </p>
          <p className="truncate">
            <span className="font-medium">Mô tả:</span> {campaign.description}
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span
              className={campaign.active ? "text-green-500" : "text-red-500"}
            >
              {campaign.active ? "Hoạt động" : "Ngưng"}
            </span>
          </p>
        </div>
        <div className="flex justify-between mt-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all text-sm"
          >
            <FaEdit className="mr-1" /> Sửa
          </button>
          <button
            onClick={handleToggleActive}
            className={`flex items-center px-3 py-1 rounded-lg text-white transition-all text-sm ${
              campaign.active
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <FaPowerOff className="mr-1" />
            {campaign.active ? "Ngưng" : "Kích hoạt"}
          </button>
        </div>
      </div>
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={campaign}
        isEditMode={true}
      />
    </>
  );
};

// --- Component chính MarketingCampaigns ---
const MarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("http://localhost:8080/marketing");
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleCampaignUpdated = (updated) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.marketingCampaignId === updated.marketingCampaignId ? updated : c
      )
    );
  };

  const handleCampaignCreated = async (newCampaign) => {
    try {
      const response = await fetch("http://localhost:8080/marketing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (!response.ok) throw new Error("Lỗi khi tạo");
      const created = await response.json();
      setCampaigns((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchActive = !showOnlyActive || c.active;
    return matchName && matchActive;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Quản Lý Sự Kiện Marketing
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-1/2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowOnlyActive(!showOnlyActive)}
              className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all shadow-md"
            >
              <FaFilter className="mr-2" />
              {showOnlyActive ? "Hiện tất cả" : "Chỉ hiện hoạt động"}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md"
            >
              <FaPlus className="mr-2" /> Tạo Sự Kiện
            </button>
          </div>
        </div>

        <ModalForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCampaignCreated}
          initialData={null}
          isEditMode={false}
        />

        {filteredCampaigns.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không tìm thấy sự kiện nào
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCampaigns.map((item) => (
              <CampaignItem
                key={item.marketingCampaignId}
                campaign={item}
                onCampaignUpdated={handleCampaignUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCampaigns;
