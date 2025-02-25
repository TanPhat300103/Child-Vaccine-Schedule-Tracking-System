import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    // BE tự tạo customerId nên không nhập
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

  // GET API danh sách khách hàng
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

  // Xử lý Active/Inactive
  const handleActive = (customerId, e) => {
    e.stopPropagation();
    console.log(
      "Gửi API cập nhật trạng thái active cho customerId:",
      customerId
    );
    fetch(`http://localhost:8080/customer/inactive?id=${customerId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((updatedCustomer) => {
        console.log(
          "POST API Active thành công. Dữ liệu trả về:",
          updatedCustomer
        );
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === updatedCustomer.customerId
              ? updatedCustomer
              : customer
          )
        );
      })
      .catch((error) => console.error("POST API Active lỗi:", error));
  };

  // Mở form cập nhật khách hàng
  const handleEdit = (customer, e) => {
    e.stopPropagation();
    console.log("Mở form cập nhật cho khách hàng:", customer);
    setEditingCustomer(customer);
    setUpdateError(null);
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
        console.log(
          "POST API Update thành công. Dữ liệu trả về:",
          updatedCustomer
        );
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
        console.error("POST API Update lỗi:", error);
        setUpdateError(error.message);
      });
  };

  // Xử lý thay đổi giá trị tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc danh sách khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.customerId.toLowerCase().includes(term) ||
      customer.firstName.toLowerCase().includes(term) ||
      customer.lastName.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term)
    );
  });

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
        console.log(
          "POST API Create thành công. Dữ liệu trả về:",
          createdCustomer
        );
        setCustomers((prev) => [...prev, createdCustomer]);
        setShowAddForm(false);
        // Reset form thêm khách hàng
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
      })
      .catch((error) => {
        console.error("POST API Create lỗi:", error);
        setNewCustomerError(error.message);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Danh sách Khách Hàng
      </h1>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => {
            setShowAddForm(true);
            setNewCustomerError(null);
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Thêm Khách Hàng
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-1/3"
        />
      </div>

      {/* Form Thêm Khách Hàng */}
      {showAddForm && (
        <div className="mb-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Thêm Khách Hàng Mới</h3>
          <div className="grid grid-cols-2 gap-4">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ
              </label>
              <input
                type="text"
                value={newCustomer.firstName}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, firstName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật Khẩu
              </label>
              <input
                type="password"
                value={newCustomer.password}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, password: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
          {newCustomerError && (
            <p className="text-red-500 text-sm mt-2">{newCustomerError}</p>
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
            >
              Tạo Mới
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Bảng danh sách khách hàng */}
      <table className="min-w-full border divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã Khách Hàng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số Điện Thoại
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Họ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Sinh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giới Tính
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa Chỉ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng Thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCustomers.map((customer) => (
            <React.Fragment key={customer.customerId}>
              <tr className="cursor-pointer hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.customerId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.dob}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.gender ? "Nam" : "Nữ"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.email}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    customer.active ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  {customer.active ? "Active" : "Inactive"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleActive(customer.customerId, e)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Active
                  </button>
                  <button
                    onClick={(e) => handleEdit(customer, e)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Cập Nhật
                  </button>
                  <Link
                    to={`/staff/childs/${customer.customerId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Xem Hồ Sơ Trẻ Em
                  </Link>
                </td>
              </tr>
              {/* Form cập nhật khách hàng */}
              {editingCustomer &&
                editingCustomer.customerId === customer.customerId && (
                  <tr>
                    <td colSpan="10" className="px-6 py-4">
                      <div className="p-4 border border-gray-300 rounded-md">
                        <h3 className="text-xl font-semibold mb-4">
                          Cập Nhật Khách Hàng
                        </h3>
                        <div className="mb-3">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div className="mb-3">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div className="mb-3">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div className="mb-3">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div className="mb-3">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        {updateError && (
                          <p className="text-red-500 text-sm mt-2">
                            {updateError}
                          </p>
                        )}
                        <div className="flex space-x-4 mt-4">
                          <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingCustomer(null)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Outlet hiển thị các route con, ví dụ Childs */}
      <Outlet />
    </div>
  );
};

export default Customers;
