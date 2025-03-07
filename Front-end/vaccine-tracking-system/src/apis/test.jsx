//  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//             <div
//               onClick={() => setSelectedPackage(pricePackages)}
//               className="cursor-pointer bg-[#2C5DA3] text-white p-6 flex items-center justify-between"
//             >
//               <div className="flex items-center space-x-4">
//                 <FaSyringe className="text-3xl" />
//                 <h2 className="text-xl font-semibold">Tất cả vắc xin</h2>
//               </div>
//               {selectedPackage === pricePackages ? (
//                 <IoMdArrowDropup className="text-2xl" />
//               ) : (
//                 <IoMdArrowDropdown className="text-2xl" />
//               )}
//             </div>

//             {selectedPackage === pricePackages && (
//               <div className="p-6">
//                 <div className="overflow-x-auto">
//                   < className="w-full">

//                       {filteredVaccinesByPriceAndCountry.length === 0 ? (

//                       ) : (
//                         filteredVaccinesByPriceAndCountry.map((vaccine) => (

//                             key={vaccine.vaccineId}
//                             className="border-b border-gray-100 hover:bg-gray-50"
//                           >

//                               className="py-4 px-4 cursor-pointer"
//                               onClick={() => openModal(vaccine)}

//                               <button
//                                 onClick={() => addToCart(vaccine)}
//                                 className={`px-4 py-2 rounded-lg transition-colors ${
//                                   selectedPackage.includes(vaccine.id)
//                                     ? "bg-[#5D90D4] text-white"
//                                     : "bg-gray-100 text-[#1A365D] hover:bg-[#2C5DA3] hover:text-white"
//                                 }`}
//                               >
//                                 {selectedPackage.includes(vaccine.id)
//                                   ? "Selected"
//                                   : "Select"}
//                               </button>

//                         ))
//                       )}

//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
