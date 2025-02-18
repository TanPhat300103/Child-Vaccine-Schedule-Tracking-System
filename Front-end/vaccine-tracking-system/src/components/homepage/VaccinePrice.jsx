import { motion } from "framer-motion";
import React from "react";
const vaccinePricing = [
  {
    disease: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B",
    vaccines: [
      { name: "HEXAXIM", country: "Pháp", price: "995.000đ" },
      { name: "INFANRIX HEXA", country: "Bỉ", price: "995.000đ" },
    ],
  },
  {
    disease: "Rota virus",
    vaccines: [
      { name: "ROTARIX", country: "Bỉ", price: "815.000đ" },
      { name: "ROTAVIN", country: "Việt Nam", price: "480.000đ" },
      { name: "ROTATEQ", country: "Mỹ", price: "655.000đ" },
    ],
  },
  {
    disease: "Các bệnh do phế cầu (Viêm phổi, Viêm tai giữa, Viêm màng não)",
    vaccines: [
      { name: "SYNFLORIX", country: "Bỉ", price: "1.024.000đ" },
      { name: "PREVENAR 13", country: "Bỉ", price: "1.280.000đ" },
      { name: "PNEUMOVAX 23", country: "Mỹ", price: "1.440.000đ" },
    ],
  },
  {
    disease: "Cúm mùa",
    vaccines: [
      { name: "IVACFLU-S 0,5ML", country: "Việt Nam", price: "260.000đ" },
      { name: "VAXIGRIP TETRA", country: "Pháp", price: "333.000đ" },
      { name: "INFLUVAC TETRA", country: "Hà Lan", price: "333.000đ" },
    ],
  },
  {
    disease: "Ung Thư do Vi Rút HPV",
    vaccines: [
      { name: "GARDASIL 9", country: "Mỹ", price: "2.940.000đ" },
      { name: "GARDASIL 4", country: "Mỹ", price: "1.780.000đ" },
    ],
  },
  {
    disease: "Viêm não Nhật Bản",
    vaccines: [
      { name: "JEVAX 1ML", country: "Việt Nam", price: "175.000đ" },
      { name: "IMOJEV", country: "Thái Lan", price: "830.000đ" },
      { name: "JEEV 3MCG 0,5 ML", country: "Ấn Độ", price: "279.000đ" },
    ],
  },
];

export default function VaccinePricingTable() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-blue-700 mb-12"
        >
          Bảng Giá Vắc Xin
        </motion.h2>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full border border-gray-300">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Phòng bệnh</th>
                <th className="px-6 py-4 text-left">Tên vắc xin</th>
                <th className="px-6 py-4 text-left">Nước sản xuất</th>
                <th className="px-6 py-4 text-left">Giá niêm yết (VND)</th>
              </tr>
            </thead>
            <tbody>
              {vaccinePricing.map((item, index) => (
                <React.Fragment key={index}>
                  {item.vaccines.map((vaccine, i) => (
                    <tr key={i} className="border hover:bg-gray-50 transition">
                      {i === 0 && (
                        <td
                          className="px-6 py-4 border bg-gray-100 font-semibold"
                          rowSpan={item.vaccines.length}
                        >
                          {item.disease}
                        </td>
                      )}
                      <td className="px-6 py-4 border">{vaccine.name}</td>
                      <td className="px-6 py-4 border">{vaccine.country}</td>
                      <td className="px-6 py-4 border">{vaccine.price}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
