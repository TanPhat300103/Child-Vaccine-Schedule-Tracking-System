// import React, { useState, useEffect } from "react";
// import Modal from "react-modal";
// import { useCart } from "../common/AuthContext";
// import {
//   FaSyringe,
//   FaFlask,
//   FaGlobe,
//   FaUserClock,
//   FaDollarSign,
//   FaSearch,
//   FaChild,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

// // API mock functions (like your original mock)
// const getVaccines = async () => {
//   return [
//     // Mock vaccines data here (unchanged from the original code)
//   ];
// };

// const getVaccineDetailByVaccineId = async (id) => {
//   return [
//     // Mock vaccine detail data here (unchanged from the original code)
//   ];
// };

// const LichTiemChung = () => {
//   const [danhSachVaccine, setDanhSachVaccine] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [thongTinVaccine, setThongTinVaccine] = useState(null);
//   const [vaccineSelected, setVaccineSelected] = useState([]);
//   const { addToCart } = useCart ? useCart() : { addToCart: () => {} };
//   const [searchQuery, setSearchQuery] = useState("");
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(1000000);
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedVaccine, setSelectedVaccine] = useState(null);
//   const [showFullSchedule, setShowFullSchedule] = useState(true);
//   const [ageRangeFilter, setAgeRangeFilter] = useState({ min: 0, max: 18 });

//   // Filter vaccines by name, price, country, and age range
//   const filteredVaccines = danhSachVaccine.filter(
//     (vaccine) =>
//       vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vaccine.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredVaccinesByPriceAndCountry = filteredVaccines.filter(
//     (vaccine) =>
//       vaccine.price >= minPrice &&
//       vaccine.price <= maxPrice &&
//       (selectedCountry ? vaccine.country === selectedCountry : true) &&
//       vaccine.ageMin >= ageRangeFilter.min &&
//       vaccine.ageMax <= ageRangeFilter.max
//   );

//   // Fetch vaccine details
//   useEffect(() => {
//     if (!selectedVaccine?.vaccineId) return;

//     const fetchVaccineData = async () => {
//       try {
//         setLoading(true);
//         const data = await getVaccineDetailByVaccineId(
//           selectedVaccine.vaccineId
//         );
//         if (data?.length > 0) {
//           setThongTinVaccine(data[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching vaccine data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVaccineData();
//   }, [selectedVaccine]);

//   // Fetch vaccines list
//   useEffect(() => {
//     const fetchVaccines = async () => {
//       try {
//         setLoading(true);
//         const data = await getVaccines();
//         setDanhSachVaccine(data);
//         setVaccineSelected(data);
//       } catch (error) {
//         console.error("Error fetching vaccines list:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVaccines();
//   }, []);

//   const openModal = (vaccine) => {
//     setSelectedVaccine(vaccine);
//     setModalIsOpen(true);
//   };

//   const closeModal = () => {
//     setModalIsOpen(false);
//     setSelectedVaccine(null);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const scheduleByAge = [
//     // Mock schedule data here (same as original code)
//   ];

//   return (
//     <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl md:text-4xl font-bold text-[#1A365D] text-center mb-2">
//             Lịch Tiêm Chủng Cho Trẻ Em
//           </h1>
//           <p className="text-center text-gray-600 mb-6">
//             Theo dõi và quản lý lịch tiêm chủng cho trẻ một cách dễ dàng và hiệu
//             quả
//           </p>
//         </div>

//         {/* Vaccine schedule by age */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mb-8">
//           <div
//             onClick={() => setShowFullSchedule(!showFullSchedule)}
//             className="cursor-pointer bg-[#2C5DA3] text-white p-6 flex items-center justify-between"
//           >
//             <div className="flex items-center space-x-4">
//               <FaCalendarAlt className="text-2xl" />
//               <h2 className="text-xl font-semibold">
//                 Lịch tiêm chủng theo độ tuổi
//               </h2>
//             </div>
//             {showFullSchedule ? (
//               <IoMdArrowDropup className="text-2xl" />
//             ) : (
//               <IoMdArrowDropdown className="text-2xl" />
//             )}
//           </div>

//           {showFullSchedule && (
//             <div className="p-6">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-[#EBF4FF] border-b border-gray-200">
//                       <th className="text-left py-3 px-4 text-[#1A365D] font-semibold">
//                         Độ tuổi
//                       </th>
//                       <th className="text-left py-3 px-4 text-[#1A365D] font-semibold">
//                         Vắc xin cần tiêm
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {scheduleByAge.map((item, index) => (
//                       <tr
//                         key={index}
//                         className={`border-b border-gray-100 hover:bg-blue-50 ${
//                           index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                         }`}
//                       >
//                         <td className="py-4 px-4 font-medium text-[#2C5DA3]">
//                           {item.age}
//                         </td>
//                         <td className="py-4 px-4">
//                           <ul className="list-disc pl-4">
//                             {item.vaccines.map((vaccine, vIndex) => (
//                               <li key={vIndex} className="mb-1">
//                                 {vaccine}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
//                 <p className="text-sm text-gray-700">
//                   <span className="font-semibold text-[#2C5DA3]">Lưu ý:</span>{" "}
//                   Lịch tiêm chủng trên đây là lịch tiêm chủng cơ bản theo khuyến
//                   cáo của Bộ Y tế. Tùy thuộc vào tình trạng sức khỏe của trẻ,
//                   bác sĩ có thể điều chỉnh lịch tiêm phù hợp.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Search and filters */}
//         <div className="relative mb-6">
//           <input
//             type="text"
//             className="w-full p-4 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-md transition duration-300 ease-in-out"
//             placeholder="Tìm kiếm vắc xin theo tên hoặc mô tả"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <div className="absolute left-4 top-4 text-gray-500">
//             <FaSearch />
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto mb-8">
//           <h3 className="font-bold text-lg text-[#1A365D] mb-4">
//             Bộ lọc tìm kiếm
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
//             {/* Min and Max Price Filters */}
//             {/* The rest of your filters go here (same as your original code) */}
//           </div>
//         </div>

//         {/* Vaccine Price List */}
//         <h2 className="text-[#1A365D] text-2xl font-bold mb-6">
//           Bảng Giá Vắc Xin Dành Cho Trẻ Em
//         </h2>

//         <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mb-8">
//           <div className="bg-[#2C5DA3] text-white p-6 flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <FaSyringe className="text-2xl" />
//               <h2 className="text-xl font-semibold">Danh sách vắc xin</h2>
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-[#EBF4FF] border-b border-gray-200">
//                     {/* Table headers for vaccines */}
//                     {/* The rest of your table rows */}
//                   </tr>
//                 </thead>
//                 <tbody>{/* Rendering filtered vaccines */}</tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Vaccine Details Modal */}
//         <Modal
//           isOpen={modalIsOpen}
//           onRequestClose={closeModal}
//           contentLabel="Thông tin chi tiết vắc xin"
//           className="fixed inset-0 flex items-center justify-center z-50"
//           overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//           ariaHideApp={false}
//         >
//           <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <svg
//                   className="animate-spin h-8 w-8 text-blue-500"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//               </div>
//             ) : thongTinVaccine ? (
//               <>{/* Render vaccine details */}</>
//             ) : null}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default LichTiemChung;
