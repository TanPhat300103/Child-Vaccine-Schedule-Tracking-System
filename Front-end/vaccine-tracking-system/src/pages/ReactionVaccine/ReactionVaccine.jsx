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
    name: "COVID-19 Vaccine",
    brand: "PfizerBioNTech",
    description: "mRNA-based vaccine for SARS-CoV-2 virus protection",
    dosageInfo: "0.3 mL intramuscular injection",
  };

  const recommendedDoses = [
    { id: 1, date: "First Dose", status: "completed" },
    { id: 2, date: "Second Dose (21 days after)", status: "current" },
    { id: 3, date: "Booster (6 months after)", status: "pending" },
  ];

  const commonReactions = [
    { symptom: "Injection site pain", severity: "Mild" },
    { symptom: "Fatigue", severity: "Moderate" },
    { symptom: "Headache", severity: "Mild" },
    { symptom: "Muscle pain", severity: "Moderate" },
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
    if (!formData.ageGroup) newErrors.ageGroup = "Age group is required";
    if (!formData.reactionSeverity)
      newErrors.reactionSeverity = "Reaction severity is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // API call simulation
      alert("Thank you for your feedback!");
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
          <h2 className="text-2xl font-semibold mb-4">Vaccine Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{vaccineInfo.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Dosage Information
              </h3>
              <p className="text-gray-600">{vaccineInfo.dosageInfo}</p>
            </div>
          </div>
        </div>

        {/* Recommended Doses */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended Doses</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Common Reactions</h2>
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
                    Severity: {reaction.severity}
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
          <h2 className="text-2xl font-semibold mb-6">Share Your Experience</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Submit Anonymously
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
                  Name (Optional)
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
                Age Group*
              </label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.ageGroup ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select age group</option>
                <option value="18-30">18-30 years</option>
                <option value="31-50">31-50 years</option>
                <option value="51-70">51-70 years</option>
                <option value="71+">71+ years</option>
              </select>
              {errors.ageGroup && (
                <p className="mt-1 text-sm text-red-600">{errors.ageGroup}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reaction Severity*
              </label>
              <select
                name="reactionSeverity"
                value={formData.reactionSeverity}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.reactionSeverity ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select severity</option>
                <option value="none">No reaction</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
              {errors.reactionSeverity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.reactionSeverity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={maxChars}
                rows={4}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Please describe your experience..."
              />
              <div className="mt-1 text-sm text-gray-500 flex justify-between">
                <span>
                  {charCount}/{maxChars} characters
                </span>
                {errors.description && (
                  <span className="text-red-600">{errors.description}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Experience
              </label>
              <input
                type="range"
                name="rating"
                min="1"
                max="10"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Documentation (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                        onChange={handleInputChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinePage;
