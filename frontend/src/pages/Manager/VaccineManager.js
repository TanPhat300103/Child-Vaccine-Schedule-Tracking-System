import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaSyringe,
  FaSearch,
  FaPlus,
  FaPowerOff,
  FaVial,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/Vaccines.css";

const Vaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [searchValueMin, setSearchValueMin] = useState("");
  const [searchValueMax, setSearchValueMax] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: "",
    doseNumber: 0,
    price: 0,
    description: "",
    country: "",
    ageMin: 0,
    ageMax: 0,
    active: true,
  });
  const [newVaccineError, setNewVaccineError] = useState(null);

  // Validation functions
  const validateVaccine = (vaccine) => {
    if (vaccine.doseNumber <= 0) {
      return "Số liều phải lớn hơn 0";
    }
    if (vaccine.price <= 0) {
      return "Giá phải lớn hơn 0";
    }
    if (vaccine.ageMin > vaccine.ageMax) {
      return "Tuổi tối thiểu không được lớn hơn tuổi tối đa";
    }
    return null;
  };

  // Fetch vaccines từ API
  const fetchVaccines = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/vaccine`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetch vaccines success:", data);
        setVaccines(data);
      })
      .catch((err) => console.error("Lỗi:", err));
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const filteredVaccines = vaccines.filter((vaccine) => {
    let matchesSearch = true;
    if (searchType === "name") {
      matchesSearch = vaccine.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    } else if (searchType === "price") {
      const price = Number(vaccine.price);
      const minPrice = searchValueMin ? Number(searchValueMin) : -Infinity;
      const maxPrice = searchValueMax ? Number(searchValueMax) : Infinity;
      matchesSearch = price >= minPrice && price <= maxPrice;
    } else if (searchType === "age") {
      const vaccineAgeMin = Number(vaccine.ageMin);
      const vaccineAgeMax = Number(vaccine.ageMax);
      const inputMin = searchValueMin ? Number(searchValueMin) : -Infinity;
      const inputMax = searchValueMax ? Number(searchValueMax) : Infinity;
      matchesSearch = vaccineAgeMin >= inputMin && vaccineAgeMax <= inputMax;
    }

    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = vaccine.active === true;
    } else if (filterStatus === "inactive") {
      matchesStatus = vaccine.active === false;
    }

    return matchesSearch && matchesStatus;
  });

  const handleVaccineUpdated = (updatedVaccine) => {
    setVaccines((prev) =>
      prev.map((v) =>
        v.vaccineId === updatedVaccine.vaccineId ? updatedVaccine : v
      )
    );
  };

  // Toggle trạng thái active của vaccine
  const handleToggleActive = (id, currentStatus) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/vaccine/active?id=${id}`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json", // Bỏ qua warning page
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API toggle active thành công:", data);
        setVaccines((prev) =>
          prev.map((vaccine) =>
            vaccine.vaccineId === id
              ? { ...vaccine, active: !currentStatus }
              : vaccine
          )
        );
      })
      .catch((err) => console.error("Lỗi khi cập nhật trạng thái:", err));
  };

  // Xử lý tạo vaccine mới
  const handleCreateVaccine = (e) => {
    e.preventDefault();
    const validationError = validateVaccine(newVaccine);
    if (validationError) {
      setNewVaccineError(validationError);
      return;
    }

    console.log("Creating vaccine:", newVaccine);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/vaccine/create`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json", // Bỏ qua warning page
      },
      credentials: "include",
      body: JSON.stringify(newVaccine),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tạo vaccine từ server");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Vaccine created successfully:", data);
        setShowCreateModal(false);
        setNewVaccine({
          name: "",
          doseNumber: 0,
          price: 0,
          description: "",
          country: "",
          ageMin: 0,
          ageMax: 0,
          active: true,
        });
        setNewVaccineError(null);
        fetchVaccines();
      })
      .catch((err) => {
        console.error("Lỗi khi tạo Vaccine:", err);
        setNewVaccineError(
          err.message || "Đã xảy ra lỗi khi tạo. Vui lòng thử lại!"
        );
      });
  };

  const VaccineItem = ({ vaccine, onVaccineUpdated, onToggleActive }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVaccine, setEditingVaccine] = useState(null);
    const [originalEditingVaccine, setOriginalEditingVaccine] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    const handleOpenModal = () => {
      setEditingVaccine({ ...vaccine });
      setOriginalEditingVaccine({ ...vaccine });
      setIsModalOpen(true);
      setUpdateError(null);
    };

    const isChanged = () =>
      JSON.stringify(editingVaccine) !== JSON.stringify(originalEditingVaccine);

    // Hàm update vaccine mới với fetch
    const handleUpdate = () => {
      const validationError = validateVaccine(editingVaccine);
      if (validationError) {
        setUpdateError(validationError);
        return;
      }
      fetch(`${process.env.REACT_APP_API_BASE_URL}/vaccine/update`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json", // Bỏ qua warning page
        },
        credentials: "include",
        body: JSON.stringify(editingVaccine),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Lỗi khi cập nhật vaccine từ server");
          }
          return res.json();
        })
        .then((data) => {
          console.log("API update returned:", data);
          onVaccineUpdated(data);
          setIsModalOpen(false);
          setUpdateError(null);
        })
        .catch((err) => {
          console.error("Lỗi khi update vaccine:", err);
          setUpdateError(
            err.message || "Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!"
          );
        });
    };

    const handleToggleActiveLocal = (e) => {
      e.stopPropagation();
      onToggleActive(vaccine.vaccineId, vaccine.active);
    };

    return (
      <>
        <div className="vaccine-item-vaccinemanager" onClick={handleOpenModal}>
          <div className="vaccine-info-vaccinemanager">
            <div className="vaccine-icon-container-vaccinemanager">
              <FaVial className="vaccine-icon-vaccinemanager" />
            </div>
            <div>
              <h3 className="vaccine-name-vaccinemanager">{vaccine.name}</h3>
              <p className="vaccine-details-vaccinemanager">
                Số liều: {vaccine.doseNumber} | Giá:{" "}
                {vaccine.price.toLocaleString()} VND
              </p>
            </div>
          </div>
          <div className="vaccine-actions-vaccinemanager">
            <button
              onClick={handleToggleActiveLocal}
              className={`toggle-button-vaccinemanager ${
                vaccine.active
                  ? "toggle-deactivate-vaccinemanager"
                  : "toggle-activate-vaccinemanager"
              }`}
            >
              <FaPowerOff />
              <span>{vaccine.active ? "Ngưng" : "Kích hoạt"}</span>
            </button>
            <NavLink
              to={`../vaccine-detail/${vaccine.vaccineId}`}
              className="detail-button-vaccinemanager"
            >
              Vaccine nhập kho
            </NavLink>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay-vaccinemanager">
            <div className="modal-content-vaccinemanager">
              <h2 className="modal-title-vaccinemanager">Cập Nhật Vaccine</h2>
              <div className="modal-grid-vaccinemanager">
                <div>
                  <label className="modal-label-vaccinemanager">
                    Tên Vaccine:
                  </label>
                  <input
                    type="text"
                    value={editingVaccine.name}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        name: e.target.value,
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
                <div>
                  <label className="modal-label-vaccinemanager">Số liều:</label>
                  <input
                    type="number"
                    value={editingVaccine.doseNumber}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        doseNumber: Number(e.target.value),
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
                <div>
                  <label className="modal-label-vaccinemanager">
                    Giá (VND):
                  </label>
                  <input
                    type="number"
                    value={editingVaccine.price}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        price: Number(e.target.value),
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
                <div>
                  <label className="modal-label-vaccinemanager">Mô tả:</label>
                  <input
                    type="text"
                    value={editingVaccine.description}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        description: e.target.value,
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
                <div>
                  <label className="modal-label-vaccinemanager">Xuất xứ:</label>
                  <input
                    type="text"
                    value={editingVaccine.country}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        country: e.target.value,
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
                <div>
                  <label className="modal-label-vaccinemanager">
                    Độ tuổi tối thiểu:
                  </label>
                  <input
                    type="number"
                    value={editingVaccine.ageMin}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        ageMin: Number(e.target.value),
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
                <div>
                  <label className="modal-label-vaccinemanager">
                    Độ tuổi tối đa:
                  </label>
                  <input
                    type="number"
                    value={editingVaccine.ageMax}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        ageMax: Number(e.target.value),
                      })
                    }
                    className="modal-input-vaccinemanager"
                  />
                </div>
              </div>
              {updateError && (
                <p className="error-text-vaccinemanager">{updateError}</p>
              )}
              <div className="modal-buttons-vaccinemanager">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="modal-cancel-button-vaccinemanager"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!isChanged()}
                  className={`modal-update-button-vaccinemanager ${
                    !isChanged() ? "disabled-vaccinemanager" : ""
                  }`}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container-vaccinemanager">
      <div className="content-vaccinemanager">
        <header className="header-vaccinemanager">
          <div className="header-title-vaccinemanager">
            <FaSyringe className="header-icon-vaccinemanager" />
            <h1 className="header-text-vaccinemanager">Quản lý vắc xin</h1>
          </div>
          <p className="header-subtitle-vaccinemanager">
            Tra cứu, quản lý và theo dõi danh sách vắc xin trong hệ thống tiêm
            chủng
          </p>
        </header>

        <div className="search-filter-container-vaccinemanager">
          <div className="search-filter-vaccinemanager">
            <div className="search-container-vaccinemanager">
              <div className="search-type-container-vaccinemanager">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setSearchValueMin("");
                    setSearchValueMax("");
                  }}
                  className="search-type-vaccinemanager"
                >
                  <option value="name">Tìm theo tên</option>
                  <option value="price">Tìm theo giá</option>
                  <option value="age">Tìm theo độ tuổi</option>
                </select>
                <FaSearch className="search-icon-vaccinemanager" />
              </div>
              {searchType === "name" && (
                <input
                  type="text"
                  placeholder="Nhập tên vaccine"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="search-input-vaccinemanager"
                />
              )}
              {(searchType === "price" || searchType === "age") && (
                <div className="range-inputs-vaccinemanager">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={searchValueMin}
                    onChange={(e) => setSearchValueMin(e.target.value)}
                    className="range-input-vaccinemanager"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={searchValueMax}
                    onChange={(e) => setSearchValueMax(e.target.value)}
                    className="range-input-vaccinemanager"
                  />
                </div>
              )}
            </div>
            <div className="filter-actions-vaccinemanager">
              <div className="filter-buttons-vaccinemanager">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`filter-button-vaccinemanager ${
                    filterStatus === "all" ? "active-vaccinemanager" : ""
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`filter-button-vaccinemanager ${
                    filterStatus === "active" ? "active-vaccinemanager" : ""
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`filter-button-vaccinemanager ${
                    filterStatus === "inactive" ? "active-vaccinemanager" : ""
                  }`}
                >
                  Không hoạt động
                </button>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="create-button-vaccinemanager"
              >
                <FaPlus />
                <span>Thêm vaccine mới</span>
              </button>
            </div>
          </div>
        </div>

        <div className="vaccine-list-vaccinemanager">
          {filteredVaccines.length === 0 ? (
            <div className="no-results-vaccinemanager">
              <FaSyringe className="no-results-icon-vaccinemanager" />
              <p className="no-results-text-vaccinemanager">
                Không tìm thấy vaccine nào phù hợp
              </p>
            </div>
          ) : (
            filteredVaccines.map((vaccine) => (
              <VaccineItem
                key={vaccine.vaccineId}
                vaccine={vaccine}
                onVaccineUpdated={handleVaccineUpdated}
                onToggleActive={handleToggleActive}
              />
            ))
          )}
        </div>

        {showCreateModal && (
          <div className="create-modal-overlay-vaccinemanager">
            <div
              className="create-modal-backdrop-vaccinemanager"
              onClick={() => setShowCreateModal(false)}
            ></div>
            <div className="create-modal-content-vaccinemanager">
              <h3 className="create-modal-title-vaccinemanager">
                Tạo Vaccine Mới
              </h3>
              <form
                onSubmit={handleCreateVaccine}
                className="create-form-vaccinemanager"
              >
                <div>
                  <label className="create-label-vaccinemanager">
                    Tên Vaccine{" "}
                    <span className="required-vaccinemanager">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newVaccine.name}
                    onChange={(e) =>
                      setNewVaccine({ ...newVaccine, name: e.target.value })
                    }
                    className="create-input-vaccinemanager"
                    placeholder="Nhập tên vaccine"
                    required
                  />
                </div>
                <div className="create-grid-vaccinemanager">
                  <div>
                    <label className="create-label-vaccinemanager">
                      Số liều <span className="required-vaccinemanager">*</span>
                    </label>
                    <input
                      type="number"
                      name="doseNumber"
                      value={newVaccine.doseNumber}
                      onChange={(e) =>
                        setNewVaccine({
                          ...newVaccine,
                          doseNumber: Number(e.target.value),
                        })
                      }
                      className="create-input-vaccinemanager"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="create-label-vaccinemanager">
                      Giá (VND){" "}
                      <span className="required-vaccinemanager">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newVaccine.price}
                      onChange={(e) =>
                        setNewVaccine({
                          ...newVaccine,
                          price: Number(e.target.value),
                        })
                      }
                      className="create-input-vaccinemanager"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="create-label-vaccinemanager">
                    Mô tả <span className="required-vaccinemanager">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={newVaccine.description}
                    onChange={(e) =>
                      setNewVaccine({
                        ...newVaccine,
                        description: e.target.value,
                      })
                    }
                    className="create-textarea-vaccinemanager"
                    placeholder="Nhập mô tả vaccine"
                    required
                  />
                </div>
                <div>
                  <label className="create-label-vaccinemanager">
                    Xuất xứ <span className="required-vaccinemanager">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={newVaccine.country}
                    onChange={(e) =>
                      setNewVaccine({
                        ...newVaccine,
                        country: e.target.value,
                      })
                    }
                    className="create-input-vaccinemanager"
                    placeholder="Nhập quốc gia xuất xứ"
                    required
                  />
                </div>
                <div className="create-grid-vaccinemanager">
                  <div>
                    <label className="create-label-vaccinemanager">
                      Tuổi tối thiểu{" "}
                      <span className="required-vaccinemanager">*</span>
                    </label>
                    <input
                      type="number"
                      name="ageMin"
                      value={newVaccine.ageMin}
                      onChange={(e) =>
                        setNewVaccine({
                          ...newVaccine,
                          ageMin: Number(e.target.value),
                        })
                      }
                      className="create-input-vaccinemanager"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="create-label-vaccinemanager">
                      Tuổi tối đa{" "}
                      <span className="required-vaccinemanager">*</span>
                    </label>
                    <input
                      type="number"
                      name="ageMax"
                      value={newVaccine.ageMax}
                      onChange={(e) =>
                        setNewVaccine({
                          ...newVaccine,
                          ageMax: Number(e.target.value),
                        })
                      }
                      className="create-input-vaccinemanager"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                {newVaccineError && (
                  <p className="error-text-vaccinemanager">{newVaccineError}</p>
                )}
                <div className="create-buttons-vaccinemanager">
                  <button
                    type="submit"
                    className="create-submit-button-vaccinemanager"
                  >
                    Tạo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="create-cancel-button-vaccinemanager"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vaccines;
