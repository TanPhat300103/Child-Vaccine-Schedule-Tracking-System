import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaEdit, FaPowerOff } from "react-icons/fa";

// --- Component VaccineItem ---
const VaccineItem = ({ vaccine, onVaccineUpdated, onToggleActive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleActive = () => {
    onToggleActive(vaccine.vaccineId, vaccine.active);
  };

  const handleUpdate = (updatedData) => {
    onVaccineUpdated(updatedData);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 transition-all hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col h-full">
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
              vaccine.active
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <FaPowerOff className="mr-1" />
            {vaccine.active ? "Ngưng" : "Kích hoạt"}
          </button>
        </div>
        <div className="mt-3">
          <NavLink
            to={`../vaccine-detail/${vaccine.vaccineId}`}
            className="w-full block text-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all text-sm"
          >
            Chi tiết
          </NavLink>
        </div>
      </div>

      {/* Modal cập nhật Vaccine */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Cập nhật Vaccine</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedVaccine = {
                  vaccineId: vaccine.vaccineId,
                  name: e.target.name.value,
                  doseNumber: Number(e.target.doseNumber.value) || 0,
                  price: Number(e.target.price.value) || 0,
                  description: e.target.description.value,
                  country: e.target.country.value,
                  ageMin: Number(e.target.ageMin.value) || 0,
                  ageMax: Number(e.target.ageMax.value) || 0,
                  active: vaccine.active, // giữ nguyên trạng thái active
                };
                handleUpdate(updatedVaccine);
              }}
            >
              <label className="block mb-3">
                Tên Vaccine:
                <input
                  type="text"
                  name="name"
                  defaultValue={vaccine.name}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Số liều:
                <input
                  type="number"
                  name="doseNumber"
                  defaultValue={vaccine.doseNumber}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Giá (VND):
                <input
                  type="number"
                  name="price"
                  defaultValue={vaccine.price}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Mô tả:
                <input
                  type="text"
                  name="description"
                  defaultValue={vaccine.description}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Xuất xứ:
                <input
                  type="text"
                  name="country"
                  defaultValue={vaccine.country}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Độ tuổi tối thiểu:
                <input
                  type="number"
                  name="ageMin"
                  defaultValue={vaccine.ageMin}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Độ tuổi tối đa:
                <input
                  type="number"
                  name="ageMax"
                  defaultValue={vaccine.ageMax}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// --- Component chính Vaccines ---
const Vaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  // State tìm kiếm theo tiêu chí
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  // Đối với tìm kiếm theo range (price hoặc age)
  const [searchValueMin, setSearchValueMin] = useState("");
  const [searchValueMax, setSearchValueMax] = useState("");
  // State cho modal tạo mới
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = () => {
    axios
      .get("http://localhost:8080/vaccine")
      .then((res) => {
        console.log("Fetch vaccines success:", res.data);
        setVaccines(res.data);
      })
      .catch((err) => console.error("Lỗi:", err));
  };

  const handleVaccineUpdated = (updatedVaccine) => {
    setVaccines((prev) =>
      prev.map((v) =>
        v.vaccineId === updatedVaccine.vaccineId ? updatedVaccine : v
      )
    );
  };

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

  // Lọc danh sách vaccine dựa theo tiêu chí tìm kiếm
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

  // Xử lý tạo mới Vaccine và Vaccine Detail
  const handleCreateVaccine = (e) => {
    e.preventDefault();
    const form = e.target;
    // Thu thập dữ liệu Vaccine (không cần nhập mã vaccine)
    const vaccineData = {
      name: form.name.value,
      doseNumber: Number(form.doseNumber.value) || 0,
      price: Number(form.price.value) || 0,
      description: form.description.value,
      country: form.country.value,
      ageMin: Number(form.ageMin.value) || 0,
      ageMax: Number(form.ageMax.value) || 0,
      active: true,
    };

    console.log("Creating vaccine:", vaccineData);
    axios
      .post("http://localhost:8080/vaccine/create", vaccineData)
      .then((res) => {
        console.log("Vaccine created successfully:", res.data);
        const createdVaccine = res.data;
        // Thu thập dữ liệu Vaccine Detail
        const vaccineDetailData = {
          vaccine: createdVaccine, // sử dụng vaccine được tạo trả về từ BE
          entryDate: form.entryDate.value,
          expiredDate: form.expiredDate.value,
          status: true,
          img: form.img.value,
          day: Number(form.day.value) || 0,
          tolerance: Number(form.tolerance.value) || 0,
          quantity: Number(form.quantity.value) || 0,
        };
        axios
          .post("http://localhost:8080/vaccinedetail/create", vaccineDetailData)
          .then((resDetail) => {
            console.log("Vaccine detail created successfully:", resDetail.data);
            setShowCreateModal(false);
            fetchVaccines();
          })
          .catch((err) => console.error("Lỗi khi tạo Vaccine Detail:", err));
      })
      .catch((err) => console.error("Lỗi khi tạo Vaccine:", err));
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Danh sách Vắc xin
        </h2>
        {/* Thanh tìm kiếm theo tiêu chí */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              // Reset các giá trị tìm kiếm khi đổi tiêu chí
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

        {filteredVaccines.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không tìm thấy vaccine nào
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      />
                    </label>
                    <label className="block mb-3">
                      Số liều:
                      <input
                        type="number"
                        name="doseNumber"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Giá (VND):
                      <input
                        type="number"
                        name="price"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Mô tả:
                      <input
                        type="text"
                        name="description"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Xuất xứ:
                      <input
                        type="text"
                        name="country"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Độ tuổi tối thiểu:
                      <input
                        type="number"
                        name="ageMin"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Độ tuổi tối đa:
                      <input
                        type="number"
                        name="ageMax"
                        required
                        className="w-full border p-2 rounded mt-1"
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
                      />
                    </label>
                    <label className="block mb-3">
                      Ngày hết hạn:
                      <input
                        type="date"
                        name="expiredDate"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      URL Hình ảnh:
                      <input
                        type="text"
                        name="img"
                        className="w-full border p-2 rounded mt-1"
                        placeholder="Nhập URL hình ảnh (nếu có)"
                      />
                    </label>
                    <label className="block mb-3">
                      Số ngày:
                      <input
                        type="number"
                        name="day"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Dung sai:
                      <input
                        type="number"
                        name="tolerance"
                        required
                        className="w-full border p-2 rounded mt-1"
                      />
                    </label>
                    <label className="block mb-3">
                      Số lượng:
                      <input
                        type="number"
                        name="quantity"
                        required
                        className="w-full border p-2 rounded mt-1"
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
        {/* Nút mở modal Tạo mới Vaccine */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
          >
            Tạo mới Vaccine
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vaccines;
