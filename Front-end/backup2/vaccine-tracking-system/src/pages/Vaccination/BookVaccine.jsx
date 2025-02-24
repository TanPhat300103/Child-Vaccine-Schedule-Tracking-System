import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomerId,
  postSchedules,
  getChilds,
  getVaccines,
  getVaccineCombos,
} from "../../apis/api";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookVaccine = () => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [vaccineCombos, setVaccineCombos] = useState([]);

  const [formData, setFormData] = useState({
    booking: {
      bookingDate: "",
      customer: {
        customerId: "",
      },
    },
    vaccineId: [],
    vaccineComboId: [],
    child: {
      childId: "",
    },
    consent: false,
  });

  const navigate = useNavigate();

  // Lấy customerID khi đăng nhập
  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log(localStorage.getItem("userId"));

        if (!userId) {
          toast.error("Lỗi: Không tìm thấy userId, vui lòng đăng nhập lại!");
          return;
        }

        // Kiểm tra xem userId có tồn tại trong dữ liệu API không
        const customer = await getCustomerId(userId);
        if (customer && customer.customerId) {
          setCustomerId(customer.customerId);
          console.log("✅ Customer ID lấy được:", customer.id);
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

  // Lấy danh sách trẻ em
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await getChilds();

        console.log("API Response (Get Childs):", children);

        setChildren(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trẻ em:", error);
      }
    };
    fetchChildren();
  }, []);
  // lay vaccine
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

  //lay combo vaccine
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

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (name === "vaccineId" || name === "vaccineComboId") {
        return { ...prev, [name]: [value] }; // Đảm bảo lưu dưới dạng mảng
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Kiểm tra dữ liệu form trước khi gửi
  const validateForm = () => {
    const newErrors = {};
    if (!formData.bookingDate)
      newErrors.bookingDate = "Ngày đặt lịch là bắt buộc";
    if (!formData.vaccineId && !formData.vaccineComboId)
      newErrors.vaccineId = "Vui lòng chọn vắc-xin hoặc combo vắc-xin";
    if (!formData.childId) newErrors.childId = "Vui lòng chọn trẻ";
    if (!formData.consent) newErrors.consent = "Vui lòng đồng ý với điều khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi dữ liệu lên backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Lỗi: Không tìm thấy Customer ID. Vui lòng đăng nhập lại!");
      console.error("⚠️ customerId bị null hoặc undefined:", customerId);
      return;
    }

    if (validateForm()) {
      setIsLoading(true);
      const loadingToast = toast.loading("Đang đặt lịch, vui lòng chờ...");

      try {
        const payload = {
          booking: {
            bookingDate: formData.bookingDate,
            customer: { customerId: customerId }, // customerId nằm trong customer
          },
          vaccineId: formData.vaccineId ? formData.vaccineId : [],
          vaccineComboId: formData.vaccineComboId
            ? formData.vaccineComboId
            : [],

          child: { childId: formData.childId }, // Child ID
        };

        // Log dữ liệu gửi lên API
        console.log(
          "🚀 Dữ liệu gửi lên API:",
          JSON.stringify(payload, null, 2)
        );
        console.log("customerId:", customerId);
        console.log("Form Data:", formData);

        // Gửi dữ liệu lên API
        const result = await postSchedules(payload);
        console.log("API Response:", result);

        // Xử lý kết quả trả về từ API
        if (result.success) {
          toast.update(loadingToast, {
            render: "Đặt lịch thành công!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          navigate("/status-schedule");
        } else {
          toast.update(loadingToast, {
            render:
              result.message ||
              "Đặt lịch thất bại. Vui lòng kiểm tra lại thông tin.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("❌ Lỗi khi gửi dữ liệu:", error);
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
              value={formData.bookingDate}
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
              value={formData.childId}
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

            {/* Chọn Vaccine */}
            <label htmlFor="vaccineId" className="font-medium">
              Chọn Vắc-xin
            </label>
            <select
              name="vaccineId"
              value={formData.vaccineId}
              onChange={handleChange}
              className={`block w-full py-2 border ${
                errors.vaccineId ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
            >
              <option value="">Chọn Vắc-xin</option>
              {vaccines.map((vaccine) => (
                <option key={vaccine.vaccineId} value={vaccine.vaccineId}>
                  {vaccine.name} - {vaccine.country} ({vaccine.doseNumber} liều)
                </option>
              ))}
            </select>

            {errors.vaccineId && (
              <p className="text-sm text-red-500">{errors.vaccineId}</p>
            )}

            {/* Chọn Combo Vaccine (Không bắt buộc) */}
            <label htmlFor="vaccineComboId" className="font-medium">
              Chọn Combo Vắc-xin (Tùy chọn)
            </label>
            <select
              name="vaccineComboId"
              value={formData.vaccineComboId}
              onChange={handleChange}
              className={`block w-full py-2 border ${
                errors.vaccineId ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm`}
            >
              <option value="">Không chọn combo</option>
              {vaccineCombos.map((combo) => (
                <option key={combo.vaccineComboId} value={combo.vaccineComboId}>
                  {combo.name} - {combo.priceCombo} VNĐ
                </option>
              ))}
            </select>

            {errors.vaccineId && (
              <p className="text-sm text-red-500">{errors.vaccineId}</p>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
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
