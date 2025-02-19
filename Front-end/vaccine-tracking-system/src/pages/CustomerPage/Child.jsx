// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { format } from "date-fns";

// const apiUrl = import.meta.env.VITE_API_URL ;

// const Child = () => {
//   const { childId } = useParams();
//   const [child, setChild] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchChild = async () => {
//     setLoading(true);
//     try {
//       // Adjust the endpoint according to your API
//       const response = await axios.get("${apiUrl}/child/findid?id=${childId}");
//       setChild(response.data);
//       setError(null);
//     } catch (err) {
//       console.error("Lỗi lấy dữ liệu trẻ:", err);
//       setError("Không thể tải thông tin trẻ em");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChild();
//   }, [childId]);

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       // Create update payload with only the changed fields
//       const updatePayload = {
//         ...editData,
//       };

//       // Send PUT request to update child information
//       await axios.put("${apiUrl}/child/update", updatePayload);
//       alert("Cập nhật thành công!");
//       setEditing(false);
//       fetchChild();
//     } catch (err) {
//       console.error("Lỗi cập nhật trẻ:", err);
//       alert("Lỗi cập nhật trẻ: ${err.response?.data?.message || err.message}");
//     }
//   };

//   if (loading) return <p>Đang tải dữ liệu trẻ em...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (!child) return <p>Không tìm thấy thông tin trẻ em</p>;

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-center">
//         Hồ Sơ Tiêm Chủng Trẻ Em
//       </h2>
//       <table className="min-w-full bg-white border mb-4">
//         <tbody className="text-gray-600 text-sm font-light">
//           <tr className="border-b border-gray-200 hover:bg-gray-100">
//             <td className="py-3 px-6 text-left">Mã trẻ</td>
//             <td className="py-3 px-6 text-left">{child.childId}</td>
//           </tr>
//           <tr className="border-b border-gray-200 hover:bg-gray-100">
//             <td className="py-3 px-6 text-left">Họ và tên</td>
//             <td className="py-3 px-6 text-left">
//               {editing ? (
//                 <>
//                   <input
//                     type="text"
//                     name="firstName"
//                     defaultValue={child.firstName}
//                     onChange={handleEditChange}
//                     className="border rounded px-2 py-1 mr-2"
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     defaultValue={child.lastName}
//                     onChange={handleEditChange}
//                     className="border rounded px-2 py-1"
//                   />
//                 </>
//               ) : (
//                 `${child.firstName} ${child.lastName}`
//               )}
//             </td>
//           </tr>
//           <tr className="border-b border-gray-200 hover:bg-gray-100">
//             <td className="py-3 px-6 text-left">Ngày sinh</td>
//             <td className="py-3 px-6 text-left">
//               {child.dob
//                 ? format(new Date(child.dob), "dd/MM/yyyy")
//                 : "Chưa cập nhật"}
//             </td>
//           </tr>
//           <tr className="border-b border-gray-200 hover:bg-gray-100">
//             <td className="py-3 px-6 text-left">Giới tính</td>
//             <td className="py-3 px-6 text-left">
//               {child.gender === "male"
//                 ? "Nam"
//                 : child.gender === "female"
//                 ? "Nữ"
//                 : "Chưa cập nhật"}
//             </td>
//           </tr>
//           <tr className="border-b border-gray-200 hover:bg-gray-100">
//             <td className="py-3 px-6 text-left">Chống chỉ định</td>
//             <td className="py-3 px-6 text-left">
//               {child.contraindications || "Không có"}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {editing ? (
//         <div className="flex justify-end space-x-4">
//           <button
//             onClick={handleSave}
//             className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
//           >
//             Lưu
//           </button>
//           <button
//             onClick={() => setEditing(false)}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
//           >
//             Hủy
//           </button>
//         </div>
//       ) : (
//         <div className="flex justify-end">
//           <button
//             onClick={() => {
//               setEditing(true);
//               setEditData({
//                 firstName: child.firstName,
//                 lastName: child.lastName,
//               });
//             }}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
//           >
//             Chỉnh sửa
//           </button>
//         </div>
//       )}

//       {/* Bảng Vaccine Đã Tiêm */}
//       <div>
//         <h3 className="text-xl font-bold text-center mb-2">Vaccine Đã Tiêm</h3>
//         {child.vaccinations && child.vaccinations.length > 0 ? (
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//                 <th className="py-3 px-6 text-left">STT</th>
//                 <th className="py-3 px-6 text-left">Vaccine Đã Tiêm</th>
//                 <th className="py-3 px-6 text-left">Ngày tiêm</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-600 text-sm font-light">
//               {child.vaccinations.map((vac, index) => (
//                 <tr
//                   key={vac.id || index}
//                   className="border-b border-gray-200 hover:bg-gray-100"
//                 >
//                   <td className="py-3 px-6 text-left text-center">
//                     {index + 1}
//                   </td>
//                   <td className="py-3 px-6 text-left">{vac.vaccine}</td>
//                   <td className="py-3 px-6 text-left">
//                     {format(new Date(vac.date), "dd/MM/yyyy")}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center text-gray-500">
//             Chưa có thông tin tiêm chủng
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Child;
