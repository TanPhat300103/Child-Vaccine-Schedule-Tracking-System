// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  format,
  parseISO,
  addDays,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

// Import và đăng ký các thành phần cần thiết của Chart.js
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatPrice = (price) =>
  price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) ||
  "0 VND";

// Hàm aggregatePayments: nhóm dữ liệu payments theo ngày (hoặc theo tháng nếu cần)
const aggregatePayments = (payments, fromDate, toDate, groupBy = "day") => {
  let labels = [];
  if (groupBy === "day") {
    const totalDays = differenceInCalendarDays(toDate, fromDate) + 1;
    for (let i = 0; i < totalDays; i++) {
      labels.push(format(addDays(fromDate, i), "dd-MM"));
    }
  } else if (groupBy === "month") {
    labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  }
  const incomeMap = {};
  labels.forEach((label) => {
    incomeMap[label] = 0;
  });
  payments.forEach((payment) => {
    const pDate = parseISO(payment.date);
    if (pDate >= fromDate && pDate <= toDate) {
      if (groupBy === "day") {
        const label = format(pDate, "dd-MM");
        if (incomeMap[label] !== undefined) {
          incomeMap[label] += payment.total;
        }
      } else if (groupBy === "month") {
        const label = format(pDate, "MMM");
        if (incomeMap[label] !== undefined) {
          incomeMap[label] += payment.total;
        }
      }
    }
  });
  const data = labels.map((label) => incomeMap[label]);
  return { labels, data };
};

const Dashboard = () => {
  // Stats
  const [incomeToday, setIncomeToday] = useState(0);
  const [incomeWeek, setIncomeWeek] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(0);
  const [incomeYear, setIncomeYear] = useState(0);

  // Payment data (danh sách payment)
  const [payments, setPayments] = useState([]);

  // Aggregated data cho biểu đồ
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loadingLineChart, setLoadingLineChart] = useState(false);

  // Thời gian cho biểu đồ: mặc định là 30 ngày trước đến hôm nay
  const [customRange, setCustomRange] = useState({
    from: format(addDays(new Date(), -29), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  // Dữ liệu khác
  const [bookingsToday, setBookingsToday] = useState([]);
  const [bestsellerVaccines, setBestsellerVaccines] = useState({});
  const [outOfStockVaccines, setOutOfStockVaccines] = useState([]);
  const [expiredVaccines, setExpiredVaccines] = useState([]);

  // Modal dùng chung
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Modal cho biểu đồ phóng to & custom range
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [customRangeTemp, setCustomRangeTemp] = useState({ from: "", to: "" });

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchAllPayments();
    fetchStats();
    fetchBookingsToday();
    fetchOutOfStockAndExpired();
    fetchBestsellerVaccines();
  }, []);

  const fetchAllPayments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/payment");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const resToday = await axios.get(
        `http://localhost:8080/admin/incomebydate?date=${todayStr}`
      );
      setIncomeToday(resToday.data);

      const resWeek = await axios.get(
        `http://localhost:8080/admin/incomebyweek?date=${todayStr}`
      );
      setIncomeWeek(resWeek.data);

      const resMonth = await axios.get(
        `http://localhost:8080/admin/incomebymonth?month=${month}&year=${year}`
      );
      setIncomeMonth(resMonth.data);

      const resYear = await axios.get(
        `http://localhost:8080/admin/incomebyyear?year=${year}`
      );
      setIncomeYear(resYear.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchBookingsToday = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/bookingtoday");
      setBookingsToday(res.data);
    } catch (err) {
      console.error("Error fetching bookings today:", err);
    }
  };

  const fetchOutOfStockAndExpired = async () => {
    try {
      const resOut = await axios.get(
        "http://localhost:8080/admin/vaccineoutofstock"
      );
      setOutOfStockVaccines(resOut.data);
      const resExp = await axios.get(
        "http://localhost:8080/admin/expiredvaccine"
      );
      setExpiredVaccines(resExp.data);
    } catch (err) {
      console.error("Error fetching vaccine info:", err);
    }
  };

  const fetchBestsellerVaccines = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/bestvaccine");
      setBestsellerVaccines(res.data);
    } catch (err) {
      console.error("Error fetching bestseller vaccines:", err);
    }
  };

  // Aggregate payments dựa theo customRange (mặc định là 30 ngày trước đến hôm nay)
  useEffect(() => {
    if (payments.length === 0) return;
    setLoadingLineChart(true);
    const fromDate = new Date(customRange.from);
    const toDate = new Date(customRange.to);
    // Với custom range, nhóm theo ngày
    const agg = aggregatePayments(payments, fromDate, toDate, "day");
    setAggregatedData(agg);
    setLoadingLineChart(false);
  }, [customRange, payments]);

  const lineChartData = useMemo(() => {
    if (!aggregatedData) return null;
    return {
      labels: aggregatedData.labels,
      datasets: [
        {
          label: "Thu nhập",
          data: aggregatedData.data,
          fill: false,
          borderColor: "rgba(75,192,192,1)",
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };
  }, [aggregatedData]);

  const lineChartOptions = {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0,0,0,0.1)" } },
    },
  };

  // Best Seller Vaccine: Top 3 (sắp xếp theo số lượt giảm dần)
  const bestSellerList = useMemo(() => {
    const entries = Object.entries(bestsellerVaccines);
    if (!entries.length) return [];
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 3);
  }, [bestsellerVaccines]);

  // Modal dùng chung
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  // Modal cho biểu đồ phóng to & custom range
  const openChartModal = () => {
    setCustomRangeTemp({ from: "", to: "" });
    setIsChartModalOpen(true);
  };
  const closeChartModal = () => {
    setIsChartModalOpen(false);
  };
  const applyCustomRange = () => {
    if (customRangeTemp.from && customRangeTemp.to) {
      setCustomRange(customRangeTemp);
      setIsChartModalOpen(false);
      // Hiển thị thông tin khoảng thời gian đã chọn trong modal (nếu cần)
      openModal(
        `Biểu đồ được cập nhật từ ngày ${customRangeTemp.from} đến ${customRangeTemp.to}`
      );
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 bg-blue-600 text-white rounded-xl mb-6">
          <h2 className="text-3xl font-bold">Bảng điều khiển Admin</h2>
          <p className="mt-2">Chào mừng bạn trở lại!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Hôm nay", value: incomeToday },
            { label: "Tuần này", value: incomeWeek },
            { label: "Tháng này", value: incomeMonth },
            { label: "Năm nay", value: incomeYear },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <h4 className="text-gray-500 font-semibold">{item.label}</h4>
              <span className="text-2xl font-bold text-gray-700 mt-2">
                {formatPrice(item.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content: Grid 4 cột */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Left Column (3/4 width): Line Chart 30 ngày */}
          <div
            className="md:col-span-3 bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={openChartModal}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Thu nhập 30 ngày
            </h3>
            {loadingLineChart && <p>Đang tải dữ liệu biểu đồ...</p>}
            {!loadingLineChart && lineChartData ? (
              <Line data={lineChartData} options={lineChartOptions} redraw />
            ) : (
              <p className="text-gray-500">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Right Column (1/4 width): Bookings Today & Top Vaccine Bán Chạy */}
          <div className="md:col-span-1 space-y-6">
            {/* Bookings Today */}
            <div className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Đặt Lịch Hôm Nay
              </h3>
              {bookingsToday.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {bookingsToday.map((b) => (
                    <li key={b.bookingId} className="flex justify-between">
                      <span>
                        {b.bookingId} - {b.customer?.firstName}{" "}
                        {b.customer?.lastName}
                      </span>
                      <span className="text-gray-500">
                        {b.status === 1 ? "Đang Xử Lý" : "Đã Thanh Toán"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  Không có đặt lịch nào hôm nay
                </p>
              )}
            </div>

            {/* Top Vaccine Bán Chạy */}
            <div className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Top Vaccine Bán Chạy
              </h3>
              {bestSellerList.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {bestSellerList.map(([name, count], idx) => (
                    <li
                      key={idx}
                      className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
                      onClick={() =>
                        openModal(
                          "Danh sách top 10 Vaccine bán chạy:\n" +
                            Object.entries(bestsellerVaccines)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 10)
                              .map(
                                ([vName, vCount], index) =>
                                  `${index + 1}. ${vName} - ${vCount}`
                              )
                              .join("\n")
                        )
                      }
                    >
                      <span className="font-bold">{name}</span> -{" "}
                      <span>{count} lượt</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
              )}
            </div>
          </div>
        </div>

        {/* Second Row: Vaccine Hết Hàng & Vaccine Hết Hạn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Vaccine Hết Hàng
            </h3>
            <p className="text-gray-600 mb-2">
              Số lượng: {outOfStockVaccines.length}
            </p>
            <button
              onClick={() =>
                openModal(outOfStockVaccines.map((v) => v.name).join(", "))
              }
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
              Xem chi tiết
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Vaccine Hết Hạn
            </h3>
            <p className="text-gray-600 mb-2">
              Số lượng: {expiredVaccines.length}
            </p>
            <button
              onClick={() =>
                openModal(expiredVaccines.map((v) => v.name).join(", "))
              }
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* Modal cho biểu đồ phóng to & custom range */}
      {isChartModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-2xl relative">
            <button
              onClick={() => setIsChartModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Phóng to biểu đồ
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Từ ngày</label>
              <input
                type="date"
                value={customRangeTemp.from}
                onChange={(e) =>
                  setCustomRangeTemp((prev) => ({
                    ...prev,
                    from: e.target.value,
                  }))
                }
                className="border rounded w-full p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Đến ngày</label>
              <input
                type="date"
                value={customRangeTemp.to}
                onChange={(e) =>
                  setCustomRangeTemp((prev) => ({
                    ...prev,
                    to: e.target.value,
                  }))
                }
                className="border rounded w-full p-2"
              />
            </div>
            <button
              onClick={applyCustomRange}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
              Áp dụng
            </button>
            {lineChartData && (
              <div className="mt-6">
                <Line data={lineChartData} options={lineChartOptions} redraw />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal dùng chung */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Chi tiết</h2>
            <pre className="text-gray-700 whitespace-pre-line">
              {modalContent}
            </pre>
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
