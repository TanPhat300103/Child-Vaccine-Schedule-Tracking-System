import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendar, FaMoneyBill, FaVial } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css"; // hoặc thử 'react-calendar-timeline/styles.css' nếu cần

const Dashboard = () => {
  const [incomeToday, setIncomeToday] = useState(0);
  const [incomeWeek, setIncomeWeek] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(0);
  const [incomeYear, setIncomeYear] = useState(0);
  const [bookingsToday, setBookingsToday] = useState([]);
  const [outOfStockVaccines, setOutOfStockVaccines] = useState([]);
  const [expiredVaccines, setExpiredVaccines] = useState([]);
  const [bestsellerVaccines, setBestsellerVaccines] = useState({});
  const [bestVaccineChartData, setBestVaccineChartData] = useState(null);
  const [incomeMixedData, setIncomeMixedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Lấy dữ liệu dashboard từ API
  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      const todayResponse = await axios.get(
        `http://localhost:8080/admin/incomebydate?date=${today}`
      );
      setIncomeToday(todayResponse.data);

      const weekResponse = await axios.get(
        `http://localhost:8080/admin/incomebyweek?date=${today}`
      );
      setIncomeWeek(weekResponse.data);

      const monthResponse = await axios.get(
        `http://localhost:8080/admin/incomebymonth?month=${month}&year=${year}`
      );
      setIncomeMonth(monthResponse.data);

      const yearResponse = await axios.get(
        `http://localhost:8080/admin/incomebyyear?year=${year}`
      );
      setIncomeYear(yearResponse.data);

      const bookingsResponse = await axios.get(
        "http://localhost:8080/admin/bookingtoday"
      );
      setBookingsToday(bookingsResponse.data);

      const outOfStockResponse = await axios.get(
        "http://localhost:8080/admin/vaccineoutofstock"
      );
      setOutOfStockVaccines(outOfStockResponse.data);

      const expiredResponse = await axios.get(
        "http://localhost:8080/admin/expiredvaccine"
      );
      setExpiredVaccines(expiredResponse.data);

      const bestsellerResponse = await axios.get(
        "http://localhost:8080/admin/bestvaccine"
      );
      setBestsellerVaccines(bestsellerResponse.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", err);
    }
  };

  // Cập nhật dữ liệu cho biểu đồ Vaccine Bán Chạy (Horizontal Bar Chart)
  useEffect(() => {
    if (bestsellerVaccines && Object.keys(bestsellerVaccines).length > 0) {
      const labels = Object.keys(bestsellerVaccines);
      const data = Object.values(bestsellerVaccines);
      setBestVaccineChartData({
        labels,
        datasets: [
          {
            label: "Số lần đặt",
            data,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    } else {
      setBestVaccineChartData(null);
    }
  }, [bestsellerVaccines]);

  // Cập nhật dữ liệu cho biểu đồ Thu Nhập kết hợp Bar và Line
  // Theo thứ tự thời gian: "Năm" → "Tháng" → "Tuần" → "Hôm nay"
  useEffect(() => {
    setIncomeMixedData({
      labels: ["Năm", "Tháng", "Tuần", "Hôm nay"],
      datasets: [
        {
          type: "bar",
          label: "Thu nhập (Cột)",
          data: [incomeYear, incomeMonth, incomeWeek, incomeToday],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          maxBarThickness: 30, // điều chỉnh kích thước cột
        },
        {
          type: "line",
          label: "Xu hướng thu nhập (Đường)",
          data: [incomeYear, incomeMonth, incomeWeek, incomeToday],
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
        },
      ],
    });
  }, [incomeToday, incomeWeek, incomeMonth, incomeYear]);

  // Cấu hình Timeline cho lịch tiêm hôm nay
  const timelineGroups = [{ id: 1, title: "Lịch Tiêm Hôm Nay" }];
  const timelineItems = bookingsToday.map((booking, index) => {
    const start = new Date(booking.bookingDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return {
      id: index,
      group: 1,
      title: booking.status,
      start_time: start,
      end_time: end,
    };
  });

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
          Bảng điều khiển Admin
        </h2>

        {/* Biểu đồ Thu Nhập kết hợp Bar và Line */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Biểu đồ Thu Nhập
          </h3>
          {incomeMixedData && (
            <Bar
              data={incomeMixedData}
              options={{
                responsive: true,
                scales: { x: { beginAtZero: true } },
              }}
            />
          )}
        </div>

        {/* Biểu đồ Lịch Tiêm Hôm Nay (Timeline) */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Biểu đồ Lịch Tiêm Hôm Nay
          </h3>
          <Timeline
            groups={timelineGroups}
            items={timelineItems}
            defaultTimeStart={new Date(new Date().setHours(0, 0, 0, 0))}
            defaultTimeEnd={new Date(new Date().setHours(23, 59, 59, 999))}
            canMove={false}
            canResize={false}
          />
        </div>

        {/* Card thông tin Vaccine Hết Hàng và Vaccine Hết Hạn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div
            onClick={() =>
              openModal(
                outOfStockVaccines
                  .map((v) => `Vaccine hết hàng: ${v.name}`)
                  .join("\n")
              )
            }
            className="bg-white rounded-xl shadow-md p-4 transition-all hover:scale-105 hover:shadow-xl border border-gray-100 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-blue-700 flex items-center">
              <FaVial className="mr-2 text-red-500" /> Vaccine Hết Hàng
            </h3>
            <p className="text-gray-600">{outOfStockVaccines.length} vaccine</p>
          </div>
          <div
            onClick={() =>
              openModal(
                expiredVaccines
                  .map((v) => `Vaccine hết hạn: ${v.name}`)
                  .join("\n")
              )
            }
            className="bg-white rounded-xl shadow-md p-4 transition-all hover:scale-105 hover:shadow-xl border border-gray-100 cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-blue-700 flex items-center">
              <FaVial className="mr-2 text-red-500" /> Vaccine Hết Hạn
            </h3>
            <p className="text-gray-600">{expiredVaccines.length} vaccine</p>
          </div>
        </div>

        {/* Biểu đồ Vaccine Bán Chạy (Horizontal Bar Chart) */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Biểu đồ Vaccine Bán Chạy
          </h3>
          {bestVaccineChartData && (
            <Bar
              data={bestVaccineChartData}
              options={{
                indexAxis: "y",
                responsive: true,
                scales: { x: { beginAtZero: true } },
                datasets: {
                  bar: {
                    maxBarThickness: 25, // điều chỉnh giá trị theo mong muốn
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Modal hiển thị chi tiết */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Chi tiết</h2>
            <p className="text-gray-700 whitespace-pre-line">{modalContent}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
