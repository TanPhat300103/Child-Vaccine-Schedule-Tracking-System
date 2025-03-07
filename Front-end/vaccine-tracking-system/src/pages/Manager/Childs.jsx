import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPowerOff, FaChild, FaSearch, FaPlus, FaArrowLeft } from "react-icons/fa";

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
    fetch(`http://localhost:8080/customer/findid?id=${customerId}`, {
      method: "GET",
      credentials: "include",
      withCredentials: true,
    })
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
    fetch(`http://localhost:8080/child/findbycustomer?id=${customerId}`, {
      method: "GET",
      credentials: "include",
      withCredentials: true,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API hồ sơ trẻ em:", data);
        setChildren(data);
      })
      .catch((error) => console.error("Lỗi khi lấy hồ sơ trẻ em:", error));
  }, [customerId]);

  const handleCreateChild = () => {
    fetch("http://localhost:8080/child/create", {
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
    fetch("http://localhost:8080/child/update", {
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
    fetch(`http://localhost:8080/child/active?id=${childId}`, {
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center space-x-4">
            <FaChild className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-medium text-gray-700">
              Quản Lý Hồ Sơ Trẻ Em
            </h1>
          </div>
          <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
            Quản lý hồ sơ trẻ em của khách hàng{" "}
            {customerInfo
              ? `${customerInfo.firstName} ${customerInfo.lastName}`
              : ""}
          </p>
        </header>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Customer Profile */}
          <div className="md:w-1/3">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-blue-500 mb-4">
                {customerInfo
                  ? `${customerInfo.firstName} ${customerInfo.lastName}`
                  : "Thông tin khách hàng"}
              </h2>
              <div className="text-gray-600">
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
                <button className="mt-4 flex items-center space-x-2 bg-pink-100 text-pink-500 px-4 py-2 rounded-full hover:bg-pink-200 hover:text-pink-600 hover:scale-105 transition-all ease-in-out shadow-sm">
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Quay lại danh sách</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Children List */}
          <div className="md:w-2/3">
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-1/2">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowAddChildForm(true)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all ease-in-out"
                >
                  <FaPlus />
                  <span>Thêm Hồ Sơ Trẻ Em</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredChildren.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-md">
                  <FaChild className="mx-auto text-4xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-base">
                    Không tìm thấy hồ sơ trẻ em nào phù hợp
                  </p>
                </div>
              ) : (
                filteredChildren.map((child) => (
                  <div
                    key={child.childId}
                    className="bg-white border-l-4 border-blue-400 rounded-2xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all ease-in-out group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-3 rounded-full">
                        <FaChild className="text-blue-500 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 group-hover:text-blue-500 transition-colors">
                          {child.firstName} {child.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Giới tính: {child.gender ? "Nam" : "Nữ"} | Ngày sinh:{" "}
                          {new Date(child.dob).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Chống chỉ định: {child.contraindications || "Không có"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => handleChildInactive(child.childId, e)}
                        className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ease-in-out ${
                          child.active
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : "bg-green-50 text-green-500 hover:bg-green-100"
                        }`}
                      >
                        <FaPowerOff />
                        <span>{child.active ? "Ngưng" : "Kích hoạt"}</span>
                      </button>
                      <button
                        onClick={(e) => handleChildEdit(child, e)}
                        className="bg-blue-50 text-blue-500 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all ease-in-out"
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
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 backdrop-blur-md"
              onClick={() => setShowAddChildForm(false)}
            ></div>
            <div className="relative bg-white rounded-2xl shadow-md p-6 w-full max-w-md max-h-[80vh] overflow-y-auto transform transition-all animate-fadeIn">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                Thêm Hồ Sơ Trẻ Em Mới
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateChild();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Họ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChild.firstName}
                    onChange={(e) =>
                      setNewChild({ ...newChild, firstName: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Nhập họ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Tên <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChild.lastName}
                    onChange={(e) =>
                      setNewChild({ ...newChild, lastName: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Nhập tên"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Ngày Sinh <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={newChild.dob}
                    onChange={(e) =>
                      setNewChild({ ...newChild, dob: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Giới Tính <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newChild.gender ? "true" : "false"}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        gender: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Chống chỉ định
                  </label>
                  <textarea
                    value={newChild.contraindications}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        contraindications: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Nhập chống chỉ định (nếu có)"
                  />
                </div>
                {childError && (
                  <p className="text-red-400 text-sm">{childError}</p>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all ease-in-out"
                  >
                    Tạo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddChildForm(false)}
                    className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all ease-in-out"
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
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 backdrop-blur-md"
              onClick={() => setEditingChild(null)}
            ></div>
            <div className="relative bg-white rounded-2xl shadow-md p-6 w-full max-w-md max-h-[80vh] overflow-y-auto transform transition-all animate-fadeIn">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                Cập Nhật Hồ Sơ Trẻ Em
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChildSave();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Họ <span className="text-red-400">*</span>
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
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Nhập họ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Tên <span className="text-red-400">*</span>
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
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Nhập tên"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Ngày Sinh <span className="text-red-400">*</span>
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
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Giới Tính <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={editingChild.gender ? "true" : "false"}
                    onChange={(e) =>
                      setEditingChild({
                        ...editingChild,
                        gender: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Chống chỉ định
                  </label>
                  <textarea
                    value={editingChild.contraindications}
                    onChange={(e) =>
                      setEditingChild({
                        ...editingChild,
                        contraindications: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Nhập chống chỉ định (nếu có)"
                  />
                </div>
                {childUpdateError && (
                  <p className="text-red-400 text-sm">{childUpdateError}</p>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all ease-in-out"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingChild(null)}
                    className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all ease-in-out"
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