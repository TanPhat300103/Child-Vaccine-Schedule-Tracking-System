// src/pages/Customer/Child.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import {
  getChild,
  updateChild,
  deleteChild,
  getMedicalHistoryByChildId,
  updateReaction, // Đã thêm import updateReaction
} from "../../apis/api";

const Child = () => {
  const { childId } = useParams();
  const location = useLocation();
  const customerId = location.state?.customerId;
  const navigate = useNavigate();

  const [child, setChild] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [medicalHistories, setMedicalHistories] = useState([]);

  // State mới để quản lý chỉnh sửa phản ứng
  const [editingReactionId, setEditingReactionId] = useState(null);
  const [reactionEditValue, setReactionEditValue] = useState("");

  useEffect(() => {
    console.log("Received customerId in Child:", customerId);
  }, [customerId]);

  const fetchChild = async () => {
    try {
      const data = await getChild(childId);
      setChild(data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu trẻ:", err);
    }
  };

  // Hàm lấy lịch sử tiêm chủng của trẻ
  const fetchMedicalHistory = async () => {
    try {
      const historyData = await getMedicalHistoryByChildId(childId);
      setMedicalHistories(historyData);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử tiêm chủng:", err);
    }
  };

  useEffect(() => {
    fetchChild();
    fetchMedicalHistory();
  }, [childId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await updateChild({
        ...child,
        ...editData,
        customer: { customerId },
      });
      if (response.success) {
        alert("Cập nhật thành công!");
        setEditing(false);
        fetchChild();
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trẻ:", err);
      alert("Lỗi cập nhật trẻ");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn tắt hồ sơ trẻ này không?")) {
      try {
        const response = await deleteChild(child.childId);
        if (response.success) {
          alert("Tắt thành công!");
          navigate("/customer");
        } else {
          alert(response.message);
        }
      } catch (err) {
        console.error("Lỗi tắt trẻ:", err);
        alert("Lỗi tắt trẻ");
      }
    }
  };

  // Hàm cập nhật phản ứng của medical history
  const handleUpdateReaction = async (id) => {
    try {
      const response = await updateReaction(id, reactionEditValue);
      if (response.success) {
        alert("Cập nhật phản ứng thành công!");
        // Cập nhật lại danh sách medicalHistories
        setMedicalHistories((prevHistories) =>
          prevHistories.map((history) =>
            history.medicalHistoryId === id
              ? { ...history, reaction: reactionEditValue }
              : history
          )
        );
        setEditingReactionId(null);
        setReactionEditValue("");
      } else {
        alert("Cập nhật phản ứng thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật phản ứng:", err);
      alert("Lỗi khi cập nhật phản ứng!");
    }
  };

  if (!child)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Đang tải dữ liệu trẻ em...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Hồ Sơ Tiêm Chủng Trẻ Em
      </h2>

      {/* Thông tin trẻ */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <table className="w-full bg-white border mb-4">
          <tbody className="text-gray-600 text-base font-medium">
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">Họ và tên</td>
              <td className="py-3 px-6 text-left">
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={child.firstName}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                      placeholder="Họ"
                    />
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={child.lastName}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                      placeholder="Tên"
                    />
                  </div>
                ) : (
                  `${child.firstName} ${child.lastName}`
                )}
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">Ngày sinh</td>
              <td className="py-3 px-6 text-left">
                {editing ? (
                  <input
                    type="date"
                    name="dob"
                    defaultValue={child.dob.split("T")[0]}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  format(new Date(child.dob), "dd/MM/yyyy")
                )}
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">Giới tính</td>
              <td className="py-3 px-6 text-left">
                {editing ? (
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="true"
                        checked={
                          editData.gender
                            ? editData.gender === "true"
                            : child.gender === true
                        }
                        onChange={handleEditChange}
                        className="mr-2"
                      />
                      Nam
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="false"
                        checked={
                          editData.gender
                            ? editData.gender === "false"
                            : child.gender === false
                        }
                        onChange={handleEditChange}
                        className="mr-2"
                      />
                      Nữ
                    </label>
                  </div>
                ) : child.gender ? (
                  "Nam"
                ) : (
                  "Nữ"
                )}
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">Chống chỉ định</td>
              <td className="py-3 px-6 text-left">
                {editing ? (
                  <input
                    type="text"
                    name="contraindications"
                    defaultValue={child.contraindications}
                    onChange={handleEditChange}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  child.contraindications
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end space-x-4 mb-8">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-bold text-xl transition-colors"
            >
              Lưu
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-bold text-xl transition-colors"
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setEditing(true);
                setEditData({
                  firstName: child.firstName,
                  lastName: child.lastName,
                  dob: child.dob.split("T")[0],
                  gender: String(child.gender),
                  contraindications: child.contraindications,
                });
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded font-bold text-xl transition-colors"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-bold text-xl transition-colors"
            >
              Tắt
            </button>
          </>
        )}
      </div>

      {/* Bảng Lịch Sử Tiêm Chủng (Medical History) */}
      <div className="overflow-x-auto mt-8">
        <h3 className="text-xl font-bold text-center mb-4">
          Lịch Sử Tiêm Chủng
        </h3>
        <table className="w-full bg-white border">
          <thead>
            <tr className="bg-blue-50 text-blue-700 uppercase text-base leading-normal">
              <th className="py-3 px-6 text-left">STT</th>
              <th className="py-3 px-6 text-left">Vaccine</th>
              <th className="py-3 px-6 text-left">Ngày tiêm</th>
              <th className="py-3 px-6 text-left">Dose</th>
              <th className="py-3 px-6 text-left">Phản ứng</th>
            </tr>
          </thead>
          <tbody className="text-blue-700 text-base font-medium">
            {medicalHistories && medicalHistories.length > 0 ? (
              medicalHistories.map((history, index) => (
                <tr
                  key={history.medicalHistoryId}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-6 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{history.vaccine.name}</td>
                  <td className="py-3 px-6">
                    {format(new Date(history.date), "dd/MM/yyyy")}
                  </td>
                  <td className="py-3 px-6">{history.dose}</td>
                  <td className="py-3 px-6">
                    {editingReactionId === history.medicalHistoryId ? (
                      <>
                        <input
                          type="text"
                          value={reactionEditValue}
                          onChange={(e) => setReactionEditValue(e.target.value)}
                          className="border rounded px-2 py-1"
                          placeholder="Nhập phản ứng..."
                        />
                        <button
                          onClick={() =>
                            handleUpdateReaction(history.medicalHistoryId)
                          }
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setEditingReactionId(null);
                            setReactionEditValue("");
                          }}
                          className="ml-2 bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        {history.reaction ? history.reaction : "Không có"}
                        <button
                          onClick={() => {
                            setEditingReactionId(history.medicalHistoryId);
                            setReactionEditValue(history.reaction || "");
                          }}
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Chỉnh sửa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center">
                  Không có lịch sử tiêm chủng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Child;
