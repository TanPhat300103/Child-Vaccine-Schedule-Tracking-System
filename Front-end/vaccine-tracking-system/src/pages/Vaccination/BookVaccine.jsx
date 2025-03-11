import React, { useState, useEffect } from "react";
import { FaTimes, FaUser, FaTransgender, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getChildByCustomerId,
  getVaccineCombos,
  getVaccines,
  postSchedules,
} from "../../apis/api";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { useAuth } from "../../components/common/AuthContext";

const BookVaccine = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [selectedChild, setSelectedChild] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataComboById, setDataComboById] = useState([]);
  const [children, setChildren] = useState([]);
  const [vaccineData, setVaccineData] = useState([]);
  const [vaccineCombos, setVaccineCombos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [proFileData, setProFileData] = useState(null);
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const location = useLocation();
  const { cartItems } = location.state || {};

  // take data
  const userId = localStorage.getItem("userId");
  console.log("user id la: ", userInfo);
  const itemsArray = Object.values(cartItems || {});
  console.log("itemsArray,", itemsArray);
  const vaccineIds = itemsArray.map((item) => item.vaccineId); // Create an array of vaccineId from cartItems
  console.log("vaccineIds", vaccineIds);
  const [selectedVaccines, setSelectedVaccines] = useState(itemsArray || []);
  console.log("selecttedvaccine: ", selectedVaccines);
  // Only run when cartItems change
  useEffect(() => {
    // This useEffect will be triggered after selectedVaccines state updates
    console.log("selectedVaccines updated:", selectedVaccines); // Log the updated selectedVaccines
  }, [selectedVaccines]); // Watch selectedVaccines for changes

  // form data
  const [formData, setFormData] = useState({
    bookingDate: "",
    customerId: userInfo.userId || "",
    vaccineId: [],
    vaccineComboId: [],
    childId: "",
    consent: false,
  });

  // lay api child by customer id
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await getChildByCustomerId(userInfo.userId);
        setChildren(data);
        console.log("API Response (Get Childs):", children);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trẻ em:", error);
      }
    };
    fetchChildren();
  }, []);

  // lay api vaccine
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data = await getVaccines();
        setVaccineData(data);
        console.log("📡 API Response (Get Vaccines):", vaccineData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc-xin:", error);
      }
    };
    fetchVaccines();
  }, []);

  // lay api vaccinecombo
  useEffect(() => {
    const fetchVaccineCombos = async () => {
      try {
        const data = await getVaccineCombos();
        setVaccineCombos(data);
        console.log(
          "📡 API Response (Get Vaccine Combos by api):",
          vaccineCombos
        );
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu combo vắc-xin:", error);
      }
    };
    fetchVaccineCombos();
  }, []);

  // check validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.bookingDate) {
      newErrors.bookingDate = "Ngày đặt lịch là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    console.log("Booking Date:", formData.bookingDate);
    console.log("Child ID:", formData.childId);
    console.log(
      "Vaccines Selected:",
      selectedVaccines.map((vaccine) => vaccine.vaccineId)
    );
    console.log(
      "Combos Selected:",
      selectedCombos.map((combo) => combo.vaccineComboId)
    );

    return (
      formData.bookingDate && // Kiểm tra nếu ngày đặt lịch không trống
      formData.childId && // Kiểm tra nếu childId đã được chọn
      (selectedVaccines.length > 0 || selectedCombos.length > 0) // Kiểm tra nếu đã chọn vắc-xin hoặc combo
    );
  };

  // xu ly api submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    if (validateForm()) {
      setIsLoading(true);
      const loadingToast = toast.loading("Đang đặt lịch, vui lòng chờ...");
      console.log("Loading form...");
      try {
        const payload = {
          booking: {
            bookingDate: formData.bookingDate,
            customer: { customerId: userInfo.userId },
            status: 1,
          },
          vaccineId: selectedVaccines.map((v) => v.vaccineId),
          vaccineComboId: selectedCombos.map((c) => c.vaccineComboId),
          child: { childId: formData.childId },
        };
        const result = await postSchedules(payload);
        if (result.success) {
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          navigate("/customer/booking", {
            state: {
              vaccineId: selectedVaccines.map((v) => v.vaccineComboId),
              vaccineComboId: selectedCombos.map((c) => c.vaccineComboId),
              childId: selectedChild.childId,
              bookingDate: formData.bookingDate,
            },
          });
        } else {
          toast.update(loadingToast, {
            render: result.message || "Đặt lịch thất bại. Vui lòng thử lại.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        toast.update(loadingToast, {
          render: "Đã có lỗi xảy ra. Vui lòng thử lại.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // chon child
  const handleChildSelect = (child) => {
    setSelectedChild(child);
    setFormData((prev) => ({
      ...prev,
      childId: child.childId, // Cập nhật childId vào formData
    }));
    console.log("Selected Child ID:", child.childId); // In ra childId khi chọn

    // Thêm chức năng kiểm tra vaccine đã chọn với độ tuổi của trẻ
    if (selectedVaccines.length > 0) {
      const childAge = calculateAge(child.dob);
      const incompatibleVaccines = [];

      // Tìm các vaccine không phù hợp với độ tuổi
      const newSelectedVaccines = selectedVaccines.filter((vaccine) => {
        if (childAge < vaccine.ageMin || childAge > vaccine.ageMax) {
          incompatibleVaccines.push(vaccine.name);
          return false;
        }
        return true;
      });

      // Nếu có vaccine bị loại bỏ
      if (incompatibleVaccines.length > 0) {
        // Cập nhật danh sách vaccine đã chọn
        setSelectedVaccines(newSelectedVaccines);

        // Cập nhật vaccineId trong formData
        setFormData((prev) => ({
          ...prev,
          vaccineId: newSelectedVaccines.map((v) => v.vaccineId),
        }));

        // Hiển thị thông báo
        toast.warning(
          `Các vaccine ${incompatibleVaccines.join(
            ", "
          )} đã bị loại bỏ do không phù hợp với độ tuổi của trẻ.`
        );
      }
    }
  };

  // chon vaccines
  const handleVaccineSelect = (vaccine) => {
    console.log("Selected Vaccine ID:", vaccine.vaccineId);
    // Kiểm tra nếu chưa chọn trẻ
    if (!selectedChild || !selectedChild.childId) {
      toast.error("Vui lòng chọn trẻ trước khi chọn vaccine!");
      return;
    }
    const childAge = calculateAge(selectedChild.dob);
    console.log("Child Age:", childAge);

    // Kiểm tra tuổi của trẻ có nằm trong khoảng ageMin và ageMax của vaccine không
    if (childAge < vaccine.ageMin || childAge > vaccine.ageMax) {
      toast.error(
        `Trẻ ${selectedChild.firstName} ${selectedChild.lastName} (${childAge} tuổi) không phù hợp với vaccine ${vaccine.name} (tuổi từ ${vaccine.ageMin} đến ${vaccine.ageMax}).`
      );
      return;
    }
    // Kiểm tra vaccine đã có trong mảng selectedVaccines chưa
    const isVaccineSelected = selectedVaccines.some(
      (v) => v.vaccineId === vaccine.vaccineId
    );

    // Kiểm tra nếu vaccine đã có trong combo (isVaccineInCombo)
    const isVaccineInCombo = selectedCombos.includes(vaccine.vaccineId);

    if (isVaccineInCombo) {
      // Nếu vaccine có trong combo, không cho phép chọn vaccine và hiển thị thông báo lỗi
      toast.error("Vaccine này đã có trong combo. Không thể chọn lại.");
      return; // Không cho phép chọn vaccine đã có trong combo
    }

    setSelectedVaccines((prev) => {
      if (isVaccineSelected) {
        // Nếu vaccine đã có trong mảng, bỏ vaccine khỏi selectedVaccines
        setFormData((prevData) => ({
          ...prevData,
          vaccineId: prevData.vaccineId.filter(
            (id) => id !== vaccine.vaccineId // Loại bỏ vaccineId khỏi mảng
          ),
        }));
        return prev.filter((v) => v.vaccineId !== vaccine.vaccineId); // Loại bỏ vaccine khỏi selectedVaccines
      } else {
        // Nếu vaccine chưa có trong mảng, thêm vào selectedVaccines
        setFormData((prevData) => ({
          ...prevData,
          vaccineId: [...prevData.vaccineId, vaccine.vaccineId], // Thêm vaccineId vào mảng vaccineId
        }));
        return [...prev, vaccine]; // Thêm vaccine vào selectedVaccines
      }
    });
  };

  // chon vaccineCombo
  const handleComboSelect = async (combo) => {
    console.log("Selected Comboid:", combo.vaccineComboId);

    // Check if a child has been selected first
    if (!selectedChild || !selectedChild.childId) {
      toast.error("Vui lòng chọn trẻ trước khi chọn combo vaccine!");
      return;
    }

    // Kiểm tra nếu combo đã có trong selectedCombos
    const existingCombo = selectedCombos.find(
      (c) => c.vaccineComboId === combo.vaccineComboId
    );

    if (existingCombo) {
      // Nếu combo đã được chọn, bỏ chọn combo
      setFormData((prevData) => ({
        ...prevData,
        vaccineComboId: prevData.vaccineComboId.filter(
          (id) => id !== combo.vaccineComboId
        ),
        vaccineId: prevData.vaccineId.filter(
          (id) => !dataComboById.includes(id)
        ),
      }));

      setSelectedCombos((prev) =>
        prev.filter((c) => c.vaccineComboId !== combo.vaccineComboId)
      );

      console.log(`Combo ${combo.vaccineComboId} removed from selection.`);
    } else {
      try {
        // Fetch combo details from API
        const response = await fetch(
          `http://localhost:8080/combodetail/findcomboid?id=${combo.vaccineComboId}`
        );
        const comboDetails = await response.json();

        console.log("API response combo details:", comboDetails);

        if (!comboDetails || comboDetails.length === 0) {
          console.error(
            "Data for this vaccine combo is not found or is empty."
          );
          toast.error("Không tìm thấy thông tin chi tiết của combo vắc-xin.");
          return;
        }

        // Calculate child's age
        const childAge = calculateAge(selectedChild.dob);
        console.log("Child Age:", childAge);

        // Check if all vaccines in the combo are suitable for the child's age
        const incompatibleVaccines = comboDetails.filter((detail) => {
          const vaccine = detail.vaccine;
          return childAge < vaccine.ageMin || childAge > vaccine.ageMax;
        });

        // If there are incompatible vaccines, show error and don't allow selection
        if (incompatibleVaccines.length > 0) {
          const vaccineNames = incompatibleVaccines
            .map((detail) => detail.vaccine.name)
            .join(", ");
          toast.error(
            `Combo không phù hợp với độ tuổi của trẻ. Các vaccine không phù hợp: ${vaccineNames}`
          );
          return;
        }

        // Extract vaccineIds from the combo details
        const vaccineIdsInCombo = comboDetails.map(
          (detail) => detail.vaccine.vaccineId
        );
        console.log("vaccineIdsInCombo: ", vaccineIdsInCombo);

        // Kiểm tra nếu có vaccineId nào trong vaccineCombo đã có trong vaccineData
        const isVaccineInVaccineData = vaccineIdsInCombo.some((id) =>
          selectedVaccines.some(
            (vaccineDataItem) => vaccineDataItem.vaccineId === id
          )
        );

        if (isVaccineInVaccineData) {
          toast.error(
            "Một trong các vaccine trong combo đã có trong danh sách vaccine đã chọn. Không thể chọn combo này."
          );
          return;
        }

        // If all checks pass, add the combo to selection
        setDataComboById(vaccineIdsInCombo);
        setSelectedCombos((prev) => [...prev, combo]);
        setFormData((prevData) => ({
          ...prevData,
          vaccineComboId: [...prevData.vaccineComboId, combo.vaccineComboId],
          vaccineId: [...prevData.vaccineId, ...vaccineIdsInCombo],
        }));

        console.log(`Combo ${combo.vaccineComboId} added to selection.`);
      } catch (error) {
        console.error("Error fetching vaccine combo data:", error);
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu vaccine combo.");
      }
    }
  };

  // tinh tuoi
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date(); // Ngày hiện tại (hôm nay là 09/03/2025 theo giả định của bạn)
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

  // tinh tong gia
  const totalPrice = [...selectedVaccines, ...selectedCombos].reduce(
    (sum, item) => {
      const price = item.price || item.priceCombo || 0; // Nếu không có price hoặc priceCombo thì gán là 0
      return sum + (isNaN(price) ? 0 : price); // Kiểm tra nếu giá trị price là NaN thì gán là 0
    },
    0
  );

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className=" mt-20 max-w-7xl mx-auto top-[5000px] grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vaccine List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Danh sách Vắc-xin
              </h2>
              <div className="relative">
                <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                  {vaccineData.map((vaccine) => (
                    <div
                      key={vaccine.vaccineId}
                      className={`flex-none rounded-lg p-4 cursor-pointer transition-all ${
                        selectedVaccines.some(
                          (v) => v.vaccineId === vaccine.vaccineId
                        )
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleVaccineSelect(vaccine)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1593642532744-d377ab507dc8" // Static image URL
                        alt={vaccine.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-lg mb-2">
                        {vaccine.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {vaccine.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          {vaccine.doseNumber} liều
                        </span>
                        <span className="text-green-600 font-bold">
                          {vaccine.price.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Combo List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Gói Vắc-xin
              </h2>
              <div className="relative">
                <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                  {vaccineCombos.map((combo) => (
                    <div
                      key={combo.vaccineComboId}
                      className={`flex-none rounded-lg p-4 cursor-pointer transition-all ${
                        selectedCombos.find(
                          (c) => c.vaccineComboId === combo.vaccineComboId
                        )
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleComboSelect(combo)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1593642532744-d377ab507dc8"
                        alt={combo.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-lg mb-2">
                        {combo.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {combo.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-bold">
                          {combo.active}
                        </span>
                        <span className="text-green-600 font-bold">
                          {combo.priceCombo.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-26">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Đã chọn</h2>
              <div className="space-y-4 mb-6">
                {selectedVaccines.map((vaccine) => (
                  <div
                    key={vaccine.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">{vaccine.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600">{vaccine.price}đ</span>
                      <button
                        onClick={() => handleVaccineSelect(vaccine)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedCombos.map((combo) => (
                  <div
                    key={combo.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">{combo.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600">
                        {combo.priceCombo.toLocaleString()}đ
                      </span>
                      <button
                        onClick={() => handleComboSelect(combo)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thông tin trẻ em
              </h2>
              {children && children.length > 0 ? (
                // Nếu có dữ liệu trẻ em
                children.map((child) => (
                  <div
                    key={child.childId}
                    onClick={() => handleChildSelect(child)} // Chọn trẻ khi click
                    className={`flex items-center p-4 mb-4 rounded-lg cursor-pointer transition-all ${
                      selectedChild?.childId === child.childId
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <img
                      src={
                        child.image ||
                        "https://cdn-icons-png.freepik.com/512/7890/7890168.png"
                      } // Hình ảnh minh họa
                      alt={child.firstName}
                      className="w-16 h-16 object-cover rounded-full mr-4"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-gray-600" />
                        <span className="font-semibold text-lg">
                          {child.firstName} {child.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaTransgender className="text-gray-600" />
                        <span className="text-gray-600">
                          Giới tính: {child.gender ? "Nam" : "Nữ"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-gray-600" />
                        <span className="text-gray-600">
                          Ngày sinh: {child.dob}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Nếu không có dữ liệu trẻ em, hiển thị thông báo
                <p className="text-center text-gray-600">No child</p>
              )}
              <button
                onClick={() => navigate(`/customer/add-child`)} // Thêm trẻ mới
                className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                + Thêm trẻ
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Chọn ngày tiêm
              </h2>
              <input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                value={formData.bookingDate} // Đảm bảo giá trị được lấy từ formData
                onChange={(e) => {
                  setSelectedDate(e.target.value); // Lưu giá trị vào selectedDate
                  setFormData((prev) => ({
                    ...prev,
                    bookingDate: e.target.value, // Cập nhật bookingDate trong formData
                  }));
                }}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-6 w-full md:w-auto"
              />
              <button
                disabled={!isFormValid()} // Disable button nếu form không hợp lệ
                onClick={handleSubmit} // Gọi handleSubmit khi nhấn nút
                className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all ${
                  isFormValid()
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Đặt lịch tiêm
              </button>
            </div>
          </div>
          {/* Bottom Section */}
          <div className="lg:col-span-3"></div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default BookVaccine;
