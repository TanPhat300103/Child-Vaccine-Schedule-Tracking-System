import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Edit2,
  Save,
  XCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  BookOpen,
  CreditCard,
  Syringe,
  Heart,
  User as UserIcon,
} from "lucide-react";
import "../style/ChildInfoPage.css";

function ChildInfoPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingChild, setEditingChild] = useState(null);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [addingChild, setAddingChild] = useState(false);
  const [newChildData, setNewChildData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: true,
  });
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    dob: "",
  });
  const [medicalHistory, setMedicalHistory] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editingMedicalData, setEditingMedicalData] = useState(null);
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);
  const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] =
    useState(null);
  const [reactionInput, setReactionInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        const customerResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/customer/findid?id=${userInfo.userId}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        if (!customerResponse.ok)
          throw new Error("Không tìm thấy thông tin khách hàng");
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        const childrenResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/child/findbycustomer?id=${userInfo.userId}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
            credentials: "include",
          }
        );
        if (!childrenResponse.ok)
          throw new Error("Không tìm thấy thông tin con");
        const childrenData = await childrenResponse.json();
        setChildren(childrenData);
      } catch (err) {
        setError("Lỗi khi lấy thông tin: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const fetchMedicalHistory = async (childId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/medicalhistory/findbychildid?id=${childId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Không tìm thấy lịch sử tiêm chủng");
      const data = await response.json();
      setMedicalHistory((prev) => ({ ...prev, [childId]: data }));
    } catch (err) {
      setError("Lỗi khi lấy lịch sử tiêm chủng: " + err.message);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "Họ không được để trống";
        } else if (value.length < 2) {
          error = "Họ phải có ít nhất 2 ký tự";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Tên không được để trống";
        } else if (value.length < 2) {
          error = "Tên phải có ít nhất 2 ký tự";
        }
        break;
      case "dob":
        if (!value) {
          error = "Ngày sinh không được để trống";
        } else {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          if (selectedDate > currentDate) {
            error = "Ngày sinh không được ở tương lai";
          } else if (
            currentDate.getFullYear() - selectedDate.getFullYear() >
            18
          ) {
            error = "Tuổi không được lớn hơn 18";
          }
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleNewChildInputChange = (e) => {
    const { name, value } = e.target;
    setNewChildData((prev) => ({ ...prev, [name]: value }));

    // Validate ngay khi người dùng nhập
    const error = validateField(name, value);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const errors = {
      firstName: validateField("firstName", newChildData.firstName),
      lastName: validateField("lastName", newChildData.lastName),
      dob: validateField("dob", newChildData.dob),
    };
    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleChildInputChange = (e) => {
    const { name, value } = e.target;
    setEditingChild((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChild = (child) => {
    setEditingChild({ ...child, customer: { ...customer } });
  };

  const handleSaveChild = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/child/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(editingChild),
        }
      );

      if (response.ok) {
        setChildren((prev) =>
          prev.map((child) =>
            child.childId === editingChild.childId ? editingChild : child
          )
        );
        setEditingChild(null);
      } else {
        const errorText = await response.text();
        setError("Lỗi khi cập nhật thông tin con: " + errorText);
      }
    } catch (err) {
      setError("Lỗi khi cập nhật: " + err.message);
    }
  };

  const handleAddChild = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const childToAdd = {
        ...newChildData,
        customer: { customerId: customer.customerId },
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/child/create`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(childToAdd),
        }
      );

      if (response.ok) {
        const addedChild = await response.json();
        setChildren((prev) => [...prev, addedChild]);
        setAddingChild(false);
        setNewChildData({ firstName: "", lastName: "", dob: "", gender: true });
        setValidationErrors({ firstName: "", lastName: "", dob: "" });
      } else {
        const errorText = await response.text();
        setError("Lỗi khi thêm thông tin con: " + errorText);
      }
    } catch (err) {
      setError("Lỗi khi thêm: " + err.message);
    }
  };

  const toggleChildDetail = async (childId) => {
    setExpandedChildId((prev) => (prev === childId ? null : childId));
    if (expandedChildId !== childId && !medicalHistory[childId]) {
      await fetchMedicalHistory(childId);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleChildSelect = (childId) => {
    toggleChildDetail(childId);
    setIsDropdownOpen(false);
  };

  const handleEditMedical = (child) => {
    setEditingMedicalData({
      childId: child.childId,
      firstName: child.firstName,
      lastName: child.lastName,
      dob: child.dob.split("T")[0],
      gender: child.gender,
      contraindications: child.contraindications || "",
      customer: { customerId: customer.customerId },
    });
    setIsEditingMedical(true);
  };

  const handleMedicalInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMedicalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveMedical = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/child/update`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json", // Bỏ qua warning page
          },
          credentials: "include",
          body: JSON.stringify(editingMedicalData),
        }
      );

      if (response.ok) {
        setChildren((prev) =>
          prev.map((child) =>
            child.childId === editingMedicalData.childId
              ? { ...child, ...editingMedicalData }
              : child
          )
        );
        setIsEditingMedical(false);
        setEditingMedicalData(null);
      } else {
        const errorText = await response.text();
        setError("Lỗi khi Cập nhật hồ sơ tiêm chủng: " + errorText);
      }
    } catch (err) {
      setError("Lỗi khi cập nhật: " + err.message);
    }
  };

  const handleCancelEditMedical = () => {
    setIsEditingMedical(false);
    setEditingMedicalData(null);
  };

  const handleOpenReactionModal = (medicalHistoryId, currentReaction) => {
    setSelectedMedicalHistoryId(medicalHistoryId);
    setReactionInput(currentReaction || "");
    setIsReactionModalOpen(true);
  };

  const handleCloseReactionModal = () => {
    setIsReactionModalOpen(false);
    setSelectedMedicalHistoryId(null);
    setReactionInput("");
  };

  const handleUpdateReaction = async () => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/medicalhistory/updatereaction?id=${selectedMedicalHistoryId}&reaction=${encodeURIComponent(
          reactionInput
        )}`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setMedicalHistory((prev) => ({
          ...prev,
          [expandedChildId]: prev[expandedChildId].map((history) =>
            history.medicalHistoryId === selectedMedicalHistoryId
              ? { ...history, reaction: reactionInput }
              : history
          ),
        }));
        handleCloseReactionModal();
      } else {
        const errorText = await response.text();
        setError("Lỗi khi cập nhật phản ứng: " + errorText);
      }
    } catch (err) {
      setError("Lỗi khi cập nhật phản ứng: " + err.message);
    }
  };

  // Lấy ngày hiện tại định dạng YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return (
      <div className="profile-loading-childinfo">
        <div className="profile-loading-spinner-childinfo"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error-childinfo">
        <div className="profile-error-icon-childinfo">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container-childinfo">
      <div className="profile-header-childinfo">
        <div className="profile-user-info-childinfo">
          <div className="profile-avatar-childinfo">
            {customer?.firstName?.charAt(0)}
            {customer?.lastName?.charAt(0)}
          </div>
          <div className="profile-user-text-childinfo">
            <h1>
              {customer?.firstName} {customer?.lastName}
            </h1>
            <p>{customer?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="profile-content-childinfo">
        <div className="profile-sidebar-childinfo">
          <div
            className={`profile-sidebar-item-childinfo ${
              false ? "active" : ""
            }`}
            onClick={() => navigate("/profile?tab=profile")}
          >
            <div className="profile-sidebar-content-childinfo">
              <User size={18} />
              <span>Thông tin cá nhân</span>
            </div>
            <div className="profile-sidebar-placeholder-childinfo"></div>
          </div>
          <div
            className={`profile-sidebar-item-childinfo ${true ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            <div className="profile-sidebar-content-childinfo">
              <Calendar size={18} />
              <span>Thông tin con</span>
            </div>
            <button className="profile-sidebar-dropdown-toggle-childinfo">
              {isDropdownOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
          {isDropdownOpen && (
            <div className="profile-sidebar-child-list-childinfo">
              {children.length > 0 ? (
                children.map((child) => (
                  <div
                    key={child.childId}
                    className={`profile-sidebar-child-item-childinfo ${
                      child.childId === expandedChildId ? "active" : ""
                    }`}
                    onClick={() => handleChildSelect(child.childId)}
                  >
                    <span className="profile-sidebar-child-name">
                      {child.firstName} {child.lastName}
                    </span>
                    <span className="profile-sidebar-child-date">
                      {new Date(child.dob).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="profile-sidebar-no-child-childinfo">
                  <p>Chưa có thông tin con</p>
                </div>
              )}
            </div>
          )}
          <div
            className={`profile-sidebar-item-childinfo ${
              false ? "active" : ""
            }`}
            onClick={() => navigate("/my-bookings")}
          >
            <div className="profile-sidebar-content-childinfo">
              <BookOpen size={18} />
              <span>Lịch tiêm đã đặt</span>
            </div>
            <div className="profile-sidebar-placeholder-childinfo"></div>
          </div>
          <div
            className={`profile-sidebar-item-childinfo ${
              false ? "active" : ""
            }`}
            onClick={() => navigate("/my-payments")}
          >
            <div className="profile-sidebar-content-childinfo">
              <CreditCard size={18} />
              <span>Lịch sử thanh toán</span>
            </div>
            <div className="profile-sidebar-placeholder-childinfo"></div>
          </div>
        </div>

        <div className="profile-main-childinfo">
          <div className="profile-section-childinfo">
            <div className="profile-section-header-childinfo">
              <h2>Thông tin con</h2>
              <button
                className="profile-add-btn-childinfo"
                onClick={() => setAddingChild(true)}
              >
                <Plus size={16} />
                <span>Thêm con</span>
              </button>
            </div>

            {addingChild && (
              <div className="profile-child-form-childinfo">
                <h3>Thêm thông tin con</h3>
                <div className="profile-form-row-childinfo">
                  <div className="profile-form-group-childinfo">
                    <label>Họ</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newChildData.firstName}
                      onChange={handleNewChildInputChange}
                      placeholder="Nhập họ"
                    />
                    {validationErrors.firstName && (
                      <span className="profile-error-text-childinfo">
                        {validationErrors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="profile-form-group-childinfo">
                    <label>Tên</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newChildData.lastName}
                      onChange={handleNewChildInputChange}
                      placeholder="Nhập tên"
                    />
                    {validationErrors.lastName && (
                      <span className="profile-error-text-childinfo">
                        {validationErrors.lastName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="profile-form-row-childinfo">
                  <div className="profile-form-group-childinfo">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="dob"
                      value={newChildData.dob}
                      onChange={handleNewChildInputChange}
                      max={getCurrentDate()} // Vô hiệu hóa ngày tương lai
                    />
                    {validationErrors.dob && (
                      <span className="profile-error-text-childinfo">
                        {validationErrors.dob}
                      </span>
                    )}
                  </div>
                  <div className="profile-form-group-childinfo">
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={newChildData.gender}
                      onChange={handleNewChildInputChange}
                    >
                      <option value={true}>Nam</option>
                      <option value={false}>Nữ</option>
                    </select>
                  </div>
                </div>
                <div className="profile-form-actions-childinfo">
                  <button
                    className="profile-save-btn-childinfo"
                    onClick={handleAddChild}
                    disabled={Object.values(validationErrors).some(
                      (error) => error !== ""
                    )}
                  >
                    <Save size={16} />
                    <span>Lưu</span>
                  </button>
                  <button
                    className="profile-cancel-btn-childinfo"
                    onClick={() => {
                      setAddingChild(false);
                      setValidationErrors({
                        firstName: "",
                        lastName: "",
                        dob: "",
                      });
                    }}
                  >
                    <XCircle size={16} />
                    <span>Hủy</span>
                  </button>
                </div>
              </div>
            )}

            {children.length > 0 ? (
              <div className="profile-children-row-childinfo">
                {children.map((child) => {
                  const isExpanded = child.childId === expandedChildId;
                  const genderClass = child.gender ? "male" : "female";
                  return (
                    <div
                      key={child.childId}
                      className={`profile-child-card-modern-childinfo ${genderClass} ${
                        isExpanded ? "active" : ""
                      }`}
                      onClick={() => toggleChildDetail(child.childId)}
                    >
                      <div className="profile-child-avatar-modern-childinfo">
                        {child.firstName.charAt(0)}
                      </div>
                      <div className="profile-child-info-modern-childinfo">
                        <h3>
                          {child.firstName} {child.lastName}
                        </h3>
                        <p>{new Date(child.dob).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="profile-no-children-childinfo">
                <div className="profile-no-data-icon-childinfo">👶</div>
                <p>
                  Bạn chưa có thông tin con. Vui lòng thêm thông tin để bắt đầu.
                </p>
              </div>
            )}

            {expandedChildId && medicalHistory[expandedChildId] && (
              <div className="profile-medical-history-childinfo">
                <div className="profile-medical-card-childinfo">
                  <div className="profile-medical-header-childinfo">
                    <h2>
                      <Syringe size={18} />
                      HỒ SƠ TIÊM CHỦNG CỦA TRẺ
                    </h2>
                    <div className="profile-medical-actions-childinfo">
                      {!isEditingMedical ? (
                        <button
                          className="profile-edit-btn-childinfo"
                          onClick={() =>
                            handleEditMedical(
                              children.find(
                                (c) => c.childId === expandedChildId
                              )
                            )
                          }
                        >
                          <Edit2 size={18} />
                        </button>
                      ) : (
                        <>
                          <button
                            className="profile-save-btn-childinfo"
                            onClick={handleSaveMedical}
                          >
                            <Save size={18} />
                          </button>
                          <button
                            className="profile-cancel-btn-childinfo"
                            onClick={handleCancelEditMedical}
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="profile-medical-info-childinfo">
                    {isEditingMedical ? (
                      <>
                        <div className="profile-medical-field-childinfo">
                          <label>Họ</label>
                          <input
                            type="text"
                            name="firstName"
                            value={editingMedicalData.firstName}
                            onChange={handleMedicalInputChange}
                            placeholder="Nhập họ"
                          />
                        </div>
                        <div className="profile-medical-field-childinfo">
                          <label>Tên</label>
                          <input
                            type="text"
                            name="lastName"
                            value={editingMedicalData.lastName}
                            onChange={handleMedicalInputChange}
                            placeholder="Nhập tên"
                          />
                        </div>
                        <div className="profile-medical-field-childinfo">
                          <label>Ngày sinh</label>
                          <input
                            type="date"
                            name="dob"
                            value={editingMedicalData.dob}
                            onChange={handleMedicalInputChange}
                            max={getCurrentDate()} // Vô hiệu hóa ngày tương lai trong edit medical
                          />
                        </div>
                        <div className="profile-medical-field-childinfo">
                          <label>Giới tính</label>
                          <select
                            name="gender"
                            value={editingMedicalData.gender}
                            onChange={handleMedicalInputChange}
                          >
                            <option value={true}>Nam</option>
                            <option value={false}>Nữ</option>
                          </select>
                        </div>
                        <div className="profile-medical-field-childinfo">
                          <label>Chống chỉ định</label>
                          <input
                            type="text"
                            name="contraindications"
                            value={editingMedicalData.contraindications}
                            onChange={handleMedicalInputChange}
                            placeholder="Nhập chống chỉ định (nếu có)"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="profile-medical-field-childinfo">
                          <label>Họ và tên</label>
                          <p>
                            {
                              children.find(
                                (c) => c.childId === expandedChildId
                              )?.firstName
                            }{" "}
                            {
                              children.find(
                                (c) => c.childId === expandedChildId
                              )?.lastName
                            }
                          </p>
                        </div>
                        <div className="profile-medical-field-childinfo gender">
                          <label>Giới tính</label>
                          <p>
                            <UserIcon
                              size={18}
                              color={
                                children.find(
                                  (c) => c.childId === expandedChildId
                                )?.gender
                                  ? "var(--male)"
                                  : "var(--female)"
                              }
                            />
                            {children.find((c) => c.childId === expandedChildId)
                              ?.gender
                              ? "Nam"
                              : "Nữ"}
                          </p>
                        </div>
                        <div className="profile-medical-field-childinfo">
                          <label>Ngày sinh</label>
                          <p>
                            {new Date(
                              children.find(
                                (c) => c.childId === expandedChildId
                              )?.dob
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="profile-medical-field-childinfo">
                          <label>Chống chỉ định</label>
                          <p>
                            {children.find((c) => c.childId === expandedChildId)
                              ?.contraindications || "Không có"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="profile-medical-schedule-childinfo">
                    <h3>
                      <Calendar size={18} />
                      Lịch sử tiêm chủng
                    </h3>
                    {medicalHistory[expandedChildId].length > 0 ? (
                      <table className="profile-medical-table-childinfo">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Vắc xin</th>
                            <th>Ngày tiêm</th>
                            <th>Liều lượng</th>
                            <th>Phản ứng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicalHistory[expandedChildId].map(
                            (history, index) => (
                              <tr key={history.medicalHistoryId}>
                                <td>{index + 1}</td>
                                <td>{history.vaccine.name}</td>
                                <td>
                                  {new Date(history.date).toLocaleDateString()}
                                </td>
                                <td>{history.dose}</td>
                                <td>
                                  {history.reaction || "Không có"}
                                  <button
                                    className="profile-update-reaction-btn-childinfo"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenReactionModal(
                                        history.medicalHistoryId,
                                        history.reaction
                                      );
                                    }}
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p className="profile-no-history-childinfo">
                        <Heart size={24} color="var(--primary-light)" />
                        Chưa có lịch sử tiêm chủng nào.
                      </p>
                    )}
                  </div>
                </div>

                {isReactionModalOpen && (
                  <div className="profile-reaction-modal-childinfo">
                    <div className="profile-reaction-modal-content-childinfo">
                      <h3>Cập nhật phản ứng</h3>
                      <div className="profile-form-group-childinfo">
                        <label>Phản ứng sau tiêm</label>
                        <input
                          type="text"
                          value={reactionInput}
                          onChange={(e) => setReactionInput(e.target.value)}
                          placeholder="Nhập phản ứng (nếu có)"
                        />
                      </div>
                      <div className="profile-form-actions-childinfo">
                        <button
                          className="profile-save-btn-childinfo"
                          onClick={handleUpdateReaction}
                        >
                          <Save size={16} />
                          <span>Lưu</span>
                        </button>
                        <button
                          className="profile-cancel-btn-childinfo"
                          onClick={handleCloseReactionModal}
                        >
                          <XCircle size={16} />
                          <span>Hủy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildInfoPage;
