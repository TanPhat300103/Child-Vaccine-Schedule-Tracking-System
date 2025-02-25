import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFilter, FaEdit, FaPowerOff } from "react-icons/fa";

// Hàm format tiền tệ (VND)
const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// --- Component ModalForm (giữ nguyên) ---
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priceCombo" ? Number(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          {isEditMode ? "Chỉnh sửa Vaccine Combo" : "Tạo Vaccine Combo mới"}
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên combo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Tên combo"
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
              placeholder="Mô tả combo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá combo
            </label>
            <input
              type="number"
              name="priceCombo"
              value={formData.priceCombo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Giá (VND)"
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

// --- Component VaccineComboItem (cập nhật) ---
const VaccineComboItem = ({ combo, onComboUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleActive = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/vaccinecombo/active?id=${combo.id}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Lỗi khi thay đổi trạng thái");
      const updated = await response.json();
      onComboUpdated(updated);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(
        "http://localhost:8080/vaccinecombo/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error("Lỗi khi cập nhật");
      const updated = await response.json();
      onComboUpdated(updated); // Chỉ gửi dữ liệu đã cập nhật về component cha
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 transition-all hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-blue-700 mb-2 truncate">
          {combo.name}
        </h3>
        <div className="text-sm text-gray-600 space-y-1 flex-1">
          <p className="truncate">
            <span className="font-medium">Mô tả:</span> {combo.description}
          </p>
          <p>
            <span className="font-medium">Giá:</span>{" "}
            {formatPrice(combo.priceCombo)}
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span className={combo.active ? "text-green-500" : "text-red-500"}>
              {combo.active ? "Hoạt động" : "Ngưng"}
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
              combo.active
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <FaPowerOff className="mr-1" />
            {combo.active ? "Ngưng" : "Kích hoạt"}
          </button>
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

// --- Component chính VaccineCombos (cập nhật handleComboUpdated) ---
const VaccineCombos = () => {
  const [combos, setCombos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCombos = async () => {
    try {
      const response = await fetch("http://localhost:8080/vaccinecombo");
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
      const data = await response.json();
      setCombos(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleComboUpdated = (updated) => {
    setCombos((prev) => {
      const updatedCombos = prev.map((c) =>
        c.id === updated.id ? updated : c
      );
      console.log("Updated combos:", updatedCombos); // Log để kiểm tra
      return updatedCombos;
    });
  };

  const handleComboCreated = async (newCombo) => {
    try {
      const response = await fetch(
        "http://localhost:8080/vaccinecombo/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCombo),
        }
      );
      if (!response.ok) throw new Error("Lỗi khi tạo");
      const created = await response.json();
      setCombos((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const filteredCombos = combos.filter((c) => {
    const matchName = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchActive = !showOnlyActive || c.active;
    return matchName && matchActive;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Quản Lý Combo Vaccine
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-1/2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm combo..."
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
              <FaPlus className="mr-2" /> Tạo Combo
            </button>
          </div>
        </div>

        <ModalForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleComboCreated}
          initialData={null}
          isEditMode={false}
        />

        {filteredCombos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không tìm thấy combo nào
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCombos.map((combo) => (
              <VaccineComboItem
                key={combo.id}
                combo={combo}
                onComboUpdated={handleComboUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineCombos;
