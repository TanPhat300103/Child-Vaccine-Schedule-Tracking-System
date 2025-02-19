import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSyringe,
  FaCalendarAlt,
} from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const VaccineScheduling = () => {
  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    center: "",
    vaccine: "",
    appointmentDate: "",
    timeSlot: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const centers = [
    { id: 1, name: "Trung tâm Y tế Quận 1" },
    { id: 2, name: "Bệnh viện Nhi Đồng" },
    { id: 3, name: "Phòng khám Đa khoa" },
  ];

  const vaccines = [
    {
      id: 1,
      name: "HEXAXIM Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B, Pháp",
      info: "",
    },
    {
      id: 2,
      name: "ROTARIX Rota virus, Bỉ",
      info: "",
    },
    {
      id: 3,
      name: "VAXIGRIP TETRA Cúm mùa, Pháp",
      info: "",
    },
  ];

  const timeSlots = [
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.childName.trim()) newErrors.childName = "Tên trẻ là bắt buộc";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    if (!formData.phoneNumber.match(/^\d{10}$/))
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Địa chỉ email không hợp lệ";
    if (!formData.center) newErrors.center = "Vui lòng chọn trung tâm tiêm";
    if (!formData.vaccine) newErrors.vaccine = "Vui lòng chọn loại vắc-xin";
    if (!formData.appointmentDate)
      newErrors.appointmentDate = "Vui lòng chọn ngày tiêm";
    if (!formData.timeSlot) newErrors.timeSlot = "Vui lòng chọn khung giờ";
    if (!formData.consent) newErrors.consent = "Vui lòng đồng ý với điều khoản";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Giả lập API call
        const response = await fetch(
          "https://67aa281d65ab088ea7e5d7ab.mockapi.io/Schedule",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) throw new Error("Đặt lịch tiêm không thành công");

        alert("Đặt lịch tiêm thành công!");
        setFormData({
          childName: "",
          dateOfBirth: "",
          phoneNumber: "",
          email: "",
          center: "",
          vaccine: "",
          appointmentDate: "",
          timeSlot: "",
          consent: false,
        });
        // Trong VaccineScheduling page
        navigate("/payment", { state: formData });

        // Sau khi điều hướng đến Payment, chuyển đến trang Status Schedule
        setTimeout(() => {
          navigate("/status-schedule", { state: formData });
        }, 100000); // Delay nhỏ để đảm bảo trang Payment đã được load
      } catch (error) {
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Đặt Lịch Tiêm Chủng Cho Trẻ Em
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông Tin Cá Nhân */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Thông Tin Cá Nhân
              </h2>
              <label htmlFor="childName" className="font-medium">
                Tên trẻ
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.childName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Nguyễn B"
                />
                {errors.childName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.childName}
                  </p>
                )}
              </div>

              <label htmlFor="phoneNumber" className="font-medium">
                Số điện thoại phụ huynh
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0901234567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <label htmlFor="email" className="font-medium">
                Email phụ huynh
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Parent@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <label htmlFor="dateOfBirth" className="font-medium">
                Ngày sinh
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={format(new Date(), "yyyy-MM-dd")}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            {/* Thông Tin Tiêm Chủng */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Thông Tin Tiêm Chủng
              </h2>

              <label htmlFor="center" className="font-medium">
                Chọn Trung Tâm Tiêm
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="center"
                  value={formData.center}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.center ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Chọn Trung Tâm Tiêm</option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
                {errors.center && (
                  <p className="mt-1 text-sm text-red-500">{errors.center}</p>
                )}
              </div>

              <label htmlFor="vaccine" className="font-medium">
                Chọn Vắc-xin
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSyringe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="vaccine"
                  value={formData.vaccine}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.vaccine ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Chọn Vắc-xin</option>
                  {vaccines.map((vaccine) => (
                    <option key={vaccine.id} value={vaccine.id}>
                      {vaccine.name}
                    </option>
                  ))}
                </select>
                {errors.vaccine && (
                  <p className="mt-1 text-sm text-red-500">{errors.vaccine}</p>
                )}
                {formData.vaccine && (
                  <p className="mt-2 text-sm text-gray-500">
                    {
                      vaccines.find((v) => v.id.toString() === formData.vaccine)
                        ?.info
                    }
                  </p>
                )}
              </div>

              <label htmlFor="appointmentDate" className="font-medium">
                Chọn Ngày Tiêm
              </label>
              <div className="relative flex items-center gap-x-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.appointmentDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.appointmentDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.appointmentDate}
                  </p>
                )}
              </div>

              <label htmlFor="timeSlot" className="font-medium">
                Chọn Khung Giờ
              </label>
              <div className="relative flex items-center gap-x-2">
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className={`block w-full pl-3 pr-3 py-2 border ${
                    errors.timeSlot ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Chọn Khung Giờ</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-red-500">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Tôi đồng ý với việc tiêm vắc-xin và xác nhận thông tin đã cung cấp
              là chính xác
            </label>
          </div>
          {errors.consent && (
            <p className="mt-1 text-sm text-red-500">{errors.consent}</p>
          )}

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  childName: "",
                  dateOfBirth: "",
                  phoneNumber: "",
                  email: "",
                  center: "",
                  vaccine: "",
                  appointmentDate: "",
                  timeSlot: "",
                  consent: false,
                })
              }
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang Đặt Lịch..." : "Đặt Lịch Tiêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccineScheduling;
