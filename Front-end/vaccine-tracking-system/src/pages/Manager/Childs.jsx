import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Childs = () => {
  const { customerId } = useParams();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [children, setChildren] = useState([]);
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

  // State cho cập nhật hồ sơ trẻ em
  const [editingChild, setEditingChild] = useState(null);
  const [childUpdateError, setChildUpdateError] = useState(null);

  // Lấy thông tin khách hàng để hiển thị tiêu đề
  useEffect(() => {
    fetch(`http://localhost:8080/customer/findid?id=${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API thông tin khách hàng:", data);
        setCustomerInfo(data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy thông tin khách hàng:", error)
      );
  }, [customerId]);

  // Lấy danh sách hồ sơ trẻ em của khách hàng
  useEffect(() => {
    fetch(`http://localhost:8080/child/findbycustomer?id=${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("GET API hồ sơ trẻ em:", data);
        setChildren(data);
      })
      .catch((error) => console.error("Lỗi khi lấy hồ sơ trẻ em:", error));
  }, [customerId]);

  // Tạo hồ sơ trẻ em mới
  const handleCreateChild = () => {
    console.log("Gửi API tạo hồ sơ trẻ em với dữ liệu:", newChild);
    fetch("http://localhost:8080/child/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Gửi kèm thông tin khách hàng để BE gán lại customerId
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
        console.log("Tạo hồ sơ trẻ em thành công:", createdChild);
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

  // Mở form cập nhật hồ sơ trẻ em
  const handleChildEdit = (child, e) => {
    e.stopPropagation();
    console.log("Mở form cập nhật hồ sơ trẻ em:", child);
    setEditingChild(child);
    setChildUpdateError(null);
  };

  // Gửi yêu cầu cập nhật hồ sơ trẻ em
  const handleChildSave = () => {
    console.log("Gửi API cập nhật hồ sơ trẻ em với dữ liệu:", editingChild);
    fetch("http://localhost:8080/child/update", {
      method: "POST",
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
        console.log("Cập nhật hồ sơ trẻ em thành công:", updatedChild);
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

  // Chuyển trạng thái inactive cho hồ sơ trẻ em
  const handleChildInactive = (childId, e) => {
    e.stopPropagation();
    console.log("Gửi API inactive cho hồ sơ trẻ em với childId:", childId);
    fetch(`http://localhost:8080/child/active?id=${childId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((updatedChild) => {
        console.log("Cập nhật trạng thái inactive thành công:", updatedChild);
        setChildren((prev) =>
          prev.map((child) =>
            child.childId === updatedChild.childId ? updatedChild : child
          )
        );
      })
      .catch((error) =>
        console.error(
          "Lỗi khi cập nhật trạng thái inactive của hồ sơ trẻ em:",
          error
        )
      );
  };

  return (
    <div className="mt-8 p-4 border-t border-gray-300">
      <h1 className="text-3xl font-bold text-center mb-6">
        Hồ Sơ Trẻ Em của{" "}
        <span className="text-blue-600 font-bold">
          {customerInfo
            ? `${customerInfo.firstName} ${customerInfo.lastName}`
            : ""}
        </span>
      </h1>
      <Link
        to="/staff/customers"
        className="inline-block mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Quay lại danh sách khách hàng
      </Link>
      <button
        onClick={() => {
          setShowAddChildForm(true);
          setChildError(null);
        }}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Thêm Hồ Sơ Trẻ Em
      </button>
      {showAddChildForm && (
        <div className="mb-4 p-4 border border-gray-300 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Thêm Hồ Sơ Trẻ Em Mới</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ
              </label>
              <input
                type="text"
                value={newChild.firstName}
                onChange={(e) =>
                  setNewChild({ ...newChild, firstName: e.target.value })
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
                value={newChild.lastName}
                onChange={(e) =>
                  setNewChild({ ...newChild, lastName: e.target.value })
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
                value={newChild.dob}
                onChange={(e) =>
                  setNewChild({ ...newChild, dob: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giới Tính
              </label>
              <select
                value={newChild.gender ? "true" : "false"}
                onChange={(e) =>
                  setNewChild({
                    ...newChild,
                    gender: e.target.value === "true",
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Chống Chỉ Định
              </label>
              <input
                type="text"
                value={newChild.contraindications}
                onChange={(e) =>
                  setNewChild({
                    ...newChild,
                    contraindications: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
          {childError && (
            <p className="text-red-500 text-sm mt-2">{childError}</p>
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleCreateChild}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
            >
              Tạo Mới
            </button>
            <button
              onClick={() => setShowAddChildForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Bảng danh sách hồ sơ trẻ em */}
      <table className="min-w-full border divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã Trẻ Em
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Họ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giới Tính
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Sinh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chống Chỉ Định
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
          {children.map((child) => (
            <React.Fragment key={child.childId}>
              <tr className="cursor-pointer hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {child.childId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {child.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {child.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {child.gender ? "Nam" : "Nữ"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(child.dob).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {child.contraindications}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                    child.active ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  {child.active ? "Active" : "Inactive"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => handleChildEdit(child, e)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Cập Nhật
                  </button>
                  <button
                    onClick={(e) => handleChildInactive(child.childId, e)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Inactive
                  </button>
                </td>
              </tr>
              {/* Form cập nhật hồ sơ trẻ em */}
              {editingChild && editingChild.childId === child.childId && (
                <tr>
                  <td colSpan="8" className="px-6 py-4">
                    <div className="p-4 border border-gray-300 rounded-md">
                      <h3 className="text-xl font-semibold mb-4">
                        Cập Nhật Hồ Sơ Trẻ Em
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Họ
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tên
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ngày Sinh
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Giới Tính
                          </label>
                          <select
                            value={editingChild.gender ? "true" : "false"}
                            onChange={(e) =>
                              setEditingChild({
                                ...editingChild,
                                gender: e.target.value === "true",
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          >
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Chống Chỉ Định
                          </label>
                          <input
                            type="text"
                            value={editingChild.contraindications}
                            onChange={(e) =>
                              setEditingChild({
                                ...editingChild,
                                contraindications: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </div>
                      </div>
                      {childUpdateError && (
                        <p className="text-red-500 text-sm mt-2">
                          {childUpdateError}
                        </p>
                      )}
                      <div className="flex space-x-4 mt-4">
                        <button
                          onClick={handleChildSave}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingChild(null)}
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
    </div>
  );
};

export default Childs;
