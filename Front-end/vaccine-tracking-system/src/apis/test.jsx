// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./BookingPage.css";

// function BookingPage() {
//   const [vaccines, setVaccines] = useState([]);
//   const [vaccineCombos, setVaccineCombos] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedVaccine, setSelectedVaccine] = useState(null);
//   const [selectedCombo, setSelectedCombo] = useState(null);
//   const [vaccineSearch, setVaccineSearch] = useState("");
//   const [comboSearch, setComboSearch] = useState("");
//   const [minAgeFilter, setMinAgeFilter] = useState("");
//   const [maxAgeFilter, setMaxAgeFilter] = useState("");
//   const [children, setChildren] = useState([]);
//   const [selectedChild, setSelectedChild] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showConfirmPopup, setShowConfirmPopup] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [bookingStatus, setBookingStatus] = useState(null); // State để lưu trạng thái đặt lịch (success/error)

//   useEffect(() => {
//     const fetchVaccines = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/vaccine", {
//           method: "GET",
//           credentials: "include",
//         });
//         if (!response.ok) throw new Error("Failed to fetch vaccines");
//         const data = await response.json();
//         const mockVaccines = [
//           ...data,
//           ...Array.from(
//             { length: Math.max(0, 8 - data.length) },
//             (_, index) => ({
//               vaccineId: `V00${data.length + index + 1}`,
//               name: `Vaccine ${data.length + index + 1}`,
//               description: `Description for Vaccine ${data.length + index + 1}`,
//               price: 200000 + index * 50000,
//               doseNumber: 2,
//               country: "USA",
//               ageMin: 12 + index * 5,
//               ageMax: 99 - index * 5,
//               active: true,
//             })
//           ),
//         ];
//         setVaccines(
//           mockVaccines.map((vaccine) => ({
//             ...vaccine,
//             isSelected: false,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching vaccines:", error);
//       }
//     };

//     const fetchVaccineCombos = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/vaccinecombo", {
//           method: "GET",
//           credentials: "include",
//         });
//         if (!response.ok) throw new Error("Failed to fetch vaccine combos");
//         const data = await response.json();
//         const mockCombos = [
//           ...data,
//           ...Array.from(
//             { length: Math.max(0, 8 - data.length) },
//             (_, index) => ({
//               vaccineComboId: `C00${data.length + index + 1}`,
//               name: `Combo ${data.length + index + 1}`,
//               description: `Description for Combo ${data.length + index + 1}`,
//               priceCombo: 300000 + index * 50000,
//             })
//           ),
//         ];
//         setVaccineCombos(
//           mockCombos.map((combo) => ({
//             ...combo,
//             isSelected: false,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching vaccine combos:", error);
//       }
//     };

//     const fetchChildren = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:8080/child/findbycustomer?id=1",
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch children");
//         const data = await response.json();
//         setChildren(data);
//       } catch (error) {
//         console.error("Error fetching children:", error);
//       }
//     };

//     fetchVaccines();
//     fetchVaccineCombos();
//     fetchChildren();
//   }, []);

//   console.log("Selected Items:", selectedItems);
//   console.log("Children:", children);

//   const handleCheckboxChange = (item, type, e) => {
//     e.stopPropagation();
//     const isChecked = e.target.checked;

//     if (isChecked) {
//       setSelectedItems((prev) => [...prev, item]);
//       if (type === "vaccine") {
//         setVaccines((prev) =>
//           prev.map((v) =>
//             v.vaccineId === item.vaccineId ? { ...v, isSelected: true } : v
//           )
//         );
//       } else {
//         setVaccineCombos((prev) =>
//           prev.map((c) =>
//             c.vaccineComboId === item.vaccineComboId
//               ? { ...c, isSelected: true }
//               : c
//           )
//         );
//       }
//     } else {
//       setSelectedItems((prev) =>
//         prev.filter((selectedItem) =>
//           type === "vaccine"
//             ? selectedItem.vaccineId !== item.vaccineId
//             : selectedItem.vaccineComboId !== item.vaccineComboId
//         )
//       );
//       if (type === "vaccine") {
//         setVaccines((prev) =>
//           prev.map((v) =>
//             v.vaccineId === item.vaccineId ? { ...v, isSelected: false } : v
//           )
//         );
//       } else {
//         setVaccineCombos((prev) =>
//           prev.map((c) =>
//             c.vaccineComboId === item.vaccineComboId
//               ? { ...c, isSelected: false }
//               : c
//           )
//         );
//       }
//     }
//   };

//   const handleRemoveItem = (itemToRemove) => {
//     setSelectedItems((prev) =>
//       prev.filter((item) =>
//         item.vaccineId
//           ? item.vaccineId !== itemToRemove.vaccineId
//           : item.vaccineComboId !== itemToRemove.vaccineComboId
//       )
//     );

//     setVaccines((prev) =>
//       prev.map((v) =>
//         v.vaccineId === itemToRemove.vaccineId ? { ...v, isSelected: false } : v
//       )
//     );

//     setVaccineCombos((prev) =>
//       prev.map((c) =>
//         c.vaccineComboId === itemToRemove.vaccineComboId
//           ? { ...c, isSelected: false }
//           : c
//       )
//     );
//   };

//   const handleOpenVaccineModal = (vaccine) => {
//     setSelectedVaccine(vaccine);
//   };

//   const handleOpenComboModal = (combo) => {
//     setSelectedCombo(combo);
//   };

//   const handleCloseModal = () => {
//     setSelectedVaccine(null);
//     setSelectedCombo(null);
//     setShowConfirmPopup(false);
//     setIsLoading(false);
//     setBookingStatus(null); // Reset trạng thái đặt lịch khi đóng modal
//   };

//   const handleChildSelect = (childId) => {
//     setSelectedChild(childId);
//   };

//   // Hàm xử lý khi nhấn nút "Xác nhận đặt vaccine"
//   const handleConfirmBooking = () => {
//     setShowConfirmPopup(true);
//     setBookingStatus(null); // Reset trạng thái đặt lịch khi mở popup
//   };

//   // Hàm gửi yêu cầu đặt lịch lên API
//   const confirmBooking = async () => {
//     setIsLoading(true);

//     // Định dạng ngày theo yêu cầu (yyyy-MM-dd)
//     const formattedDate = selectedDate.toISOString().split("T")[0];

//     // Tách vaccineId và vaccineComboId từ selectedItems
//     const vaccineIds = selectedItems
//       .filter((item) => item.vaccineId)
//       .map((item) => item.vaccineId);
//     const vaccineComboIds = selectedItems
//       .filter((item) => item.vaccineComboId)
//       .map((item) => item.vaccineComboId);

//     // Lấy customerId từ child được chọn
//     const selectedChildData = children.find(
//       (child) => child.childId === selectedChild
//     );
//     const customerId = selectedChildData
//       ? selectedChildData.customer.customerId
//       : null;

//     if (!customerId) {
//       setBookingStatus({
//         success: false,
//         message: "Không tìm thấy thông tin khách hàng. Vui lòng thử lại!",
//       });
//       setIsLoading(false);
//       return;
//     }

//     // Tạo payload theo định dạng yêu cầu
//     const payload = {
//       booking: {
//         bookingDate: formattedDate,
//         customer: {
//           customerId: customerId,
//         },
//         status: 1,
//       },
//       vaccineId: vaccineIds,
//       child: {
//         childId: selectedChild,
//       },
//       vaccineComboId: vaccineComboIds,
//     };

//     try {
//       const response = await fetch("http://localhost:8080/booking/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to create booking");
//       const data = await response.json();
//       console.log("Booking created successfully:", data);
//       setBookingStatus({ success: true, message: "Đặt lịch thành công!" });
//       // Reset các lựa chọn sau khi đặt thành công
//       setSelectedItems([]);
//       setSelectedChild("");
//       setSelectedDate(null);
//       setVaccines((prev) =>
//         prev.map((vaccine) => ({ ...vaccine, isSelected: false }))
//       );
//       setVaccineCombos((prev) =>
//         prev.map((combo) => ({ ...combo, isSelected: false }))
//       );
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       setBookingStatus({
//         success: false,
//         message: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredVaccines = vaccines.filter((vaccine) => {
//     const matchesName = vaccine.name
//       .toLowerCase()
//       .includes(vaccineSearch.toLowerCase());
//     const minAge = minAgeFilter ? parseInt(minAgeFilter, 10) : null;
//     const maxAge = maxAgeFilter ? parseInt(maxAgeFilter, 10) : null;

//     let matchesAge = true;
//     if (minAge !== null) {
//       matchesAge = matchesAge && vaccine.ageMin >= minAge;
//     }
//     if (maxAge !== null) {
//       matchesAge = matchesAge && vaccine.ageMax <= maxAge;
//     }

//     return matchesName && matchesAge;
//   });

//   const filteredCombos = vaccineCombos.filter((combo) =>
//     combo.name.toLowerCase().includes(comboSearch.toLowerCase())
//   );

//   const totalPrice = selectedItems.reduce((sum, item) => {
//     const price = item.price || item.priceCombo || 0;
//     return sum + price;
//   }, 0);

//   return (
//     <div className="booking-page-container-bookingpage">
//       <div className="booking-page-wrapper-bookingpage">
//         <header className="booking-header-bookingpage">
//           <h2>Đăng Ký Tiêm Chủng</h2>
//           <p>Lựa chọn vaccine chất lượng, bảo vệ sức khỏe</p>
//         </header>

//         <div className="booking-content-bookingpage">
//           <div className="booking-list-section-bookingpage">
//             {/* Vaccine Section */}
//             <div className="vaccine-section-bookingpage">
//               <div className="section-title-bookingpage">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="icon-bookingpage"
//                 >
//                   <path d="M8 2v4"></path>
//                   <path d="M16 2v4"></path>
//                   <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//                   <path d="M3 10h18"></path>
//                   <path d="m14 14 2 2 4-4"></path>
//                 </svg>
//                 <h2>Danh sách Vaccine</h2>
//               </div>

//               {/* Search Bar và Filter cho Vaccine */}
//               <div className="search-filter-container-bookingpage">
//                 <div className="search-bar-wrapper-bookingpage">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="search-icon-bookingpage"
//                   >
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Tìm kiếm vaccine..."
//                     value={vaccineSearch}
//                     onChange={(e) => setVaccineSearch(e.target.value)}
//                     className="search-bar-bookingpage"
//                   />
//                 </div>
//                 <div className="age-filter-bookingpage">
//                   <input
//                     type="number"
//                     placeholder="Tuổi tối thiểu"
//                     value={minAgeFilter}
//                     onChange={(e) => setMinAgeFilter(e.target.value)}
//                     className="age-input-bookingpage"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Tuổi tối đa"
//                     value={maxAgeFilter}
//                     onChange={(e) => setMaxAgeFilter(e.target.value)}
//                     className="age-input-bookingpage"
//                   />
//                 </div>
//               </div>

//               <div className="vaccine-grid-bookingpage">
//                 {filteredVaccines.map((vaccine) => (
//                   <div
//                     key={vaccine.vaccineId}
//                     className={`vaccine-card-bookingpage ${
//                       vaccine.isSelected ? "selected-bookingpage" : ""
//                     }`}
//                     onClick={() => handleOpenVaccineModal(vaccine)}
//                   >
//                     <div className="vaccine-info-bookingpage">
//                       <h3>{vaccine.name || "Không có tên"}</h3>
//                       <p>{vaccine.description || "Không có mô tả"}</p>
//                       <div className="vaccine-price-bookingpage">
//                         {(vaccine.price || 0).toLocaleString()} VND
//                       </div>
//                     </div>
//                     <div className="vaccine-actions-bookingpage">
//                       <input
//                         type="checkbox"
//                         checked={vaccine.isSelected}
//                         onChange={(e) =>
//                           handleCheckboxChange(vaccine, "vaccine", e)
//                         }
//                         onClick={(e) => e.stopPropagation()}
//                         className="checkbox-bookingpage"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Vaccine Combo Section */}
//             <div className="vaccine-combo-section-bookingpage">
//               <div className="section-title-bookingpage">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="icon-bookingpage"
//                 >
//                   <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//                   <path d="M16 2v4"></path>
//                   <path d="M8 2v4"></path>
//                   <path d="M3 10h18"></path>
//                   <path d="m13 16 3-3 3 3"></path>
//                 </svg>
//                 <h2>Gói Vaccine</h2>
//               </div>

//               {/* Search Bar cho Combo */}
//               <div className="search-filter-container-bookingpage">
//                 <div className="search-bar-wrapper-bookingpage">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="search-icon-bookingpage"
//                   >
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="Tìm kiếm combo..."
//                     value={comboSearch}
//                     onChange={(e) => setComboSearch(e.target.value)}
//                     className="search-bar-bookingpage"
//                   />
//                 </div>
//               </div>

//               <div className="vaccine-grid-bookingpage">
//                 {filteredCombos.map((combo) => (
//                   <div
//                     key={combo.vaccineComboId}
//                     className={`vaccine-card-bookingpage ${
//                       combo.isSelected ? "selected-bookingpage" : ""
//                     }`}
//                     onClick={() => handleOpenComboModal(combo)}
//                   >
//                     <div className="vaccine-info-bookingpage">
//                       <h3>{combo.name || "Không có tên"}</h3>
//                       <p>{combo.description || "Không có mô tả"}</p>
//                       <div className="vaccine-price-bookingpage">
//                         {(combo.priceCombo || 0).toLocaleString()} VND
//                       </div>
//                     </div>
//                     <div className="vaccine-actions-bookingpage">
//                       <input
//                         type="checkbox"
//                         checked={combo.isSelected}
//                         onChange={(e) =>
//                           handleCheckboxChange(combo, "combo", e)
//                         }
//                         onClick={(e) => e.stopPropagation()}
//                         className="checkbox-bookingpage"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Selected Items Sidebar */}
//           <div className="selected-sidebar-bookingpage">
//             <div className="sidebar-header-bookingpage">
//               <div className="sidebar-title-bookingpage">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="icon-bookingpage"
//                 >
//                   <path d="M12 2a10 10 0 1 0 10 10A4 4 0 0 1 12 8V2"></path>
//                   <path d="M9 15v-3a3 3 0 1 1 6 0v3"></path>
//                 </svg>
//                 <h2>Thông tin đặt chọn</h2>
//               </div>
//               <span className="sidebar-count-bookingpage">
//                 {selectedItems.length} mục
//               </span>
//             </div>

//             <div className="sidebar-body-bookingpage">
//               {selectedItems.length === 0 ? (
//                 <div className="empty-selection-bookingpage">
//                   <p>Bạn chưa chọn vaccine nào</p>
//                 </div>
//               ) : (
//                 <div className="selected-items-list-bookingpage">
//                   <div className="selected-items-scrollable-bookingpage">
//                     {selectedItems.map((item) => (
//                       <div
//                         key={item.vaccineId || item.vaccineComboId}
//                         className="selected-item-bookingpage"
//                       >
//                         <div className="selected-item-icon-bookingpage">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <path d="M12 2v6l3 3-3 3v6m-6-6h12"></path>
//                           </svg>
//                         </div>
//                         <div className="selected-item-details-bookingpage">
//                           <h4>{item.name || "Không có tên"}</h4>
//                           <p>
//                             {(
//                               item.price ||
//                               item.priceCombo ||
//                               0
//                             ).toLocaleString()}{" "}
//                             VND
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveItem(item)}
//                           className="remove-item-btn-bookingpage"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Danh sách con dưới dạng thẻ nhỏ nằm ngang */}
//                   {selectedItems.length > 0 && (
//                     <div className="child-selection-bookingpage">
//                       <label className="child-selection-label-bookingpage">
//                         Tiêm cho:
//                       </label>
//                       <div className="child-cards-container-bookingpage">
//                         {children.map((child) => (
//                           <div
//                             key={child.childId}
//                             className={`child-card-bookingpage ${
//                               selectedChild === child.childId ? "selected" : ""
//                             }`}
//                             onClick={() => handleChildSelect(child.childId)}
//                           >
//                             <span>
//                               {child.firstName} {child.lastName}
//                             </span>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Lịch chọn ngày */}
//                       <div className="date-selection-bookingpage">
//                         <label className="date-selection-label-bookingpage">
//                           Ngày tiêm:
//                         </label>
//                         <DatePicker
//                           selected={selectedDate}
//                           onChange={(date) => setSelectedDate(date)}
//                           dateFormat="dd/MM/yyyy"
//                           placeholderText="Chọn ngày tiêm"
//                           className="date-picker-bookingpage"
//                           minDate={new Date()}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="sidebar-footer-bookingpage">
//               {selectedItems.length > 0 && (
//                 <div className="total-section-bookingpage">
//                   <div className="total-label-bookingpage">Tổng cộng</div>
//                   <div className="total-price-bookingpage">
//                     {totalPrice.toLocaleString()} VND
//                   </div>
//                 </div>
//               )}
//               <button
//                 className="confirm-button-bookingpage"
//                 disabled={
//                   selectedItems.length === 0 || !selectedChild || !selectedDate
//                 }
//                 onClick={handleConfirmBooking}
//               >
//                 {selectedItems.length === 0
//                   ? "Vui lòng chọn vaccine"
//                   : "Xác nhận đặt vaccine"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal cho Vaccine */}
//       {selectedVaccine && (
//         <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
//           <div
//             className="modal-content-bookingpage"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-header-bookingpage">
//               <h2>{selectedVaccine.name || "Không có tên"}</h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="close-modal-btn-bookingpage"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body-bookingpage">
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Mã vaccine:</span>
//                 <span>{selectedVaccine.vaccineId || "Không có mã"}</span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Số liều:</span>
//                 <span>
//                   {selectedVaccine.doseNumber || "Không có thông tin"}
//                 </span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Mô tả:</span>
//                 <span>{selectedVaccine.description || "Không có mô tả"}</span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Quốc gia:</span>
//                 <span>{selectedVaccine.country || "Không có thông tin"}</span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Độ tuổi:</span>
//                 <span>
//                   {selectedVaccine.ageMin || "N/A"} -{" "}
//                   {selectedVaccine.ageMax || "N/A"}
//                 </span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Trạng thái:</span>
//                 <span>
//                   {selectedVaccine.active
//                     ? "Đang hoạt động"
//                     : "Ngừng hoạt động"}
//                 </span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Giá:</span>
//                 <span className="modal-price-bookingpage">
//                   {(selectedVaccine.price || 0).toLocaleString()} VND
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal cho Combo */}
//       {selectedCombo && (
//         <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
//           <div
//             className="modal-content-bookingpage"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-header-bookingpage">
//               <h2>{selectedCombo.name || "Không có tên"}</h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="close-modal-btn-bookingpage"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body-bookingpage">
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Mã combo:</span>
//                 <span>{selectedCombo.vaccineComboId || "Không có mã"}</span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Mô tả:</span>
//                 <span>{selectedCombo.description || "Không có mô tả"}</span>
//               </div>
//               <div className="modal-info-item-bookingpage">
//                 <span className="modal-label-bookingpage">Giá combo:</span>
//                 <span className="modal-price-bookingpage">
//                   {(selectedCombo.priceCombo || 0).toLocaleString()} VND
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Popup xác nhận đặt lịch */}
//       {showConfirmPopup && (
//         <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
//           <div
//             className="modal-content-bookingpage"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-header-bookingpage">
//               <h2>{bookingStatus ? "Thông báo" : "Xác nhận đặt lịch"}</h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="close-modal-btn-bookingpage"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="modal-body-bookingpage">
//               {isLoading ? (
//                 <div className="loading-spinner-bookingpage">
//                   <div className="spinner-bookingpage"></div>
//                   <p>Đang xử lý...</p>
//                 </div>
//               ) : bookingStatus ? (
//                 <div className="booking-status-bookingpage">
//                   <p
//                     className={
//                       bookingStatus.success
//                         ? "success-message-bookingpage"
//                         : "error-message-bookingpage"
//                     }
//                   >
//                     {bookingStatus.message}
//                   </p>
//                   {bookingStatus.success && (
//                     <p className="additional-message-bookingpage">
//                       Vui lòng kiểm tra email và chú ý theo dõi lịch trình
//                     </p>
//                   )}
//                   <button
//                     className="close-status-btn-bookingpage"
//                     onClick={handleCloseModal}
//                   >
//                     Đóng
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <p>Bạn có chắc chắn muốn đặt lịch tiêm này không?</p>
//                   <div className="confirm-buttons-bookingpage">
//                     <button
//                       className="confirm-yes-btn-bookingpage"
//                       onClick={confirmBooking}
//                     >
//                       Có
//                     </button>
//                     <button
//                       className="confirm-no-btn-bookingpage"
//                       onClick={handleCloseModal}
//                     >
//                       Không
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default BookingPage;
