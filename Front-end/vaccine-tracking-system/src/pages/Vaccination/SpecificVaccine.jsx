import React, { useEffect, useState } from "react";
import {
  FaSyringe,
  FaCalendarAlt,
  FaFlask,
  FaGlobe,
  FaUserClock,
  FaDollarSign,
  FaBoxOpen,
  FaChartLine,
} from "react-icons/fa";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useLocation } from "react-router-dom";
import { getVaccineDetailByVaccineId } from "../../apis/api";

const VaccineDetailPage = () => {
  const [showZoom, setShowZoom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vaccineData, setVaccineData] = useState([]);

  // take data
  const { state } = useLocation();
  const vaccineId = state?.vaccineId;
  console.log("vaccine Id : ", vaccineId);

  // tolerance
  const ToleranceIndicator = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  // take api vaccineDetailByVaccineId
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const data = await getVaccineDetailByVaccineId(vaccineId);
        setVaccineData(data[0]);
        console.log("vaccine data: ", vaccineData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vắc-xin:", error);
      } finally {
        setIsLoading(false); // Khi tải xong, setLoading là false
      }
    };
    if (vaccineId) {
      fetchVaccines();
    }
  }, [vaccineId]);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading khi dữ liệu đang được tải
  }

  return (
    <div className="min-h-screen bg-[#E6F2FF] p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#333333] flex items-center gap-3">
            <FaSyringe className="text-[#4A90E2]" />
            {vaccineData?.name || "Vaccine Detail"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative">
            <div
              className="relative cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setShowZoom(!showZoom)}
            >
              <img
                src={vaccineData.img}
                alt="Vaccine"
                className={`w-full h-[400px] object-cover transition-transform duration-300 ${
                  showZoom ? "scale-150" : "scale-100"
                }`}
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="bg-[#D4EDDA] p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-[#333333]">
                Thông tin chi tiết
              </h2>

              <div className="space-y-4">
                <DetailRow
                  icon={<FaSyringe />}
                  label="Số liều"
                  value={vaccineData?.vaccine.doseNumber || "n"}
                />
                <DetailRow
                  icon={<FaFlask />}
                  label="Mô tả"
                  value={vaccineData?.vaccine.description || "n"}
                />
                <DetailRow
                  icon={<FaGlobe />}
                  label="Quốc gia sản xuất"
                  value={vaccineData?.vaccine.country || "n"}
                />
                <DetailRow
                  icon={<FaUserClock />}
                  label="Độ tuổi khuyến nghị"
                  value={`${vaccineData.vaccine.ageMin} - ${vaccineData.vaccine.ageMax} tuổi`}
                />
                <DetailRow
                  icon={<FaDollarSign />}
                  label="Giá vaccine"
                  value={vaccineData.vaccine.price}
                />
              </div>
            </div>

            {/* Tracking Section */}
            <div className="bg-[#E6F2FF] p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-[#333333]">
                Theo dõi tiêm chủng
              </h2>

              <div className="space-y-4">
                <DetailRow
                  icon={<FaCalendarAlt />}
                  label="Ngày sản xuất"
                  value={
                    // Kiểm tra xem entryDate có hợp lệ không
                    isNaN(Date.parse(vaccineData.entryDate))
                      ? "Ngày không hợp lệ" // Nếu không hợp lệ, hiển thị thông báo lỗi
                      : format(
                          new Date(vaccineData.entryDate), // Chuyển đổi chuỗi thành đối tượng Date
                          "dd MMMM yyyy", // Định dạng ngày
                          { locale: vi }
                        )
                  }
                />

                <div className="flex items-center gap-4">
                  <FaChartLine className="text-[#4A90E2] text-xl" />
                  <span className="text-[#333333] min-w-[150px]">
                    Mức độ dung nạp:
                  </span>
                  <ToleranceIndicator value={vaccineData.tolerance} />
                </div>
                <DetailRow
                  icon={<FaBoxOpen />}
                  label="Số lượng còn lại"
                  value={`${vaccineData.quantity} liều`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <span className="text-[#4A90E2] text-xl">{icon}</span>
    <span className="text-[#333333] min-w-[150px]">{label}:</span>
    <span className="text-[#333333] font-medium">{value}</span>
  </div>
);

export default VaccineDetailPage;
