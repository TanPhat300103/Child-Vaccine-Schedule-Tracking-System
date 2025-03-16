import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaPowerOff,
  FaChild,
  FaSearch,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
import "../../style/Childs.css";

const Childs = () => {
  const { customerId } = useParams();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // useEffect để fetch dữ liệu khách hàng và trẻ em không thay đổi
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/customer/findid?id=${customerId}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        credentials: "include",
        withCredentials: true,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API thông tin khách hàng:", data);
        setCustomerInfo(data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy thông tin khách hàng:", error)
      );
  }, [customerId]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/child/findbycustomer?id=${customerId}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        credentials: "include",
        withCredentials: true,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API hồ sơ trẻ em:", data);
        setChildren(data);
      })
      .catch((error) => console.error("Lỗi khi lấy hồ sơ trẻ em:", error));
  }, [customerId]);

  // Các hàm handle không thay đổi
  const handleCreateChild = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/child/create`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
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

  const handleChildSave = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/child/update`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
      body: JSON.stringify(editingChild),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi khi Cập nhật hồ sơ trẻ em.");
          });
        }
        return response.json();
      })
      .then((updatedChild) => {
        setChildren((prev) =>
          prev.map((child) =>
            child.childId === updatedChild.childId ? updatedChild : child
          )
        );
        setEditingChild(null);
        setChildUpdateError(null);
      })
      .catch((error) => {
        console.error("Lỗi khi Cập nhật hồ sơ trẻ em:", error);
        setChildUpdateError(error.message);
      });
  };

  const handleChildInactive = (childId, e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan lên thẻ cha
    fetch(`${process.env.REACT_APP_API_BASE_URL}/child/active?id=${childId}`, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      credentials: "include",
      withCredentials: true,
    })
      .then((response) => response.json())
      .then((updatedChild) => {
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

  const handleCardClick = (child) => {
    setEditingChild(child);
    setChildUpdateError(null);
  };

  const childrenArray = Array.isArray(children) ? children : [children];
  const filteredChildren = childrenArray.filter((child) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      child.firstName.toLowerCase().includes(term) ||
      child.lastName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container-child">
      <div className="content-wrapper-child">
        {/* Header không thay đổi */}
        <header className="header-child">
          <div className="header-title-child">
            <FaChild className="header-icon-child" />
            <h1 className="header-text-child">Quản lý hồ sơ trẻ em</h1>
          </div>
          <p className="header-subtitle-child">
            Quản lý hồ sơ trẻ em của khách hàng{" "}
            <strong>
              {customerInfo
                ? `${customerInfo.firstName} ${customerInfo.lastName}`
                : ""}
            </strong>
          </p>
        </header>

        <div className="layout-child">
          {/* Left Column không thay đổi */}
          <div className="left-column-child">
            <div className="customer-card-child">
              <h2 className="customer-card-title-child">
                {customerInfo
                  ? `${customerInfo.firstName} ${customerInfo.lastName}`
                  : "Thông tin khách hàng"}
              </h2>
              <div className="customer-card-content-child">
                <p>
                  <strong>SĐT:</strong> {customerInfo?.phoneNumber || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {customerInfo?.email || "N/A"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {customerInfo?.address || "N/A"}
                </p>
              </div>
              <Link to="../customers" className="back-link-child">
                <button className="back-button-child">
                  <FaArrowLeft className="back-icon-child" />
                  <span>Quay lại danh sách</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Chỉnh sửa phần danh sách trẻ em */}
          <div className="right-column-child">
            <div className="search-bar-child">
              <div className="search-container-child">
                <FaSearch className="search-icon-child" />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-child"
                />
              </div>
              <button
                onClick={() => setShowAddChildForm(true)}
                className="add-button-child"
              >
                <FaPlus />
                <span>Thêm hồ sơ trẻ em</span>
              </button>
            </div>

            <div className="children-list-child">
              {filteredChildren.length === 0 ? (
                <div className="no-children-child">
                  <FaChild className="no-children-icon-child" />
                  <p className="no-children-text-child">
                    Không tìm thấy hồ sơ trẻ em nào phù hợp
                  </p>
                </div>
              ) : (
                filteredChildren.map((child) => (
                  <div
                    key={child.childId}
                    className="child-card-child"
                    onClick={() => handleCardClick(child)}
                    style={{ cursor: "pointer" }} // Thêm style để hiển thị con trỏ tay
                  >
                    <div className="child-card-left-child">
                      <div className="child-icon-container-child">
                        <FaChild className="child-icon-child" />
                      </div>
                      <div>
                        <h3 className="child-name-child">
                          {child.firstName} {child.lastName}
                        </h3>
                        <p className="child-info-child">
                          Giới tính: {child.gender ? "Nam" : "Nữ"} | Ngày sinh:{" "}
                          {new Date(child.dob).toLocaleDateString()}
                        </p>
                        <p className="child-info-child">
                          Chống chỉ định:{" "}
                          {child.contraindications || "Không có"}
                        </p>
                      </div>
                    </div>
                    <div className="child-card-right-child">
                      <button
                        onClick={(e) => handleChildInactive(child.childId, e)}
                        className={`status-button-child ${
                          child.active ? "deactivate-child" : "activate-child"
                        }`}
                      >
                        <FaPowerOff />
                        <span>{child.active ? "Ngưng" : "Kích hoạt"}</span>
                      </button>
                      {/* Bỏ nút Cập nhật */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Tạo Hồ sơ trẻ em không thay đổi */}
        {showAddChildForm && (
          <div className="modal-overlay-child">
            <div
              className="modal-backdrop-child"
              onClick={() => setShowAddChildForm(false)}
            ></div>
            <div className="modal-content-child">
              <h3 className="modal-title-child">Thêm hồ sơ trẻ em Mới</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateChild();
                }}
                className="modal-form-child"
              >
                <div className="form-group-child">
                  <label className="form-label-child">
                    Họ <span className="required-child">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChild.firstName}
                    onChange={(e) =>
                      setNewChild({ ...newChild, firstName: e.target.value })
                    }
                    className="form-input-child"
                    placeholder="Nhập họ"
                    required
                  />
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">
                    Tên <span className="required-child">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChild.lastName}
                    onChange={(e) =>
                      setNewChild({ ...newChild, lastName: e.target.value })
                    }
                    className="form-input-child"
                    placeholder="Nhập tên"
                    required
                  />
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">
                    Ngày sinh <span className="required-child">*</span>
                  </label>
                  <input
                    type="date"
                    value={newChild.dob}
                    onChange={(e) =>
                      setNewChild({ ...newChild, dob: e.target.value })
                    }
                    className="form-input-child"
                    required
                  />
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">
                    Giới tính <span className="required-child">*</span>
                  </label>
                  <select
                    value={newChild.gender ? "true" : "false"}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        gender: e.target.value === "true",
                      })
                    }
                    className="form-input-child"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">Chống chỉ định</label>
                  <textarea
                    value={newChild.contraindications}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        contraindications: e.target.value,
                      })
                    }
                    className="form-input-child"
                    placeholder="Nhập chống chỉ định (nếu có)"
                  />
                </div>
                {childError && <p className="error-text-child">{childError}</p>}
                <div className="form-buttons-child">
                  <button type="submit" className="submit-button-child">
                    Tạo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddChildForm(false)}
                    className="cancel-button-child"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Cập nhật hồ sơ trẻ em không thay đổi */}
        {editingChild && (
          <div className="modal-overlay-child">
            <div
              className="modal-backdrop-child"
              onClick={() => setEditingChild(null)}
            ></div>
            <div className="modal-content-child">
              <h3 className="modal-title-child">Cập nhật hồ sơ trẻ em</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChildSave();
                }}
                className="modal-form-child"
              >
                <div className="form-group-child">
                  <label className="form-label-child">
                    Họ <span className="required-child">*</span>
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
                    className="form-input-child"
                    placeholder="Nhập họ"
                    required
                  />
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">
                    Tên <span className="required-child">*</span>
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
                    className="form-input-child"
                    placeholder="Nhập tên"
                    required
                  />
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">
                    Ngày sinh <span className="required-child">*</span>
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
                    className="form-input-child"
                    required
                  />
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">
                    Giới tính <span className="required-child">*</span>
                  </label>
                  <select
                    value={editingChild.gender ? "true" : "false"}
                    onChange={(e) =>
                      setEditingChild({
                        ...editingChild,
                        gender: e.target.value === "true",
                      })
                    }
                    className="form-input-child"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div className="form-group-child">
                  <label className="form-label-child">Chống chỉ định</label>
                  <textarea
                    value={editingChild.contraindications}
                    onChange={(e) =>
                      setEditingChild({
                        ...editingChild,
                        contraindications: e.target.value,
                      })
                    }
                    className="form-input-child"
                    placeholder="Nhập chống chỉ định (nếu có)"
                  />
                </div>
                {childUpdateError && (
                  <p className="error-text-child">{childUpdateError}</p>
                )}
                <div className="form-buttons-child">
                  <button type="submit" className="submit-button-child">
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingChild(null)}
                    className="cancel-button-child"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Childs;
