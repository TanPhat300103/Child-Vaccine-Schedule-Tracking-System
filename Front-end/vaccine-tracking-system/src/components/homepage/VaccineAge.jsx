import { useState } from "react";

const packages = [
  {
    id: "package1",
    name: "Gói trẻ em từ 0-2 tuổi",
    details: [
      {
        disease: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B",
        vaccine: "HEXAXIM",
        country: "Pháp",
        doses: 3,
      },
      { disease: "Rota virus", vaccine: "ROTARIX", country: "Bỉ", doses: 2 },
    ],
  },
  {
    id: "package2",
    name: "Gói tiền học đường từ 3-9 tuổi",
    details: [
      {
        disease:
          "Các bệnh do phế cầu (Viêm phổi, Viêm tai giữa, Viêm màng não)",
        vaccine: "PREVENAR 13",
        country: "Bỉ",
        doses: 1,
      },
      {
        disease: "Cúm mùa",
        vaccine: "VAXIGRIP TETRA",
        country: "Pháp",
        doses: 1,
      },
    ],
  },
  {
    id: "package3",
    name: "Gói thanh thiếu niên từ 9-18 tuổi",
    details: [
      {
        disease: "Ung Thư do Vi Rút HPV",
        vaccine: "GARDASIL 9",
        country: "Mỹ",
        doses: 3,
      },
      {
        disease: "Viêm não Nhật Bản",
        vaccine: "IMOJEV",
        country: "Thái Lan",
        doses: 1,
      },
    ],
  },
];

const VaccinationPackages = () => {
  // 👉 Gán gói mặc định là package1 (Gói trẻ em 0-2 tuổi)
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Danh sách gói tiêm (Bên trái) */}
          <div className="space-y-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedPackage?.id === pkg.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white border border-gray-300 hover:border-blue-500 hover:shadow-md"
                }`}
              >
                {pkg.name}
              </button>
            ))}
          </div>

          {/* Chi tiết gói tiêm (Bên phải) */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">
              Chi tiết gói tiêm
            </h3>

            {selectedPackage ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-700">
                  {selectedPackage.name}
                </h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="border p-3">Phòng bệnh</th>
                      <th className="border p-3">Tên vắc xin</th>
                      <th className="border p-3">Nước sản xuất</th>
                      <th className="border p-3">Số mũi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPackage.details.map((item, index) => (
                      <tr
                        key={index}
                        className="border hover:bg-gray-100 transition"
                      >
                        <td className="border p-3">{item.disease}</td>
                        <td className="border p-3 font-medium text-blue-600">
                          {item.vaccine}
                        </td>
                        <td className="border p-3">{item.country}</td>
                        <td className="border p-3 text-center">{item.doses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Vui lòng chọn một gói tiêm ở bên trái.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default VaccinationPackages;
