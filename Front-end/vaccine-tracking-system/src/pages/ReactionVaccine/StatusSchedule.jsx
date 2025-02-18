import React, { useState } from "react";
import { FaSyringe, FaSearch, FaPrint } from "react-icons/fa";
import {
  BsClockFill,
  BsCheckCircleFill,
  BsExclamationCircleFill,
} from "react-icons/bs";

const VaccinationSchedule = () => {
  const [activeTab, setActiveTab] = useState("completed");
  const [searchTerm, setSearchTerm] = useState("");

  const vaccineData = {
    completed: [
      {
        id: 1,
        name: "BCG",
        date: "2023-12-01",
        description: "Vaccine against tuberculosis",
        status: "completed",
      },
      {
        id: 2,
        name: "Hepatitis B",
        date: "2023-11-15",
        description: "Protection against Hepatitis B virus",
        status: "completed",
      },
    ],
    pending: [
      {
        id: 3,
        name: "DPT",
        date: "2024-01-05",
        description: "Triple vaccine for Diphtheria, Pertussis, Tetanus",
        status: "pending",
      },
      {
        id: 4,
        name: "Polio",
        date: "2024-01-10",
        description: "Oral Polio Vaccine",
        status: "pending",
      },
    ],
    upcoming: [
      {
        id: 5,
        name: "MMR",
        date: "2024-02-15",
        description: "Measles, Mumps, and Rubella vaccine",
        status: "upcoming",
      },
      {
        id: 6,
        name: "Chickenpox",
        date: "2024-03-01",
        description: "Varicella vaccine",
        status: "upcoming",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <BsCheckCircleFill className="text-green-500" />;
      case "pending":
        return <BsExclamationCircleFill className="text-yellow-500" />;
      case "upcoming":
        return <BsClockFill className="text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredVaccines = vaccineData[activeTab].filter((vaccine) =>
    vaccine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaSyringe className="text-blue-500 text-3xl" />
            <h1 className="text-3xl font-bold text-gray-800">
              Vaccination Schedule
            </h1>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vaccines..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </header>

        <div className="mb-6">
          <div className="flex justify-center space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 font-medium ${
                activeTab === "completed"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đã tiêm
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-yellow-500 text-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chờ xác nhận
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 font-medium ${
                activeTab === "upcoming"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sắp tiêm
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVaccines.length > 0 ? (
            filteredVaccines.map((vaccine) => (
              <div
                key={vaccine.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {vaccine.name}
                  </h3>
                  {getStatusIcon(vaccine.status)}
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-2">
                    {vaccine.description}
                  </p>
                  <p className="text-gray-500 text-sm">Date: {vaccine.date}</p>
                </div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(
                    vaccine.status
                  )}`}
                >
                  {vaccine.status.charAt(0).toUpperCase() +
                    vaccine.status.slice(1)}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No vaccines found</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2 mx-auto">
            <FaPrint />
            Export Vaccination Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationSchedule;
