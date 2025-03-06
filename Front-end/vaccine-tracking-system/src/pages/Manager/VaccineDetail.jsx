import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import { FaEdit, FaPowerOff } from "react-icons/fa";

// --- Component VaccineDetailItem ---
const VaccineDetailItem = ({ detail, onDetailUpdated, onToggleStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Sử dụng state cho imageUrl để kiểm soát input hình ảnh trong modal
  const [imageUrl, setImageUrl] = useState(detail.img || "");

  // Khi người dùng bấm nút trạng thái, gọi hàm callback của parent
  const handleToggleStatus = () => {
    onToggleStatus(detail.id, detail.status);
  };

  // Xử lý cập nhật thông tin VaccineDetail thông qua API
  const handleUpdate = (updatedData) => {
    console.log("Gửi API cập nhật với dữ liệu:", updatedData);
    axios
      .post(`http://localhost:8080/vaccinedetail/update`, updatedData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Cập nhật VaccineDetail thành công:", res.data);
        onDetailUpdated(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error("Cập nhật VaccineDetail thất bại:", err);
      });
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 transition-all hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col h-full">
        <img
          src={detail.img || "https://via.placeholder.com/150"}
          alt={detail.vaccine?.name || "Vaccine Detail"}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-blue-700 mb-2 truncate">
          {detail.vaccine?.name || "Không có tên vaccine"}
        </h3>
        <div className="text-sm text-gray-600 space-y-1 flex-1">
          <p>
            <span className="font-medium">ID:</span> {detail.id}
          </p>
          <p>
            <span className="font-medium">Ngày nhập:</span> {detail.entryDate}
          </p>
          <p>
            <span className="font-medium">Ngày hết hạn:</span>{" "}
            {detail.expiredDate}
          </p>
          <p>
            <span className="font-medium">Số ngày:</span> {detail.day}
          </p>
          <p>
            <span className="font-medium">Dung sai:</span> {detail.tolerance}
          </p>
          <p>
            <span className="font-medium">Số lượng:</span> {detail.quantity}
          </p>
        </div>
        {/* Nút trạng thái và nút chỉnh sửa trên cùng một dòng */}
        <div className="flex justify-end mt-3 space-x-2">
          <button
            onClick={handleToggleStatus}
            className="flex items-center bg-gray-200 px-3 py-1 rounded-lg transition-all text-sm"
          >
            <FaPowerOff className="mr-1" />
            <span className={detail.status ? "text-green-500" : "text-red-500"}>
              {detail.status ? "Bật" : "Tắt"}
            </span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all text-sm"
          >
            <FaEdit className="mr-1" /> Sửa
          </button>
        </div>
      </div>

      {/* Modal cập nhật VaccineDetail */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Cập nhật Vaccine Detail
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDetail = {
                  ...detail,
                  entryDate: e.target.entryDate.value,
                  expiredDate: e.target.expiredDate.value,
                  day: Number(e.target.day.value) || 0,
                  tolerance: Number(e.target.tolerance.value) || 0,
                  quantity: Number(e.target.quantity.value) || 0,
                  img: imageUrl || null, // Nếu không nhập URL thì sẽ set là null
                };
                handleUpdate(updatedDetail);
              }}
            >
              <label className="block mb-3">
                Ngày nhập:
                <input
                  type="date"
                  name="entryDate"
                  defaultValue={detail.entryDate}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Ngày hết hạn:
                <input
                  type="date"
                  name="expiredDate"
                  defaultValue={detail.expiredDate}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Số ngày:
                <input
                  type="number"
                  name="day"
                  defaultValue={detail.day}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Dung sai:
                <input
                  type="number"
                  name="tolerance"
                  defaultValue={detail.tolerance}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                Số lượng:
                <input
                  type="number"
                  name="quantity"
                  defaultValue={detail.quantity}
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
              <label className="block mb-3">
                URL Hình ảnh:
                <input
                  type="text"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                  placeholder="Nhập URL hình ảnh (để trống để xóa ảnh)"
                />
              </label>
              {imageUrl && (
                <div className="mb-3">
                  <img
                    src={imageUrl}
                    alt="Current Vaccine Detail"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
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

// --- Component chính VaccineDetail ---
const VaccineDetail = () => {
  const { vaccineId } = useParams();
  const [vaccineDetails, setVaccineDetails] = useState([]);

  useEffect(() => {
    fetchVaccineDetails();
  }, [vaccineId]);

  const fetchVaccineDetails = () => {
    axios
      .get(
        `http://localhost:8080/vaccinedetail/findbyvaccine?id=${vaccineId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("API fetch VaccineDetail thành công:", res.data);
        setVaccineDetails(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy VaccineDetail:", err));
  };

  const handleDetailUpdated = (updatedDetail) => {
    setVaccineDetails((prev) =>
      prev.map((d) => (d.id === updatedDetail.id ? updatedDetail : d))
    );
  };
  const handleToggleStatus = (detailId, currentStatus) => {
    console.log(
      "Đang chuyển trạng thái cho detailId:",
      detailId,
      "Trạng thái hiện tại:",
      currentStatus
    );
    axios
      .post(`http://localhost:8080/vaccinedetail/active?id=${detailId}`, null, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("API toggle status thành công:", res.data);
        setVaccineDetails((prev) =>
          prev.map((d) =>
            d.id === detailId ? { ...d, status: !currentStatus } : d
          )
        );
      })
      .catch((err) =>
        console.error("Lỗi chuyển trạng thái VaccineDetail:", err)
      );
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Danh sách Vaccine Detail cho Vaccine {vaccineId}
        </h2>
        <div className="mb-4 text-center">
          <NavLink
            to="../vaccines"
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
          >
            Quay lại Vaccine
          </NavLink>
        </div>
        {vaccineDetails.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Không tìm thấy Vaccine Detail nào
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vaccineDetails.map((detail) => (
              <VaccineDetailItem
                key={detail.id}
                detail={detail}
                onDetailUpdated={handleDetailUpdated}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineDetail;
