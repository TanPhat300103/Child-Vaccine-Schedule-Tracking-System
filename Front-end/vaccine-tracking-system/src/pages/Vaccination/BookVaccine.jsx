import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomerId,
  postSchedules,
  getChilds,
  getVaccines,
  getVaccineCombos,
  getBookingByCustomerId,
} from "../../apis/api";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookVaccine = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [vaccineCombos, setVaccineCombos] = useState([]);
  const navigate = useNavigate();
  const [isVaccineListVisible, setIsVaccineListVisible] = useState(false);
  const [isVaccineComboListVisible, setIsVaccineComboListVisible] =
    useState(false);

  // form data
  const [formData, setFormData] = useState({
    bookingDate: "",
    customerId: customerId || "",
    vaccineId: [],
    vaccineComboId: [],
    childId: "",
    consent: false,
  });

  // take api 1 customerId
  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log(localStorage.getItem("userId"));
        if (!userId) {
          toast.error("Lỗi: Không tìm thấy userId, vui lòng đăng nhập lại!");
          return;
        }
        const customer = await getCustomerId(userId);
        if (customer && customer.customerId) {
          setCustomerId(customer.customerId);
          console.log("✅ Customer ID lấy được:", customer.customerId);
        } else {
          toast.error(
            "Không thể lấy thông tin khách hàng. Vui lòng đăng nhập lại!"
          );
        }
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
        console.log("API Response (Get Childs):", data);
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
        console.log("📡 API Response (Get Vaccines):", data);
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
        console.log("📡 API Response (Get Vaccine Combos):", data);
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

    // Kiểm tra nếu ngày đặt lịch không được để trống
    if (!formData.bookingDate) {
      newErrors.bookingDate = "Ngày đặt lịch là bắt buộc";
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(formData.bookingDate);
      if (selectedDate < currentDate) {
        newErrors.bookingDate = "Ngày đặt lịch không thể là ngày trong quá khứ";
      }
    }

    // Kiểm tra các trường khác
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
        const payload = {
          booking: {
            bookingDate: formData.bookingDate,
            customer: { customerId: customerId },
          },
          vaccineId: formData.vaccineId.length > 0 ? formData.vaccineId : [], // Đảm bảo gửi mảng
          vaccineComboId:
            formData.vaccineComboId.length > 0 ? formData.vaccineComboId : [], // Đảm bảo gửi mảng
          child: { childId: formData.childId },
        };

        console.log("Payload:", payload);

        const result = await postSchedules(payload);
        console.log("API Response:", result);

        // Kiểm tra nếu result có success và bookingId
        if (result.success) {
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          console.log(
            "Navigating to /detail-vaccine with bookingId:",
            result.bookingId
          );

          // Điều hướng tới trang detail-vaccine với bookingId
          navigate("/detail-vaccine", {
            state: { bookingId: result.bookingId },
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Đặt Lịch Tiêm Chủng Cho Trẻ Em
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ngày đặt lịch */}
            <label htmlFor="bookingDate" className="font-medium">
              Ngày Đặt Lịch
            </label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate || ""}
              onChange={handleChange}
              className={`block w-full py-2 border ${
                errors.bookingDate ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
            />
            {errors.bookingDate && (
              <p className="text-sm text-red-500">{errors.bookingDate}</p>
            )}

            {/* Chọn trẻ */}
            <label htmlFor="childId" className="font-medium">
              Chọn Trẻ
            </label>
            <select
              name="childId"
              value={formData.childId || ""}
              onChange={handleChange}
              className={`block w-full py-2 border ${
                errors.childId ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
            >
              <option value="">Chọn Trẻ</option>
              {children.map((child) => (
                // Thêm thuộc tính key vào mỗi <option>
                <option key={child.childId} value={child.childId}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>

            {errors.childId && (
              <p className="text-sm text-red-500">{errors.childId}</p>
            )}

            {/* Chọn Vắc-xin */}
            <label htmlFor="vaccineId" className="font-medium">
              Chọn Vắc-xin
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVaccineListVisible(!isVaccineListVisible)}
                className="block w-full text-left py-2 px-4 border border-gray-300 rounded-md shadow-sm"
              >
                {isVaccineListVisible ? "Ẩn Danh Sách Vắc-xin" : "Chọn Vắc-xin"}
              </button>
              {isVaccineListVisible && (
                <div className="space-y-2 mt-2 absolute w-full bg-white shadow-lg z-10 border rounded-md">
                  {vaccines.map((vaccine) => (
                    <div
                      key={vaccine.vaccineId}
                      className="flex items-center px-4 py-2"
                    >
                      <input
                        type="checkbox"
                        name="vaccineId"
                        value={vaccine.vaccineId}
                        checked={formData.vaccineId.includes(vaccine.vaccineId)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        {vaccine.name} - {vaccine.country} ({vaccine.doseNumber}{" "}
                        liều)
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.vaccineId && (
              <p className="text-sm text-red-500">{errors.vaccineId}</p>
            )}

            {/* Chọn Combo Vaccine */}
            <label htmlFor="vaccineComboId" className="font-medium">
              Chọn Combo Vắc-xin (Tùy chọn)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsVaccineComboListVisible(!isVaccineComboListVisible)
                }
                className="block w-full text-left py-2 px-4 border border-gray-300 rounded-md shadow-sm"
              >
                {isVaccineComboListVisible
                  ? "Ẩn Danh Sách Combo"
                  : "Chọn Combo Vắc-xin"}
              </button>
              {isVaccineComboListVisible && (
                <div className="space-y-2 mt-2 absolute w-full bg-white shadow-lg z-10 border rounded-md">
                  {vaccineCombos.map((combo) => (
                    <div
                      key={combo.vaccineComboId}
                      className="flex items-center px-4 py-2"
                    >
                      <input
                        type="checkbox"
                        name="vaccineComboId"
                        value={combo.vaccineComboId || ""}
                        checked={formData.vaccineComboId.includes(
                          combo.vaccineComboId
                        )}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-900">
                        {combo.name} - {combo.priceCombo} VNĐ
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.vaccineComboId && (
              <p className="text-sm text-red-500">{errors.vaccineComboId}</p>
            )}

            {/* Đồng ý điều khoản */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với việc tiêm vắc-xin và xác nhận thông tin đã cung
                cấp là chính xác
              </label>
            </div>
            {errors.consent && (
              <p className="text-sm text-red-500">{errors.consent}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isLoading ? "Đang đặt lịch..." : "Đặt Lịch Tiêm"}
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BookVaccine;
