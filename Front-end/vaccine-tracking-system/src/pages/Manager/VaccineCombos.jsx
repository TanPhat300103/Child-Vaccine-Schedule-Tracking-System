import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaPlus, FaSearch, FaFilter, FaPowerOff, FaFlask } from "react-icons/fa";

// Hàm format tiền tệ (VND) - nếu có thuộc tính priceCombo
const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// ModalForm Component
const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode,
}) => {
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
    console.log("ModalForm - Gửi API dữ liệu:", formData);
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

// VaccineComboItem Component
const VaccineComboItem = ({ combo, onComboUpdated }) => {
  const comboId = combo.vaccineComboId;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleActive = async (e) => {
    e.stopPropagation();
    try {
      console.log("Gửi API thay đổi trạng thái cho comboId:", comboId);
      const response = await fetch(
        `http://localhost:8080/vaccinecombo/active?id=${comboId}`,
        {
          method: "POST",
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
      const response = await fetch("http://localhost:8080/vaccinecombo/update", {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
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
        className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all group cursor-pointer"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaFlask className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {combo.name}
            </h3>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Mô tả:</span> {combo.description}
            </p>
            {combo.priceCombo !== undefined && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Giá:</span>{" "}
                {formatPrice(combo.priceCombo)}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleToggleActive}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              combo.active
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
          >
            <FaPowerOff />
            <span>{combo.active ? "Ngưng" : "Kích hoạt"}</span>
          </button>
          <NavLink
            to={`../combo-detail/${comboId}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all flex items-center space-x-2"
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
      const response = await fetch("http://localhost:8080/vaccinecombo", {
        method: "GET",
        credentials: "include",
        withCredentials: true,
      });
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
      const response = await fetch("http://localhost:8080/vaccinecombo/create", {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCombo),
      });
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-4">
            <FaFlask className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-light text-gray-800">
              Quản Lý Combo Vaccine
            </h1>
            
          </div>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Tra cứu, quản lý và theo dõi danh sách combo vaccine trong hệ thống
            tiêm chủng
          </p>
        </header>

        <div className="bg-white shadow-xl rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full">
              <div className="relative flex-grow">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setSearchValueMin("");
                    setSearchValueMax("");
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Tìm theo tên</option>
                  <option value="price">Tìm theo giá</option>
                </select>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {searchType === "name" && (
                <input
                  type="text"
                  placeholder="Nhập tên combo"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-grow pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              {searchType === "price" && (
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={searchValueMin}
                    onChange={(e) => setSearchValueMin(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={searchValueMax}
                    onChange={(e) => setSearchValueMax(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "active"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "inactive"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Không hoạt động
                </button>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus />
                <span>Tạo mới Combo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCombos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaFlask className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
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