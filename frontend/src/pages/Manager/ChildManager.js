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

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/customer/findid?id=${customerId}`,
      {
        method: "GET",
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

  const handleCreateChild = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/child/create`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
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

  const handleChildEdit = (child, e) => {
    e.stopPropagation();
    setEditingChild(child);
    setChildUpdateError(null);
  };

  const handleChildSave = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/child/update`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingChild),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Lỗi khi cập nhật hồ sơ trẻ em.");
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
        console.error("Lỗi khi cập nhật hồ sơ trẻ em:", error);
        setChildUpdateError(error.message);
      });
  };

  const handleChildInactive = (childId, e) => {
    e.stopPropagation();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/child/active?id=${childId}`, {
      method: "POST",
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
        {/* Header */}
        <header className="header-child">
          <div className="header-title-child">
            <FaChild className="header-icon-child" />
            <h1 className="header-text-child">Quản Lý Hồ Sơ Trẻ Em</h1>
          </div>
          <p className="header-subtitle-child">
            Quản lý hồ sơ trẻ em của khách hàng{" "}
            {customerInfo
              ? `${customerInfo.firstName} ${customerInfo.lastName}`
              : ""}
          </p>
        </header>

        {/* Two-column layout */}
        <div className="layout-child">
          {/* Left Column: Customer Profile */}
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
              <Link to="../customers">
                <button className="back-button-child">
                  <FaArrowLeft className="back-icon-child" />
                  <span>Quay lại danh sách</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Children List */}
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
                <span>Thêm Hồ Sơ Trẻ Em</span>
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
                  <div key={child.childId} className="child-card-child">
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
                      <button
                        onClick={(e) => handleChildEdit(child, e)}
                        className="edit-button-child"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Tạo Hồ Sơ Trẻ Em */}
        {showAddChildForm && (
          <div className="modal-overlay-child">
            <div
              className="modal-backdrop-child"
              onClick={() => setShowAddChildForm(false)}
            ></div>
            <div className="modal-content-child">
              <h3 className="modal-title-child">Thêm Hồ Sơ Trẻ Em Mới</h3>
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
                    Ngày Sinh <span className="required-child">*</span>
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
                    Giới Tính <span className="required-child">*</span>
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

        {/* Modal Cập Nhật Hồ Sơ Trẻ Em */}
        {editingChild && (
          <div className="modal-overlay-child">
            <div
              className="modal-backdrop-child"
              onClick={() => setEditingChild(null)}
            ></div>
            <div className="modal-content-child">
              <h3 className="modal-title-child">Cập Nhật Hồ Sơ Trẻ Em</h3>
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
                    Ngày Sinh <span className="required-child">*</span>
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
                    Giới Tính <span className="required-child">*</span>
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
