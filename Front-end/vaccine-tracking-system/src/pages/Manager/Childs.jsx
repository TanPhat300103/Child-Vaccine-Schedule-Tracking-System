import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPowerOff, FaChild } from "react-icons/fa";

const Childs = () => {
  const { customerId } = useParams();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [children, setChildren] = useState([]);

  // Search and filter state (chỉ tìm theo tên)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"

  // Modal state for adding and editing child
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [newChild, setNewChild] = useState({
    firstName: "",
    lastName: "",
    gender: true,
    dob: "",
    contraindications: "",
    active: true,
  });
  const [childError, setChildError] = useState(null);

  const [editingChild, setEditingChild] = useState(null);
  const [childUpdateError, setChildUpdateError] = useState(null);

  // Lấy thông tin khách hàng
  useEffect(() => {
    fetch(`http://localhost:8080/customer/findid?id=${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API thông tin khách hàng:", data);
        setCustomerInfo(data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy thông tin khách hàng:", error)
      );
  }, [customerId]);

  // Lấy danh sách hồ sơ trẻ em
  useEffect(() => {
    fetch(`http://localhost:8080/child/findbycustomer?id=${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API hồ sơ trẻ em:", data);
        setChildren(data);
      })
      .catch((error) => console.error("Lỗi khi lấy hồ sơ trẻ em:", error));
  }, [customerId]);

  // Tạo hồ sơ trẻ em mới
  const handleCreateChild = () => {
    console.log("Gửi API tạo hồ sơ trẻ em với dữ liệu:", newChild);
    fetch("http://localhost:8080/child/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Gửi kèm thông tin khách hàng để BE gán lại customerId
      body: JSON.stringify({ ...newChild, customer: customerInfo }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi khi tạo hồ sơ trẻ em.");
          });
        }
        return response.json();
      })
      .then((createdChild) => {
        console.log("Tạo hồ sơ trẻ em thành công:", createdChild);
        setChildren((prev) => [...prev, createdChild]);
        setShowAddChildForm(false);
        setNewChild({
          firstName: "",
          lastName: "",
          gender: true,
          dob: "",
          contraindications: "",
          active: true,
        });
        setChildError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi tạo hồ sơ trẻ em:", error);
        setChildError(error.message);
      });
  };

  // Mở form cập nhật hồ sơ trẻ em
  const handleChildEdit = (child, e) => {
    e.stopPropagation();
    console.log("Mở form cập nhật hồ sơ trẻ em:", child);
    setEditingChild(child);
    setChildUpdateError(null);
  };

  // Gửi API cập nhật hồ sơ trẻ em
  const handleChildSave = () => {
    console.log("Gửi API cập nhật hồ sơ trẻ em với dữ liệu:", editingChild);
    fetch("http://localhost:8080/child/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingChild),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi khi cập nhật hồ sơ trẻ em.");
          });
        }
        return response.json();
      })
      .then((updatedChild) => {
        console.log("Cập nhật hồ sơ trẻ em thành công:", updatedChild);
        setChildren((prev) =>
          prev.map((child) =>
            child.childId === updatedChild.childId ? updatedChild : child
          )
        );
        setEditingChild(null);
        setChildUpdateError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật hồ sơ trẻ em:", error);
        setChildUpdateError(error.message);
      });
  };

  // Chuyển trạng thái active/inactive cho hồ sơ trẻ em
  const handleChildInactive = (childId, e) => {
    e.stopPropagation();
    console.log("Gửi API cập nhật trạng thái cho childId:", childId);
    fetch(`http://localhost:8080/child/active?id=${childId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((updatedChild) => {
        console.log("Cập nhật trạng thái thành công:", updatedChild);
        setChildren((prev) =>
          prev.map((child) =>
            child.childId === updatedChild.childId ? updatedChild : child
          )
        );
      })
      .catch((error) =>
        console.error("Lỗi khi cập nhật trạng thái hồ sơ trẻ em:", error)
      );
  };

  // Lọc danh sách hồ sơ trẻ em theo tên và trạng thái
  const filteredChildren = children.filter((child) => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      matchesSearch =
        child.firstName.toLowerCase().includes(term) ||
        child.lastName.toLowerCase().includes(term);
    }
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = child.active;
    } else if (filterStatus === "inactive") {
      matchesStatus = !child.active;
    }
    return matchesSearch && matchesStatus;
  });

  // Hàm chuyển đổi trạng thái bộ lọc (cycle qua "all" -> "active" -> "inactive" -> "all")
  const cycleFilterStatus = () => {
    if (filterStatus === "all") setFilterStatus("active");
    else if (filterStatus === "active") setFilterStatus("inactive");
    else if (filterStatus === "inactive") setFilterStatus("all");
  };

  const filterButtonClass =
    filterStatus === "all"
      ? "bg-blue-500 hover:bg-blue-700"
      : filterStatus === "active"
      ? "bg-green-500 hover:bg-green-700"
      : "bg-red-500 hover:bg-red-700";

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header: hiển thị thông tin khách hàng bên trái, danh sách hồ sơ bên phải */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cột trái: Thông tin khách hàng */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              {customerInfo
                ? `${customerInfo.firstName} ${customerInfo.lastName}`
                : "Thông tin khách hàng"}
            </h2>
            {customerInfo && (
              <>
                <p className="text-gray-700">
                  <strong>SĐT:</strong> {customerInfo.phoneNumber}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {customerInfo.email}
                </p>
                <p className="text-gray-700">
                  <strong>Địa chỉ:</strong> {customerInfo.address}
                </p>
              </>
            )}
          </div>
          <Link
            to="/staff/customers"
            className="inline-block mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách khách hàng
          </Link>
        </div>

        {/* Cột phải: Danh sách hồ sơ trẻ em */}
        <div className="md:w-2/3">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={cycleFilterStatus}
                className={`${filterButtonClass} text-white font-bold py-3 px-6 rounded-lg`}
              >
                {filterStatus === "all"
                  ? "Hiện Tất Cả"
                  : filterStatus === "active"
                  ? "Đang Hoạt Động"
                  : "Đã Dừng"}
              </button>
              <button
                onClick={() => setShowAddChildForm(true)}
                className="border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-6 rounded-full hover:bg-yellow-500 hover:text-white transition-all"
              >
                Thêm Hồ Sơ Trẻ Em
              </button>
            </div>
          </div>

          {/* Danh sách hồ sơ trẻ em hiển thị dạng Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredChildren.map((child) => (
              <div
                key={child.childId}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
              >
                <h3 className="text-xl font-extrabold text-blue-600 mb-2">
                  {child.firstName} {child.lastName}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Mã:</strong> {child.childId}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Giới Tính:</strong> {child.gender ? "Nam" : "Nữ"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Ngày Sinh:</strong>{" "}
                  {new Date(child.dob).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Chống chỉ định:</strong> {child.contraindications}
                </p>
                <p
                  className={`text-sm font-bold ${
                    child.active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {child.active ? "Active" : "Inactive"}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={(e) => handleChildInactive(child.childId, e)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex items-center justify-center"
                  >
                    <FaPowerOff size={18} />
                  </button>
                  <button
                    onClick={(e) => handleChildEdit(child, e)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Cập Nhật
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Tạo Hồ Sơ Trẻ Em */}
      {showAddChildForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
            <h3 className="text-2xl font-semibold mb-6">
              Thêm Hồ Sơ Trẻ Em Mới
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ
                </label>
                <input
                  type="text"
                  value={newChild.firstName}
                  onChange={(e) =>
                    setNewChild({ ...newChild, firstName: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  value={newChild.lastName}
                  onChange={(e) =>
                    setNewChild({ ...newChild, lastName: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  value={newChild.dob}
                  onChange={(e) =>
                    setNewChild({ ...newChild, dob: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới Tính
                </label>
                <select
                  value={newChild.gender ? "true" : "false"}
                  onChange={(e) =>
                    setNewChild({
                      ...newChild,
                      gender: e.target.value === "true",
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chống chỉ định
                </label>
                <input
                  type="text"
                  value={newChild.contraindications}
                  onChange={(e) =>
                    setNewChild({
                      ...newChild,
                      contraindications: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {childError && (
              <p className="text-red-500 text-sm mt-4">{childError}</p>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCreateChild}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Tạo Mới
              </button>
              <button
                onClick={() => setShowAddChildForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cập Nhật Hồ Sơ Trẻ Em */}
      {editingChild && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
            <h3 className="text-2xl font-semibold mb-6">
              Cập Nhật Hồ Sơ Trẻ Em
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ
                </label>
                <input
                  type="text"
                  value={editingChild.firstName}
                  onChange={(e) =>
                    setEditingChild({
                      ...editingChild,
                      firstName: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  value={editingChild.lastName}
                  onChange={(e) =>
                    setEditingChild({
                      ...editingChild,
                      lastName: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  value={editingChild.dob}
                  onChange={(e) =>
                    setEditingChild({
                      ...editingChild,
                      dob: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới Tính
                </label>
                <select
                  value={editingChild.gender ? "true" : "false"}
                  onChange={(e) =>
                    setEditingChild({
                      ...editingChild,
                      gender: e.target.value === "true",
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chống chỉ định
                </label>
                <input
                  type="text"
                  value={editingChild.contraindications}
                  onChange={(e) =>
                    setEditingChild({
                      ...editingChild,
                      contraindications: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {childUpdateError && (
              <p className="text-red-500 text-sm mt-4">{childUpdateError}</p>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleChildSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Lưu
              </button>
              <button
                onClick={() => setEditingChild(null)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Childs;
