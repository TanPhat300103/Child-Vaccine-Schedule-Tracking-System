import React, { useState, useEffect } from "react";
import {
  FaSyringe,
  FaThermometerHalf,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUpload,
} from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";

const VaccinePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    ageGroup: "",
    reactionSeverity: "",
    description: "",
    rating: 5,
    isAnonymous: false,
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const vaccineInfo = {
    name: "Vaccine COVID-19",
    brand: "PfizerBioNTech",
    description: "Vaccine mRNA chống virus SARS-CoV-2",
    dosageInfo: "Tiêm 0.3 mL qua cơ",
  };

  const recommendedDoses = [
    { id: 1, date: "Mũi đầu tiên", status: "completed" },
    { id: 2, date: "Mũi thứ hai (21 ngày sau)", status: "current" },
    { id: 3, date: "Mũi tăng cường (6 tháng sau)", status: "pending" },
  ];

  const commonReactions = [
    { symptom: "Đau tại chỗ tiêm", severity: "Nhẹ" },
    { symptom: "Mệt mỏi", severity: "Vừa" },
    { symptom: "Đau đầu", severity: "Nhẹ" },
    { symptom: "Đau cơ", severity: "Vừa" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const inputValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    if (name === "description") {
      setCharCount(value.length);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ageGroup) newErrors.ageGroup = "Nhóm tuổi là bắt buộc";
    if (!formData.reactionSeverity)
      newErrors.reactionSeverity = "Mức độ phản ứng là bắt buộc";
    if (!formData.description) newErrors.description = "Mô tả là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form before submission
    if (validateForm()) {
      try {
        // Make API call to send form data to MockAPI
        const response = await axios.post(
          "https://your-mockapi-url.com/feedbacks", // URL của MockAPI
          formData
        );
        console.log("Feedback submitted:", response.data);
        alert("Cảm ơn bạn đã chia sẻ phản hồi!");
      } catch (error) {
        console.error("There was an error submitting the feedback:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-center mb-4">
            <FaSyringe className="text-blue-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {vaccineInfo.name}
          </h1>
          <p className="text-gray-600">{vaccineInfo.brand}</p>
        </div>

        {/* Vaccine Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Thông tin vaccine</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Mô tả</h3>
              <p className="text-gray-600">{vaccineInfo.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Thông tin liều lượng
              </h3>
              <p className="text-gray-600">{vaccineInfo.dosageInfo}</p>
            </div>
          </div>
        </div>

        {/* Recommended Doses */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Các mũi tiêm khuyến nghị
          </h2>
          <div className="space-y-4">
            {recommendedDoses.map((dose) => (
              <div
                key={dose.id}
                className={`flex items-center p-4 rounded-lg ${
                  dose.status === "current"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <BsClockHistory className="text-blue-500 mr-4" />
                <span className="flex-grow">{dose.date}</span>
                {dose.status === "completed" && (
                  <FaCheckCircle className="text-green-500" />
                )}
                {dose.status === "current" && (
                  <FaExclamationTriangle className="text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Common Reactions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Phản ứng phổ biến</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {commonReactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <FaThermometerHalf className="text-red-500 mr-3" />
                <div>
                  <p className="font-medium">{reaction.symptom}</p>
                  <p className="text-sm text-gray-600">
                    Mức độ: {reaction.severity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-2xl font-semibold mb-6">
            Chia sẻ trải nghiệm của bạn
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Gửi ẩn danh
              </label>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </div>

            {!formData.isAnonymous && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên (Không bắt buộc)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhóm tuổi*
              </label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ageGroup ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Chọn nhóm tuổi</option>
                <option value="18-30">18-30 tuổi</option>
                <option value="31-50">31-50 tuổi</option>
                <option value="51-70">51-70 tuổi</option>
                <option value="71+">Trên 71 tuổi</option>
              </select>
              {errors.ageGroup && (
                <p className="mt-1 text-sm text-red-600">{errors.ageGroup}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mức độ phản ứng*
              </label>
              <select
                name="reactionSeverity"
                value={formData.reactionSeverity}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reactionSeverity ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Chọn mức độ phản ứng</option>
                <option value="Nhẹ">Nhẹ</option>
                <option value="Vừa">Vừa</option>
                <option value="Nặng">Nặng</option>
              </select>
              {errors.reactionSeverity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.reactionSeverity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả phản ứng*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                rows={4}
                maxLength={maxChars}
              />
              <p className="mt-1 text-sm text-gray-500">
                {charCount}/{maxChars} ký tự
              </p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đánh giá (1-5 sao)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tải lên ảnh (Tùy chọn)
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 mt-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Gửi phản hồi <FaUpload className="inline ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinePage;
