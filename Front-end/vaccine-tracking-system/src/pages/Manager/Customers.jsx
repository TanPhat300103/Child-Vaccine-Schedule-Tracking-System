import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaUserMd,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaChild,
  FaPowerOff,
  FaEye,
  FaEyeSlash,
  FaMars,
  FaVenus,
} from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [originalEditingCustomer, setOriginalEditingCustomer] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
    active: true,
  });
  const [newCustomerError, setNewCustomerError] = useState(null);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/customer", {
      method: "GET",
      credentials: "include",
      withCredentials: true,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API thành công. Dữ liệu khách hàng:", data);
        setCustomers(data);
      })
      .catch((error) =>
        console.error("GET API lỗi khi lấy dữ liệu khách hàng:", error)
      );
  }, []);

  const handleActive = (customerId, e) => {
    e.stopPropagation();
    console.log("Gửi API cập nhật trạng thái active cho:", customerId);
    fetch(`http://localhost:8080/customer/inactive?id=${customerId}`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
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

  const handleEdit = (customer, e) => {
    e.stopPropagation();
    console.log("Mở form cập nhật cho khách hàng:", customer);
    setEditingCustomer({ ...customer });
    setOriginalEditingCustomer({ ...customer });
    setUpdateError(null);
    setEditingPasswordVisible(false);
  };

  const isChanged = () => {
    return (
      JSON.stringify(editingCustomer) !==
      JSON.stringify(originalEditingCustomer)
    );
  };

  const handleSave = () => {
    console.log("Gửi API cập nhật khách hàng với dữ liệu:", editingCustomer);
    fetch("http://localhost:8080/customer/update", {
      method: "POST",
      credentials: "include",
      withCredentials: true,
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
        setOriginalEditingCustomer(null);
        setUpdateError(null);
      })
      .catch((error) => {
        console.error("Cập nhật lỗi:", error);
        setUpdateError(error.message);
      });
  };

  const handleCreate = () => {
    console.log("Gửi API tạo khách hàng với dữ liệu:", newCustomer);
    fetch("http://localhost:8080/customer/create", {
      method: "POST",
      credentials: "include",
      withCredentials: true,
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

  // Hàm chuyển đổi trạng thái bộ lọc
  const cycleFilterStatus = () => {
    if (filterStatus === "all") setFilterStatus("active");
    else if (filterStatus === "active") setFilterStatus("inactive");
    else if (filterStatus === "inactive") setFilterStatus("all");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-4">
            <FaUserMd className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-light text-gray-800">
              Quản Lý Khách Hàng
            </h1>
          </div>
          <p className="mt-4 text-gray-500">
            Tra cứu và quản lý thông tin khách hàng
          </p>
        </header>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-xl rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchTerm("");
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Tìm theo Tên</option>
                  <option value="code">Tìm theo Mã</option>
                  <option value="email">Tìm theo Email</option>
                </select>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex space-x-4">
              {/* Nút Hiện Theo Trạng Thái */}
              <button
                onClick={cycleFilterStatus}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : filterStatus === "active"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                <FaFilter />
                <span>
                  {filterStatus === "all"
                    ? "Tất Cả"
                    : filterStatus === "active"
                    ? "Hoạt Động"
                    : "Ngừng"}
                </span>
              </button>
              {/* Nút Thêm Khách Hàng */}
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaUserPlus />
                <span>Thêm Khách Hàng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.customerId}
              onClick={(e) => handleEdit(customer, e)}
              className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mã Khách Hàng: {customer.customerId}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => handleActive(customer.customerId, e)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    customer.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <FaPowerOff />
                  <span>{customer.active ? "Hoạt Động" : "Ngừng"}</span>
                </button>
                <Link
                  to={`/staff/childs/${customer.customerId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <FaChild />
                  <span>Hồ Sơ Trẻ Em</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal chỉnh sửa khách hàng */}
        {editingCustomer && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
              <h3 className="text-2xl font-semibold mb-6">
                Cập Nhật Khách Hàng
              </h3>
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    className="mt-1 w-full rounded-md ring-1 ring-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              {updateError && (
                <p className="text-red-500 text-sm mt-4">{updateError}</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!isChanged()}
                  className={`font-bold py-2 px-4 rounded-lg ${
                    isChanged()
                      ? "bg-green-500 hover:bg-green-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
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

        {/* Modal thêm khách hàng */}
        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl ring-1 ring-gray-200">
              <h3 className="text-2xl font-semibold mb-6">
                Thêm Khách Hàng Mới
              </h3>
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
                      setNewCustomer({
                        ...newCustomer,
                        lastName: e.target.value,
                      })
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
                      setNewCustomer({
                        ...newCustomer,
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
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
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
                      setNewCustomer({
                        ...newCustomer,
                        banking: e.target.value,
                      })
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
                      setNewCustomer({
                        ...newCustomer,
                        email: e.target.value,
                      })
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
                  Thêm
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
      </div>
      <Outlet />
    </div>
  );
};

export default Customers;
