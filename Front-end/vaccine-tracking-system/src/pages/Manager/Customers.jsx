import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaPowerOff,
  FaChild,
  FaEye,
  FaEyeSlash,
  FaMars,
  FaVenus,
} from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // Search state: chọn loại tìm kiếm và từ khóa
  const [searchType, setSearchType] = useState("name"); // "name", "code", "email"
  const [searchTerm, setSearchTerm] = useState("");

  // Filter trạng thái: "all", "active", "inactive"
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal tạo mới
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: true,
    password: "",
    address: "",
    banking: "",
    email: "",
    roleId: 3,
    active: true,
  });
  const [newCustomerError, setNewCustomerError] = useState(null);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);

  // Lấy danh sách khách hàng từ API
  useEffect(() => {
    fetch("http://localhost:8080/customer")
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API thành công. Dữ liệu khách hàng:", data);
        setCustomers(data);
      })
      .catch((error) =>
        console.error("GET API lỗi khi lấy dữ liệu khách hàng:", error)
      );
  }, []);

  // Xử lý Active/Inactive: nút tích hợp trạng thái với icon và chữ
  const handleActive = (customerId, e) => {
    e.stopPropagation();
    console.log("Gửi API cập nhật trạng thái active cho:", customerId);
    fetch(`http://localhost:8080/customer/inactive?id=${customerId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((updatedCustomer) => {
        console.log("API Active thành công:", updatedCustomer);
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === updatedCustomer.customerId
              ? updatedCustomer
              : customer
          )
        );
      })
      .catch((error) => console.error("API Active lỗi:", error));
  };

  // Khi bấm vào card (ngoại trừ các nút riêng) sẽ mở modal chỉnh sửa
  const handleEdit = (customer, e) => {
    e.stopPropagation();
    console.log("Mở form cập nhật cho khách hàng:", customer);
    setEditingCustomer(customer);
    setUpdateError(null);
    setEditingPasswordVisible(false);
  };

  // Gửi API cập nhật khách hàng
  const handleSave = () => {
    console.log("Gửi API cập nhật khách hàng với dữ liệu:", editingCustomer);
    fetch("http://localhost:8080/customer/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi không xác định khi cập nhật.");
          });
        }
        return response.json();
      })
      .then((updatedCustomer) => {
        console.log("Cập nhật thành công:", updatedCustomer);
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === updatedCustomer.customerId
              ? updatedCustomer
              : customer
          )
        );
        setEditingCustomer(null);
        setUpdateError(null);
      })
      .catch((error) => {
        console.error("Cập nhật lỗi:", error);
        setUpdateError(error.message);
      });
  };

  // Gửi API tạo khách hàng mới
  const handleCreate = () => {
    console.log("Gửi API tạo khách hàng với dữ liệu:", newCustomer);
    fetch("http://localhost:8080/customer/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi không xác định khi tạo khách hàng.");
          });
        }
        return response.json();
      })
      .then((createdCustomer) => {
        console.log("Tạo khách hàng thành công:", createdCustomer);
        setCustomers((prev) => [...prev, createdCustomer]);
        setShowAddForm(false);
        setNewCustomer({
          phoneNumber: "",
          firstName: "",
          lastName: "",
          dob: "",
          gender: true,
          password: "",
          address: "",
          banking: "",
          email: "",
          roleId: 3,
          active: true,
        });
        setNewCustomerError(null);
        setNewPasswordVisible(false);
      })
      .catch((error) => {
        console.error("Tạo khách hàng lỗi:", error);
        setNewCustomerError(error.message);
      });
  };

  // Lọc danh sách khách hàng theo từ khóa và trạng thái
  const filteredCustomers = customers.filter((customer) => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (searchType === "name") {
        matchesSearch =
          customer.firstName.toLowerCase().includes(term) ||
          customer.lastName.toLowerCase().includes(term);
      } else if (searchType === "code") {
        matchesSearch = customer.customerId.toLowerCase().includes(term);
      } else if (searchType === "email") {
        matchesSearch = customer.email.toLowerCase().includes(term);
      }
    }
    let matchesStatus = true;
    if (filterStatus === "active") matchesStatus = customer.active;
    else if (filterStatus === "inactive") matchesStatus = !customer.active;
    return matchesSearch && matchesStatus;
  });

  // Hàm chuyển đổi trạng thái bộ lọc (cycle qua 3 trạng thái)
  const cycleFilterStatus = () => {
    if (filterStatus === "all") setFilterStatus("active");
    else if (filterStatus === "active") setFilterStatus("inactive");
    else if (filterStatus === "inactive") setFilterStatus("all");
  };

  // Xác định màu của nút trạng thái
  const filterButtonClass =
    filterStatus === "all"
      ? "bg-blue-500 hover:bg-blue-700"
      : filterStatus === "active"
      ? "bg-green-500 hover:bg-green-700"
      : "bg-red-500 hover:bg-red-700";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Danh sách Khách Hàng
      </h1>

      {/* Thanh Tìm Kiếm & Bộ Lọc */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchTerm("");
            }}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Tìm theo Tên</option>
            <option value="code">Tìm theo Mã</option>
            <option value="email">Tìm theo Email</option>
          </select>
          <input
            type="text"
            placeholder="Nhập từ khóa..."
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
            onClick={() => setShowAddForm(true)}
            className="border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-6 rounded-full hover:bg-yellow-500 hover:text-white transition-all"
          >
            Thêm Khách Hàng
          </button>
        </div>
      </div>

      {/* Danh sách khách hàng dạng Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.customerId}
            onClick={(e) => handleEdit(customer, e)}
            className="relative bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
          >
            {/* Icon giới tính to, hiển thị ở góc phải */}
            <div className="absolute top-2 right-2">
              {customer.gender ? (
                <FaMars size={28} className="text-blue-600" />
              ) : (
                <FaVenus size={28} className="text-pink-500" />
              )}
            </div>
            {/* Tên khách hàng nổi bật */}
            <h2 className="text-xl font-extrabold text-blue-600 mb-2">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                Mã:{" "}
              </span>
              {customer.customerId}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                SĐT:{" "}
              </span>
              {customer.phoneNumber}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                Email:{" "}
              </span>
              {customer.email}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                Địa chỉ:{" "}
              </span>
              {customer.address}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                Ngày sinh:{" "}
              </span>
              {new Date(customer.dob).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                Tài khoản:{" "}
              </span>
              {customer.banking}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-semibold uppercase text-gray-500">
                Mật khẩu:{" "}
              </span>
              ••••••
            </p>
            {/* Nút Active tích hợp trạng thái */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActive(customer.customerId, e);
                }}
                className={`text-white font-bold py-1 px-3 rounded flex items-center justify-center ${
                  customer.active
                    ? "bg-green-500 hover:bg-green-700"
                    : "bg-red-500 hover:bg-red-700"
                }`}
              >
                <FaPowerOff size={18} className="mr-1" />
                {customer.active ? "Active" : "Inactive"}
              </button>
              <Link
                to={`/staff/childs/${customer.customerId}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded flex items-center gap-1"
              >
                <FaChild size={18} />
                Hồ Sơ Trẻ Em
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tạo Khách Hàng */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
            <h3 className="text-2xl font-semibold mb-6">Thêm Khách Hàng Mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ
                </label>
                <input
                  type="text"
                  value={newCustomer.firstName}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
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
                  value={newCustomer.lastName}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, lastName: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  value={newCustomer.phoneNumber}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      phoneNumber: e.target.value,
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
                  value={newCustomer.dob}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, dob: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới Tính
                </label>
                <select
                  value={newCustomer.gender ? "true" : "false"}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      gender: e.target.value === "true",
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    value={newCustomer.password}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  >
                    {newPasswordVisible ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, address: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số Tài Khoản Ngân Hàng
                </label>
                <input
                  type="text"
                  value={newCustomer.banking}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, banking: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {newCustomerError && (
              <p className="text-red-500 text-sm mt-4">{newCustomerError}</p>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCreate}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Tạo Mới
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cập Nhật Khách Hàng */}
      {editingCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
            <h3 className="text-2xl font-semibold mb-6">Cập Nhật Khách Hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ
                </label>
                <input
                  type="text"
                  value={editingCustomer.firstName}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      firstName: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  value={editingCustomer.lastName}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      lastName: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số Điện Thoại
                </label>
                <input
                  type="text"
                  value={editingCustomer.phoneNumber}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  value={editingCustomer.dob}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      dob: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới Tính
                </label>
                <select
                  value={editingCustomer.gender ? "true" : "false"}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      gender: e.target.value === "true",
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <input
                    type={editingPasswordVisible ? "text" : "password"}
                    value={editingCustomer.password}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPasswordVisible(!editingPasswordVisible)
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  >
                    {editingPasswordVisible ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      address: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số Tài Khoản Ngân Hàng
                </label>
                <input
                  type="text"
                  value={editingCustomer.banking}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      banking: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      email: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            {updateError && (
              <p className="text-red-500 text-sm mt-4">{updateError}</p>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Lưu
              </button>
              <button
                onClick={() => setEditingCustomer(null)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Customers;
