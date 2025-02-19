import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Child from "./Child";
import AddChild from "./AddChild";
import Footer from "../../components/common/Footer";
import { FiUser } from "react-icons/fi";

// Lấy base API từ biến môi trường VITE_API_URL
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CustomerPage = () => {
  // Trong thực tế, nên lấy từ context hoặc localStorage
  const customerId = localStorage.getItem("customerId") || "cust001";
  const [activeSection, setActiveSection] = useState("profile");
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchCustomer(), fetchChildren()]);
      } catch (err) {
        setError(
          "Không thể tải dữ liệu: " + (err.message || "Lỗi không xác định")
        );
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [customerId]); // Thêm customerId vào dependencies

  // Lấy thông tin customer
  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customers/${customerId}`);
      setCustomer(response.data);
    } catch (err) {
      console.error("Lỗi lấy thông tin khách hàng:", err);
      throw new Error("Không thể tải thông tin khách hàng");
    }
  };

  // Lấy thông tin trẻ em
  const fetchChildren = async () => {
    try {
      // Sử dụng cách đặt tham số chuẩn RESTful
      const response = await axios.get(`${apiUrl}/child`, {
        params: { customerId: customerId },
      });
      setChildren(response.data);
    } catch (err) {
      console.error("Lỗi lấy thông tin trẻ em:", err);
      throw new Error("Không thể tải thông tin trẻ em");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );

  if (!customer)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">
          Không tìm thấy thông tin khách hàng
        </div>
      </div>
    );

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
              {children.length > 0 ? (
                children.map((child) => (
                  <button
                    key={child.childId}
                    onClick={() => navigate(`/customer/child/${child.childId}`)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-md"
                  >
                    {child.firstName} {child.lastName}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 px-4">
                  Chưa có thông tin trẻ em
                </p>
              )}
            </div>

            <button
              onClick={() => setActiveSection("add-child")}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Thêm trẻ em
            </button>

            <button
              onClick={() => navigate("/schedule")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md"
            >
              Lịch tiêm chủng
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
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
                  <strong>Số điện thoại:</strong>{" "}
                  {customer.phoneNumber || "Chưa cập nhật"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {customer.address || "Chưa cập nhật"}
                </p>
                <p>
                  <strong>Ngày sinh:</strong>{" "}
                  {customer.dob
                    ? new Date(customer.dob).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "add-child" && (
            <AddChild customerId={customerId} refreshChildren={fetchChildren} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerPage;
