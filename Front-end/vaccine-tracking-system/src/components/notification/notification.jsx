import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ArrowLeft, Footprints } from "lucide-react";
import "../notification/notification.css";
import { useAuth } from "../../components/common/AuthContext"; // Import useAuth để lấy userInfo
import Header from "../header/header";
import Footer from "../common/Footer";
function NotificationDetail() {
  const { notificationId } = useParams(); // Lấy notificationId từ URL
  const navigate = useNavigate();
  const { userInfo } = useAuth(); // Lấy thông tin user từ AuthContext
  const [notification, setNotification] = useState(null); // Thông báo chi tiết
  const [allNotifications, setAllNotifications] = useState([]); // Danh sách tất cả thông báo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // Bộ lọc: all, read, unread

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy chi tiết thông báo
        const detailResponse = await fetch(`http://localhost:8080/notification/findid?id=${notificationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!detailResponse.ok) {
          throw new Error('Failed to fetch notification details');
        }
        const detailData = await detailResponse.json();
        setNotification(detailData);

        // Lấy tất cả thông báo
        const allResponse = await fetch(`http://localhost:8080/notification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!allResponse.ok) {
          throw new Error('Failed to fetch all notifications');
        }
        const allData = await allResponse.json();

        // Lọc thông báo theo customerId hoặc roleId = 1
        const filteredNotifications = allData.filter(notification => {
          const matchesCustomerId = notification.customer && notification.customer.customerId === userInfo?.userId;
          const matchesRoleId = notification.role && notification.role.roleId === 1;
          return matchesCustomerId || matchesRoleId;
        });

        // Sắp xếp theo ngày giảm dần
        setAllNotifications(filteredNotifications.sort((a, b) => new Date(b.date) - new Date(a.date)));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [notificationId, userInfo]); // Thêm userInfo vào dependency array

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMarkRead = async () => {
    try {
      const response = await fetch(`http://localhost:8080/notification/markread?id=${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        setNotification({ ...notification, read: true });
        setAllNotifications(allNotifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Lọc danh sách thông báo theo tab
  const filteredNotifications = () => {
    if (activeTab === 'all') return allNotifications;
    if (activeTab === 'read') return allNotifications.filter(n => n.read);
    if (activeTab === 'unread') return allNotifications.filter(n => !n.read);
    return allNotifications;
  };

  if (loading) {
    return (
      <div className="notification-detail-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-detail-container">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div>
        <Header/>
    <div className="notification-detail-container">
      <div className="notification-detail-header">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={18} /> Quay lại
        </button>
        <h1>Chi tiết thông báo</h1>
      </div>

      {/* Thông báo chi tiết */}
      <div className="notification-detail-content">
        <h2>{notification.tittle}</h2>
        <p className="notification-date">{notification.date}</p>
        <p className="notification-message">{notification.message}</p>
        {notification.read ? (
          <span className="status read">Đã đọc</span>
        ) : (
          <>
           
          
          </>
        )
        }
      </div>

      {/* Danh sách tất cả thông báo */}
      <div className="all-notifications-section">
        <h3>Tất cả thông báo</h3>
        <div className="notification-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            Tất cả
          </button>
          <button
            className={`tab ${activeTab === 'read' ? 'active' : ''}`}
            onClick={() => handleTabChange('read')}
          >
            Đã đọc
          </button>
          <button
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => handleTabChange('unread')}
          >
            Chưa đọc
          </button>
        </div>
        <div className="notification-list">
          {filteredNotifications().length > 0 ? (
            filteredNotifications().map(n => (
              <Link
                to={`/notification/${n.id}`}
                key={n.id}
                className={`notification-item ${n.read ? 'read' : 'unread'} ${
                  n.id === notification.id ? 'selected' : ''
                }`}
              >
                <div className="notification-content">
                  <strong>{n.tittle}</strong>
                  <p>{n.message}</p>
                </div>
                <div className="notification-time">
                  {n.date}
                </div>
              </Link>
            ))
          ) : (
            <div className="notification-item">
              <span>Không có thông báo nào.</span>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default NotificationDetail;