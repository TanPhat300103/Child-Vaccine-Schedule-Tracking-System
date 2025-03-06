import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import {
  getChild,
  updateChild,
  deleteChild,
  getMedicalHistoryByChildId,
  updateReaction,
} from "../../apis/api";
import {
  HeartPulse,
  Edit2,
  Trash2,
  Save,
  X,
  Activity,
  Mars,
  Venus,
} from "lucide-react";
import { useAuth } from "../../components/common/AuthContext.jsx";

const Child = () => {
  const { childId } = useParams();
  const { userInfo } = useAuth();
  const location = useLocation();
  const customerId = location.state?.customerId || userInfo.userId;
  const navigate = useNavigate();

  const [child, setChild] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [medicalHistories, setMedicalHistories] = useState([]);

  // Dùng cho modal chỉnh sửa phản ứng
  const [editingReactionId, setEditingReactionId] = useState(null);
  const [reactionEditValue, setReactionEditValue] = useState("");

  useEffect(() => {
    fetchChild();
    fetchMedicalHistory();
  }, [childId]);

  const fetchChild = async () => {
    try {
      const data = await getChild(childId);
      setChild(data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu trẻ:", err);
    }
  };

  const fetchMedicalHistory = async () => {
    try {
      const historyData = await getMedicalHistoryByChildId(childId);
      setMedicalHistories(historyData);
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử tiêm chủng:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm kiểm tra có thay đổi so với dữ liệu ban đầu không
  const hasChanges = () => {
    if (!child) return false;
    return (
      editData.firstName !== child.firstName ||
      editData.lastName !== child.lastName ||
      editData.dob !== child.dob.split("T")[0] ||
      editData.gender !== String(child.gender) ||
      editData.contraindications !== child.contraindications
    );
  };

  const handleSave = async () => {
    if (!hasChanges()) return; // không cho lưu nếu không có thay đổi
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

  const handleUpdateReaction = async (id) => {
    try {
      const response = await updateReaction(id, reactionEditValue);
      if (response.success) {
        alert("Cập nhật phản ứng thành công!");
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

  // Tìm thông tin lịch sử tiêm chủng đang được chỉnh sửa
  const selectedHistory = medicalHistories.find(
    (history) => history.medicalHistoryId === editingReactionId
  );

  if (!child)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center space-y-4">
          <HeartPulse className="w-24 h-24 text-blue-500 animate-pulse" />
          <p className="text-xl text-blue-700 font-semibold">
            Đang tải dữ liệu trẻ em...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <HeartPulse className="w-10 h-10 text-blue-100" />
            <h2 className="text-2xl font-bold text-blue-50">
              Hồ Sơ Tiêm Chủng Trẻ Em
            </h2>
          </div>
          <div className="flex space-x-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges()}
                  className={`${
                    hasChanges()
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white p-2 rounded-full transition-all hover:scale-110`}
                >
                  <Save className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full transition-all hover:scale-110"
                >
                  <X className="w-6 h-6" />
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-all hover:scale-110"
                >
                  <Edit2 className="w-6 h-6" />
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all hover:scale-110"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Child Information */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <label className="block text-blue-700 font-semibold mb-2">
                Họ và tên
              </label>
              {editing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={child.firstName}
                    onChange={handleEditChange}
                    className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Họ"
                  />
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={child.lastName}
                    onChange={handleEditChange}
                    className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên"
                  />
                </div>
              ) : (
                <p className="text-xl font-bold text-blue-900">
                  {`${child.firstName} ${child.lastName}`}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <label className="block text-blue-700 font-semibold mb-2">
                Ngày sinh
              </label>
              {editing ? (
                <input
                  type="date"
                  name="dob"
                  defaultValue={child.dob.split("T")[0]}
                  onChange={handleEditChange}
                  className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-xl font-bold text-blue-900">
                  {format(new Date(child.dob), "dd/MM/yyyy")}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <label className="block text-blue-700 font-semibold mb-2">
                Giới tính
              </label>
              {editing ? (
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setEditData((prev) => ({
                        ...prev,
                        gender: prev.gender === "true" ? "false" : "true",
                      }))
                    }
                    className="rounded-full border-2 border-blue-300 px-4 py-2 flex items-center gap-2 focus:outline-none"
                  >
                    {editData.gender === "true" ? (
                      <Mars className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Venus className="w-5 h-5 text-pink-600" />
                    )}
                    <span className="text-blue-900 font-semibold">
                      {editData.gender === "true" ? "Nam" : "Nữ"}
                    </span>
                  </button>
                </div>
              ) : (
                <button className="rounded-full border-2 border-blue-300 px-4 py-2 flex items-center gap-2 cursor-default">
                  {child.gender ? (
                    <Mars className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Venus className="w-5 h-5 text-pink-600" />
                  )}
                  <span className="text-blue-900 font-semibold">
                    {child.gender ? "Nam" : "Nữ"}
                  </span>
                </button>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <label className="block text-blue-700 font-semibold mb-2">
                Chống chỉ định
              </label>
              {editing ? (
                <input
                  type="text"
                  name="contraindications"
                  defaultValue={child.contraindications}
                  onChange={handleEditChange}
                  className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-xl font-bold text-blue-900">
                  {child.contraindications || "Không có"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Vaccination History */}
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Activity className="w-8 h-8 text-blue-600 mr-2" />
            <h3 className="text-2xl font-bold text-blue-900">
              Lịch Sử Tiêm Chủng
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-6 text-left text-blue-800">STT</th>
                  <th className="py-3 px-6 text-left text-blue-800">Vaccine</th>
                  <th className="py-3 px-6 text-left text-blue-800">
                    Ngày tiêm
                  </th>
                  <th className="py-3 px-6 text-left text-blue-800">
                    Liều Lượng
                  </th>
                  <th className="py-3 px-6 text-left text-blue-800">
                    Phản ứng
                  </th>
                </tr>
              </thead>
              <tbody>
                {medicalHistories && medicalHistories.length > 0 ? (
                  medicalHistories.map((history, index) => (
                    <tr
                      key={history.medicalHistoryId}
                      className="border-b border-blue-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-3 px-6 text-blue-900">{index + 1}</td>
                      <td className="py-3 px-6 text-blue-900">
                        {history.vaccine.name}
                      </td>
                      <td className="py-3 px-6 text-blue-900">
                        {format(new Date(history.date), "dd/MM/yyyy")}
                      </td>
                      <td className="py-3 px-6 text-blue-900">
                        {history.dose}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-900">
                            {history.reaction || "Không có"}
                          </span>
                          <button
                            onClick={() => {
                              setEditingReactionId(history.medicalHistoryId);
                              setReactionEditValue(history.reaction || "");
                            }}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-blue-900 text-lg font-semibold"
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <HeartPulse className="w-16 h-16 text-blue-400 opacity-50" />
                        Không có lịch sử tiêm chủng nào.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa Phản Ứng */}
      {editingReactionId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-2/5 overflow-hidden border border-slate-200  transition-all duration-300 transform">
            {/* Header with medical theme */}
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-5">
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 8l-7 7-7-7"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Ghi Nhận Phản Ứng Sau Tiêm
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedHistory ? (
                <>
                  <div className="mb-6 bg-slate-50  p-4 rounded-xl border-l-4 border-teal-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-teal-600 "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-5 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs  text-slate-900">Vaccine</p>
                          <p className="font-medium text-slate-900 dark:text-slate-900">
                            {selectedHistory.vaccine.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100  flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600 "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs  text-slate-900 ">Ngày tiêm</p>
                          <p className="font-medium text-slate-900 dark:text-indigo-900">
                            {format(
                              new Date(selectedHistory.date),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100  flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-600 "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs  text-slate-900 ">Liều lượng</p>
                          <p className="font-medium text-slate-900 dark:text-slate-900">
                            {selectedHistory.dose}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="reaction"
                      className="block text-sm font-medium text-slate-700 dark:text-blue-900 mb-2"
                    >
                      Mô tả phản ứng sau tiêm
                    </label>
                    <textarea
                      id="reaction"
                      value={reactionEditValue}
                      onChange={(e) => setReactionEditValue(e.target.value)}
                      className="w-full bg-white  border border-slate-300  rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all duration-200  dark:text-blue-950 placeholder-slate-400  resize-none"
                      placeholder="Mô tả chi tiết các phản ứng sau khi tiêm (nếu có)..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditingReactionId(null);
                        setReactionEditValue("");
                      }}
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-300 transition-all duration-200 flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </button>
                    <button
                      onClick={() => handleUpdateReaction(editingReactionId)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thông tin
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-center">
                    Không tìm thấy dữ liệu. Vui lòng thử lại.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Child;
