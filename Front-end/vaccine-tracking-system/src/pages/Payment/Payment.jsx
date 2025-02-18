import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";

const VaccinePaymentPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (
      !formData.phoneNumber.trim() ||
      !/^\+?[1-9]\d{9,11}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number";
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!paymentMethod)
      newErrors.paymentMethod = "Please select a payment method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData, paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", { ...formData, paymentMethod });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative px-6 py-8 sm:px-12">
          <div className="absolute inset-0 bg-opacity-10 bg-blue-100 z-0">
            <div
              className="w-full h-full opacity-5"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
                backgroundSize: "cover",
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Thanh Toán Lịch Tiêm Chủng Cho Trẻ
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="mr-2 text-blue-500" />
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nguyễn A"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaPhone className="mr-2 text-blue-500" />
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0901234567"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    Địa chỉ
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Residential Address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Phương thức thanh toán
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="offline"
                      name="paymentMethod"
                      checked={paymentMethod === "offline"}
                      onChange={() => handlePaymentMethodChange("offline")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="offline"
                      className="ml-3 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FaMoneyBillWave className="mr-2 text-blue-500" />
                      Thanh toán trực tiếp
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      checked={paymentMethod === "online"}
                      onChange={() => handlePaymentMethodChange("online")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="online"
                      className="ml-3 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FaCreditCard className="mr-2 text-blue-500" />
                      Thanh toán online
                    </label>
                  </div>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isFormValid
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinePaymentPage;
