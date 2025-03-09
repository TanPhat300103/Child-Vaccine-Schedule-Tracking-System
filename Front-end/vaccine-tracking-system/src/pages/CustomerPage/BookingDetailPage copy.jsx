import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, Outlet } from "react-router-dom";
import Footer from "../../components/common/Footer";
import { toast } from "react-toastify";
import { updateUser, fetchChildren, fetchCustomer } from "../../apis/api";
import { format } from "date-fns";
import Header from "../../components/common/Header";
import {
  FiCalendar,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser as FiUserOutline,
  FiUser,
  FiLogOut,
  FiPlusCircle,
} from "react-icons/fi";
import { FaMars, FaVenus, FaChild } from "react-icons/fa";
import { AiOutlineHistory } from "react-icons/ai";
import { useAuth } from "../../components/common/AuthContext";

// Hàm so sánh dữ liệu form và dữ liệu gốc
const isFormChanged = (formData, originalData) => {
  if (!originalData) return false;
  for (let key in formData) {
    if (formData[key] !== originalData[key]) {
      return true;
    }
  }
  return false;
};

const BookingDetailPage = () => {
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const [showAllChildren, setShowAllChildren] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const isExactPath = location.pathname === "/customer";
  const [error, setError] = useState(null);

  // Lưu dữ liệu gốc để kiểm tra khi thay đổi
  const [originalData, setOriginalData] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const { state } = useLocation();
  const { vaccineIds, vaccineComboIds, childId, bookingDate } = state || {};

  console.log("Vaccine IDs:", vaccineIds);
  console.log("Vaccine Combo IDs:", vaccineComboIds);
  console.log("Child ID:", childId);
  console.log("Booking Date:", bookingDate);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "false", // mặc định nữ
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  const { userInfo } = useAuth();
  console.log("userinfo: ", userInfo);
  const customerId = userInfo?.userId;

  // Khi customer thay đổi => set lại formData và originalData
  useEffect(() => {
    if (customer) {
      const newForm = {
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        dob: customer.dob
          ? new Date(customer.dob).toISOString().split("T")[0]
          : "",
        gender: customer.gender ? "true" : "false",
        email: customer.email || "",
        phoneNumber: customer.phoneNumber || "",
        address: customer.address || "",
        password: customer.password || "",
      };
      setFormData(newForm);
      setOriginalData(newForm);
    }
  }, [customer]);

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [proFileData, setProFileData] = useState(null);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/myprofile", {
          method: "GET",
          credentials: "include",
        });
        if (response.status === 401) {
          setIsAuthenticated(false);
          navigate("/login"); // Chuyển hướng nếu không đăng nhập
        } else {
          const data = await response.json();
          setProFileData(data);
          console.log("My profile data: ", data);
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/login");
        console.error("Error checking auth:", error);
      }
    };
    checkAuth();
  }, [navigate]);

  // Theo dõi thay đổi form để bật tắt nút lưu
  useEffect(() => {
    setIsChanged(isFormChanged(formData, originalData));
  }, [formData, originalData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle giới tính bằng icon
  const toggleGender = () => {
    setFormData((prev) => ({
      ...prev,
      gender: prev.gender === "true" ? "false" : "true",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.gender = formData.gender === "true";
    setIsLoading(true);
    try {
      const result = await updateUser(formData);
      if (result.success) {
        toast.success(result.message);
        setOriginalData({ ...formData });
        setIsChanged(false);
        navigate("/customer");
      } else {
        toast.error(
          result.message ||
            "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin."
        );
        setErrors({ submit: result.message || "Cập nhật thất bại" });
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!customerId) {
        setError("Không tìm thấy ID khách hàng");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Gọi API để lấy dữ liệu khách hàng và danh sách trẻ em
        await Promise.all([
          loadCustomerData(customerId),
          loadChildrenData(customerId),
        ]);
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
  }, [customerId]);

  const loadCustomerData = async (customerId) => {
    try {
      const data = await fetchCustomer(customerId);
      setCustomer(data);
    } catch (error) {
      toast.error("Không thể lấy thông tin khách hàng.");
      console.error("Error fetching customer:", error);
    }
  };

  const loadChildrenData = async (customerId) => {
    try {
      const response = await fetchChildren(customerId);
      if (Array.isArray(response)) {
        setChildren(response);
      } else {
        setChildren([]);
        toast.error("Dữ liệu trẻ em không hợp lệ.");
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin trẻ em:", err);
      setChildren([]);
      toast.error("Không thể lấy danh sách trẻ em.");
    }
  };

  const refreshChildren = () => {
    loadChildrenData(customerId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">
          Không tìm thấy thông tin khách hàng
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <Header />
      <div className="container mx-auto px-1 py-30 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-white border border-teal-200 rounded-xl shadow-md p-5 flex flex-col">
          {/* Phần header của sidebar */}
          <div className="mb-4 pb-3 border-b border-teal-100">
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg font-medium text-lg transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-teal-600 hover:bg-teal-50"
                }`
              }
            >
              <FiUser className="mr-3 w-5 h-5" />
              Hồ sơ của tôi
            </NavLink>
          </div>

          {/* Phần hồ sơ trẻ em - Sử dụng dữ liệu từ API */}
          <div className="mt-3">
            <div className="flex items-center px-4 py-2 text-1sm font-bold uppercase tracking-wider [text-shadow:1px_1px_2px_rgba(59,130,246,0.3)]">
              <span>Hồ sơ trẻ em</span>
              {children.length > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {children.length}
                </span>
              )}
            </div>
            {children.length > 0 ? (
              <>
                {(showAllChildren ? children : children.slice(0, 5)).map(
                  (child) => (
                    <NavLink
                      key={child.childId}
                      to={`/customer/child/${child.childId}`}
                      state={{ customerId }}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg transition-all transform hover:shadow-md text-1xl ${
                          isActive
                            ? "bg-blue-100"
                            : "hover:bg-blue-50 text-blue-700"
                        }`
                      }
                    >
                      <FaChild className="mr-2 w-5 h-5" />
                      {child.firstName} {child.lastName}
                    </NavLink>
                  )
                )}
                {children.length > 5 && (
                  <button
                    onClick={() => setShowAllChildren((prev) => !prev)}
                    className="block w-full text-left px-4 py-2 text-xl text-blue-500 hover:underline transition-colors"
                  >
                    {showAllChildren ? "Thu gọn" : "Xem thêm..."}
                  </button>
                )}
              </>
            ) : (
              <p className="px-4 py-2 text-xl text-blue-300">
                Chưa có thông tin
              </p>
            )}
          </div>

          {/* Phần các chức năng chính */}
          <div className="space-y-3 mt-4">
            <NavLink
              to="/customer/add-child"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100 hover:shadow"
                }`
              }
            >
              <FiPlusCircle className="mr-3 w-5 h-5" />
              <span className="font-medium">Thêm hồ sơ</span>
            </NavLink>

            <NavLink
              to="/customer/booking"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100 hover:shadow"
                }`
              }
            >
              <FiCalendar className="mr-3 w-5 h-5" />
              <span className="font-medium">Xem đặt lịch</span>
            </NavLink>

            <NavLink
              to="/customer/payment"
              state={{ customerId }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors shadow-sm ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow"
                }`
              }
            >
              <AiOutlineHistory className="mr-3 w-5 h-5" />
              <span className="font-medium">Lịch sử thanh toán</span>
            </NavLink>
          </div>

          {/* Nút đăng xuất */}
          <div className="mt-auto pt-4 border-t border-teal-100">
            <button
              onClick={() => {
                localStorage.removeItem("customerId");
                navigate("/");
              }}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm hover:shadow"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="w-auto md:w-10/10 bg-gradient-to-b from-blue-50 to-white text-blue-800 border border-blue-200 rounded-lg shadow-md flex flex-col justify-between">
          <div className="bookingdetail-container">
            <div className="bookingdetail-content">
              <div className="bookingdetail-main">
                <div className="bookingdetail-section">
                  <h2 className="bookingdetail-section-title">
                    Danh Sách Mũi Tiêm
                  </h2>
                  {bookingDetails.length > 0 ? (
                    <div className="bookingdetail-details-list">
                      {Object.keys(groupedDetails).map((date) => (
                        <div key={date} className="bookingdetail-date-group">
                          <div className="bookingdetail-date-label">
                            <span>{date}</span>
                          </div>
                          <div className="bookingdetail-date-items">
                            {groupedDetails[date].map((detail) => {
                              const isExpanded =
                                detail.bookingDetailId === expandedDetailId;
                              const statusClass = getStatusClass(detail.status);
                              const isEditing =
                                editingReaction === detail.bookingDetailId;
                              return (
                                <div
                                  key={detail.bookingDetailId}
                                  className={`bookingdetail-card ${statusClass}`}
                                >
                                  <div
                                    className="bookingdetail-card-header"
                                    onClick={() =>
                                      toggleDetail(detail.bookingDetailId)
                                    }
                                  >
                                    <div className="bookingdetail-card-info">
                                      <div className="bookingdetail-card-icon-wrapper">
                                        {detail.status === 2 ? (
                                          <CheckCircle
                                            size={20}
                                            className="bookingdetail-card-icon active"
                                          />
                                        ) : detail.status === 3 ? (
                                          <XCircle
                                            size={20}
                                            className="bookingdetail-card-icon inactive"
                                          />
                                        ) : (
                                          <Syringe
                                            size={20}
                                            className="bookingdetail-card-icon pending"
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <h3>
                                          {detail.vaccine.name} -{" "}
                                          {detail.child.firstName}{" "}
                                          {detail.child.lastName}
                                        </h3>
                                        <p className="bookingdetail-card-date">
                                          <Calendar size={14} /> Dự kiến:{" "}
                                          {new Date(
                                            detail.scheduledDate
                                          ).toLocaleDateString()}
                                        </p>
                                        <p className="bookingdetail-card-status">
                                          Trạng thái:{" "}
                                          <span
                                            className={`bookingdetail-status ${statusClass}`}
                                          >
                                            {getStatusText(detail.status)}
                                          </span>{" "}
                                          | Combo:{" "}
                                          {detail.vaccineCombo?.name ||
                                            "Không có"}
                                        </p>
                                        <p className="bookingdetail-card-administered">
                                          {detail.administeredDate
                                            ? `Đã tiêm: ${new Date(
                                                detail.administeredDate
                                              ).toLocaleDateString()}`
                                            : "Chưa tiêm"}
                                        </p>
                                      </div>
                                    </div>
                                    <button className="bookingdetail-toggle-btn">
                                      {isExpanded ? (
                                        <ChevronUp size={20} />
                                      ) : (
                                        <ChevronDown size={20} />
                                      )}
                                    </button>
                                  </div>

                                  {isExpanded && (
                                    <div className="bookingdetail-card-details">
                                      <div className="bookingdetail-detail-section">
                                        <h4>Thông Tin Trẻ</h4>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Tên:
                                          </span>
                                          <span className="bookingdetail-detail-value">
                                            {detail.child.firstName}{" "}
                                            {detail.child.lastName}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="bookingdetail-detail-section">
                                        <h4>Thông Tin Vaccine</h4>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Tên Vaccine:
                                          </span>
                                          <span className="bookingdetail-detail-value">
                                            {detail.vaccine.name} (Dose{" "}
                                            {detail.vaccine.doseNumber})
                                          </span>
                                        </div>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Combo:
                                          </span>
                                          <span className="bookingdetail-detail-value">
                                            {detail.vaccineCombo?.name ||
                                              "Không có"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="bookingdetail-detail-section">
                                        <h4>Thông Tin Lịch Tiêm</h4>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            ID:
                                          </span>
                                          <span className="bookingdetail-detail-value">
                                            {detail.bookingDetailId}
                                          </span>
                                        </div>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Ngày dự kiến:
                                          </span>
                                          <span className="bookingdetail-detail-value">
                                            {new Date(
                                              detail.scheduledDate
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Ngày tiêm thực tế:
                                          </span>
                                          <span className="bookingdetail-detail-value">
                                            {detail.administeredDate
                                              ? new Date(
                                                  detail.administeredDate
                                                ).toLocaleDateString()
                                              : "Chưa tiêm"}
                                          </span>
                                        </div>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Trạng thái:
                                          </span>
                                          <span
                                            className={`bookingdetail-status ${statusClass}`}
                                          >
                                            {getStatusText(detail.status)}
                                          </span>
                                        </div>
                                        <div className="bookingdetail-detail-item">
                                          <span className="bookingdetail-detail-label">
                                            Ghi chú phản ứng:
                                          </span>
                                          <div className="bookingdetail-reaction-section">
                                            {isEditing ? (
                                              <div className="bookingdetail-reaction-form">
                                                <textarea
                                                  value={reactionNote}
                                                  onChange={
                                                    handleReactionChange
                                                  }
                                                  placeholder="Nhập ghi chú phản ứng sau tiêm..."
                                                  className="bookingdetail-reaction-input"
                                                />
                                                <button
                                                  className="bookingdetail-reaction-save-btn"
                                                  onClick={() =>
                                                    updateReaction(
                                                      detail.bookingDetailId
                                                    )
                                                  }
                                                >
                                                  <Save size={16} />
                                                  <span>Lưu</span>
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="bookingdetail-reaction-display">
                                                <span className="bookingdetail-detail-value">
                                                  {detail.reactionNote ||
                                                    "Không có"}
                                                </span>
                                                {detail.status === 2 && (
                                                  <button
                                                    className="bookingdetail-reaction-edit-btn"
                                                    onClick={() =>
                                                      startEditingReaction(
                                                        detail.bookingDetailId,
                                                        detail.reactionNote
                                                      )
                                                    }
                                                  >
                                                    Cập Nhật Trạng Thái Sau Tiêm
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bookingdetail-no-details">
                      <div className="bookingdetail-no-data-icon">💉</div>
                      <p>Không có mũi tiêm nào trong booking này.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetailPage;
