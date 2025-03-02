import React, { useState, useEffect } from "react";
import { FaTimes, FaUser, FaTransgender, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  getChildByCustomerId,
  getVaccineCombos,
  getVaccineCombosByComboId,
  getVaccines,
  postSchedules,
} from "../../apis/api";
import { toast } from "react-toastify";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const BookVaccine = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [selectedChild, setSelectedChild] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataComboById, setDataComboById] = useState([]);
  const [children, setChildren] = useState([]);
  const [vaccineData, setVaccineData] = useState([]);
  const [vaccineCombos, setVaccineCombos] = useState([]);
  const navigate = useNavigate();

  // take data
  const userId = localStorage.getItem("userId");
  console.log("userId: ", userId);

  // form data
  const [formData, setFormData] = useState({
    bookingDate: "",
    customerId: userId || "",
    vaccineId: [],
    vaccineComboId: [],
    childId: "",
    consent: false,
  });

  // take api childByCustommerId
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await getChildByCustomerId(userId);
        setChildren(data);
        console.log("API Response (Get Childs):", children);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trẻ em:", error);
      }
    };
    fetchChildren();
  }, []);

  // take api vaccines
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

  // take api vaccinecombo
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

  // useEffect(() => {
  //   const fetchVaccineComboId = async () => {
  //     try {
  //       const data = await getVaccineCombosByComboId(comboId);
  //       console.log("📡 API Response (Get Vaccine Combos by api):", data);
  //       setVaccineComboId(data);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy dữ liệu combo vắc-xin:", error);
  //     }
  //   };
  //   fetchVaccineComboId();
  // }, []);

  //handle form field

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   setFormData((prev) => {
  //     let updatedValue;

  //     if (type === "checkbox") {
  //       if (name === "vaccineId") {
  //         updatedValue = checked
  //           ? [...prev[name], value] // Thêm vào mảng nếu checkbox được chọn
  //           : prev[name].filter((id) => id !== value); // Loại bỏ nếu checkbox bị bỏ chọn
  //       } else if (name === "vaccineComboId") {
  //         updatedValue = checked
  //           ? [...prev[name], value] // Thêm vào mảng nếu checkbox được chọn
  //           : prev[name].filter((id) => id !== value); // Loại bỏ nếu checkbox bị bỏ chọn
  //       } else if (name === "consent") {
  //         updatedValue = checked;
  //       }
  //     } else {
  //       updatedValue = value;
  //     }

  //     return { ...prev, [name]: updatedValue };
  //   });
  // };

  // check validate form

  // check validate
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra nếu ngày đặt lịch không được để trống
    if (!formData.bookingDate) {
      newErrors.bookingDate = "Ngày đặt lịch là bắt buộc";
    }

    // // Kiểm tra các trường khác
    // if (!formData.vaccineId.length && !formData.vaccineComboId.length) {
    //   newErrors.vaccineId = "Vui lòng chọn vắc-xin hoặc combo vắc-xin";
    // }
    // if (!formData.childId) newErrors.childId = "Vui lòng chọn trẻ";

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
  // submit and post
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
            customer: { customerId: userId },
          },
          vaccineId: selectedVaccines.map((v) => v.vaccineId),
          vaccineComboId: selectedCombos.map((c) => c.vaccineComboId),
          child: { childId: formData.childId },
        };

        console.log("Payload:", payload);

        const result = await postSchedules(payload);
        console.log("API Response payload:", result);

        if (result.success) {
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          // Chuyển vaccineComboId và childId qua trang tiếp theo
          navigate("/customer", {
            state: {
              vaccineId: selectedVaccines.map((v) => v.vaccineComboId),
              vaccineComboId: selectedCombos.map((c) => c.vaccineComboId),
              childId: selectedChild.childId, // Truyền childId đã chọn
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

  // select child
  const handleChildSelect = (child) => {
    setSelectedChild(child); // Lưu đối tượng của trẻ được chọn
    setFormData((prev) => ({
      ...prev,
      childId: child.childId, // Cập nhật childId vào formData
    }));
    console.log("Selected Child ID:", child.childId); // In ra childId khi chọn
  };

  // select vaccines
  const handleVaccineSelect = (vaccine) => {
    console.log("Selected Vaccine ID:", vaccine.vaccineId);

    // Kiểm tra vaccine đã có trong mảng selectedVaccines chưa
    const isVaccineSelected = selectedVaccines.some(
      (v) => v.vaccineId === vaccine.vaccineId
    );

    // Kiểm tra nếu vaccine đã có trong combo (isVaccineInCombo)
    const isVaccineInCombo = dataComboById.includes(vaccine.vaccineId);

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

  // select vaccineCombo
  const handleComboSelect = async (combo) => {
    console.log("Selected Comboid:", combo.vaccineComboId);

    // Kiểm tra nếu vaccineComboId có hợp lệ không trước khi gọi API
    if (!combo.vaccineComboId) {
      console.error("VaccineComboId is invalid");
      return;
    }

    // Kiểm tra nếu combo đã có trong selectedCombos
    const existingCombo = selectedCombos.find(
      (c) => c.vaccineComboId === combo.vaccineComboId
    );
    const dataComboId = await getVaccineCombosByComboId(combo.vaccineComboId);
    console.log("API response vaccineiddata:", dataComboId);

    // Truy xuất vaccineId từ từng phần tử trong mảng API response
    const vaccineIdsInCombo = dataComboId.map((item) => item.vaccine.vaccineId);
    console.log("Vaccine IDs in selected combo:", vaccineIdsInCombo);
    setDataComboById(vaccineIdsInCombo);
    console.log("datacombobyid: ", dataComboById);
    if (existingCombo) {
      // Nếu combo đã được chọn, bỏ chọn combo
      setFormData((prevData) => ({
        ...prevData,
        vaccineComboId: prevData.vaccineComboId.filter(
          (id) => id !== combo.vaccineComboId
        ),
        vaccineId: prevData.vaccineId.filter(
          (id) => id !== existingCombo.vaccineId // Loại bỏ vaccineId duy nhất khi bỏ chọn combo
        ),
      }));

      setSelectedCombos(
        (prev) => prev.filter((c) => c.vaccineComboId !== combo.vaccineComboId) // Loại bỏ combo khỏi selectedCombos
      );

      console.log(`Combo ${combo.vaccineComboId} removed from selection.`);
    } else {
      // Nếu combo chưa được chọn, gọi API để lấy dữ liệu
      try {
        const dataComboId = await getVaccineCombosByComboId(
          combo.vaccineComboId
        );
        console.log("API response vaccineiddata:", dataComboId.vaccineId);
        console.log("API response vaccineiddata:", dataComboId);

        if (dataComboId) {
          // Kiểm tra vaccineId trong combo (vì vaccineId là chuỗi, không phải mảng)
          const vaccineIdsInCombo = dataComboId.vaccineId
            ? [dataComboId.vaccineId]
            : [];
          console.log("Vaccine ID in selected combo:", vaccineIdsInCombo);

          // Cập nhật lại selectedCombos và formData khi chọn combo
          setSelectedCombos((prev) => [...prev, combo]);

          setFormData((prevData) => ({
            ...prevData,
            vaccineComboId: [...prevData.vaccineComboId, combo.vaccineComboId],
            vaccineId: [...prevData.vaccineId, ...vaccineIdsInCombo],
          }));

          console.log(`Combo ${combo.vaccineComboId} added to selection.`);
        } else {
          console.error("Data for this vaccine combo is not found.");
        }
      } catch (error) {
        console.error("Error fetching vaccine combo data:", error);
      }
    }
  };

  // calculate total
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
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {vaccineData.map((vaccine) => (
                    <div
                      key={vaccine.vaccineId}
                      className={`flex-none w-64 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedVaccines.some(
                          (v) => v.vaccineId === vaccine.vaccineId
                        )
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50"
                      }`}
                      onClick={() => handleVaccineSelect(vaccine)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1593642532744-d377ab507dc8"
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
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {vaccineCombos.map((combo) => (
                    <div
                      key={combo.vaccineComboId}
                      className={`flex-none w-64 rounded-lg p-4 cursor-pointer transition-all ${
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
                      <span className="text-green-600">
                        {vaccine.price.toLocaleString()}đ
                      </span>
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
            </div>
          </div>

          {/* Bottom Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thông tin trẻ em
              </h2>
              {children.map((child) => (
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
              ))}

              <button
                onClick={() => navigate(`/child`)} // Thêm trẻ mới
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
            </div>
          </div>
        </div>

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
      <Footer></Footer>
    </div>
  );
};

export default BookVaccine;
