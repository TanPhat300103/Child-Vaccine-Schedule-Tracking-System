import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaPlus, FaSearch, FaFilter, FaPowerOff, FaSyringe } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hàm định dạng ngày
const parseLocalDateString = (str) => {
  if (!str) return null;
  return dayjs(str).toDate();
};

const formatLocalDateString = (date) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

// Modal Form Component
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" ? Number(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày bắt đầu
              </label>
              <DatePicker
                selected={formData.startTime}
                onChange={(date) => handleDateChange(date, "startTime")}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholderText="Chọn ngày"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <DatePicker
                selected={formData.endTime}
                onChange={(date) => handleDateChange(date, "endTime")}
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholderText="Chọn ngày"
                required
              />
            </div>
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
              rows="3"
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

// Campaign Item Component
const CampaignItem = ({ campaign, onCampaignSelected, onCampaignUpdated }) => {
  const handleToggleActive = async (e) => {
    e.stopPropagation();
    const updatedCampaign = { ...campaign, active: !campaign.active };
    try {
      const res = await fetch("http://localhost:8080/marketing/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCampaign),
      });
      if (!res.ok) throw new Error("Failed to toggle campaign status");
      const updated = await res.json();
      onCampaignUpdated(updated);
    } catch (err) {
      console.error("Error toggling campaign:", err);
    }
  };

  return (
    <div
      onClick={(e) => onCampaignSelected(campaign, e)}
      className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 flex justify-between items-center hover:shadow-lg transition-all cursor-pointer mb-4 group"
    >
      <div className="flex items-center space-x-4">
        <FaSyringe className="text-blue-500" size={24} />
        <div>
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {campaign.coupon}
          </h3>
          <p className="text-sm text-gray-600">
            Thời gian: {campaign.startTime} - {campaign.endTime}
          </p>
          <p className="text-sm text-gray-600">Giảm giá: {campaign.discount}%</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleToggleActive}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            campaign.active
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          <FaPowerOff className="inline mr-1" />
          {campaign.active ? "Kích hoạt" : "Ngưng"}
        </button>
        <button
          onClick={(e) => onCampaignSelected(campaign, e)}
          className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

// Main Component
const MarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all"); // "all", "active", "inactive"
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("http://localhost:8080/marketing", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (!response.ok) throw new Error("Failed to create campaign");
      const created = await response.json();
      setCampaigns((prev) => [created, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const handleCampaignSelected = (campaign, e) => {
    e.stopPropagation();
    setEditingCampaign({ ...campaign });
  };

  const handleSaveCampaign = async (updatedCampaign) => {
    try {
      const payload = {
        ...updatedCampaign,
        startTime: formatLocalDateString(updatedCampaign.startTime),
        endTime: formatLocalDateString(updatedCampaign.endTime),
      };
      const response = await fetch("http://localhost:8080/marketing/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update campaign");
      const updated = await response.json();
      setCampaigns((prev) =>
        prev.map((c) =>
          c.marketingCampaignId === updated.marketingCampaignId ? updated : c
        )
      );
      setEditingCampaign(null);
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterState === "active") return matchName && c.active;
    if (filterState === "inactive") return matchName && !c.active;
    return matchName; // "all"
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Quản Lý Chương Trình Tiêm Chủng
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chương trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterState("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterState === "all"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterState("active")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterState === "active"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setFilterState("inactive")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filterState === "inactive"
                  ? "bg-red-200 text-red-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Không hoạt động
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaPlus className="mr-2" />
              Tạo mới Vaccine
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
          <p className="text-center text-gray-500 mt-6">Không tìm thấy chương trình nào</p>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignItem
                key={campaign.marketingCampaignId}
                campaign={campaign}
                onCampaignSelected={handleCampaignSelected}
                onCampaignUpdated={handleCampaignUpdated}
              />
            ))}
          </div>
        )}

        {editingCampaign && (
          <ModalForm
            isOpen={true}
            onClose={() => setEditingCampaign(null)}
            onSubmit={handleSaveCampaign}
            initialData={editingCampaign}
            isEditMode={true}
          />
        )}
      </div>
    </div>
  );
};

export default MarketingCampaigns;