import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaPlus, FaSearch, FaFilter, FaPowerOff, FaSyringe } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../style/MarketingCampaigns.css';

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
  const [errors, setErrors] = useState({}); // State để lưu lỗi validation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" ? Number(value) || 0 : value,
    }));
    if (name !== "description") { // Không validate mô tả
      validateField(name, name === "discount" ? Number(value) || 0 : value);
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    validateField(name, date);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Tên sự kiện không được để trống";
        } else {
          delete newErrors.name;
        }
        break;
      case "coupon":
        if (!value.trim()) {
          newErrors.coupon = "Mã coupon không được để trống";
        } else {
          delete newErrors.coupon;
        }
        break;
      case "startTime":
        if (!value) {
          newErrors.startTime = "Ngày bắt đầu không được để trống";
        } else {
          delete newErrors.startTime;
          // Kiểm tra lại ngày kết thúc nếu ngày bắt đầu thay đổi
          if (formData.endTime && dayjs(formData.endTime).isBefore(dayjs(value))) {
            newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
          } else {
            delete newErrors.endTime;
          }
        }
        break;
      case "endTime":
        if (!value) {
          newErrors.endTime = "Ngày kết thúc không được để trống";
        } else if (formData.startTime && dayjs(value).isBefore(dayjs(formData.startTime))) {
          newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
        } else {
          delete newErrors.endTime;
        }
        break;
      case "discount":
        if (value <= 0) {
          newErrors.discount = "Giảm giá phải lớn hơn 0";
        } else {
          delete newErrors.discount;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Tên sự kiện không được để trống";
    if (!formData.coupon.trim()) newErrors.coupon = "Mã coupon không được để trống";
    if (!formData.startTime) newErrors.startTime = "Ngày bắt đầu không được để trống";
    if (!formData.endTime) newErrors.endTime = "Ngày kết thúc không được để trống";
    if (formData.startTime && formData.endTime && dayjs(formData.endTime).isBefore(dayjs(formData.startTime))) {
      newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (formData.discount <= 0) newErrors.discount = "Giảm giá phải lớn hơn 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0 && 
           formData.name.trim() && 
           formData.coupon.trim() && 
           formData.startTime && 
           formData.endTime && 
           formData.discount > 0 && 
           (!dayjs(formData.endTime).isBefore(dayjs(formData.startTime)));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Ngừng submit nếu validation thất bại

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
    <div className="modal-overlay-marketing">
      <div className="modal-backdrop-marketing" onClick={onClose}></div>
      <div className="modal-content-marketing">
        <h3 className="modal-title-marketing">
          {isEditMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
        </h3>
        <form onSubmit={handleFormSubmit} className="modal-form-marketing">
          <div className="form-group-marketing">
            <label className="form-label-marketing">Tên sự kiện</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input-marketing"
              placeholder="Tên sự kiện"
              required
            />
            {errors.name && <span className="error-text-marketing">{errors.name}</span>}
          </div>
          <div className="form-group-marketing">
            <label className="form-label-marketing">Mã coupon</label>
            <input
              type="text"
              name="coupon"
              value={formData.coupon}
              onChange={handleChange}
              className="form-input-marketing"
              placeholder="Mã coupon"
              required
            />
            {errors.coupon && <span className="error-text-marketing">{errors.coupon}</span>}
          </div>
          <div className="date-picker-container-marketing">
            <div className="form-group-marketing">
              <label className="form-label-marketing">Ngày bắt đầu</label>
              <DatePicker
                selected={formData.startTime}
                onChange={(date) => handleDateChange(date, "startTime")}
                dateFormat="dd/MM/yyyy"
                className="form-input-marketing"
                placeholderText="Chọn ngày"
                required
              />
              {errors.startTime && <span className="error-text-marketing">{errors.startTime}</span>}
            </div>
            <div className="form-group-marketing">
              <label className="form-label-marketing">Ngày kết thúc</label>
              <DatePicker
                selected={formData.endTime}
                onChange={(date) => handleDateChange(date, "endTime")}
                dateFormat="dd/MM/yyyy"
                className="form-input-marketing"
                placeholderText="Chọn ngày"
                required
              />
              {errors.endTime && <span className="error-text-marketing">{errors.endTime}</span>}
            </div>
          </div>
          <div className="form-group-marketing">
            <label className="form-label-marketing">Giảm giá (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="form-input-marketing"
              placeholder="Giảm giá (%)"
              required
            />
            {errors.discount && <span className="error-text-marketing">{errors.discount}</span>}
          </div>
          <div className="form-group-marketing">
            <label className="form-label-marketing">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea-marketing"
              placeholder="Mô tả sự kiện (không bắt buộc)"
              rows="3"
            />
          </div>
          <div className="checkbox-group-marketing">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="checkbox-input-marketing"
            />
            <label className="checkbox-label-marketing">Kích hoạt</label>
          </div>
          <div className="button-group-marketing">
            <button 
              type="submit" 
              className="submit-button-marketing"
              disabled={!isFormValid()}
            >
              {isEditMode ? "Lưu" : "Tạo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button-marketing"
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
      className="campaign-item-marketing"
    >
      <div className="campaign-info-marketing">
        <FaSyringe className="campaign-icon-marketing" size={24} />
        <div>
          <h3 className="campaign-title-marketing">{campaign.coupon}</h3>
          <p className="campaign-time-marketing">
            Thời gian: {campaign.startTime} - {campaign.endTime}
          </p>
          <p className="campaign-discount-marketing">
            Giảm giá: {campaign.discount}%
          </p>
        </div>
      </div>
      <div className="campaign-buttons-marketing">
        <button
          onClick={handleToggleActive}
          className={`toggle-button-marketing ${
            campaign.active ? "active-marketing" : "inactive-marketing"
          }`}
        >
          <FaPowerOff className="button-icon-marketing" />
          {campaign.active ? "Kích hoạt" : "Ngưng"}
        </button>
        <button
          onClick={(e) => onCampaignSelected(campaign, e)}
          className="details-button-marketing"
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
    <div className="container-marketing">
      <div className="content-marketing">
        <h2 className="title-marketing">
          Quản Lý Chương Trình Tiêm Chủng
        </h2>

        <div className="controls-marketing">
          <div className="search-container-marketing">
            <FaSearch className="search-icon-marketing" />
            <input
              type="text"
              placeholder="Tìm kiếm chương trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-marketing"
            />
          </div>
          <div className="filter-buttons-marketing">
            <button
              onClick={() => setFilterState("all")}
              className={`filter-button-marketing ${
                filterState === "all" ? "active-filter-marketing" : ""
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterState("active")}
              className={`filter-button-marketing ${
                filterState === "active" ? "active-filter-marketing" : ""
              }`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setFilterState("inactive")}
              className={`filter-button-marketing ${
                filterState === "inactive" ? "active-filter-marketing" : ""
              }`}
            >
              Không hoạt động
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="create-button-marketing"
            >
              <FaPlus className="create-icon-marketing" />
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
          <p className="no-results-marketing">Không tìm thấy chương trình nào</p>
        ) : (
          <div className="campaigns-list-marketing">
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