// src/pages/Staff/Vaccines.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  FaSyringe,
  FaSearch,
  FaPlus,
  FaPowerOff,
  FaVial,
} from "react-icons/fa";

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
      .get("http://localhost:8080/vaccine", {
        withCredentials: true,
      })
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
      .post(`http://localhost:8080/vaccine/active?id=${id}`, {
        withCredentials: true,
      })
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
      .post("http://localhost:8080/vaccine/create", newVaccine, {
        withCredentials: true,
      })
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
          .post(
            "http://localhost:8080/vaccinedetail/create",
            vaccineDetailData,
            {
              withCredentials: true,
            }
          )
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

  // VaccineItem Component
  const VaccineItem = ({ vaccine, onVaccineUpdated, onToggleActive }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVaccine, setEditingVaccine] = useState(null);
    const [originalEditingVaccine, setOriginalEditingVaccine] = useState(null);

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
          className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all group"
          onClick={handleOpenModal}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaVial className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {vaccine.name}
              </h3>
              <p className="text-sm text-gray-500">
                Số liều: {vaccine.doseNumber} | Giá:{" "}
                {vaccine.price.toLocaleString()} VND
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleActiveLocal}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                vaccine.active
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }`}
            >
              <FaPowerOff />
              <span>{vaccine.active ? "Ngưng" : "Kích hoạt"}</span>
            </button>
            <NavLink
              to={`../vaccine-detail/${vaccine.vaccineId}`}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all flex items-center space-x-2"
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-4">
            <FaSyringe className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-light text-gray-800">
              Quản Lý Vắc Xin
            </h1>
          </div>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Tra cứu, quản lý và theo dõi danh sách vắc xin trong hệ thống tiêm
            chủng
          </p>
        </header>

        {/* Search and Filter Section */}
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
                  <option value="age">Tìm theo độ tuổi</option>
                </select>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {searchType === "name" && (
                <input
                  type="text"
                  placeholder="Nhập tên vaccine"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-grow pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              {(searchType === "price" || searchType === "age") && (
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
            <button
              onClick={() => setShowCreateModal(true)}
              className="ml-4 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              <span>Tạo mới Vaccine</span>
            </button>
          </div>
        </div>

        {/* Vaccine List */}
        <div className="space-y-4">
          {filteredVaccines.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <FaSyringe className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
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
