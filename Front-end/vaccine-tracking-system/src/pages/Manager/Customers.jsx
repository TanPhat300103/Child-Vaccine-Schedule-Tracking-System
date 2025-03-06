import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaUser,
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center space-x-4">
            <FaUser className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-light text-gray-800">Quản Lý Khách Hàng</h1>
          </div>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Tra cứu, quản lý và theo dõi danh sách khách hàng trong hệ thống
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
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === "inactive"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Ngừng
                </button>
              </div>
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

        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.customerId}
              onClick={(e) => handleEdit(customer, e)}
              className="bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUser className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">Mã Khách Hàng: {customer.customerId}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={(e) => handleActive(customer.customerId, e)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    customer.active
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  <FaPowerOff />
                  <span>{customer.active ? "Ngừng" : "Hoạt Động"}</span>
                </button>
                <Link
                  to={`../childs/${customer.customerId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-200 transition-all"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
            <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl ring-1 ring-gray-200">
              <button
                onClick={() => setEditingCustomer(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <h2 className="text-2xl font-semibold mb-6">Cập Nhật Khách Hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật Khẩu
                  </label>
                  <input
                    type={editingPasswordVisible ? "text" : "password"}
                    value={editingCustomer.password}
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPasswordVisible(!editingPasswordVisible)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {editingPasswordVisible ? (
                      <FaEyeSlash size={20} className="text-gray-600" />
                    ) : (
                      <FaEye size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
            <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl ring-1 ring-gray-200">
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <h2 className="text-2xl font-semibold mb-6">Thêm Khách Hàng Mới</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật Khẩu
                  </label>
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    value={newCustomer.password}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {newPasswordVisible ? (
                      <FaEyeSlash size={20} className="text-gray-600" />
                    ) : (
                      <FaEye size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="mt-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
              {newCustomerError && (
                <p className="text-red-500 text-sm mt-4">{newCustomerError}</p>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCreate}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all text-sm font-medium flex items-center"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
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