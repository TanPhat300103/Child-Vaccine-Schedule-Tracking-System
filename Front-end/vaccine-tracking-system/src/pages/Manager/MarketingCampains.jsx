import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaPlus, FaSearch, FaFilter, FaPowerOff } from "react-icons/fa";

/* --- Các hàm hỗ trợ định dạng ngày --- */
function parseLocalDateString(str) {
  if (!str) return "";
  return dayjs(str).format("YYYY-MM-DD");
}

function formatLocalDateString(date) {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
}

/* --- Component ModalForm (dùng cho tạo mới) --- */
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
          startTime: "",
          endTime: "",
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

  const handleStartDateChange = (e) => {
    setFormData((prev) => ({ ...prev, startTime: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setFormData((prev) => ({ ...prev, endTime: e.target.value }));
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
          {/* Các trường tạo mới */}
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
            <input
              type="date"
              name="startTime"
              value={formData.startTime}
              onChange={handleStartDateChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kết thúc
            </label>
            <input
              type="date"
              name="endTime"
              value={formData.endTime}
              onChange={handleEndDateChange}
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

/* --- Component hiển thị từng dòng sự kiện marketing dưới dạng danh sách --- */
const CampaignItem = ({ campaign, onCampaignSelected, onCampaignUpdated }) => {
  // Hàm chuyển trạng thái active/inactive
  const handleToggleActive = async (e) => {
    e.stopPropagation();
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

  return (
    <div
      onClick={(e) => onCampaignSelected(campaign, e)}
      className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer border border-gray-100"
    >
      <div>
        <h2 className="text-xl font-extrabold text-blue-600 truncate">
          {campaign.name}
        </h2>
        <p className="text-sm text-gray-600">
          Bắt đầu: {campaign.startTime || "Chưa có"}
        </p>
        <p className="text-sm text-gray-600">
          Kết thúc: {campaign.endTime || "Chưa có"}
        </p>
        <p className="text-sm text-gray-600">Coupon: {campaign.coupon}</p>
      </div>
      <div>
        <button
          onClick={handleToggleActive}
          className={`text-white font-bold py-1 px-3 rounded flex items-center justify-center ${
            campaign.active
              ? "bg-green-500 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-700"
          }`}
        >
          <FaPowerOff size={18} className="mr-1" />
          {campaign.active ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
};

/* --- Component chính MarketingCampaigns --- */
const MarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State cho modal chỉnh sửa sự kiện (theo kiểu Customers.jsx)
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [originalEditingCampaign, setOriginalEditingCampaign] = useState(null);
  const [updateError, setUpdateError] = useState(null);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (!response.ok) throw new Error("Lỗi khi tạo");
      const created = await response.json();
      setCampaigns((prev) => [created, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // Khi nhấn vào 1 dòng, mở modal chỉnh sửa (theo kiểu Customers.jsx)
  const handleCampaignSelected = (campaign, e) => {
    e.stopPropagation();
    setEditingCampaign({ ...campaign });
    setOriginalEditingCampaign({ ...campaign });
    setUpdateError(null);
  };

  const isCampaignChanged = () => {
    return (
      JSON.stringify(editingCampaign) !==
      JSON.stringify(originalEditingCampaign)
    );
  };

  const handleSaveCampaign = async () => {
    try {
      const payload = {
        ...editingCampaign,
        startTime: formatLocalDateString(editingCampaign.startTime),
        endTime: formatLocalDateString(editingCampaign.endTime),
      };
      const response = await fetch("http://localhost:8080/marketing/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Lỗi không xác định khi cập nhật.");
      }
      const updatedCampaign = await response.json();
      setCampaigns((prev) =>
        prev.map((c) =>
          c.marketingCampaignId === updatedCampaign.marketingCampaignId
            ? updatedCampaign
            : c
        )
      );
      setEditingCampaign(null);
      setOriginalEditingCampaign(null);
      setUpdateError(null);
    } catch (error) {
      console.error("Cập nhật lỗi:", error);
      setUpdateError(error.message);
    }
  };

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

        {/* Modal tạo mới sử dụng ModalForm */}
        {showCreateModal && (
          <ModalForm
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCampaignCreated}
            initialData={null}
            isEditMode={false}
          />
        )}

        {filteredCampaigns.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không tìm thấy sự kiện nào
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredCampaigns.map((item) => (
              <CampaignItem
                key={item.marketingCampaignId}
                campaign={item}
                onCampaignSelected={handleCampaignSelected}
                onCampaignUpdated={handleCampaignUpdated}
              />
            ))}
          </div>
        )}

        {/* Modal chỉnh sửa sự kiện marketing theo style Customers.jsx */}
        {editingCampaign && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
              <h3 className="text-2xl font-semibold mb-6">
                Cập Nhật Sự Kiện Marketing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên sự kiện
                  </label>
                  <input
                    type="text"
                    value={editingCampaign.name}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã coupon
                  </label>
                  <input
                    type="text"
                    value={editingCampaign.coupon}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        coupon: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bắt đầu
                  </label>
                  <input
                    type="date"
                    value={editingCampaign.startTime}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        startTime: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kết thúc
                  </label>
                  <input
                    type="date"
                    value={editingCampaign.endTime}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        endTime: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              {/* Thêm trường Giảm giá và Mô tả */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    value={editingCampaign.discount}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        discount: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    value={editingCampaign.description}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              {updateError && (
                <p className="text-red-500 text-sm mt-4">{updateError}</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleSaveCampaign}
                  disabled={!isCampaignChanged()}
                  className={`font-bold py-2 px-4 rounded-lg ${
                    isCampaignChanged()
                      ? "bg-green-500 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditingCampaign(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCampaigns;
