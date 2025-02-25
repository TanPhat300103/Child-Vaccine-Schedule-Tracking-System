// src/pages/Customers/CustomersPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  getUsers,
  postUsers,
  updateUser,
  fetchChildren,
  fetchCustomer,
  deleteUser,
} from "../../apis/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getUsers();
        setCustomers(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleDelete = async (customerId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        const response = await deleteUser(customerId);

        if (response.success) {
          setCustomers((prevCustomers) =>
            prevCustomers.filter(
              (customer) => customer.customerId !== customerId
            )
          );
          console.log(response.message);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error("Lỗi khi xóa khách hàng:", err);
        setError("Không thể xóa khách hàng. Vui lòng thử lại sau.");
      }
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh Sách Khách Hàng
          </h2>
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={handleSearch}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Họ Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SĐT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Địa Chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngân Hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng Thái
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.customerId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.banking}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        customer.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.active ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(customer.customerId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() =>
              alert("Chức năng xóa tất cả khách hàng chưa được triển khai")
            }
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Xóa Tất Cả Khách Hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;
