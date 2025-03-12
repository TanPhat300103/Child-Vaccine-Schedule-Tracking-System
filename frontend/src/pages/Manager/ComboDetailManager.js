import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../style/ComboDetail.css";

// --- Custom hook: sử dụng API findbyvaccine để lấy ảnh ---
const useVaccineImage = (vaccineId) => {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!vaccineId) return;
    fetch(`http://localhost:8080/vaccinedetail/findbyvaccine?id=${vaccineId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setImg(data[0].img);
        }
      })
      .catch((err) => console.error("Error fetching vaccine image:", err));
  }, [vaccineId]);
  return img;
};

// --- Component hiển thị từng vaccine trong ComboDetail (grid chính) ---
const ComboDetailItem = ({ vaccine, onRemove }) => {
  const img = useVaccineImage(vaccine.vaccineId);
  return (
    <div className="card-combodetailmanager">
      <img
        src={img || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={vaccine.name}
        className="image-combodetailmanager"
      />
      <div className="content-combodetailmanager">
        <h3 className="card-title-combodetailmanager">{vaccine.name}</h3>
        <div className="details-combodetailmanager">
          <p>
            <span className="font-medium-combodetailmanager">Số liều:</span>{" "}
            {vaccine.doseNumber}
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Giá:</span>{" "}
            {vaccine.price} VND
          </p>
          <p className="truncate-combodetailmanager">
            <span className="font-medium-combodetailmanager">Mô tả:</span>{" "}
            {vaccine.description}
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Xuất xứ:</span>{" "}
            {vaccine.country}
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Độ tuổi:</span>{" "}
            {vaccine.ageMin} - {vaccine.ageMax} tuổi
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Trạng thái:</span>{" "}
            <span
              className={
                vaccine.active
                  ? "status-active-combodetailmanager"
                  : "status-inactive-combodetailmanager"
              }
            >
              {vaccine.active ? "Hoạt động" : "Ngưng"}
            </span>
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(vaccine.vaccineId);
          }}
          className="remove-button-combodetailmanager"
        >
          Loại Khỏi Combo
        </button>
      </div>
    </div>
  );
};

// --- Component hiển thị từng vaccine trong modal (có hiệu ứng chọn) ---
const SelectableVaccineItem = ({ vaccine, isSelected, onSelect }) => {
  const img = useVaccineImage(vaccine.vaccineId);
  return (
    <div
      className={`card-combodetailmanager ${
        isSelected ? "selected-card-combodetailmanager" : ""
      }`}
      onClick={() => onSelect(vaccine.vaccineId)}
    >
      <img
        src={img || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={vaccine.name}
        className="image-combodetailmanager"
      />
      <div className="content-combodetailmanager">
        <h3 className="card-title-combodetailmanager">{vaccine.name}</h3>
        <div className="details-combodetailmanager">
          <p>
            <span className="font-medium-combodetailmanager">Số liều:</span>{" "}
            {vaccine.doseNumber}
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Giá:</span>{" "}
            {vaccine.price} VND
          </p>
          <p className="truncate-combodetailmanager">
            <span className="font-medium-combodetailmanager">Mô tả:</span>{" "}
            {vaccine.description}
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Xuất xứ:</span>{" "}
            {vaccine.country}
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Độ tuổi:</span>{" "}
            {vaccine.ageMin} - {vaccine.ageMax} tuổi
          </p>
          <p>
            <span className="font-medium-combodetailmanager">Trạng thái:</span>{" "}
            <span
              className={
                vaccine.active
                  ? "status-active-combodetailmanager"
                  : "status-inactive-combodetailmanager"
              }
            >
              {vaccine.active ? "Hoạt động" : "Ngưng"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Card "Thêm Vaccine" trong grid chính ---
const AddVaccineCard = ({ onOpenModal }) => {
  return (
    <div onClick={onOpenModal} className="add-card-combodetailmanager">
      <div className="add-inner-combodetailmanager">
        <FaPlus className="add-icon-combodetailmanager" />
      </div>
      <h3 className="add-text-combodetailmanager">Thêm Vaccine</h3>
    </div>
  );
};

// --- Component chính ComboDetail ---
const ComboDetail = () => {
  const { vaccineComboId } = useParams();
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [selectedVaccineIds, setSelectedVaccineIds] = useState([]);
  const [adding, setAdding] = useState(false);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [searchValueMin, setSearchValueMin] = useState("");
  const [searchValueMax, setSearchValueMax] = useState("");

  useEffect(() => {
    if (vaccineComboId) {
      fetchComboDetails();
    }
  }, [vaccineComboId]);

  const fetchComboDetails = async () => {
    try {
      const apiUrl = `http://localhost:8080/combodetail/findcomboid?id=${vaccineComboId}`;
      console.log(`Requesting API: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Response received:", data);
      setComboDetails(data);
    } catch (err) {
      console.error("Error fetching combo details:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCombo = async (vaccineId) => {
    try {
      await fetch(
        `http://localhost:8080/combodetail/deletevaccine?id=${vaccineId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      setComboDetails((prevDetails) =>
        prevDetails.filter((item) => item.vaccine.vaccineId !== vaccineId)
      );
    } catch (err) {
      console.error("Error removing vaccine from combo:", err);
    }
  };

  useEffect(() => {
    if (showAddModal) {
      fetch("http://localhost:8080/vaccine", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((res) => {
          console.log("Fetch vaccines for modal success:", res);
          const existingVaccines = comboDetails.map((item) => item.vaccine);
          const filteredVaccines = res.filter(
            (vaccine) =>
              vaccine.active &&
              !existingVaccines.some(
                (existing) =>
                  existing.name === vaccine.name &&
                  existing.doseNumber === vaccine.doseNumber &&
                  existing.description === vaccine.description &&
                  existing.country === vaccine.country
              )
          );
          setAvailableVaccines(filteredVaccines);
        })
        .catch((err) =>
          console.error("Error fetching available vaccines:", err)
        );
    }
  }, [showAddModal, comboDetails]);

  const filteredAvailableVaccines = availableVaccines.filter((vaccine) => {
    if (searchType === "name") {
      return vaccine.name.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchType === "price") {
      const price = Number(vaccine.price);
      const min = searchValueMin ? Number(searchValueMin) : -Infinity;
      const max = searchValueMax ? Number(searchValueMax) : Infinity;
      return price >= min && price <= max;
    } else if (searchType === "age") {
      const minAge = Number(vaccine.ageMin);
      const maxAge = Number(vaccine.ageMax);
      const inputMin = searchValueMin ? Number(searchValueMin) : -Infinity;
      const inputMax = searchValueMax ? Number(searchValueMax) : Infinity;
      return minAge >= inputMin && maxAge <= inputMax;
    }
    return true;
  });

  const handleSelectVaccine = (vaccineId) => {
    setSelectedVaccineIds((prev) =>
      prev.includes(vaccineId)
        ? prev.filter((id) => id !== vaccineId)
        : [...prev, vaccineId]
    );
  };

  const handleConfirmAddVaccines = async () => {
    setAdding(true);
    try {
      const comboList = selectedVaccineIds.map((vaccineId) => ({
        vaccineCombo: { vaccineComboId },
        vaccine: { vaccineId },
      }));
      console.log("Adding vaccines to combo:", comboList);
      const response = await fetch("http://localhost:8080/combodetail/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comboList),
      });
      if (!response.ok) {
        throw new Error("Failed to add vaccines to combo");
      }
      toast.success("Đã thêm vaccine thành công!", { autoClose: 2000 });
    } catch (err) {
      console.error("Error adding vaccines to combo:", err);
      toast.error("Không thể thêm vaccine vào combo do lỗi server.");
    } finally {
      setAdding(false);
      fetchComboDetails();
      setShowAddModal(false);
      setSelectedVaccineIds([]);
    }
  };

  if (loading) {
    return (
      <div className="text-center-combodetailmanager">
        Đang tải danh sách vaccine trong combo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center-combodetailmanager error-combodetailmanager">
        {error}
      </div>
    );
  }

  return (
    <div className="container-combodetailmanager">
      <div className="inner-container-combodetailmanager">
        <h2 className="title-combodetailmanager">
          Danh sách Vaccine trong Combo: {vaccineComboId}
        </h2>
        <div className="grid-combodetailmanager">
          <AddVaccineCard onOpenModal={() => setShowAddModal(true)} />
          {comboDetails.map((item) => (
            <ComboDetailItem
              key={item.comboDetailId}
              vaccine={item.vaccine}
              onRemove={handleRemoveFromCombo}
            />
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay-combodetailmanager">
          <div className="modal-content-combodetailmanager">
            <div className="modal-header-combodetailmanager">
              <h2 className="modal-title-combodetailmanager">
                Chọn Vaccine để thêm vào Combo
              </h2>
              <div className="search-bar-combodetailmanager">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setSearchValueMin("");
                    setSearchValueMax("");
                  }}
                  className="input-combodetailmanager"
                >
                  <option value="name">Tìm theo tên</option>
                  <option value="price">Tìm theo giá</option>
                  <option value="age">Tìm theo độ tuổi</option>
                </select>
                {searchType === "name" && (
                  <input
                    type="text"
                    placeholder="Nhập tên vaccine"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="input-combodetailmanager"
                  />
                )}
                {(searchType === "price" || searchType === "age") && (
                  <>
                    <input
                      type="number"
                      placeholder="Từ"
                      value={searchValueMin}
                      onChange={(e) => setSearchValueMin(e.target.value)}
                      className="input-combodetailmanager"
                    />
                    <input
                      type="number"
                      placeholder="Đến"
                      value={searchValueMax}
                      onChange={(e) => setSearchValueMax(e.target.value)}
                      className="input-combodetailmanager"
                    />
                  </>
                )}
              </div>
              <div className="modal-buttons-combodetailmanager">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedVaccineIds([]);
                  }}
                  className="button-combodetailmanager cancel-button-combodetailmanager"
                  disabled={adding}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmAddVaccines}
                  className="button-combodetailmanager add-button-combodetailmanager"
                  disabled={selectedVaccineIds.length === 0 || adding}
                >
                  {adding ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
            </div>
            <div className="modal-body-combodetailmanager">
              {filteredAvailableVaccines.length === 0 ? (
                <p className="no-results-combodetailmanager">
                  Không tìm thấy vaccine nào
                </p>
              ) : (
                <div className="grid-combodetailmanager">
                  {filteredAvailableVaccines.map((vaccine) => (
                    <SelectableVaccineItem
                      key={vaccine.vaccineId}
                      vaccine={vaccine}
                      isSelected={selectedVaccineIds.includes(
                        vaccine.vaccineId
                      )}
                      onSelect={handleSelectVaccine}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboDetail;
