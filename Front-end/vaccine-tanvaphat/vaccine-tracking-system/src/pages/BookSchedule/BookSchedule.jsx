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
    { id: 1, name: "Central Medical Center" },
    { id: 2, name: "Children's Hospital" },
    { id: 3, name: "Community Health Center" },
  ];

  const vaccines = [
    {
      id: 1,
      name: "DTaP",
      info: "Protects against Diphtheria, Tetanus, and Pertussis",
    },
    {
      id: 2,
      name: "MMR",
      info: "Protects against Measles, Mumps, and Rubella",
    },
    { id: 3, name: "Hepatitis B", info: "Protects against Hepatitis B virus" },
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
    if (!formData.childName.trim())
      newErrors.childName = "Child's name is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phoneNumber.match(/^\d{10}$/))
      newErrors.phoneNumber = "Invalid phone number";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email address";
    if (!formData.center) newErrors.center = "Please select a center";
    if (!formData.vaccine) newErrors.vaccine = "Please select a vaccine";
    if (!formData.appointmentDate)
      newErrors.appointmentDate = "Please select appointment date";
    if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";
    if (!formData.consent) newErrors.consent = "Please provide consent";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // API call simulation
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

        if (!response.ok) throw new Error("Failed to schedule appointment");

        alert("Appointment scheduled successfully!");
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
        navigate("/payment");
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
          Child Vaccination Schedule
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Personal Information
              </h2>

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
                  placeholder="Child's Full Name"
                />
                {errors.childName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.childName}
                  </p>
                )}
              </div>

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
                  placeholder="Parent/Guardian Contact Number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

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
                  placeholder="Parent/Guardian Email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Vaccination Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">
                Vaccination Details
              </h2>

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
                  <option value="">Select Vaccination Center</option>
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
                  <option value="">Select Vaccine</option>
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

              <div className="relative flex items-center gap-x-2">
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className={`block w-full pl-3 pr-3 py-2 border ${
                    errors.timeSlot ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Time Slot</option>
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
              I consent to the vaccination and confirm that the information
              provided is accurate
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
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Vaccine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccineScheduling;
