import React, { useState } from "react";
import { format, isToday, isBefore } from "date-fns";
import vi from "date-fns/locale/vi";
import { useNavigate } from "react-router-dom";
import { FaChild, FaSyringe, FaCalendarAlt } from "react-icons/fa";
import {
  getChilds,
  getCustomerId,
  getVaccineCombos,
  getVaccines,
} from "../../apis/api";

const BookVaccine2 = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [vaccineCombos, setVaccineCombos] = useState([]);
  const navigate = useNavigate();
  const [isVaccineListVisible, setIsVaccineListVisible] = useState(false);
  const [isVaccineComboListVisible, setIsVaccineComboListVisible] =
    useState(false);
  const userId = localStorage.getItem("userId");
  console.log("customerId userId: ", userId);
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  const handleVaccineSelect = (vaccineId) => {
    setSelectedVaccines((prev) =>
      prev.includes(vaccineId)
        ? prev.filter((id) => id !== vaccineId)
        : [...prev, vaccineId]
    );
  };

  const handleComboSelect = (comboId) => {
    setSelectedCombos((prev) =>
      prev.includes(comboId)
        ? prev.filter((id) => id !== comboId)
        : [...prev, comboId]
    );
  };

  const [formData, setFormData] = useState({
    bookingDate: "",
    vaccineId: [],
    vaccineComboId: [],
    childId: "",
    consent: false,
  });

  // take api 1 customerId
  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const customer = await getCustomerId(userId);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        toast.error(`Lỗi khi lấy thông tin khách hàng: ${error.message}`);
      }
    };
    fetchCustomerId();
  }, []);

  // take child
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await getChilds();
        setChildren(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trẻ em:", error);
      }
    };
    fetchChildren();
  }, []);

  // take vaccines
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data = await getVaccines();
        setVaccines(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc-xin:", error);
      }
    };
    fetchVaccines();
  }, []);

  // take combo vaccine
  useEffect(() => {
    const fetchVaccineCombos = async () => {
      try {
        const data = await getVaccineCombos();
        setVaccineCombos(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu combo vắc-xin:", error);
      }
    };
    fetchVaccineCombos();
  }, []);

  //handle form field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updatedValue;

      if (type === "checkbox") {
        if (name === "vaccineId") {
          updatedValue = checked
            ? [...prev[name], value] // Thêm vào mảng nếu checkbox được chọn
            : prev[name].filter((id) => id !== value); // Loại bỏ nếu checkbox bị bỏ chọn
        } else if (name === "vaccineComboId") {
          updatedValue = checked
            ? [...prev[name], value] // Thêm vào mảng nếu checkbox được chọn
            : prev[name].filter((id) => id !== value); // Loại bỏ nếu checkbox bị bỏ chọn
        } else if (name === "consent") {
          updatedValue = checked;
        }
      } else {
        updatedValue = value;
      }
      return { ...prev, [name]: updatedValue };
    });
  };

  // check validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Ngày đặt lịch là bắt buộc";
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(formData.bookingDate);
      if (selectedDate < currentDate) {
        newErrors.bookingDate = "Ngày đặt lịch không thể là ngày trong quá khứ";
      }
    }

    if (!formData.vaccineId.length && !formData.vaccineComboId.length) {
      newErrors.vaccineId = "Vui lòng chọn vắc-xin hoặc combo vắc-xin";
    }
    if (!formData.childId) newErrors.childId = "Vui lòng chọn trẻ";
    if (!formData.consent) newErrors.consent = "Vui lòng đồng ý với điều khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // post api booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const loadingToast = toast.loading("Đang đặt lịch, vui lòng chờ...");
      try {
        const userId = localStorage.getItem("userId");
        const payload = {
          booking: {
            bookingDate: formData.bookingDate,
            customer: { customerId: userId },
          },
          vaccineId: formData.vaccineId.length > 0 ? formData.vaccineId : [], // Đảm bảo gửi mảng
          vaccineComboId:
            formData.vaccineComboId.length > 0 ? formData.vaccineComboId : [], // Đảm bảo gửi mảng
          child: { childId: formData.childId },
        };

        console.log("Payload:", payload);
        const result = await postSchedules(payload);
        if (result.success) {
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });

          navigate("/detail-vaccine", {
            state: { bookingId: "C001-B5" },
          });
        } else {
          toast.update(loadingToast, {
            render: result.message || "Đặt lịch thất bại. Vui lòng thử lại.",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        toast.update(loadingToast, {
          render: "Đã có lỗi xảy ra. Vui lòng thử lại.",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Đặt Lịch Tiêm Chủng Cho Trẻ
        </h1>
        <p className="text-gray-600">Chăm Sóc Sức Khỏe - Bảo Vệ Tương Lai</p>
      </header>

      <div className="max-w-7xl mx-auto grid gap-8">
        {/* Date Selection */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Chọn Ngày
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              return (
                <button
                  key={i}
                  onClick={() => handleDateSelect(date)}
                  className={`p-4 rounded-lg text-center transition-colors ${
                    selectedDate && isToday(selectedDate, date)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-blue-100"
                  }`}
                  disabled={isBefore(date, new Date())}
                >
                  {format(date, "dd/MM", { locale: vi })}
                </button>
              );
            })}
          </div>
        </section>

        {/* Child Selection */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaChild className="mr-2 text-blue-500" />
            Chọn Trẻ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <div
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedChild?.id === child.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <img
                  src={child.image}
                  alt={child.name}
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-center">{child.name}</h3>
                <p className="text-gray-600 text-center">{child.age}</p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Đã tiêm: {child.history}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Vaccine Selection */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaSyringe className="mr-2 text-blue-500" />
            Chọn Vắc-xin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {vaccines.map((vaccine) => (
              <div
                key={vaccine.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVaccines.includes(vaccine.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleVaccineSelect(vaccine.id)}
              >
                <img
                  src={vaccine.image}
                  alt={vaccine.name}
                  className="w-16 h-16 object-cover rounded mb-3"
                />
                <h3 className="font-semibold">{vaccine.name}</h3>
                <p className="text-sm text-gray-600">{vaccine.description}</p>
                <p className="text-blue-600 font-semibold mt-2">{1}đ</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Combo Vắc-xin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCombos.includes(combo.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleComboSelect(combo.id)}
              >
                <h3 className="font-semibold">{combo.name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Bao gồm: {combo.vaccines.join(", ")}
                </p>
                <div className="mt-3">
                  <span className="text-gray-500 line-through mr-2">{2}đ</span>
                  <span className="text-blue-600 font-semibold">{2}đ</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Xác Nhận Đặt Lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookVaccine2;
