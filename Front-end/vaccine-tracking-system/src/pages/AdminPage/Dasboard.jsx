import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Hàm aggregatePayments: nhóm payment theo ngày và chỉ lấy payment có status = true
const aggregatePayments = (payments, fromDate, toDate) => {
  const totalDays = differenceInCalendarDays(toDate, fromDate) + 1;
  const labels = [];
  for (let i = 0; i < totalDays; i++) {
    labels.push(format(addDays(fromDate, i), "dd/MM"));
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
        const label = format(pDate, "dd/MM");
        if (incomeMap[label] !== undefined) {
          incomeMap[label] += payment.total;
        }
      }
    }
  });
  const data = labels.map((label) => incomeMap[label]);
  return { labels, data };
};

// Component con cho card số liệu thống kê
const StatCard = ({ title, value, prevValue, icon }) => {
  const percentageChange =
    prevValue === 0
      ? value > 0
        ? 100
        : 0
      : ((value - prevValue) / prevValue) * 100;

  const isIncrease = percentageChange >= 0;

  // Format phần trăm: nếu > 999.9%, hiển thị dạng "999.9%+"
  const formattedPercentage =
    Math.abs(percentageChange) > 999.9
      ? "999.9%+"
      : `${Math.abs(percentageChange).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center hover:shadow-lg transition-all duration-300 border-l-4 border-teal-500 min-w-0">
      <div className="bg-teal-100 p-3 rounded-full mr-4">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-gray-500 font-medium text-sm truncate">{title}</h4>
        <div className="flex items-center mt-2">
          <span
            className={`text-xl font-bold ${
              isIncrease ? "text-green-600" : "text-red-600"
            }`}
          >
            {isIncrease ? "+" : ""}
            {formattedPercentage}
          </span>
          <span
            className={`ml-1 ${
              isIncrease ? "text-green-600" : "text-red-600"
            } text-lg`}
          >
            {isIncrease ? "▲" : "▼"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Component con cho card thông tin
const InfoCard = ({ title, children, onClick, icon, badgeCount, badgeColor }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow p-5 ${
        onClick ? "cursor-pointer" : ""
      } hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2 text-teal-600">{icon}</span>
          {title}
        </h3>
        {badgeCount !== undefined && (
          <span
            className={`${badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}
          >
            {badgeCount}
          </span>
        )}
      </div>
      {children}
    </div>
  );
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

  // Các dữ liệu khác
  const [bookingsToday, setBookingsToday] = useState([]);
  const [bestsellerVaccines, setBestsellerVaccines] = useState({});
  const [outOfStockVaccines, setOutOfStockVaccines] = useState([]);
  const [expiredVaccines, setExpiredVaccines] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({ pending: 0, completed: 0 });

  // States cho modal
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [topVaccineModalOpen, setTopVaccineModalOpen] = useState(false);
  const [outOfStockModalOpen, setOutOfStockModalOpen] = useState(false);
  const [expiredModalOpen, setExpiredModalOpen] = useState(false);

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

  // Tính toán số lượng booking theo trạng thái
  useEffect(() => {
    if (bookingsToday.length > 0) {
      const pending = bookingsToday.filter((b) => b.status === 0).length;
      const completed = bookingsToday.filter((b) => b.status === 1).length;
      setBookingCounts({ pending, completed });
    }
  }, [bookingsToday]);

  const fetchAllPayments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/payment", {
        withCredentials: true,
      });
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
        `http://localhost:8080/admin/incomebydate?date=${todayStr}`,
        { withCredentials: true }
      );
      setIncomeToday(resToday.data);

      const resWeek = await axios.get(
        `http://localhost:8080/admin/incomebyweek?date=${todayStr}`,
        { withCredentials: true }
      );
      setIncomeWeek(resWeek.data);

      const resMonth = await axios.get(
        `http://localhost:8080/admin/incomebymonth?month=${month}&year=${year}`,
        { withCredentials: true }
      );
      setIncomeMonth(resMonth.data);

      const resYear = await axios.get(
        `http://localhost:8080/admin/incomebyyear?year=${year}`,
        { withCredentials: true }
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
        { withCredentials: true }
      );
      setIncomeYesterday(resYesterday.data);

      const resLastWeek = await axios.get(
        `http://localhost:8080/admin/incomebyweek?date=${lastWeekStr}`,
        { withCredentials: true }
      );
      setIncomeLastWeek(resLastWeek.data);

      const resLastMonth = await axios.get(
        `http://localhost:8080/admin/incomebymonth?month=${
          lastMonth.getMonth() + 1
        }&year=${lastMonth.getFullYear()}`,
        { withCredentials: true }
      );
      setIncomeLastMonth(resLastMonth.data);

      const resLastYear = await axios.get(
        `http://localhost:8080/admin/incomebyyear?year=${lastYear.getFullYear()}`,
        { withCredentials: true }
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
        { withCredentials: true }
      );
      setOutOfStockVaccines(resOut.data);

      const resExp = await axios.get(
        "http://localhost:8080/admin/expiredvaccine",
        { withCredentials: true }
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

  // Xử lý Best Seller Vaccine
  const sortedVaccineEntries = useMemo(() => {
    const entries = Object.entries(bestsellerVaccines);
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [bestsellerVaccines]);

  const top3Vaccine = sortedVaccineEntries.slice(0, 3);
  const top10Vaccine = sortedVaccineEntries.slice(0, 10);

  // Chart Data
  const lineChartData = useMemo(() => {
    if (!aggregatedData) return null;
    return {
      labels: aggregatedData.labels,
      datasets: [
        {
          label: "Thu nhập",
          data: aggregatedData.data,
          fill: true,
          backgroundColor: "rgba(56, 178, 172, 0.2)",
          borderColor: "rgba(56, 178, 172, 1)",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "rgba(56, 178, 172, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [aggregatedData]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatPrice(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + " triệu";
            }
            return value.toLocaleString("vi-VN");
          },
        },
      },
    },
  };

  const donutChartData = {
    labels: ["Đang chờ xử lý", "Đã hoàn thành"],
    datasets: [
      {
        data: [bookingCounts.pending, bookingCounts.completed],
        backgroundColor: ["#f59e0b", "#10b981"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
        hoverOffset: 5,
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
    },
  };

  const barChartData = {
    labels: top3Vaccine.map(([name]) => name),
    datasets: [
      {
        label: "Số lượng",
        data: top3Vaccine.map(([, count]) => count),
        backgroundColor: ["#38b2ac", "#3182ce", "#805ad5"],
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        beginAtZero: true,
      },
    },
  };

  // Hàm xử lý khi nhấn nút "Áp dụng"
  const handleApply = () => {
    setCustomRange({ ...tempRange });
  };

  // Biểu tượng SVG cho các card
  const icons = {
    today: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-teal-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    week: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-teal-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    month: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-teal-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    year: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-teal-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
    booking: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    vaccine: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    expired: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  // Hàm format status booking
  const formatBookingStatus = (status) => {
    if (status === 0)
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Đang xử lý
        </span>
      );
    if (status === 1)
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Đã hoàn thành
        </span>
      );
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
        Không xác định
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Trang Quản Trị Trung Tâm Tiêm Chủng
              </h1>
              <p className="text-teal-100 mt-1">
                {format(new Date(), "EEEE, dd/MM/yyyy")}
              </p>
            </div>
            <div className="bg-teal-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Thu nhập hôm nay"
            value={incomeToday}
            prevValue={incomeYesterday}
            icon={icons.today}
          />
          <StatCard
            title="Thu nhập tuần này"
            value={incomeWeek}
            prevValue={incomeLastWeek}
            icon={icons.week}
          />
          <StatCard
            title="Thu nhập tháng này"
            value={incomeMonth}
            prevValue={incomeLastMonth}
            icon={icons.month}
          />
          <StatCard
            title="Thu nhập năm nay"
            value={incomeYear}
            prevValue={incomeLastYear}
            icon={icons.year}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biểu đồ thu nhập */}
          <div className="lg:col-span-2">
            <InfoCard title="Thống kê thu nhập" icon={icons.month}>
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={tempRange.from}
                    onChange={(e) =>
                      setTempRange((prev) => ({ ...prev, from: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={tempRange.to}
                    onChange={(e) =>
                      setTempRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors duration-300 mt-6 md:mt-0"
                >
                  Áp dụng
                </button>
              </div>

              <div className="h-64 lg:h-80">
                {loadingLineChart ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : aggregatedData ? (
                  <Line data={lineChartData} options={lineChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
                  </div>
                )}
              </div>
            </InfoCard>

            {/* Vaccine hết hàng và hết hạn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <InfoCard
                title="Vaccine hết hàng"
                icon={icons.warning}
                badgeCount={outOfStockVaccines.length}
                badgeColor="bg-red-500"
                onClick={() => setOutOfStockModalOpen(true)}
              >
                <div className="space-y-2">
                  {outOfStockVaccines.length === 0 ? (
                    <p className="text-gray-500 text-sm">Không có vaccine nào hết hàng</p>
                  ) : (
                    <ul className="space-y-2">
                      {outOfStockVaccines.slice(0, 3).map((vaccine, idx) => (
                        <li
                          key={idx}
                          className="flex items-center p-2 bg-red-50 rounded-lg"
                        >
                          <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                          <span className="text-sm">{vaccine.name}</span>
                        </li>
                      ))}
                      {outOfStockVaccines.length > 3 && (
                        <button
                          className="text-sm text-teal-600 hover:text-teal-800"
                          onClick={() => setOutOfStockModalOpen(true)}
                        >
                          Xem thêm...
                        </button>
                      )}
                    </ul>
                  )}
                </div>
              </InfoCard>
              <InfoCard
                title="Vaccine hết hạn"
                icon={icons.expired}
                badgeCount={expiredVaccines.length}
                badgeColor="bg-yellow-500"
                onClick={() => setExpiredModalOpen(true)}
              >
                <div className="space-y-2">
                  {expiredVaccines.length === 0 ? (
                    <p className="text-gray-500 text-sm">Không có vaccine nào hết hạn</p>
                  ) : (
                    <ul className="space-y-2">
                      {expiredVaccines.slice(0, 3).map((vaccine, idx) => (
                        <li
                          key={idx}
                          className="flex items-center p-2 bg-yellow-50 rounded-lg"
                        >
                          <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                          <span className="text-sm">{vaccine.name}</span>
                        </li>
                      ))}
                      {expiredVaccines.length > 3 && (
                        <button
                          className="text-sm text-teal-600 hover:text-teal-800"
                          onClick={() => setExpiredModalOpen(true)}
                        >
                          Xem thêm...
                        </button>
                      )}
                    </ul>
                  )}
                </div>
              </InfoCard>
            </div>
          </div>

          {/* Cột bên phải: Đặt lịch hôm nay & Top vaccine */}
          <div className="lg:col-span-1 space-y-6">
            <InfoCard
              title="Đặt lịch hôm nay"
              icon={icons.booking}
              badgeCount={bookingsToday.length}
              badgeColor="bg-blue-500"
              onClick={() => setBookingsModalOpen(true)}
            >
              <div className="space-y-2">
                {bookingsToday.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {bookingsToday.slice(0, 5).map((b) => (
                      <li key={b.bookingId} className="flex justify-between">
                        <span>
                          {b.bookingId} - {b.customer?.firstName}{" "}
                          {b.customer?.lastName}
                        </span>
                        {formatBookingStatus(b.status)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Không có đặt lịch nào hôm nay
                  </p>
                )}
              </div>
              {bookingsToday.length > 5 && (
                <button
                  className="text-sm text-teal-600 hover:text-teal-800 mt-2"
                  onClick={() => setBookingsModalOpen(true)}
                >
                  Xem thêm...
                </button>
              )}
            </InfoCard>
            <InfoCard
              title="Top vaccine bán chạy"
              icon={icons.vaccine}
              badgeCount={top3Vaccine.length}
              badgeColor="bg-green-500"
              onClick={() => setTopVaccineModalOpen(true)}
            >
              <div className="space-y-2 text-sm">
                {top3Vaccine.length > 0 ? (
                  <ul className="space-y-2">
                    {top3Vaccine.map(([name, count], idx) => (
                      <li key={idx} className="p-2 bg-green-50 rounded-lg">
                        <span className="font-medium">{name}</span> - {count}{" "}
                        lượt
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Chưa có dữ liệu</p>
                )}
              </div>
              {top10Vaccine.length > 3 && (
                <button
                  className="text-sm text-teal-600 hover:text-teal-800 mt-2"
                  onClick={() => setTopVaccineModalOpen(true)}
                >
                  Xem thêm...
                </button>
              )}
            </InfoCard>
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
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bookingsToday.map((b) => (
                <div
                  key={b.bookingId}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <span>
                    {b.bookingId} - {b.customer?.firstName}{" "}
                    {b.customer?.lastName}
                  </span>
                  {formatBookingStatus(b.status)}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setBookingsModalOpen(false)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
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
            {top10Vaccine.length > 0 ? (
              <Bar
                data={{
                  labels: top10Vaccine.map(([name]) => name),
                  datasets: [
                    {
                      label: "Số lượng",
                      data: top10Vaccine.map(([, count]) => count),
                      backgroundColor: "rgba(56, 178, 172, 0.6)",
                      borderColor: "rgba(56, 178, 172, 1)",
                      borderWidth: 1,
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: false } },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center">Chưa có dữ liệu</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setTopVaccineModalOpen(false)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cho Vaccine Hết Hàng */}
      {outOfStockModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative">
            <button
              onClick={() => setOutOfStockModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Vaccine Hết Hàng
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {outOfStockVaccines.length > 0 ? (
                <ul className="space-y-2">
                  {outOfStockVaccines.map((vaccine, idx) => (
                    <li
                      key={idx}
                      className="flex items-center p-2 bg-red-50 rounded-lg"
                    >
                      <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-sm">{vaccine.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">
                  Không có vaccine nào hết hàng
                </p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOutOfStockModalOpen(false)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cho Vaccine Hết Hạn */}
      {expiredModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md relative">
            <button
              onClick={() => setExpiredModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Vaccine Hết Hạn
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {expiredVaccines.length > 0 ? (
                <ul className="space-y-2">
                  {expiredVaccines.map((vaccine, idx) => (
                    <li
                      key={idx}
                      className="flex items-center p-2 bg-yellow-50 rounded-lg"
                    >
                      <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                      <span className="text-sm">{vaccine.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">
                  Không có vaccine nào hết hạn
                </p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setExpiredModalOpen(false)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
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