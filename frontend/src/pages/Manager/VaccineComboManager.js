import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaPowerOff,
  FaFlask,
} from "react-icons/fa";
import "../../style/VaccineCombos.css";

// Hàm format tiền tệ (VND) - nếu có thuộc tính priceCombo
const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// ModalForm Component
const ModalForm = ({ isOpen, onClose, onSubmit, initialData, isEditMode }) => {
  const [formData, setFormData] = useState(
    initialData
      ? { ...initialData }
      : {
          name: "",
          description: "",
          active: true,
          priceCombo: 0,
        }
  );
  const [error, setError] = useState(""); // Thêm state để lưu thông báo lỗi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priceCombo" ? Number(value) || 0 : value,
    }));
    // Reset lỗi khi người dùng thay đổi giá trị
    if (name === "priceCombo" && error) {
      setError("");
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    if (formData.priceCombo <= 0) {
      setError("Giá combo phải lớn hơn 0");
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra validation trước khi submit
    if (!validateForm()) {
      return;
    }

    console.log("ModalForm - Gửi API dữ liệu:", formData);
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-vaccinecombomanager" onClick={onClose}>
      <div
        className="modal-content-vaccinecombomanager"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title-vaccinecombomanager">
          {isEditMode ? "Chỉnh sửa Vaccine Combo" : "Tạo Vaccine Combo mới"}
        </h3>
        <form
          onSubmit={handleFormSubmit}
          className="modal-form-vaccinecombomanager"
        >
          <div className="form-group-vaccinecombomanager">
            <label className="form-label-vaccinecombomanager">Tên combo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input-vaccinecombomanager"
              placeholder="Tên combo"
              required
            />
          </div>
          <div className="form-group-vaccinecombomanager">
            <label className="form-label-vaccinecombomanager">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea-vaccinecombomanager"
              placeholder="Mô tả combo"
              required
            />
          </div>
          <div className="form-group-vaccinecombomanager">
            <label className="form-label-vaccinecombomanager">Giá combo</label>
            <input
              type="number"
              name="priceCombo"
              value={formData.priceCombo}
              onChange={handleChange}
              className="form-input-vaccinecombomanager"
              placeholder="Giá (VND)"
              required
              min="1" // Thêm thuộc tính min để hỗ trợ HTML validation
            />
            {error && (
              <p
                className="error-message-vaccinecombomanager"
                style={{ color: "red", fontSize: "0.9em", marginTop: "5px" }}
              >
                {error}
              </p>
            )}
          </div>
          <div className="form-group-vaccinecombomanager flex-items-center-vaccinecombomanager">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="form-checkbox-vaccinecombomanager"
            />
            <label className="form-label-checkbox-vaccinecombomanager">
              Kích hoạt
            </label>
          </div>
          <div className="form-actions-vaccinecombomanager">
            <button type="submit" className="submit-button-vaccinecombomanager">
              {isEditMode ? "Lưu" : "Tạo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button-vaccinecombomanager"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// VaccineComboItem Component
const VaccineComboItem = ({ combo, onComboUpdated }) => {
  const comboId = combo.vaccineComboId;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleActive = async (e) => {
    e.stopPropagation();
    try {
      console.log("Gửi API thay đổi trạng thái cho comboId:", comboId);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo/active?id=${comboId}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          withCredentials: true,
        }
      );
      if (!response.ok) throw new Error("Lỗi khi thay đổi trạng thái");
      const updated = await response.json();
      console.log("API toggle active thành công, dữ liệu trả về:", updated);
      onComboUpdated(updated);
    } catch (error) {
      console.error("Lỗi toggle active:", error);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      console.log("Gửi API cập nhật combo, dữ liệu gửi:", updatedData);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          withCredentials: true,
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error("Lỗi khi cập nhật");
      const updated = await response.json();
      console.log("API cập nhật thành công, dữ liệu trả về:", updated);
      onComboUpdated(updated);
    } catch (error) {
      console.error("Lỗi cập nhật combo:", error);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="combo-item-vaccinecombomanager"
      >
        <div className="combo-item-content-vaccinecombomanager">
          <div className="combo-icon-wrapper-vaccinecombomanager">
            <FaFlask className="combo-icon-vaccinecombomanager" />
          </div>
          <div>
            <h3 className="combo-title-vaccinecombomanager">{combo.name}</h3>
            <p className="combo-description-vaccinecombomanager">
              <span className="font-medium-vaccinecombomanager">Mô tả:</span>{" "}
              {combo.description}
            </p>
            {combo.priceCombo !== undefined && (
              <p className="combo-price-vaccinecombomanager">
                <span className="font-medium-vaccinecombomanager">Giá:</span>{" "}
                {formatPrice(combo.priceCombo)}
              </p>
            )}
          </div>
        </div>
        <div className="combo-actions-vaccinecombomanager">
          <button
            onClick={handleToggleActive}
            className={`toggle-button-vaccinecombomanager ${
              combo.active
                ? "toggle-inactive-vaccinecombomanager"
                : "toggle-active-vaccinecombomanager"
            }`}
          >
            <FaPowerOff />
            <span>{combo.active ? "Ngưng" : "Kích hoạt"}</span>
          </button>
          <NavLink
            to={`../combo-detail/${comboId}`}
            onClick={(e) => e.stopPropagation()}
            className="detail-button-vaccinecombomanager"
          >
            Chi tiết
          </NavLink>
        </div>
      </div>
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={combo}
        isEditMode={true}
      />
    </>
  );
};

// Main Component VaccineCombos
const VaccineCombos = () => {
  const [combos, setCombos] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [searchValueMin, setSearchValueMin] = useState("");
  const [searchValueMax, setSearchValueMax] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCombos = async () => {
    try {
      console.log("Gửi API lấy danh sách combo...");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          withCredentials: true,
        }
      );
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
      const data = await response.json();
      console.log("GET API VaccineCombo thành công, dữ liệu trả về:", data);
      setCombos(data);
    } catch (error) {
      console.error("Lỗi GET VaccineCombo:", error);
    }
  };

  const handleComboUpdated = (updated) => {
    setCombos((prev) =>
      prev.map((c) =>
        c.vaccineComboId === updated.vaccineComboId ? updated : c
      )
    );
    console.log("Combo đã được cập nhật:", updated);
  };

  const handleComboCreated = async (newCombo) => {
    try {
      console.log("Gửi API tạo combo mới, dữ liệu gửi:", newCombo);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo/create`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true", // Bỏ qua warning page
          },
          credentials: "include",
          withCredentials: true,
          body: JSON.stringify(newCombo),
        }
      );
      if (!response.ok) throw new Error("Lỗi khi tạo");
      const created = await response.json();
      console.log("Tạo combo thành công, dữ liệu trả về:", created);
      setCombos((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Lỗi tạo combo:", error);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const filteredCombos = combos.filter((combo) => {
    let matchesSearch = true;
    if (searchType === "name") {
      matchesSearch = combo.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    } else if (searchType === "price") {
      const price = Number(combo.priceCombo);
      const minPrice = searchValueMin ? Number(searchValueMin) : -Infinity;
      const maxPrice = searchValueMax ? Number(searchValueMax) : Infinity;
      matchesSearch = price >= minPrice && price <= maxPrice;
    }

    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = combo.active === true;
    } else if (filterStatus === "inactive") {
      matchesStatus = combo.active === false;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="vaccine-combos-container-vaccinecombomanager">
      <div className="content-wrapper-vaccinecombomanager">
        <header className="header-vaccinecombomanager">
          <div className="header-content-vaccinecombomanager">
            <FaFlask className="icon-vaccinecombomanager" />
            <h1 className="title-vaccinecombomanager">Quản Lý Combo Vaccine</h1>
          </div>
          <p className="description-vaccinecombomanager">
            Tra cứu, quản lý và theo dõi danh sách combo vaccine trong hệ thống
            tiêm chủng
          </p>
        </header>

        <div className="search-filter-card-vaccinecombomanager">
          <div className="search-filter-container-vaccinecombomanager">
            <div className="search-input-group-vaccinecombomanager">
              <div className="select-wrapper-vaccinecombomanager">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setSearchValueMin("");
                    setSearchValueMax("");
                  }}
                  className="select-vaccinecombomanager"
                >
                  <option value="name">Tìm theo tên</option>
                  <option value="price">Tìm theo giá</option>
                </select>
                <FaSearch className="search-icon-vaccinecombomanager" />
              </div>
              {searchType === "name" && (
                <input
                  type="text"
                  placeholder="Nhập tên combo"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input-vaccinecombomanager"
                />
              )}
              {searchType === "price" && (
                <div className="price-input-group-vaccinecombomanager">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={searchValueMin}
                    onChange={(e) => setSearchValueMin(e.target.value)}
                    className="input-vaccinecombomanager"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={searchValueMax}
                    onChange={(e) => setSearchValueMax(e.target.value)}
                    className="input-vaccinecombomanager"
                  />
                </div>
              )}
            </div>
            <div className="filter-create-group-vaccinecombomanager">
              <div className="filter-buttons-vaccinecombomanager">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`filter-button-vaccinecombomanager ${
                    filterStatus === "all"
                      ? "filter-button-selected-vaccinecombomanager"
                      : ""
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`filter-button-vaccinecombomanager ${
                    filterStatus === "active"
                      ? "filter-button-selected-vaccinecombomanager"
                      : ""
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`filter-button-vaccinecombomanager ${
                    filterStatus === "inactive"
                      ? "filter-button-selected-vaccinecombomanager"
                      : ""
                  }`}
                >
                  Không hoạt động
                </button>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="create-button-vaccinecombomanager"
              >
                <FaPlus />
                <span>Tạo mới Combo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="combo-list-vaccinecombomanager">
          {filteredCombos.length === 0 ? (
            <div className="no-results-vaccinecombomanager">
              <FaFlask className="no-results-icon-vaccinecombomanager" />
              <p className="no-results-text-vaccinecombomanager">
                Không tìm thấy combo nào phù hợp
              </p>
            </div>
          ) : (
            filteredCombos.map((combo) => (
              <VaccineComboItem
                key={combo.vaccineComboId}
                combo={combo}
                onComboUpdated={handleComboUpdated}
              />
            ))
          )}
        </div>

        <ModalForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleComboCreated}
          initialData={null}
          isEditMode={false}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default VaccineCombos;
