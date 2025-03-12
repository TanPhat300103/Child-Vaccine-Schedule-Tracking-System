import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FaMale, FaFemale } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import '../style/OverviewPage.css';

function Overview() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [children, setChildren] = useState([]);
  const [medicalHistories, setMedicalHistories] = useState({});
  const [payments, setPayments] = useState([]);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError('Không tìm thấy ID người dùng');
        setLoading(false);
        return;
      }

      try {
        const bookingsResponse = await fetch(
          `http://localhost:8080/booking/findbycustomer?customerId=${userInfo.userId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!bookingsResponse.ok) throw new Error('Không tìm thấy danh sách booking');
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const detailsPromises = bookingsData.map(booking =>
          fetch(`http://localhost:8080/bookingdetail/findbybooking?id=${booking.bookingId}`, {
            method: 'GET',
            credentials: 'include',
          }).then(res => {
            if (!res.ok) throw new Error(`Không tìm thấy chi tiết booking ${booking.bookingId}`);
            return res.json();
          })
        );
        const allDetails = await Promise.all(detailsPromises);
        const flattenedDetails = allDetails.flat();
        setBookingDetails(flattenedDetails);

        const childrenResponse = await fetch(
          `http://localhost:8080/child/findbycustomer?id=${userInfo.userId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!childrenResponse.ok) throw new Error('Không tìm thấy danh sách trẻ');
        const childrenData = await childrenResponse.json();
        setChildren(childrenData);

        const notificationsResponse = await fetch('http://localhost:8080/notification', {
          method: 'GET',
          credentials: 'include',
        });
        if (!notificationsResponse.ok) throw new Error('Không tìm thấy danh sách thông báo');
        const notificationsData = await notificationsResponse.json();

        const filteredNotifications = notificationsData.filter(
          notification =>
            (notification.role && notification.role.roleId === 1) ||
            (notification.customer && notification.customer.customerId === userInfo.userId)
        );
        setNotifications(filteredNotifications);

        const paymentsResponse = await fetch(
          `http://localhost:8080/payment/getbycustomerid?customerId=${userInfo.userId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!paymentsResponse.ok) throw new Error('Không tìm thấy danh sách hóa đơn');
        const paymentsData = await paymentsResponse.json();
        // Sắp xếp: hóa đơn chưa thanh toán (status: false) lên đầu
        const sortedPayments = paymentsData.sort((a, b) => (a.status === b.status ? 0 : a.status ? 1 : -1));
        setPayments(sortedPayments);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const fetchMedicalHistory = async (childId) => {
    try {
      const response = await fetch(`http://localhost:8080/medicalhistory/findbychildid?id=${childId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`Không tìm thấy lịch sử tiêm chủng cho trẻ ${childId}`);
      const data = await response.json();
      setMedicalHistories(prev => ({
        ...prev,
        [childId]: data,
      }));
    } catch (err) {
      console.error('Lỗi khi lấy lịch sử tiêm chủng:', err.message);
      setMedicalHistories(prev => ({
        ...prev,
        [childId]: [],
      }));
    }
  };

  const handleChildClick = (childId) => {
    if (expandedChildId === childId) {
      setExpandedChildId(null);
    } else {
      setExpandedChildId(childId);
      if (!medicalHistories[childId]) {
        fetchMedicalHistory(childId);
      }
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const adjustedFirstDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i);

  const vaccinationDates = bookingDetails.reduce((acc, detail) => {
    const scheduledDate = new Date(detail.scheduledDate);
    if (
      scheduledDate.getMonth() === currentMonth.getMonth() &&
      scheduledDate.getFullYear() === currentMonth.getFullYear()
    ) {
      const day = scheduledDate.getDate();
      if (!acc[day]) acc[day] = { children: new Set(), details: [] };
      const childName = `${detail.child.firstName} ${detail.child.lastName}`;
      acc[day].children.add(childName);
      acc[day].details.push({
        vaccineName: detail.vaccine.name,
        childName: childName,
        bookingDetailId: detail.bookingDetailId,
        scheduledDate: detail.scheduledDate,
        status: detail.status === 1 ? 'Chưa tiêm' : detail.status === 2 ? 'Đã tiêm' : 'Đã hủy',
        reactionNote: detail.reactionNote || 'Không có',
        vaccineCombo: detail.vaccineCombo,
      });
    }
    return acc;
  }, {});

  const calculateProgress = (bookingId) => {
    const details = bookingDetails.filter(detail => detail.booking.bookingId === bookingId);
    const totalValid = details.filter(detail => detail.status !== 3).length;
    const completed = details.filter(detail => detail.status === 2).length;
    return { completed, totalValid };
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    if (vaccinationDates[day]) {
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  const calculateAge = (dob) => {
    if (!dob) return 'Chưa có';
    const birthDate = new Date(dob);
    const today = new Date('2025-03-05');
    let ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      ageInYears--;
    }

    return ageInYears > 0 ? `${ageInYears} tuổi` : 'Dưới 1 tuổi';
  };

  const groupVaccinationsByChild = (details) => {
    const grouped = {};
    details.forEach((detail) => {
      const childName = detail.childName;
      if (!grouped[childName]) {
        grouped[childName] = [];
      }
      grouped[childName].push({
        vaccineName: detail.vaccineName,
        scheduledDate: detail.scheduledDate,
        status: detail.status,
        reactionNote: detail.reactionNote,
        vaccineCombo: detail.vaccineCombo,
      });
    });
    return grouped;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="overviewpage-loading">
        <div className="overviewpage-loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overviewpage-error">
        <div className="overviewpage-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="overviewpage-container">
      <div className="overviewpage-header">
        <div className="overviewpage-header-info">
          <div className="overviewpage-avatar">
            <Calendar size={32} />
          </div>
          <div className="overviewpage-header-text">
            <h1>Tổng Quan</h1>
            <p>Dưới đây là tổng quan về lịch tiêm chủng và thông tin của bạn.</p>
          </div>
        </div>
      </div>

      <div className="overviewpage-content">
        <div className="overviewpage-main-column">
          <div className="overviewpage-section">
            <h2 className="overviewpage-section-title">Lịch Tiêm Sắp Tới</h2>
            <div className="overviewpage-calendar-header">
              <button onClick={handlePreviousMonth} className="overviewpage-calendar-btn">
                <ChevronLeft size={18} />
                Trước
              </button>
              <span>
                Tháng {currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="overviewpage-calendar-btn">
                Sau
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="overviewpage-calendar">
              <div className="overviewpage-day-name">T2</div>
              <div className="overviewpage-day-name">T3</div>
              <div className="overviewpage-day-name">T4</div>
              <div className="overviewpage-day-name">T5</div>
              <div className="overviewpage-day-name">T6</div>
              <div className="overviewpage-day-name">T7</div>
              <div className="overviewpage-day-name">CN</div>

              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="overviewpage-day overviewpage-day-empty"></div>
              ))}

              {daysArray.map(day => (
                <div
                  key={day}
                  className={`overviewpage-day ${
                    vaccinationDates[day] ? 'overviewpage-day-has-vaccine' : ''
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="overviewpage-day-number">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overviewpage-section">
            <h2 className="overviewpage-section-title">Thông Tin Trẻ</h2>
            {children.length > 0 ? (
              children.map(child => (
                <div key={child.childId} className="overviewpage-child-card">
                  <div
                    className="overviewpage-child-header"
                    onClick={() => handleChildClick(child.childId)}
                  >
                    <h3>
                      {child.gender === true ? (
                        <FaMale size={18} color="#1e90ff" className="gender-icon" />
                      ) : child.gender === false ? (
                        <FaFemale size={18} color="#ff69b4" className="gender-icon" />
                      ) : (
                        <FaMale size={18} color="#666" className="gender-icon" />
                      )}
                      {` ${child.firstName} ${child.lastName}`}
                      <span className="child-age">({calculateAge(child.dob)})</span>
                    </h3>
                    <span className="overviewpage-toggle-icon">
                      {expandedChildId === child.childId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </div>
                  {expandedChildId === child.childId && (
                    <div className="overviewpage-child-details">
                      <p>Ngày sinh: {child.dob ? new Date(child.dob).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
                      <div className="overviewpage-medical-history">
                        <h4>Lịch Sử Tiêm Chủng</h4>
                        {medicalHistories[child.childId] ? (
                          medicalHistories[child.childId].length > 0 ? (
                            <table className="overviewpage-medical-history-table">
                              <thead>
                                <tr>
                                  <th>Ngày</th>
                                  <th>Vaccine</th>
                                  <th>Liều</th>
                                  <th>Phản ứng</th>
                                </tr>
                              </thead>
                              <tbody>
                                {medicalHistories[child.childId].map(history => (
                                  <tr key={history.medicalHistoryId}>
                                    <td>{new Date(history.date).toLocaleDateString('vi-VN')}</td>
                                    <td>{history.vaccine.name}</td>
                                    <td>{history.dose}</td>
                                    <td>{history.reaction || 'Không có'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>Chưa có lịch sử tiêm chủng.</p>
                          )
                        ) : (
                          <p>Đang tải lịch sử tiêm chủng...</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Không có thông tin trẻ nào.</p>
            )}
          </div>
        </div>

        <div className="overviewpage-side-column">
          <div className="overviewpage-section overviewpage-notification-section">
            <h2 className="overviewpage-section-title">Thông Báo</h2>
            <div className="overviewpage-notification-container">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="overviewpage-notification"
                    onClick={() => navigate(`/notification/${notification.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4>{notification.tittle}</h4>
                    <p>{notification.message}</p>
                    <span className="overviewpage-notification-date">
                      {new Date(notification.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))
              ) : (
                <p>Không có thông báo nào.</p>
              )}
            </div>
            {notifications.length > 0 && (
              <a href="http://localhost:3000/notification/1" className="overviewpage-view-all">
                Xem tất cả
              </a>
            )}
          </div>

          <div className="overviewpage-section overviewpage-progress-section">
            <h2 className="overviewpage-section-title">Tiến Độ Tiêm Chủng</h2>
            <div className="overviewpage-progress-container">
              {bookings.length > 0 ? (
                bookings.map(booking => {
                  const { completed, totalValid } = calculateProgress(booking.bookingId);
                  const progressPercentage = totalValid > 0 ? (completed / totalValid) * 100 : 0;

                  return (
                    <div
                      key={booking.bookingId}
                      className="overviewpage-progress-item"
                      onClick={() => navigate(`/booking-detail/${booking.bookingId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h4>Booking #{booking.bookingId}</h4>
                      <p>Ngày: {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</p>
                      <div className="overviewpage-progress-bar">
                        <div
                          className="overviewpage-progress-bar-fill"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p>{completed}/{totalValid} mũi đã hoàn thành</p>
                    </div>
                  );
                })
              ) : (
                <p>Không có booking nào.</p>
              )}
            </div>
            {bookings.length > 0 && (
              <a
                href="http://localhost:3000/profile?tab=bookings"
                className="overviewpage-view-all"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/my-bookings');
                }}
              >
                Xem tất cả
              </a>
            )}
          </div>

          <div className="overviewpage-section overviewpage-payment-section">
            <h2 className="overviewpage-section-title">Hóa Đơn</h2>
            <div className="overviewpage-payment-container">
              {payments.length > 0 ? (
                payments.map(payment => (
                  <div
                    key={payment.paymentId}
                    className={`overviewpage-payment-item ${
                      payment.status ? 'overviewpage-payment-item-paid' : ''
                    }`}
                  >
                    <h4>Hóa đơn #{payment.paymentId}</h4>
                    <p>Ngày: {new Date(payment.date).toLocaleDateString('vi-VN')}</p>
                    <p>Tổng: {formatCurrency(payment.total)}</p>
                    <p>
                      Trạng thái:{' '}
                      <span
                        className={`overviewpage-status overviewpage-status-${
                          payment.status ? 'đã\ thanh\ toán' : 'chưa\ thanh\ toán'
                        }`}
                      >
                        {payment.status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </p>
                    {!payment.status && (
                      <button
                        onClick={() => navigate(`/payment-process/${payment.paymentId}`)}
                        className="overviewpage-payment-btn"
                      >
                        Thanh toán
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>Không có hóa đơn nào.</p>
              )}
            </div>
            {payments.length > 0 && (
              <a
                href="http://localhost:3000/my-payments"
                className="overviewpage-view-all"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/my-payments');
                }}
              >
                Xem tất cả
              </a>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedDay && (
        <div className="overviewpage-modal-overlay">
          <div className="overviewpage-modal">
            <div className="overviewpage-modal-header">
              <h3>Lịch Tiêm Ngày {selectedDay}/{currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}</h3>
              <button onClick={closeModal} className="overviewpage-modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="overviewpage-modal-body">
              {Object.entries(groupVaccinationsByChild(vaccinationDates[selectedDay].details)).map(
                ([childName, vaccinations], index) => (
                  <div key={index} className="overviewpage-child-vaccination-group">
                    <h4 className="overviewpage-child-name">{childName}</h4>
                    <table className="overviewpage-vaccination-table">
                      <thead>
                        <tr>
                          <th>Tên Vaccine</th>
                          <th>Vaccine Combo</th>
                          <th>Trạng Thái</th>
                          <th>Ghi Chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vaccinations.map((vaccination, idx) => (
                          <tr key={idx}>
                            <td>{vaccination.vaccineName}</td>
                            <td>{vaccination.vaccineCombo ? 'Thuộc Combo' : 'Vaccine Lẻ'}</td>
                            <td>
                              <span
                                className={`overviewpage-status overviewpage-status-${vaccination.status.toLowerCase()}`}
                              >
                                {vaccination.status}
                              </span>
                            </td>
                            <td>{vaccination.reactionNote}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Overview;