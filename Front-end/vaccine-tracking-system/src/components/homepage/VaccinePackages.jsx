// eslint-disable-next-line no-unused-vars
import React from "react";
import { vaccinePackages } from "../../stores/data.js"; // Sử dụng dữ liệu từ file data.js

const VaccinePackages = () => {
  return (
    <section id="vaccinepackages" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Gói tiêm chủng theo độ tuổi
        </h2>
        {vaccinePackages.map((pkg, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold mb-4">Độ tuổi: {pkg.age}</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-card text-white">
                  <tr>
                    <th className="p-4 text-left">Phòng bệnh</th>
                    <th className="p-4 text-left">Tên vắc xin</th>
                    <th className="p-4 text-left">Nước sản xuất</th>
                    <th className="p-4 text-left">Số mũi</th>
                    <th className="p-4 text-left">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.vaccines.map((vaccine, vIndex) => (
                    <tr key={vIndex} className="border-b">
                      <td className="p-4">{vaccine.disease}</td>
                      <td className="p-4">{vaccine.name}</td>
                      <td className="p-4">{vaccine.manufacturer}</td>
                      <td className="p-4">{vaccine.doses}</td>
                      <td className="p-4">{vaccine.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VaccinePackages;
