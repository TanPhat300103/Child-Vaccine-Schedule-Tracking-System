// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  format,
  parseISO,
  addDays,
  differenceInCalendarDays,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from "date-fns";

// Import và đăng ký các thành phần của Chart.js
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

// Hàm aggregatePayments: nhóm payment theo ngày và chỉ lấy payment có status = true
const aggregatePayments = (payments, fromDate, toDate) => {
  const totalDays = differenceInCalendarDays(toDate, fromDate) + 1;
  const labels = [];
  for (let i = 0; i < totalDays; i++) {
    labels.push(format(addDays(fromDate, i), "dd-MM"));
  }
  const incomeMap = {};
  labels.forEach((label) => {
    incomeMap[label] = 0;
  });
  const paymentsArray = Array.isArray(payments) ? payments : [payments];
  paymentsArray.forEach((payment) => {
    if (payment.status === true) {
      const pDate = parseISO(payment.date);
      if (pDate >= fromDate && pDate <= toDate) {
        const label = format(pDate, "dd-MM");
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
  // Stats hiện tại
  const [incomeToday, setIncomeToday] = useState(0);
  const [incomeWeek, setIncomeWeek] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(0);
  const [incomeYear, setIncomeYear] = useState(0);

  // Stats kỳ trước để so sánh
  const [incomeYesterday, setIncomeYesterday] = useState(0);
  const [incomeLastWeek, setIncomeLastWeek] = useState(0);
  const [incomeLastMonth, setIncomeLastMonth] = useState(0);
  const [incomeLastYear, setIncomeLastYear] = useState(0);

  // Payment data
  const [payments, setPayments] = useState([]);

  // Aggregated data cho Line Chart
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loadingLineChart, setLoadingLineChart] = useState(false);

  // Custom date range (mặc định: 30 ngày trước đến hôm nay)
  const [customRange, setCustomRange] = useState({
    from: format(addDays(new Date(), -29), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  // State tạm thời cho input
  const [tempRange, setTempRange] = useState({
    from: format(addDays(new Date(), -29), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  // Theo dõi giá trị customRange trước đó bằng useRef
  const prevCustomRange = useRef(customRange);

  // Các dữ liệu khác
  const [bookingsToday, setBookingsToday] = useState([]);
  const [bestsellerVaccines, setBestsellerVaccines] = useState({});
  const [outOfStockVaccines, setOutOfStockVaccines] = useState([]);
  const [expiredVaccines, setExpiredVaccines] = useState([]);

  // States cho modal
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [topVaccineModalOpen, setTopVaccineModalOpen] = useState(false);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchAllPayments();
    fetchStats();
    fetchBookingsToday();
    fetchOutOfStockAndExpired();
    fetchBestsellerVaccines();
    fetchComparisonStats();
  }, []);

  // Aggregate payments khi customRange hoặc payments thay đổi
  useEffect(() => {
    if (payments.length > 0) {
      setLoadingLineChart(true);
      const fromDate = new Date(customRange.from);
      const toDate = new Date(customRange.to);
      const agg = aggregatePayments(payments, fromDate, toDate);
      setAggregatedData(agg);
      setLoadingLineChart(false);
    }
  }, [payments, customRange]);

  const fetchAllPayments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/payment", {
        withCredentials: true,
      });

      console.log("response la: ", res.data);

      setPayments(res.data);
      console.log("payment la: ", payments);
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
        `http://localhost:8080/admin/incomebydate?date=${todayStr}`,
        {
          withCredentials: true,
        }
      );
      setIncomeToday(resToday.data);

      const resWeek = await axios.get(
        `http://localhost:8080/admin/incomebyweek?date=${todayStr}`,
        {
          withCredentials: true,
        }
      );
      setIncomeWeek(resWeek.data);

      const resMonth = await axios.get(
        `http://localhost:8080/admin/incomebymonth?month=${month}&year=${year}`,
        {
          withCredentials: true,
        }
      );
      setIncomeMonth(resMonth.data);

      const resYear = await axios.get(
        `http://localhost:8080/admin/incomebyyear?year=${year}`,
        {
          withCredentials: true,
        }
      );
      setIncomeYear(resYear.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchComparisonStats = async () => {
    try {
      const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");
      const lastWeekStr = format(subWeeks(new Date(), 1), "yyyy-MM-dd");
      const lastMonth = subMonths(new Date(), 1);
      const lastYear = subYears(new Date(), 1);

      const resYesterday = await axios.get(
        `http://localhost:8080/admin/incomebydate?date=${yesterdayStr}`,
        {
          withCredentials: true,
        }
      );
      setIncomeYesterday(resYesterday.data);

      const resLastWeek = await axios.get(
        `http://localhost:8080/admin/incomebyweek?date=${lastWeekStr}`,
        {
          withCredentials: true,
        }
      );
      setIncomeLastWeek(resLastWeek.data);

      const resLastMonth = await axios.get(
        `http://localhost:8080/admin/incomebymonth?month=${
          lastMonth.getMonth() + 1
        }&year=${lastMonth.getFullYear()}`,
        {
          withCredentials: true,
        }
      );
      setIncomeLastMonth(resLastMonth.data);

      const resLastYear = await axios.get(
        `http://localhost:8080/admin/incomebyyear?year=${lastYear.getFullYear()}`,
        {
          withCredentials: true,
        }
      );
      setIncomeLastYear(resLastYear.data);
    } catch (err) {
      console.error("Error fetching comparison stats:", err);
    }
  };

  const fetchBookingsToday = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/bookingtoday", {
        withCredentials: true,
      });
      if (!Array.isArray(res.data)) {
        throw new Error("Dữ liệu nhận được không phải là mảng");
      }
      setBookingsToday(res.data);
    } catch (err) {
      console.error("Error fetching bookings today:", err);
    }
  };

  const fetchOutOfStockAndExpired = async () => {
    try {
      const resOut = await axios.get(
        "http://localhost:8080/admin/vaccineoutofstock",
        {
          withCredentials: true,
        }
      );
      setOutOfStockVaccines(resOut.data);
      const resExp = await axios.get(
        "http://localhost:8080/admin/expiredvaccine",
        {
          withCredentials: true,
        }
      );
      setExpiredVaccines(resExp.data);
    } catch (err) {
      console.error("Error fetching vaccine info:", err);
    }
  };

  const fetchBestsellerVaccines = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/bestvaccine", {
        withCredentials: true,
      });
      setBestsellerVaccines(res.data);
    } catch (err) {
      console.error("Error fetching bestseller vaccines:", err);
    }
  };

  // Hàm tính phần trăm thay đổi
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

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

  // Xử lý Best Seller Vaccine
  const sortedVaccineEntries = useMemo(() => {
    const entries = Object.entries(bestsellerVaccines);
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [bestsellerVaccines]);
  const top3Vaccine = sortedVaccineEntries.slice(0, 3);
  const top10Vaccine = sortedVaccineEntries.slice(0, 10);

  const generateBarChartData = (dataArray) => ({
    labels: dataArray.map(([name]) => name),
    datasets: [
      {
        label: "Số lượt",
        data: dataArray.map(([, count]) => count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  });

  // Hàm xử lý khi nhấn nút "Áp dụng"
  const handleApply = () => {
    setCustomRange({ ...tempRange });
    // Tính toán ngay với giá trị mới của tempRange
    const fromDate = new Date(tempRange.from);
    const toDate = new Date(tempRange.to);
    const agg = aggregatePayments(payments, fromDate, toDate);
    setAggregatedData(agg);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 bg-blue-600 text-white rounded-xl mb-6">
          <h2 className="text-3xl font-bold">Bảng điều khiển Admin</h2>
          <p className="mt-2">Chào mừng bạn trở lại!</p>
        </div>

        {/* Stats Cards với mũi tên và phần trăm thay đổi */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Hôm nay", value: incomeToday, prev: incomeYesterday },
            { label: "Tuần này", value: incomeWeek, prev: incomeLastWeek },
            { label: "Tháng này", value: incomeMonth, prev: incomeLastMonth },
            { label: "Năm nay", value: incomeYear, prev: incomeLastYear },
          ].map((item, idx) => {
            const percentageChange = calculatePercentageChange(
              item.value,
              item.prev
            );
            const isIncrease = percentageChange >= 0;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <h4 className="text-gray-500 font-semibold">{item.label}</h4>
                <span className="text-2xl font-bold text-gray-700 mt-2">
                  {formatPrice(item.value)}
                </span>
                <div className="flex items-center mt-2">
                  {isIncrease ? (
                    <span className="text-green-500">▲</span>
                  ) : (
                    <span className="text-red-500">▼</span>
                  )}
                  <span
                    className={`ml-1 ${
                      isIncrease ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(percentageChange).toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content: Line Chart (3/4) và Right Column (1/4) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Line Chart với custom range inputs */}
          <div className="md:col-span-3 bg-white rounded-xl shadow p-4">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={tempRange.from}
                  onChange={(e) =>
                    setTempRange((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="border rounded w-full p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={tempRange.to}
                  onChange={(e) =>
                    setTempRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="border rounded w-full p-2"
                />
              </div>
              <button
                onClick={handleApply}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Áp dụng
              </button>
            </div>
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Thu nhập từ {customRange.from} đến {customRange.to}
            </h3>
            {loadingLineChart && <p>Đang tải dữ liệu biểu đồ...</p>}
            {!loadingLineChart && aggregatedData ? (
              <Line data={lineChartData} options={lineChartOptions} redraw />
            ) : (
              !loadingLineChart && <p>Chưa có dữ liệu để hiển thị</p>
            )}
          </div>

          {/* Right Column: Đặt Lịch Hôm Nay & Top Vaccine */}
          <div className="md:col-span-1 space-y-6">
            <div
              onClick={() => setBookingsModalOpen(true)}
              className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Đặt Lịch Hôm Nay
              </h3>

              {bookingsToday.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {Array.isArray(bookingsToday) &&
                    bookingsToday.slice(0, 5).map((b) => (
                      <li key={b.bookingId} className="flex justify-between">
                        <span>
                          {b.bookingId} - {b.customer?.firstName}{" "}
                          {b.customer?.lastName}
                        </span>
                        <span className="text-gray-500">
                          {b.status === 0 ? "Đang Xử Lý" : "Đã Thanh Toán"}
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
            <div
              onClick={() => setTopVaccineModalOpen(true)}
              className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Top Vaccine Bán Chạy
              </h3>
              {top3Vaccine && top3Vaccine.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {top3Vaccine.map(([name, count], idx) => (
                    <li key={idx} className="p-2 bg-blue-50 rounded">
                      <span className="font-bold">{name}</span> - {count} lượt
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
            <p className="text-gray-700 text-sm">
              {Array.isArray(outOfStockVaccines)
                ? outOfStockVaccines.map((v) => v.name).join(", ")
                : "Không có vaccine hết hàng"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Vaccine Hết Hạn
            </h3>
            <p className="text-gray-600 mb-2">
              Số lượng: {expiredVaccines.length}
            </p>
            <p className="text-gray-700 text-sm">
              {Array.isArray(expiredVaccines)
                ? expiredVaccines.map((v) => v.name).join(", ")
                : "Không có vaccine hết hạn"}
            </p>
          </div>
        </div>
      </div>

      {/* Modal cho Bookings Today */}
      {bookingsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative">
            <button
              onClick={() => setBookingsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Đặt Lịch Hôm Nay
            </h2>
            <pre className="text-gray-700 whitespace-pre-line">
              {bookingsToday
                .map(
                  (b) =>
                    `${b.bookingId} - ${b.customer?.firstName} ${
                      b.customer?.lastName
                    } (${b.status === 1 ? "Đang Xử Lý" : "Đã Thanh Toán"})`
                )
                .join("\n")}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setBookingsModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cho Top Vaccine */}
      {topVaccineModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-2xl relative">
            <button
              onClick={() => setTopVaccineModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Top 10 Vaccine Bán Chạy
            </h2>
            {top10Vaccine && top10Vaccine.length > 0 ? (
              <Bar
                data={generateBarChartData(top10Vaccine)}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: false } },
                  },
                }}
                redraw
              />
            ) : (
              <p className="text-gray-500">Chưa có dữ liệu</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setTopVaccineModalOpen(false)}
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
