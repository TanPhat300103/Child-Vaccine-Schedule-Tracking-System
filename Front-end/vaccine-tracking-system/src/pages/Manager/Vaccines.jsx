// src/pages/Staff/Vaccines.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaPowerOff, FaEye, FaEyeSlash } from "react-icons/fa";

const Vaccines = () => {
  // State danh sách vaccine và tìm kiếm
  const [vaccines, setVaccines] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [searchValueMin, setSearchValueMin] = useState("");
  const [searchValueMax, setSearchValueMax] = useState("");
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
  const [newVaccineDetail, setNewVaccineDetail] = useState({
    entryDate: "",
    expiredDate: "",
    img: "",
    day: 0,
    tolerance: 0,
    quantity: 0,
  });
  const [newVaccineError, setNewVaccineError] = useState(null);

  // Fetch vaccines từ API
  const fetchVaccines = () => {
    axios
      .get("http://localhost:8080/vaccine")
      .then((res) => {
        console.log("Fetch vaccines success:", res.data);
        setVaccines(res.data);
      })
      .catch((err) => console.error("Lỗi:", err));
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  // Lọc danh sách vaccine theo tiêu chí tìm kiếm
  const filteredVaccines = vaccines.filter((vaccine) => {
    if (searchType === "name") {
      return vaccine.name.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchType === "price") {
      const price = Number(vaccine.price);
      const minPrice = searchValueMin ? Number(searchValueMin) : -Infinity;
      const maxPrice = searchValueMax ? Number(searchValueMax) : Infinity;
      return price >= minPrice && price <= maxPrice;
    } else if (searchType === "age") {
      const vaccineAgeMin = Number(vaccine.ageMin);
      const vaccineAgeMax = Number(vaccine.ageMax);
      const inputMin = searchValueMin ? Number(searchValueMin) : -Infinity;
      const inputMax = searchValueMax ? Number(searchValueMax) : Infinity;
      return vaccineAgeMin >= inputMin && vaccineAgeMax <= inputMax;
    }
    return true;
  });

  // Cập nhật vaccine trong state sau chỉnh sửa
  const handleVaccineUpdated = (updatedVaccine) => {
    setVaccines((prev) =>
      prev.map((v) =>
        v.vaccineId === updatedVaccine.vaccineId ? updatedVaccine : v
      )
    );
  };

  // Toggle trạng thái active của vaccine
  const handleToggleActive = (id, currentStatus) => {
    axios
      .post(`http://localhost:8080/vaccine/active?id=${id}`)
      .then(() => {
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

  // Handle tạo mới Vaccine và Vaccine Detail
  const handleCreateVaccine = (e) => {
    e.preventDefault();
    console.log("Creating vaccine:", newVaccine);
    axios
      .post("http://localhost:8080/vaccine/create", newVaccine)
      .then((res) => {
        console.log("Vaccine created successfully:", res.data);
        const createdVaccine = res.data;
        const vaccineDetailData = {
          vaccine: createdVaccine,
          entryDate: newVaccineDetail.entryDate,
          expiredDate: newVaccineDetail.expiredDate,
          status: true,
          img: newVaccineDetail.img,
          day: Number(newVaccineDetail.day) || 0,
          tolerance: Number(newVaccineDetail.tolerance) || 0,
          quantity: Number(newVaccineDetail.quantity) || 0,
        };
        axios
          .post("http://localhost:8080/vaccinedetail/create", vaccineDetailData)
          .then((resDetail) => {
            console.log("Vaccine detail created successfully:", resDetail.data);
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
            setNewVaccineDetail({
              entryDate: "",
              expiredDate: "",
              img: "",
              day: 0,
              tolerance: 0,
              quantity: 0,
            });
            setNewVaccineError(null);
            fetchVaccines();
          })
          .catch((err) => console.error("Lỗi khi tạo Vaccine Detail:", err));
      })
      .catch((err) => {
        console.error("Lỗi khi tạo Vaccine:", err);
        setNewVaccineError(err.message);
      });
  };

  // --- Component VaccineItem ---
  // Mỗi item chỉ hiển thị tên của vaccine. Khi click, mở modal chỉnh sửa.
  const VaccineItem = ({ vaccine, onVaccineUpdated, onToggleActive }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVaccine, setEditingVaccine] = useState(null);
    const [originalEditingVaccine, setOriginalEditingVaccine] = useState(null);
    const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);

    const handleOpenModal = () => {
      setEditingVaccine({ ...vaccine });
      setOriginalEditingVaccine({ ...vaccine });
      setIsModalOpen(true);
    };

    const isChanged = () =>
      JSON.stringify(editingVaccine) !== JSON.stringify(originalEditingVaccine);

    const handleUpdate = () => {
      onVaccineUpdated(editingVaccine);
      setIsModalOpen(false);
    };

    const handleToggleActiveLocal = (e) => {
      e.stopPropagation();
      onToggleActive(vaccine.vaccineId, vaccine.active);
    };

    return (
      <>
        <div
          className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
          onClick={handleOpenModal}
        >
          <h3 className="text-xl font-bold text-blue-700">{vaccine.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleActiveLocal}
              className={`flex items-center px-3 py-1 rounded-lg text-white transition-all text-sm ${
                vaccine.active
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              <FaPowerOff size={18} className="mr-1" />
              {vaccine.active ? "Ngưng" : "Kích hoạt"}
            </button>
            <NavLink
              to={`../vaccine-detail/${vaccine.vaccineId}`}
              className="block text-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all text-sm"
            >
              Chi tiết
            </NavLink>
          </div>
        </div>

        {/* Modal chỉnh sửa Vaccine */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Cập Nhật Vaccine</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số liều:
                  </label>
                  <input
                    type="number"
                    value={editingVaccine.doseNumber}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        doseNumber: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả:
                  </label>
                  <input
                    type="text"
                    value={editingVaccine.description}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Xuất xứ:
                  </label>
                  <input
                    type="text"
                    value={editingVaccine.country}
                    onChange={(e) =>
                      setEditingVaccine({
                        ...editingVaccine,
                        country: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-2 rounded-md mr-2"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!isChanged()}
                  className={`font-bold py-2 px-4 rounded-lg ${
                    !isChanged()
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-700 text-white"
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
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Danh sách Vắc xin
        </h2>
        {/* Thanh tìm kiếm và nút tạo mới */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center items-center">
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
          <button
            onClick={() => {
              // Nếu cần, logic refresh tìm kiếm ở đây.
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
          >
            Tìm kiếm
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
          >
            Tạo mới Vaccine
          </button>
        </div>

        {filteredVaccines.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không tìm thấy vaccine nào
          </p>
        ) : (
          // Danh sách hiển thị theo hàng ngang: mỗi vaccine chỉ in tên
          <div className="flex flex-col gap-2">
            {filteredVaccines.map((vaccine) => (
              <VaccineItem
                key={vaccine.vaccineId}
                vaccine={vaccine}
                onVaccineUpdated={handleVaccineUpdated}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}

        {/* Modal Tạo mới Vaccine và Vaccine Detail */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                Tạo mới Vaccine và Vaccine Detail
              </h2>
              <form onSubmit={handleCreateVaccine}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thông tin Vaccine */}
                  <div>
                    <h3 className="font-semibold mb-2">Thông tin Vaccine</h3>
                    <label className="block mb-3">
                      Tên Vaccine:
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({ ...newVaccine, name: e.target.value })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Số liều:
                      <input
                        type="number"
                        name="doseNumber"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({
                            ...newVaccine,
                            doseNumber: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Giá (VND):
                      <input
                        type="number"
                        name="price"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({
                            ...newVaccine,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Mô tả:
                      <input
                        type="text"
                        name="description"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({
                            ...newVaccine,
                            description: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Xuất xứ:
                      <input
                        type="text"
                        name="country"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({
                            ...newVaccine,
                            country: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Độ tuổi tối thiểu:
                      <input
                        type="number"
                        name="ageMin"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({
                            ...newVaccine,
                            ageMin: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Độ tuổi tối đa:
                      <input
                        type="number"
                        name="ageMax"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccine({
                            ...newVaccine,
                            ageMax: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                  {/* Thông tin Vaccine Detail */}
                  <div>
                    <h3 className="font-semibold mb-2">
                      Thông tin Vaccine Detail
                    </h3>
                    <label className="block mb-3">
                      Ngày nhập:
                      <input
                        type="date"
                        name="entryDate"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccineDetail({
                            ...newVaccineDetail,
                            entryDate: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Ngày hết hạn:
                      <input
                        type="date"
                        name="expiredDate"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccineDetail({
                            ...newVaccineDetail,
                            expiredDate: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      URL Hình ảnh:
                      <input
                        type="text"
                        name="img"
                        className="w-full border p-2 rounded mt-1"
                        placeholder="Nhập URL hình ảnh (nếu có)"
                        onChange={(e) =>
                          setNewVaccineDetail({
                            ...newVaccineDetail,
                            img: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Số ngày:
                      <input
                        type="number"
                        name="day"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccineDetail({
                            ...newVaccineDetail,
                            day: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Dung sai:
                      <input
                        type="number"
                        name="tolerance"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccineDetail({
                            ...newVaccineDetail,
                            tolerance: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="block mb-3">
                      Số lượng:
                      <input
                        type="number"
                        name="quantity"
                        required
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) =>
                          setNewVaccineDetail({
                            ...newVaccineDetail,
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                  >
                    Tạo mới
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
