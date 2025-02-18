// src/pages/Customer/CustomerPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Child from "./Child"; // Component hiển thị thông tin trẻ em (dùng cho route riêng)
import AddChild from "./AddChild";
import Footer from "../../components/common/Footer";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiCalendar,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

// Lấy base API từ biến môi trường VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CustomerPage = () => {
  // Giả sử đang đăng nhập với customerId "cust001"
  const customerId = "cust001";
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCustomer(), fetchChildren()]);
      } catch (err) {
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Lấy thông tin customer (sử dụng endpoint /customers)
  // Sửa phần fetch customer
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customers/${customerId}`); // Sửa endpoint
      setCustomer(response.data); // Bỏ [0] vì API trả về object trực tiếp
    } catch (err) {
      console.error("Lỗi lấy thông tin khách hàng:", err);
    }
  };

  // Sửa phần fetch children
  const fetchChildren = async () => {
    try {
      const response = await axios.get(`${apiUrl}/child`, {
        params: { "customer.customerId": customerId },
      });
      setChildren(response.data);
    } catch (err) {
      console.error("Lỗi lấy thông tin trẻ em:", err);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchChildren();
  }, [customerId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!customer) return <div>Không tìm thấy khách hàng</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <button
              onClick={() => setActiveSection("profile")}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeSection === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              Hồ sơ của tôi
            </button>

            <div className="space-y-2">
              <h3 className="font-medium px-4">Hồ sơ trẻ em</h3>
              {children.map((child) => (
                <button
                  key={child.childId}
                  onClick={() => navigate(`/customer/child/${child.childId}`)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
                >
                  {child.firstName} {child.lastName}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveSection("add-child")}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Thêm trẻ em
            </button>

            <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md">
              Lịch tiêm chủng
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 rounded-md"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
          {activeSection === "profile" && customer && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                <p>
                  <strong>Họ và tên:</strong> {customer.firstName}{" "}
                  {customer.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {customer.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {customer.phoneNumber}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {customer.address}
                </p>
                <p>
                  <strong>Ngày sinh:</strong>{" "}
                  {new Date(customer.dob).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {activeSection === "add-child" && (
            <AddChild refreshChildren={fetchChildren} />
          )}

          {/* Khi chuyển sang trang Child, sẽ do route riêng */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerPage;
