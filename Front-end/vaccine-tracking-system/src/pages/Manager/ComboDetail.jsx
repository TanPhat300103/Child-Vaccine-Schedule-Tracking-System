import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

// --- Custom hook: sử dụng API findbyvaccine để lấy ảnh ---
const useVaccineImage = (vaccineId) => {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!vaccineId) return;
    axios
      .get(
        `http://localhost:8080/vaccinedetail/findbyvaccine?id=${vaccineId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setImg(res.data[0].img);
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden transition-all hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col h-full">
      <img
        src={img || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={vaccine.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-blue-700 mb-2 truncate">
          {vaccine.name}
        </h3>
        <div className="text-sm text-gray-600 space-y-1 flex-1">
          <p>
            <span className="font-medium">Số liều:</span> {vaccine.doseNumber}
          </p>
          <p>
            <span className="font-medium">Giá:</span> {vaccine.price} VND
          </p>
          <p className="truncate">
            <span className="font-medium">Mô tả:</span> {vaccine.description}
          </p>
          <p>
            <span className="font-medium">Xuất xứ:</span> {vaccine.country}
          </p>
          <p>
            <span className="font-medium">Độ tuổi:</span> {vaccine.ageMin} -{" "}
            {vaccine.ageMax} tuổi
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span
              className={vaccine.active ? "text-green-500" : "text-red-500"}
            >
              {vaccine.active ? "Hoạt động" : "Ngưng"}
            </span>
          </p>
        </div>
        {/* Nút Loại Khỏi Combo */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(vaccine.vaccineId);
          }}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all"
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
      className={`cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden transition-all hover:scale-105 hover:shadow-xl border ${
        isSelected ? "border-4 border-blue-500" : "border-gray-100"
      } flex flex-col h-full`}
      onClick={() => onSelect(vaccine.vaccineId)}
    >
      <img
        src={img || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={vaccine.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-blue-700 mb-2 truncate">
          {vaccine.name}
        </h3>
        <div className="text-sm text-gray-600 space-y-1 flex-1">
          <p>
            <span className="font-medium">Số liều:</span> {vaccine.doseNumber}
          </p>
          <p>
            <span className="font-medium">Giá:</span> {vaccine.price} VND
          </p>
          <p className="truncate">
            <span className="font-medium">Mô tả:</span> {vaccine.description}
          </p>
          <p>
            <span className="font-medium">Xuất xứ:</span> {vaccine.country}
          </p>
          <p>
            <span className="font-medium">Độ tuổi:</span> {vaccine.ageMin} -{" "}
            {vaccine.ageMax} tuổi
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span
              className={vaccine.active ? "text-green-500" : "text-red-500"}
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
    <div
      onClick={onOpenModal}
      className="cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-xl border border-gray-100 h-full p-4"
    >
      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 w-full h-40 rounded-xl">
        <FaPlus className="text-blue-500" size={48} />
      </div>
      <h3 className="text-lg font-semibold text-blue-700 mt-4">Thêm Vaccine</h3>
    </div>
  );
};

// --- Component chính ComboDetail ---
const ComboDetail = () => {
  const { vaccineComboId } = useParams();
  const [comboDetails, setComboDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State cho modal Thêm Vaccine
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [selectedVaccineIds, setSelectedVaccineIds] = useState([]);
  const [adding, setAdding] = useState(false); // Thêm state để theo dõi quá trình thêm vaccine

  // State cho thanh tìm kiếm trong modal
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [searchValueMin, setSearchValueMin] = useState("");
  const [searchValueMax, setSearchValueMax] = useState("");

  useEffect(() => {
    if (vaccineComboId) {
      fetchComboDetails();
    }
  }, [vaccineComboId]);

  // Lấy danh sách vaccine đã có trong combo
  const fetchComboDetails = async () => {
    try {
      const apiUrl = `http://localhost:8080/combodetail/findcomboid?id=${vaccineComboId}`;
      console.log(`Requesting API: ${apiUrl}`);
      const response = await axios.get(apiUrl, {
        withCredentials: true,
      });
      console.log("Response received:", response.data);
      setComboDetails(response.data);
    } catch (err) {
      console.error("Error fetching combo details:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xoá vaccine khỏi combo (sử dụng POST theo backend)
  const handleRemoveFromCombo = async (vaccineId) => {
    try {
      await axios.post(
        `http://localhost:8080/combodetail/deletevaccine?id=${vaccineId}`,
        {},
        { withCredentials: true }
      );
      // Cập nhật lại state để loại bỏ vaccine vừa xoá
      setComboDetails((prevDetails) =>
        prevDetails.filter((item) => item.vaccine.vaccineId !== vaccineId)
      );
    } catch (err) {
      console.error("Error removing vaccine from combo:", err);
    }
  };

  // Khi mở modal, lấy danh sách vaccine hiện có từ API và lọc
  useEffect(() => {
    if (showAddModal) {
      axios
        .get("http://localhost:8080/vaccine", {
          withCredentials: true,
        })
        .then((res) => {
          console.log("Fetch vaccines for modal success:", res.data);
          // Lọc vaccine active và không trùng với vaccine trong combo
          const existingVaccines = comboDetails.map((item) => item.vaccine);
          const filteredVaccines = res.data.filter(
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

  // Lọc danh sách vaccine trong modal theo thanh tìm kiếm
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

  // Hàm toggle chọn vaccine trong modal
  const handleSelectVaccine = (vaccineId) => {
    setSelectedVaccineIds((prev) =>
      prev.includes(vaccineId)
        ? prev.filter((id) => id !== vaccineId)
        : [...prev, vaccineId]
    );
  };

  // Hàm xác nhận thêm vaccine vào combo
  const handleConfirmAddVaccines = async () => {
    setAdding(true);
    try {
      // Xử lý tuần tự từng vaccine một
      for (const vaccineId of selectedVaccineIds) {
        const payload = {
          vaccineCombo: { vaccineComboId },
          vaccine: { vaccineId },
        };
        await axios.post("http://localhost:8080/combodetail/create", payload, {
          withCredentials: true,
        });
      }
      alert("Đã thêm tất cả vaccine vào combo thành công!");
    } catch (err) {
      console.error("Một số vaccine không thể thêm:", err);
      alert("Một số vaccine không thể thêm vào combo do lỗi server.");
    } finally {
      setAdding(false);
      fetchComboDetails(); // Reload dữ liệu
      setShowAddModal(false);
      setSelectedVaccineIds([]);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        Đang tải danh sách vaccine trong combo...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Danh sách Vaccine trong Combo: {vaccineComboId}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card Thêm Vaccine */}
          <AddVaccineCard onOpenModal={() => setShowAddModal(true)} />
          {/* Danh sách vaccine trong combo */}
          {comboDetails.map((item) => (
            <ComboDetailItem
              key={item.comboDetailId}
              vaccine={item.vaccine}
              onRemove={handleRemoveFromCombo}
            />
          ))}
        </div>
      </div>

      {/* Modal Thêm Vaccine */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Chọn Vaccine để thêm vào Combo
            </h2>
            {/* Thanh tìm kiếm */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchValue("");
                  setSearchValueMin("");
                  setSearchValueMax("");
                }}
                className="border p-2 rounded"
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
                  className="border p-2 rounded"
                />
              )}
              {(searchType === "price" || searchType === "age") && (
                <>
                  <input
                    type="number"
                    placeholder="Từ"
                    value={searchValueMin}
                    onChange={(e) => setSearchValueMin(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={searchValueMax}
                    onChange={(e) => setSearchValueMax(e.target.value)}
                    className="border p-2 rounded"
                  />
                </>
              )}
            </div>
            {/* Grid hiển thị danh sách vaccine có thể chọn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAvailableVaccines.length === 0 ? (
                <p className="text-center text-gray-500 text-lg w-full">
                  Không tìm thấy vaccine nào
                </p>
              ) : (
                filteredAvailableVaccines.map((vaccine) => (
                  <SelectableVaccineItem
                    key={vaccine.vaccineId}
                    vaccine={vaccine}
                    isSelected={selectedVaccineIds.includes(vaccine.vaccineId)}
                    onSelect={handleSelectVaccine}
                  />
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedVaccineIds([]);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
                disabled={adding}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAddVaccines}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                disabled={selectedVaccineIds.length === 0 || adding}
              >
                {adding ? "Đang thêm..." : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboDetail;
