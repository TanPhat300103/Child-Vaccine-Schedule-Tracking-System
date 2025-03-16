import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaPlus, FaSearch, FaBullhorn, FaPowerOff } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/MarketingCampaigns.css";

// Hàm định dạng ngày

// Hàm định dạng ngày
const parseLocalDateString = (str) => {
  if (!str) return null;
  return dayjs(str).toDate();
};

const formatLocalDateString = (date) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

// Hàm định dạng ngày hiển thị
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  return dayjs(dateStr).format("DD/MM/YYYY");
};

// Modal Form Component

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
    if (name !== "description") {
      // Không validate mô tả
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
          if (
            formData.endTime &&
            dayjs(formData.endTime).isBefore(dayjs(value))
          ) {
            newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
          } else {
            delete newErrors.endTime;
          }
        }
        break;
      case "endTime":
        if (!value) {
          newErrors.endTime = "Ngày kết thúc không được để trống";
        } else if (
          formData.startTime &&
          dayjs(value).isBefore(dayjs(formData.startTime))
        ) {
          newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
        } else {
          delete newErrors.endTime;
        }
        break;
      case "discount":
        if ((value <= 0) | (value > 99)) {
          newErrors.discount = "Giảm giá không hợp lệ";
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

    if (!formData.name.trim())
      newErrors.name = "Tên sự kiện không được để trống";
    if (!formData.coupon.trim())
      newErrors.coupon = "Mã coupon không được để trống";
    if (!formData.startTime)
      newErrors.startTime = "Ngày bắt đầu không được để trống";
    if (!formData.endTime)
      newErrors.endTime = "Ngày kết thúc không được để trống";
    if (
      formData.startTime &&
      formData.endTime &&
      dayjs(formData.endTime).isBefore(dayjs(formData.startTime))
    ) {
      newErrors.endTime = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (formData.discount <= 0) newErrors.discount = "Giảm giá phải lớn hơn 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 &&
      formData.name.trim() &&
      formData.coupon.trim() &&
      formData.startTime &&
      formData.endTime &&
      formData.discount > 0 &&
      !dayjs(formData.endTime).isBefore(dayjs(formData.startTime))
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          {isEditMode ? "Chỉnh sửa chiến dịch" : "Tạo chiến dịch mới"}
        </h3>
        <form onSubmit={handleFormSubmit} className="modal-form-marketing">
          <div className="form-group-marketing">
            <label className="form-label-marketing">Tên chiến dịch</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input-marketing"
              placeholder="Nhập tên chiến dịch"
              required
            />
            {errors.name && (
              <span className="error-text-marketing">{errors.name}</span>
            )}
          </div>
          <div className="form-group-marketing">
            <label className="form-label-marketing">Mã coupon</label>
            <input
              type="text"
              name="coupon"
              value={formData.coupon}
              onChange={handleChange}
              className="form-input-marketing"
              placeholder="Nhập mã coupon"
              required
            />
            {errors.coupon && (
              <span className="error-text-marketing">{errors.coupon}</span>
            )}
          </div>
          <div className="date-picker-container-marketing">
            <div className="form-group-marketing">
              <label className="form-label-marketing">Ngày bắt đầu</label>
              <DatePicker
                selected={formData.startTime}
                onChange={(date) => handleDateChange(date, "startTime")}
                dateFormat="dd/MM/yyyy"
                className="form-input-marketing"
                placeholderText="Chọn ngày bắt đầu"
                required
              />
              {errors.startTime && (
                <span className="error-text-marketing">{errors.startTime}</span>
              )}
            </div>
            <div className="form-group-marketing">
              <label className="form-label-marketing">Ngày kết thúc</label>
              <DatePicker
                selected={formData.endTime}
                onChange={(date) => handleDateChange(date, "endTime")}
                dateFormat="dd/MM/yyyy"
                className="form-input-marketing"
                placeholderText="Chọn ngày kết thúc"
                required
              />
              {errors.endTime && (
                <span className="error-text-marketing">{errors.endTime}</span>
              )}
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
              placeholder="Nhập % giảm giá"
              min="1"
              max="99"
              required
            />
            {errors.discount && (
              <span className="error-text-marketing">{errors.discount}</span>
            )}
          </div>
          <div className="form-group-marketing">
            <label className="form-label-marketing">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea-marketing"
              placeholder="Nhập mô tả chi tiết về chiến dịch (không bắt buộc)"
              rows="3"
            />
          </div>
          <div className="checkbox-group-marketing">
            <input
              type="checkbox"
              name="active"
              id="active-checkbox"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="checkbox-input-marketing"
            />
            <label
              htmlFor="active-checkbox"
              className="checkbox-label-marketing"
            >
              Kích hoạt chiến dịch
            </label>
          </div>
          <div className="button-group-marketing">
            <button
              type="submit"
              className="submit-button-marketing"
              disabled={!isFormValid()}
            >
              {isEditMode ? "Lưu thay đổi" : "Tạo chiến dịch"}
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
}; // Campaign Item Component
const CampaignItem = ({ campaign, onCampaignSelected, onCampaignUpdated }) => {
  const handleToggleActive = async (e) => {
    e.stopPropagation();
    const updatedCampaign = { ...campaign, active: !campaign.active };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/marketing/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(updatedCampaign),
        }
      );
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
        <FaBullhorn className="campaign-icon-marketing" size={24} />
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
            campaign.active ? "inactive-marketing" : "active-marketing"
          }`}
        >
          <FaPowerOff className="button-icon-marketing" />
          {campaign.active ? "Ngưng" : "Kích hoạt"}
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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/marketing`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
      console.log(data);
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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/marketing/create`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(newCampaign),
        }
      );
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
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/marketing/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
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
    const matchName =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.coupon.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterState === "active") return matchName && c.active;
    if (filterState === "inactive") return matchName && !c.active;
    return matchName; // "all"
  });

  return (
    <div className="container-marketing">
      <div className="content-marketing">
        <header className="header-marketing">
          <h2 className="title-marketing">Quản lý chiến dịch tiêm chủng</h2>
          <p className="header-subtitle-marketing">
            Tra cứu, quản lý và theo dõi danh sách chiến dịch tiêm chủng trong
            hệ thống
          </p>
        </header>
        <div className="controls-marketing">
          <div className="search-container-marketing">
            <FaSearch className="search-icon-marketing" />
            <input
              type="text"
              placeholder="Tìm kiếm chiến dịch..."
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
              Tạo mới sự kiện
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
          <p className="no-results-marketing">Không tìm thấy chiến dịch nào</p>
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
