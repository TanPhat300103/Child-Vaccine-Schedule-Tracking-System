import React, { useState } from "react";
import { FaSyringe, FaUpload, FaTimes } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const VaccinationTracker = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    appointmentDate: "",
    status: "",
    cost: "",
    rating: 0,
    description: "",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "phone":
        newErrors.phone = /^[0-9]{10}$/.test(value)
          ? ""
          : "Số điện thoại không hợp lệ";
        break;
      case "email":
        newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email không hợp lệ";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("Chỉ được tải lên tối đa 3 ảnh");
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    // After submitting, navigate to the Feedback page
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaSyringe className="text-blue-500 text-3xl mr-3" />
            <div>
              <h1 className="text-2xl font-bold">
                Theo Dõi Phản Ứng Sau Tiêm Chủng
              </h1>
              <p className="text-gray-500">
                Hệ thống theo dõi phản ứng sau tiêm chủng
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Thông Tin Bệnh Nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Họ và Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Số Điện Thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Ngày Đặt Lịch</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Trạng Thái Tiêm</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="completed">Đã Tiêm</option>
                  <option value="pending">Đang Chờ</option>
                  <option value="finished">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Tổng Chi Phí</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Đánh Giá Phản Ứng</h2>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-2xl text-yellow-400"
                >
                  {star <= formData.rating ? <AiFillStar /> : <AiOutlineStar />}
                </button>
              ))}
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết phản ứng của trẻ..."
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tải Ảnh Lên</h2>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center cursor-pointer"
              >
                <FaUpload className="text-3xl mb-2 text-gray-400" />
                <span>Kéo thả hoặc click để tải ảnh lên</span>
                <span className="text-sm text-gray-500">(Tối đa 3 ảnh)</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Gửi Phản Hồi
          </button>
        </form>
      </div>
    </div>
  );
};

export default VaccinationTracker;
