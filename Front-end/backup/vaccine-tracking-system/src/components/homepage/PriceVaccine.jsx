import { motion } from "framer-motion";
import React from "react";
import { pricepackage } from "../../stores/vaccinedata.jsx";

const PriceVaccine = () => {
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
              {pricepackage.map((item, index) => (
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
};
export default PriceVaccine;
