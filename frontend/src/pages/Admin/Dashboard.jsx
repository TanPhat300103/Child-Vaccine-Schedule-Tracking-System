import React, { useState, useEffect, useMemo } from "react";
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
import { useAuth } from "../../components/AuthContext";
import "../../style/Dashboard.css"; // Import the CSS file

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

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace("₫", "VNĐ"); // Thay "₫" bằng "VNĐ"

const StatCard = ({ title, value, prevValue, icon }) => {
  const percentageChange =
    prevValue === 0
      ? value > 0
        ? 100
        : 0
      : ((value - prevValue) / prevValue) * 100;
  const isIncrease = percentageChange >= 0;
  const formattedPercentage =
    Math.abs(percentageChange) > 999.9
      ? "999.9%+"
      : `${Math.abs(percentageChange).toFixed(1)}%`;

  return (
    <div className="stat-card-container-dashboard">
      <div className="stat-card-dashboard">
        <div className="stat-icon-dashboard">{icon}</div>
        <div className="stat-content-dashboard">
          <h4 className="stat-title-dashboard">{title}</h4>
          <div className="stat-income-dashboard">{formatPrice(value)}</div>
          <div className="stat-value-dashboard">
            <span
              className={`stat-percentage-dashboard ${
                isIncrease
                  ? "stat-percentage-increase-dashboard"
                  : "stat-percentage-decrease-dashboard"
              }`}
            >
              {isIncrease ? "+" : ""}
              {formattedPercentage}
            </span>
            <span
              className={`stat-arrow-dashboard ${
                isIncrease
                  ? "stat-arrow-increase-dashboard"
                  : "stat-arrow-decrease-dashboard"
              }`}
            >
              {isIncrease ? "▲" : "▼"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  children,
  onClick,
  icon,
  badgeCount,
  badgeColor,
}) => {
  return (
    <div
      onClick={onClick}
      className={`info-card-dashboard ${
        onClick ? "info-card-clickable-dashboard" : ""
      }`}
    >
      <div className="info-card-header-dashboard">
        <h3 className="info-card-title-dashboard">
          <span className="info-card-icon-dashboard">{icon}</span>
          {title}
        </h3>
        {badgeCount !== undefined && (
          <span className={`info-card-badge-dashboard ${badgeColor}-dashboard`}>
            {badgeCount}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

const Dashboard = () => {
  const [incomeToday, setIncomeToday] = useState(0);
  const [incomeWeek, setIncomeWeek] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(0);
  const [incomeYear, setIncomeYear] = useState(0);
  const [incomeYesterday, setIncomeYesterday] = useState(0);
  const [incomeLastWeek, setIncomeLastWeek] = useState(0);
  const [incomeLastMonth, setIncomeLastMonth] = useState(0);
  const [incomeLastYear, setIncomeLastYear] = useState(0);
  const [payments, setPayments] = useState([]);
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loadingLineChart, setLoadingLineChart] = useState(false);
  const [customRange, setCustomRange] = useState({
    from: format(addDays(new Date(), -29), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });
  const [tempRange, setTempRange] = useState({
    from: format(addDays(new Date(), -29), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });
  const [bookingsToday, setBookingsToday] = useState([]);
  const [bestsellerVaccines, setBestsellerVaccines] = useState({});
  const [outOfStockVaccines, setOutOfStockVaccines] = useState([]);
  const [expiredVaccines, setExpiredVaccines] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({
    pending: 0,
    completed: 0,
  });
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [topVaccineModalOpen, setTopVaccineModalOpen] = useState(false);
  const [outOfStockModalOpen, setOutOfStockModalOpen] = useState(false);
  const [expiredModalOpen, setExpiredModalOpen] = useState(false);

  useEffect(() => {
    fetchAllPayments();
    fetchStats();
    fetchBookingsToday();
    fetchOutOfStockAndExpired();
    fetchBestsellerVaccines();
    fetchComparisonStats();
  }, []);

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

  useEffect(() => {
    if (bookingsToday.length > 0) {
      const pending = bookingsToday.filter((b) => b.status === 0).length;
      const completed = bookingsToday.filter((b) => b.status === 1).length;
      setBookingCounts({ pending, completed });
    }
  }, [bookingsToday]);

  const fetchAllPayments = async () => {
    try {
      const res = await fetch("http://localhost:8080/payment", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data);
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

      const resToday = await fetch(
        `http://localhost:8080/admin/incomebydate?date=${todayStr}`,
        { credentials: "include" }
      );
      setIncomeToday(await resToday.json());

      const resWeek = await fetch(
        `http://localhost:8080/admin/incomebyweek?date=${todayStr}`,
        { credentials: "include" }
      );
      setIncomeWeek(await resWeek.json());

      const resMonth = await fetch(
        `http://localhost:8080/admin/incomebymonth?month=${month}&year=${year}`,
        { credentials: "include" }
      );
      setIncomeMonth(await resMonth.json());

      const resYear = await fetch(
        `http://localhost:8080/admin/incomebyyear?year=${year}`,
        { credentials: "include" }
      );
      setIncomeYear(await resYear.json());
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

      const resYesterday = await fetch(
        `http://localhost:8080/admin/incomebydate?date=${yesterdayStr}`,
        { credentials: "include" }
      );
      setIncomeYesterday(await resYesterday.json());

      const resLastWeek = await fetch(
        `http://localhost:8080/admin/incomebyweek?date=${lastWeekStr}`,
        { credentials: "include" }
      );
      setIncomeLastWeek(await resLastWeek.json());

      const resLastMonth = await fetch(
        `http://localhost:8080/admin/incomebymonth?month=${
          lastMonth.getMonth() + 1
        }&year=${lastMonth.getFullYear()}`,
        { credentials: "include" }
      );
      setIncomeLastMonth(await resLastMonth.json());

      const resLastYear = await fetch(
        `http://localhost:8080/admin/incomebyyear?year=${lastYear.getFullYear()}`,
        { credentials: "include" }
      );
      setIncomeLastYear(await resLastYear.json());
    } catch (err) {
      console.error("Error fetching comparison stats:", err);
    }
  };

  const fetchBookingsToday = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/bookingtoday", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Data is not an array");
      setBookingsToday(data);
    } catch (err) {
      console.error("Error fetching bookings today:", err);
    }
  };

  const fetchOutOfStockAndExpired = async () => {
    try {
      const resOut = await fetch(
        "http://localhost:8080/admin/vaccineoutofstock",
        {
          credentials: "include",
        }
      );
      setOutOfStockVaccines(await resOut.json());

      const resExp = await fetch("http://localhost:8080/admin/expiredvaccine", {
        credentials: "include",
      });
      setExpiredVaccines(await resExp.json());
    } catch (err) {
      console.error("Error fetching vaccine info:", err);
    }
  };

  const fetchBestsellerVaccines = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/bestvaccine", {
        credentials: "include",
      });
      setBestsellerVaccines(await res.json());
    } catch (err) {
      console.error("Error fetching bestseller vaccines:", err);
    }
  };

  const sortedVaccineEntries = useMemo(() => {
    const entries = Object.entries(bestsellerVaccines);
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [bestsellerVaccines]);

  const top3Vaccine = sortedVaccineEntries.slice(0, 3);
  const top10Vaccine = sortedVaccineEntries.slice(0, 10);

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
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null)
              label += formatPrice(context.parsed.y);
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { maxRotation: 45, minRotation: 45 },
      },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
        ticks: {
          callback: function (value) {
            if (value >= 1000000)
              return (value / 1000000).toFixed(0) + " triệu";
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
        labels: { usePointStyle: true, padding: 15 },
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
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false, drawBorder: false } },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
        beginAtZero: true,
      },
    },
  };

  const handleApply = () => {
    setCustomRange({ ...tempRange });
  };

  const icons = {
    today: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon-dashboard"
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
        className="icon-dashboard"
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
        className="icon-dashboard"
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
        className="icon-dashboard"
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
        className="icon-small-dashboard"
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
        className="icon-small-dashboard"
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
        className="icon-small-dashboard"
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
        className="icon-small-dashboard"
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

  const formatBookingStatus = (status) => {
    if (status === 0)
      return (
        <span className="booking-status-pending-dashboard">Đang xử lý</span>
      );
    if (status === 1)
      return (
        <span className="booking-status-completed-dashboard">
          Đã hoàn thành
        </span>
      );
    return (
      <span className="booking-status-unknown-dashboard">Không xác định</span>
    );
  };

  return (
    <div className="container-dashboard">
      <div className="content-dashboard">
        <div className="stats-grid-dashboard">
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

        <div className="main-grid-dashboard">
          <div className="main-left-dashboard">
            <InfoCard title="Thống kê thu nhập" icon={icons.month}>
              <div className="date-range-dashboard">
                <div className="date-input-dashboard">
                  <label className="date-label-dashboard">Từ ngày</label>
                  <input
                    type="date"
                    value={tempRange.from}
                    onChange={(e) =>
                      setTempRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="date-picker-dashboard"
                  />
                </div>
                <div className="date-input-dashboard">
                  <label className="date-label-dashboard">Đến ngày</label>
                  <input
                    type="date"
                    value={tempRange.to}
                    onChange={(e) =>
                      setTempRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="date-picker-dashboard"
                  />
                </div>
                <button onClick={handleApply} className="apply-btn-dashboard">
                  Áp dụng
                </button>
              </div>
              <div className="chart-container-dashboard">
                {loadingLineChart ? (
                  <div className="loading-spinner-dashboard">
                    <div className="spinner-dashboard"></div>
                  </div>
                ) : aggregatedData ? (
                  <Line data={lineChartData} options={lineChartOptions} />
                ) : (
                  <div className="no-data-dashboard">
                    <p className="no-data-text-dashboard">
                      Không có dữ liệu để hiển thị
                    </p>
                  </div>
                )}
              </div>
            </InfoCard>
            <div className="vaccine-status-grid-dashboard">
              <InfoCard
                title="Vaccine hết hàng"
                icon={icons.warning}
                badgeCount={outOfStockVaccines.length}
                badgeColor="bg-red-500"
                onClick={() => setOutOfStockModalOpen(true)}
              >
                <div className="vaccine-list-dashboard">
                  {outOfStockVaccines.length === 0 ? (
                    <p className="vaccine-empty-dashboard">
                      Không có vaccine nào hết hàng
                    </p>
                  ) : (
                    <ul className="vaccine-items-dashboard">
                      {outOfStockVaccines.slice(0, 3).map((vaccine, idx) => (
                        <li
                          key={idx}
                          className="vaccine-item-outofstock-dashboard"
                        >
                          <span className="vaccine-dot-outofstock-dashboard"></span>
                          <span className="vaccine-name-dashboard">
                            {vaccine.name}
                          </span>
                        </li>
                      ))}
                      {outOfStockVaccines.length > 3 && (
                        <button
                          className="vaccine-more-btn-dashboard"
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
                <div className="vaccine-list-dashboard">
                  {expiredVaccines.length === 0 ? (
                    <p className="vaccine-empty-dashboard">
                      Không có vaccine nào hết hạn
                    </p>
                  ) : (
                    <ul className="vaccine-items-dashboard">
                      {expiredVaccines.slice(0, 3).map((vaccine, idx) => (
                        <li
                          key={idx}
                          className="vaccine-item-expired-dashboard"
                        >
                          <span className="vaccine-dot-expired-dashboard"></span>
                          <span className="vaccine-name-dashboard">
                            {vaccine.name}
                          </span>
                        </li>
                      ))}
                      {expiredVaccines.length > 3 && (
                        <button
                          className="vaccine-more-btn-dashboard"
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

          <div className="main-right-dashboard">
            <InfoCard
              title="Đặt lịch hôm nay"
              icon={icons.booking}
              badgeCount={bookingsToday.length}
              badgeColor="bg-blue-500"
              onClick={() => setBookingsModalOpen(true)}
            >
              <div className="booking-list-dashboard">
                {bookingsToday.length > 0 ? (
                  <ul className="booking-items-dashboard">
                    {bookingsToday.slice(0, 5).map((b) => (
                      <li key={b.bookingId} className="booking-item-dashboard">
                        <span className="booking-info-dashboard">
                          {b.bookingId} - {b.customer?.firstName}{" "}
                          {b.customer?.lastName}
                        </span>
                        {formatBookingStatus(b.status)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="booking-empty-dashboard">
                    Không có đặt lịch nào hôm nay
                  </p>
                )}
              </div>
              {bookingsToday.length > 5 && (
                <button
                  className="booking-more-btn-dashboard"
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
              <div className="top-vaccine-list-dashboard">
                {top3Vaccine.length > 0 ? (
                  <ul className="top-vaccine-items-dashboard">
                    {top3Vaccine.map(([name, count], idx) => (
                      <li key={idx} className="top-vaccine-item-dashboard">
                        <span className="top-vaccine-name-dashboard">
                          {name}
                        </span>{" "}
                        - {count} lượt
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="top-vaccine-empty-dashboard">Chưa có dữ liệu</p>
                )}
              </div>
              {top10Vaccine.length > 3 && (
                <button
                  className="top-vaccine-more-btn-dashboard"
                  onClick={() => setTopVaccineModalOpen(true)}
                >
                  Xem thêm...
                </button>
              )}
            </InfoCard>
          </div>
        </div>
      </div>

      {bookingsModalOpen && (
        <div className="modal-overlay-dashboard">
          <div className="modal-content-dashboard">
            <button
              onClick={() => setBookingsModalOpen(false)}
              className="modal-close-btn-dashboard"
            >
              ×
            </button>
            <h2 className="modal-title-dashboard">Đặt Lịch Hôm Nay</h2>
            <div className="modal-body-dashboard">
              {bookingsToday.map((b) => (
                <div key={b.bookingId} className="modal-item-dashboard">
                  <span className="modal-item-info-dashboard">
                    {b.bookingId} - {b.customer?.firstName}{" "}
                    {b.customer?.lastName}
                  </span>
                  {formatBookingStatus(b.status)}
                </div>
              ))}
            </div>
            <div className="modal-footer-dashboard">
              <button
                onClick={() => setBookingsModalOpen(false)}
                className="modal-close-btn-action-dashboard"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {topVaccineModalOpen && (
        <div className="modal-overlay-dashboard">
          <div className="modal-content-large-dashboard">
            <button
              onClick={() => setTopVaccineModalOpen(false)}
              className="modal-close-btn-dashboard"
            >
              ×
            </button>
            <h2 className="modal-title-large-dashboard">
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
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { display: false } },
                  },
                }}
              />
            ) : (
              <p className="modal-no-data-dashboard">Chưa có dữ liệu</p>
            )}
            <div className="modal-footer-dashboard">
              <button
                onClick={() => setTopVaccineModalOpen(false)}
                className="modal-close-btn-action-dashboard"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {outOfStockModalOpen && (
        <div className="modal-overlay-dashboard">
          <div className="modal-content-dashboard">
            <button
              onClick={() => setOutOfStockModalOpen(false)}
              className="modal-close-btn-dashboard"
            >
              ×
            </button>
            <h2 className="modal-title-dashboard">Vaccine Hết Hàng</h2>
            <div className="modal-body-dashboard">
              {outOfStockVaccines.length > 0 ? (
                <ul className="modal-list-dashboard">
                  {outOfStockVaccines.map((vaccine, idx) => (
                    <li key={idx} className="modal-item-outofstock-dashboard">
                      <span className="modal-dot-outofstock-dashboard"></span>
                      <span className="modal-item-name-dashboard">
                        {vaccine.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="modal-no-data-dashboard">
                  Không có vaccine nào hết hàng
                </p>
              )}
            </div>
            <div className="modal-footer-dashboard">
              <button
                onClick={() => setOutOfStockModalOpen(false)}
                className="modal-close-btn-action-dashboard"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {expiredModalOpen && (
        <div className="modal-overlay-dashboard">
          <div className="modal-content-dashboard">
            <button
              onClick={() => setExpiredModalOpen(false)}
              className="modal-close-btn-dashboard"
            >
              ×
            </button>
            <h2 className="modal-title-dashboard">Vaccine Hết Hạn</h2>
            <div className="modal-body-dashboard">
              {expiredVaccines.length > 0 ? (
                <ul className="modal-list-dashboard">
                  {expiredVaccines.map((vaccine, idx) => (
                    <li key={idx} className="modal-item-expired-dashboard">
                      <span className="modal-dot-expired-dashboard"></span>
                      <span className="modal-item-name-dashboard">
                        {vaccine.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="modal-no-data-dashboard">
                  Không có vaccine nào hết hạn
                </p>
              )}
            </div>
            <div className="modal-footer-dashboard">
              <button
                onClick={() => setExpiredModalOpen(false)}
                className="modal-close-btn-action-dashboard"
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
