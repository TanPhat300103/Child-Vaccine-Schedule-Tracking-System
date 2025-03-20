import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style/BookingPage.css";
import { useAuth } from "../components/AuthContext";

function BookingPage() {
  const [vaccines, setVaccines] = useState([]);
  const [vaccineCombos, setVaccineCombos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboDetailsMap, setComboDetailsMap] = useState({});
  const [vaccineSearch, setVaccineSearch] = useState("");
  const [comboSearch, setComboSearch] = useState("");
  const [minAgeFilter, setMinAgeFilter] = useState("");
  const [maxAgeFilter, setMaxAgeFilter] = useState("");
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/vaccine`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch vaccines");
        const data = await response.json();
        const mockVaccines = [
          ...data,
          ...Array.from(
            { length: Math.max(0, 8 - data.length) },
            (_, index) => ({
              vaccineId: `V00${data.length + index + 1}`,
              name: `Vaccine ${data.length + index + 1}`,
              description: `Mô tả vắc xin ${data.length + index + 1}`,
              price: 200000 + index * 50000,
              doseNumber: 2,
              country: "USA",
              ageMin: 12 + index * 5,
              ageMax: 99 - index * 5,
              active: true,
            })
          ),
        ];
        setVaccines(
          mockVaccines.map((vaccine) => ({
            ...vaccine,
            isSelected: false,
          }))
        );
      } catch (error) {
        console.error("Error fetching vaccines:", error);
      }
    };

    const fetchVaccineCombos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/vaccinecombo`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch vaccine combos");
        const data = await response.json();
        const mockCombos = [
          ...data,
          ...Array.from(
            { length: Math.max(0, 8 - data.length) },
            (_, index) => ({
              vaccineComboId: `C00${data.length + index + 1}`,
              name: `Combo ${data.length + index + 1}`,
              description: `Mô tả của combo ${data.length + index + 1}`,
              priceCombo: 300000 + index * 50000,
              active: true, // Thêm active mặc định là true cho mock data
            })
          ),
        ];
        setVaccineCombos(
          mockCombos.map((combo) => ({
            ...combo,
            isSelected: false,
          }))
        );

        for (const combo of mockCombos) {
          if (!comboDetailsMap[combo.vaccineComboId]) {
            await fetchComboDetails(combo.vaccineComboId);
          }
        }
      } catch (error) {
        console.error("Error fetching vaccine combos:", error);
      }
    };

    const fetchChildren = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/child/findbycustomer?id=${userInfo.userId}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch children");
        const data = await response.json();
        const childrenWithAge = data.map((child) => ({
          ...child,
          age: calculateAge(child.dob),
        }));
        setChildren(childrenWithAge);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };

    fetchVaccines();
    fetchVaccineCombos();
    fetchChildren();
  }, [userInfo.userId]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectedChild("");
    }
  }, [selectedItems]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isAgeCompatible = (age, ageMin, ageMax) => {
    return age >= ageMin && age <= ageMax;
  };

  const isComboAgeCompatible = (age, comboId) => {
    const comboDetails = comboDetailsMap[comboId] || [];
    return comboDetails.every((detail) =>
      isAgeCompatible(age, detail.vaccine.ageMin, detail.vaccine.ageMax)
    );
  };

  const fetchComboDetails = async (comboId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/combodetail`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch combo details");
      const data = await response.json();
      const filteredDetails = data.filter(
        (detail) => detail.vaccineCombo.vaccineComboId === comboId
      );
      setComboDetailsMap((prev) => ({
        ...prev,
        [comboId]: filteredDetails,
      }));
    } catch (error) {
      console.error("Error fetching combo details:", error);
      setComboDetailsMap((prev) => ({ ...prev, [comboId]: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedComboVaccineIds = () => {
    const selectedCombos = selectedItems.filter((item) => item.vaccineComboId);
    const allVaccineIds = [];
    selectedCombos.forEach((combo) => {
      const details = comboDetailsMap[combo.vaccineComboId] || [];
      const vaccineIds = details.map((detail) => detail.vaccine.vaccineId);
      allVaccineIds.push(...vaccineIds);
    });
    return [...new Set(allVaccineIds)];
  };

  const handleCheckboxChange = (item, type, e) => {
    e.stopPropagation();
    const isChecked = e.target.checked;

    if (isChecked && selectedChild) {
      const selectedChildData = children.find(
        (child) => child.childId === selectedChild
      );
      const childAge = selectedChildData ? selectedChildData.age : null;

      if (type === "vaccine") {
        if (!isAgeCompatible(childAge, item.ageMin, item.ageMax)) {
          setMessageModalContent(
            `Vaccine ${item.name} không phù hợp với độ tuổi của trẻ (${childAge} tuổi)!`
          );
          setShowMessageModal(true);
          e.target.checked = false;
          return;
        }
        const selectedComboVaccineIds = getSelectedComboVaccineIds();
        if (selectedComboVaccineIds.includes(item.vaccineId)) {
          setMessageModalContent(
            "Vaccine này đã có trong combo bạn chọn, không thể chọn riêng lẻ!"
          );
          setShowMessageModal(true);
          e.target.checked = false;
          return;
        }
      } else if (type === "combo") {
        if (!isComboAgeCompatible(childAge, item.vaccineComboId)) {
          setMessageModalContent(
            `Combo ${item.name} không phù hợp với độ tuổi của trẻ (${childAge} tuổi)!`
          );
          setShowMessageModal(true);
          e.target.checked = false;
          return;
        }
      }
    }

    if (isChecked) {
      if (type === "vaccine") {
        setSelectedItems((prev) => [...prev, item]);
        setVaccines((prev) =>
          prev.map((v) =>
            v.vaccineId === item.vaccineId ? { ...v, isSelected: true } : v
          )
        );
      } else {
        const comboDetails = comboDetailsMap[item.vaccineComboId] || [];
        const comboVaccineIds = comboDetails.map(
          (detail) => detail.vaccine.vaccineId
        );
        setSelectedItems((prev) => {
          const updatedItems = prev.filter(
            (selectedItem) =>
              !selectedItem.vaccineId ||
              !comboVaccineIds.includes(selectedItem.vaccineId)
          );
          return [...updatedItems, item];
        });
        setVaccines((prev) =>
          prev.map((v) =>
            comboVaccineIds.includes(v.vaccineId)
              ? { ...v, isSelected: false }
              : v
          )
        );
        setVaccineCombos((prev) =>
          prev.map((c) =>
            c.vaccineComboId === item.vaccineComboId
              ? { ...c, isSelected: true }
              : c
          )
        );
      }
    } else {
      setSelectedItems((prev) =>
        prev.filter((selectedItem) =>
          type === "vaccine"
            ? selectedItem.vaccineId !== item.vaccineId
            : selectedItem.vaccineComboId !== item.vaccineComboId
        )
      );
      if (type === "vaccine") {
        setVaccines((prev) =>
          prev.map((v) =>
            v.vaccineId === item.vaccineId ? { ...v, isSelected: false } : v
          )
        );
      } else {
        setVaccineCombos((prev) =>
          prev.map((c) =>
            c.vaccineComboId === item.vaccineComboId
              ? { ...c, isSelected: false }
              : c
          )
        );
      }
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setSelectedItems((prev) =>
      prev.filter((item) =>
        item.vaccineId
          ? item.vaccineId !== itemToRemove.vaccineId
          : item.vaccineComboId !== itemToRemove.vaccineComboId
      )
    );

    setVaccines((prev) =>
      prev.map((v) =>
        v.vaccineId === itemToRemove.vaccineId ? { ...v, isSelected: false } : v
      )
    );

    setVaccineCombos((prev) =>
      prev.map((c) =>
        c.vaccineComboId === itemToRemove.vaccineComboId
          ? { ...c, isSelected: false }
          : c
      )
    );
  };

  const handleOpenVaccineModal = (vaccine) => {
    setSelectedVaccine(vaccine);
  };

  const handleOpenComboModal = (combo) => {
    setSelectedCombo(combo);
    if (!comboDetailsMap[combo.vaccineComboId]) {
      fetchComboDetails(combo.vaccineComboId);
    }
  };

  const handleOpenSelectedItemModal = (item) => {
    if (item.vaccineId) {
      handleOpenVaccineModal(item);
    } else if (item.vaccineComboId) {
      handleOpenComboModal(item);
    }
  };

  const handleCloseModal = () => {
    setSelectedVaccine(null);
    setSelectedCombo(null);
    setShowConfirmPopup(false);
    setShowMessageModal(false);
    setMessageModalContent("");
    setIsLoading(false);
    setBookingStatus(null);
  };

  const handleChildSelect = (childId) => {
    const selectedChildData = children.find(
      (child) => child.childId === childId
    );
    const childAge = selectedChildData ? selectedChildData.age : null;

    const incompatibleItems = selectedItems.filter((item) => {
      if (item.vaccineId) {
        return !isAgeCompatible(childAge, item.ageMin, item.ageMax);
      } else if (item.vaccineComboId) {
        return !isComboAgeCompatible(childAge, item.vaccineComboId);
      }
      return false;
    });

    if (incompatibleItems.length > 0) {
      const incompatibleNames = incompatibleItems
        .map((item) => item.name)
        .join(", ");
      setMessageModalContent(
        `Trẻ không phù hợp với các lựa chọn: ${incompatibleNames}. Vui lòng bỏ chọn hoặc thay đổi trẻ!`
      );
      setShowMessageModal(true);
      return;
    }

    setSelectedChild(childId);
  };

  const handleConfirmBooking = () => {
    setShowConfirmPopup(true);
    setBookingStatus(null);
  };

  const confirmBooking = async () => {
    setIsLoading(true);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const vaccineIds = selectedItems
      .filter((item) => item.vaccineId)
      .map((item) => item.vaccineId);
    const vaccineComboIds = selectedItems
      .filter((item) => item.vaccineComboId)
      .map((item) => item.vaccineComboId);
    const selectedChildData = children.find(
      (child) => child.childId === selectedChild
    );
    const customerId = selectedChildData
      ? selectedChildData.customer.customerId
      : null;

    if (!customerId) {
      setBookingStatus({
        success: false,
        message: "Không tìm thấy thông tin khách hàng. Vui lòng thử lại!",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      booking: {
        bookingDate: formattedDate,
        customer: { customerId: customerId },
        status: 1,
      },
      vaccineId: vaccineIds,
      child: { childId: selectedChild },
      vaccineComboId: vaccineComboIds,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/booking/create`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to create booking");
      const data = await response.json();
      console.log("Booking created successfully:", data);
      setBookingStatus({ success: true, message: "Đặt lịch thành công!" });
      setSelectedItems([]);
      setSelectedChild("");
      setSelectedDate(null);
      setVaccines((prev) =>
        prev.map((vaccine) => ({ ...vaccine, isSelected: false }))
      );
      setVaccineCombos((prev) =>
        prev.map((combo) => ({ ...combo, isSelected: false }))
      );
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingStatus({
        success: false,
        message: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVaccines = vaccines.filter((vaccine) => {
    const matchesName = vaccine.name
      .toLowerCase()
      .includes(vaccineSearch.toLowerCase());
    const minAge = minAgeFilter ? parseInt(minAgeFilter, 10) : null;
    const maxAge = maxAgeFilter ? parseInt(maxAgeFilter, 10) : null;
    let matchesAge = true;
    if (minAge !== null) matchesAge = matchesAge && vaccine.ageMin >= minAge;
    if (maxAge !== null) matchesAge = matchesAge && vaccine.ageMax <= maxAge;
    return matchesName && matchesAge && vaccine.active; // Chỉ hiển thị vaccine có active = true
  });

  const filteredCombos = vaccineCombos.filter((combo) =>
    combo.name.toLowerCase().includes(comboSearch.toLowerCase()) && combo.active // Chỉ hiển thị combo có active = true
  );

  const totalPrice = selectedItems.reduce((sum, item) => {
    const price = item.price || item.priceCombo || 0;
    return sum + price;
  }, 0);

  const selectedComboVaccineIds = getSelectedComboVaccineIds();

  return (
    <div className="booking-page-container-bookingpage">
      <div className="booking-page-wrapper-bookingpage">
        <header className="booking-header-bookingpage">
          <h2>ĐĂNG KÝ TIÊM</h2>
          <p>Lựa chọn vắc xin chất lượng, bảo vệ sức khỏe</p>
        </header>

        <div className="booking-content-bookingpage">
          <div className="booking-list-section-bookingpage">
            <div className="vaccine-section-bookingpage">
              <div className="section-title-bookingpage">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon-bookingpage"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                  <path d="M3 10h18"></path>
                  <path d="m14 14 2 2 4-4"></path>
                </svg>
                <h2>Danh sách vắc xin</h2>
              </div>
              <div className="search-filter-container-bookingpage">
                <div className="search-bar-wrapper-bookingpage">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="search-icon-bookingpage"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm vắc xin..."
                    value={vaccineSearch}
                    onChange={(e) => setVaccineSearch(e.target.value)}
                    className="search-bar-bookingpage"
                  />
                </div>
                <div className="age-filter-bookingpage">
                  <input
                    type="number"
                    placeholder="Tuổi tối thiểu"
                    value={minAgeFilter}
                    onChange={(e) => setMinAgeFilter(e.target.value)}
                    className="age-input-bookingpage"
                  />
                  <input
                    type="number"
                    placeholder="Tuổi tối đa"
                    value={maxAgeFilter}
                    onChange={(e) => setMaxAgeFilter(e.target.value)}
                    className="age-input-bookingpage"
                  />
                </div>
              </div>
              <div className="vaccine-grid-bookingpage">
                {filteredVaccines.map((vaccine) => {
                  const isDisabled =
                    selectedComboVaccineIds.includes(vaccine.vaccineId) ||
                    (selectedChild &&
                      !isAgeCompatible(
                        children.find((c) => c.childId === selectedChild)?.age,
                        vaccine.ageMin,
                        vaccine.ageMax
                      ));
                  return (
                    <div
                      key={vaccine.vaccineId}
                      className={`vaccine-card-bookingpage ${
                        vaccine.isSelected ? "selected-bookingpage" : ""
                      } ${isDisabled ? "disabled-bookingpage" : ""}`}
                      onClick={() =>
                        !isDisabled && handleOpenVaccineModal(vaccine)
                      }
                    >
                      <div className="vaccine-info-bookingpage">
                        <h3>{vaccine.name || "Không có tên"}</h3>
                        <p>{vaccine.description || "Không có mô tả"}</p>
                        <div className="vaccine-price-bookingpage">
                          {(vaccine.price || 0).toLocaleString()} VND
                        </div>
                        {isDisabled && (
                          <p className="disabled-note-bookingpage">
                            {selectedComboVaccineIds.includes(vaccine.vaccineId)
                              ? "Đã có trong combo"
                              : "Không phù hợp độ tuổi"}
                          </p>
                        )}
                      </div>
                      {!isDisabled && (
                        <div className="vaccine-actions-bookingpage">
                          <input
                            type="checkbox"
                            checked={vaccine.isSelected}
                            onChange={(e) =>
                              handleCheckboxChange(vaccine, "vaccine", e)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="checkbox-bookingpage"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="vaccine-combo-section-bookingpage">
              <div className="section-title-bookingpage">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon-bookingpage"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                  <path d="M16 2v4"></path>
                  <path d="M8 2v4"></path>
                  <path d="M3 10h18"></path>
                  <path d="m13 16 3-3 3 3"></path>
                </svg>
                <h2>Gói vắc xin</h2>
              </div>
              <div className="search-filter-container-bookingpage">
                <div className="search-bar-wrapper-bookingpage">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="search-icon-bookingpage"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm combo..."
                    value={comboSearch}
                    onChange={(e) => setComboSearch(e.target.value)}
                    className="search-bar-bookingpage"
                  />
                </div>
              </div>
              <div className="vaccine-grid-bookingpage">
                {filteredCombos.map((combo) => {
                  const isDisabled =
                    selectedChild &&
                    !isComboAgeCompatible(
                      children.find((c) => c.childId === selectedChild)?.age,
                      combo.vaccineComboId
                    );
                  return (
                    <div
                      key={combo.vaccineComboId}
                      className={`vaccine-card-bookingpage ${
                        combo.isSelected ? "selected-bookingpage" : ""
                      } ${isDisabled ? "disabled-bookingpage" : ""}`}
                      onClick={() => !isDisabled && handleOpenComboModal(combo)}
                    >
                      <div className="vaccine-info-bookingpage">
                        <h3>{combo.name || "Không có tên"}</h3>
                        <p>{combo.description || "Không có mô tả"}</p>
                        <div className="vaccine-price-bookingpage">
                          {(combo.priceCombo || 0).toLocaleString()} VND
                        </div>
                        {isDisabled && (
                          <p className="disabled-note-bookingpage">
                            Không phù hợp độ tuổi
                          </p>
                        )}
                      </div>
                      {!isDisabled && (
                        <div className="vaccine-actions-bookingpage">
                          <input
                            type="checkbox"
                            checked={combo.isSelected}
                            onChange={(e) =>
                              handleCheckboxChange(combo, "combo", e)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="checkbox-bookingpage"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="selected-sidebar-bookingpage">
            <div className="sidebar-header-bookingpage">
              <div className="sidebar-title-bookingpage">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon-bookingpage"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A4 4 0 0 1 12 8V2"></path>
                  <path d="M9 15v-3a3 3 0 1 1 6 0v3"></path>
                </svg>
                <h2>Thông tin đặt chọn</h2>
              </div>
              <span className="sidebar-count-bookingpage">
                {selectedItems.length}
              </span>
            </div>
            <div className="sidebar-body-bookingpage">
              {selectedItems.length === 0 ? (
                <div className="empty-selection-bookingpage">
                  <p>Bạn chưa chọn vắc xin nào</p>
                </div>
              ) : (
                <div className="selected-items-list-bookingpage">
                  <div className="selected-items-scrollable-bookingpage">
                    {selectedItems.map((item) => (
                      <div
                        key={item.vaccineId || item.vaccineComboId}
                        className="selected-item-bookingpage"
                        onClick={() => handleOpenSelectedItemModal(item)}
                      >
                        <div className="selected-item-icon-bookingpage">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2v6l3 3-3 3v6m-6-6h12"></path>
                          </svg>
                        </div>
                        <div className="selected-item-details-bookingpage">
                          <h4 className="selected-item-name">
                            {item.name || "Không có tên"}
                          </h4>
                          <p>
                            {(
                              item.price ||
                              item.priceCombo ||
                              0
                            ).toLocaleString()}{" "}
                            VND
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(item);
                          }}
                          className="remove-item-btn-bookingpage"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="child-selection-bookingpage">
                      <label className="child-selection-label-bookingpage">
                        Tiêm cho:
                      </label>
                      <div className="child-cards-container-bookingpage">
                        {children.map((child) => (
                          <div
                            key={child.childId}
                            className={`child-card-bookingpage ${
                              selectedChild === child.childId ? "selected" : ""
                            }`}
                            onClick={() => handleChildSelect(child.childId)}
                          >
                            <span>
                              {child.firstName} {child.lastName}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="date-selection-bookingpage">
                        <label className="date-selection-label-bookingpage">
                          Ngày tiêm:
                        </label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Chọn ngày tiêm"
                          className="date-picker-bookingpage"
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="sidebar-footer-bookingpage">
              {selectedItems.length > 0 && (
                <div className="total-section-bookingpage">
                  <div className="total-label-bookingpage">Tổng cộng</div>
                  <div className="total-price-bookingpage">
                    {totalPrice.toLocaleString()} VND
                  </div>
                </div>
              )}
              <button
                className="confirm-button-bookingpage"
                disabled={
                  selectedItems.length === 0 || !selectedChild || !selectedDate
                }
                onClick={handleConfirmBooking}
              >
                {selectedItems.length === 0
                  ? "Vui lòng chọn vắc xin"
                  : "Xác nhận đặt vắc xin"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedVaccine && (
        <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
          <div
            className="modal-content-bookingpage"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bookingpage">
              <h2>{selectedVaccine.name || "Không có tên"}</h2>
              <button
                onClick={handleCloseModal}
                className="close-modal-btn-bookingpage"
              >
                ✕
              </button>
            </div>
            <div className="modal-body-bookingpage">
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Mã vắc xin:</span>
                <span>{selectedVaccine.vaccineId || "Không có mã"}</span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Số liều:</span>
                <span>
                  {selectedVaccine.doseNumber || "Không có thông tin"}
                </span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Mô tả:</span>
                <span>{selectedVaccine.description || "Không có mô tả"}</span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Quốc gia:</span>
                <span>{selectedVaccine.country || "Không có thông tin"}</span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Độ tuổi:</span>
                <span>
                  {selectedVaccine.ageMin || "N/A"} -{" "}
                  {selectedVaccine.ageMax || "N/A"}
                </span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Trạng thái:</span>
                <span>
                  {selectedVaccine.active
                    ? "Đang hoạt động"
                    : "Ngừng hoạt động"}
                </span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Giá:</span>
                <span className="modal-price-bookingpage">
                  {(selectedVaccine.price || 0).toLocaleString()} VND
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCombo && (
        <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
          <div
            className="modal-content-bookingpage"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bookingpage">
              <h2>{selectedCombo.name || "Không có tên"}</h2>
              <button
                onClick={handleCloseModal}
                className="close-modal-btn-bookingpage"
              >
                ✕
              </button>
            </div>
            <div className="modal-body-bookingpage">
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Mã combo:</span>
                <span>{selectedCombo.vaccineComboId || "Không có mã"}</span>
              </div>
              <div className="modal-info-item-b Beckingpage">
                <span className="modal-label-bookingpage">Mô tả:</span>
                <span>{selectedCombo.description || "Không có mô tả"}</span>
              </div>
              <div className="modal-info-item-bookingpage">
                <span className="modal-label-bookingpage">Giá combo:</span>
                <span className="modal-price-bookingpage">
                  {(selectedCombo.priceCombo || 0).toLocaleString()} VND
                </span>
              </div>
              <div className="combo-details-section-bookingpage">
                <h3>Danh sách mũi tiêm trong combo</h3>
                {isLoading ? (
                  <div className="loading-spinner-bookingpage">
                    <div className="spinner-bookingpage"></div>
                    <p>Đang tải...</p>
                  </div>
                ) : comboDetailsMap[selectedCombo.vaccineComboId]?.length >
                  0 ? (
                  <div className="combo-details-list-bookingpage">
                    {comboDetailsMap[selectedCombo.vaccineComboId].map(
                      (detail) => (
                        <div
                          key={detail.comboDetailId}
                          className="combo-detail-item-bookingpage"
                        >
                          <div className="combo-detail-icon-bookingpage">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 2v6l3 3-3 3v6m-6-6h12"></path>
                            </svg>
                          </div>
                          <div className="combo-detail-content-bookingpage">
                            <span className="combo-detail-name-bookingpage">
                              {detail.vaccine.name || "Không có tên"}
                            </span>
                            <span className="combo-detail-dose-bookingpage">
                              {detail.vaccine.doseNumber || "N/A"} liều
                            </span>
                            <span className="combo-detail-price-bookingpage">
                              {(detail.vaccine.price || 0).toLocaleString()} VND
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p>
                    Không có thông tin chi tiết về mũi tiêm trong combo này.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
          <div
            className="modal-content-bookingpage"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bookingpage">
              <h2>{bookingStatus ? "Thông báo" : "Xác nhận đặt lịch"}</h2>
              <button
                onClick={handleCloseModal}
                className="close-modal-btn-bookingpage"
              >
                ✕
              </button>
            </div>
            <div className="modal-body-bookingpage">
              {isLoading ? (
                <div className="loading-spinner-bookingpage">
                  <div className="spinner-bookingpage"></div>
                  <p>Đang xử lý...</p>
                </div>
              ) : bookingStatus ? (
                <div className="booking-status-bookingpage">
                  <p
                    className={
                      bookingStatus.success
                        ? "success-message-bookingpage"
                        : "error-message-bookingpage"
                    }
                  >
                    {bookingStatus.message}
                  </p>
                  {bookingStatus.success && (
                    <p className="additional-message-bookingpage">
                      Vui lòng kiểm tra email và chú ý theo dõi lịch trình
                    </p>
                  )}
                  <button
                    className="close-status-btn-bookingpage"
                    onClick={handleCloseModal}
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  <p>Bạn có chắc chắn muốn đặt lịch tiêm này không?</p>
                  <div className="confirm-buttons-bookingpage">
                    <button
                      className="confirm-yes-btn-bookingpage"
                      onClick={confirmBooking}
                    >
                      Có
                    </button>
                    <button
                      className="confirm-no-btn-bookingpage"
                      onClick={handleCloseModal}
                    >
                      Không
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showMessageModal && (
        <div className="modal-overlay-bookingpage" onClick={handleCloseModal}>
          <div
            className="modal-content-bookingpage message-modal-bookingpage"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bookingpage">
              <h2>Thông báo</h2>
              <button
                onClick={handleCloseModal}
                className="close-modal-btn-bookingpage"
              >
                ✕
              </button>
            </div>
            <div className="modal-body-bookingpage">
              <p className="message-modal-text-bookingpage">
                {messageModalContent}
              </p>
              <div className="message-modal-buttons-bookingpage">
                <button
                  className="message-modal-close-btn-bookingpage"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPage;