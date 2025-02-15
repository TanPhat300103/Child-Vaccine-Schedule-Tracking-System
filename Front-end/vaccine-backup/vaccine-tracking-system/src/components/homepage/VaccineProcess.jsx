// eslint-disable-next-line no-unused-vars
import React from "react";
import { vaccinationProcess } from "../../stores/data"; // Sử dụng dữ liệu từ file data.js

const VaccinationProcess = () => {
  return (
    <section id="vaccineprocess" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Quy trình tiêm chủng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {vaccinationProcess.map((step) => (
            <div
              key={step.step}
              className="text-center p-6 bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-[#0D6EFD] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VaccinationProcess;
