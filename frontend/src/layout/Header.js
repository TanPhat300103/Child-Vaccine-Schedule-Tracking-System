import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/header.css";
import { useAuth } from '../components/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { Home, Star, User, LogOut, ChevronDown, Menu, X, Syringe, Calendar, Bell, CheckCircle, Circle, BookOpen } from "lucide-react";

function Header() {
  const { isLoggedIn, userInfo, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const handbookRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn && userInfo?.userId) {
      fetchCustomerData(userInfo.userId);
      fetchNotifications();
    }
  }, [isLoggedIn, userInfo]);

  const fetchCustomerData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/customer/findid?id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setCustomerData(null);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:8080/notification`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();

      const filteredNotifications = data.filter(notification => {
        const matchesCustomerId = notification.customer && notification.customer.customerId === userInfo?.userId;
        const matchesRoleId = notification.role && notification.role.roleId === 1;
        return matchesCustomerId || matchesRoleId;
      });

      filteredNotifications.sort((a, b) => {
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        return new Date(b.date) - new Date(a.date);
      });

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const markAsRead = async (notification) => {
    if (notification.read) return;

    try {
      const updatedNotification = { ...notification, read: true };
      const response = await fetch(`http://localhost:8080/notification/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedNotification),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false);
    setIsHandbookOpen(false);
    setActiveTab('all');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false);
    setIsHandbookOpen(false);
    setActiveTab('all');
  };

  const toggleHandbookDropdown = () => {
    setIsHandbookOpen(!isHandbookOpen);
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setCustomerData(null);
    setNotifications([]);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleViewAllNotifications = () => {
    setIsNotificationOpen(false);
    navigate('/notification/1');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification);
    }
    setIsNotificationOpen(false);
    navigate(`/notification/${notification.id}`);
  };

  const handleHandbookClick = (path) => {
    setIsHandbookOpen(false);
    navigate(path);
  };

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const displayedNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Hàm cắt ngắn tên nếu vượt quá 15 ký tự
  const truncateName = (name) => {
    if (!name) return "User";
    return name.length > 15 ? `${name.substring(0, 15)}...` : name;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (handbookRef.current && !handbookRef.current.contains(event.target)) {
        setIsHandbookOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <header className="navbar">
      <div className="loading-spinner"></div>
    </header>;
  }

  const fullName = customerData ? `${customerData.firstName} ${customerData.lastName}` : "User";

  return (  
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Syringe size={24} />
          </div>
          <span className="brand-name">Thu Hà | Hoàng Tử Gió</span>
        </Link>
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      <nav className={`navbar-nav ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={18} /> Home
            </Link>
          </li>
          <li>
            <div 
              onClick={() => handleProtectedRoute('/booking')}
              className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
            >
              <Calendar size={18} /> Booking
            </div>
          </li>
          <li>
            <div 
              onClick={() => handleProtectedRoute('/overview')}
              className={`nav-link ${location.pathname === '/overview' ? 'active' : ''}`}
            >
              <Star size={18} /> Overview
            </div>
          </li>
          <li>
            <Link 
              to="/vaccines"
              className={`nav-link ${location.pathname === '/vaccine' ? 'active' : ''}`}
            >
              <Syringe size={18} /> Vaccine
            </Link>
          </li>
          <li className="handbook-container" ref={handbookRef}>
            <div
              className={`nav-link ${
                location.pathname.startsWith('/handbook') ? 'active' : ''
              }`}
              onClick={toggleHandbookDropdown}
            >
              <BookOpen size={18} /> Cẩm nang
              <ChevronDown
                size={16}
                className={`dropdown-arrow ${isHandbookOpen ? 'rotate' : ''}`}
              />
            </div>
            {isHandbookOpen && (
              <div className="handbook-dropdown">
                <div
                  className="handbook-item"
                  onClick={() => handleHandbookClick('/handbook/vaccination-process')}
                >
                  <span>Quy trình tiêm chủng</span>
                </div>
                <div
                  className="handbook-item"
                  onClick={() => handleHandbookClick('/handbook/pre-post-notes')}
                >
                  <span>Lưu ý trước và sau tiêm chủng</span>
                </div>
                <div
                  className="handbook-item"
                  onClick={() => handleHandbookClick('/handbook/faq')}
                >
                  <span>Những câu hỏi thường gặp</span>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="user-actions">
            <div className="notification-container" ref={notificationRef}>
              <div className="notification-icon" onClick={toggleNotification}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
              </div>
              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Thông báo</h3>
                    <div className="notification-tabs">
                      <button
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabChange('all')}
                      >
                        Tất cả
                      </button>
                      <button
                        className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
                        onClick={() => handleTabChange('unread')}
                      >
                        Chưa đọc
                      </button>
                    </div>
                  </div>
                  <div className="notification-list">
                    {displayedNotifications.length > 0 ? (
                      displayedNotifications.map(notification => (
                        <div
                          key={notification.id}
                          className="notification-wrapper"
                        >
                          <div
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="notification-status">
                              {notification.read ? (
                                <CheckCircle size={14} className="status-icon read" />
                              ) : (
                                <Circle size={14} className="status-icon unread" />
                              )}
                            </div>
                            <div className="notification-content">
                              <strong>{notification.tittle}</strong>
                              <p>{notification.message}</p>
                            </div>
                            <div className="notification-time">
                              {notification.date}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="notification-item">
                        <span>Không có thông báo nào.</span>
                      </div>
                    )}
                  </div>
                  <div className="notification-footer">
                    <button onClick={handleViewAllNotifications}>Xem tất cả</button>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-container" ref={dropdownRef}>
              <div className="profile-icon" onClick={toggleDropdown}>
                <div className="avatar-circle">
                  <User size={18} />
                </div>
                <span className="profile-username">
                  {truncateName(fullName)}
                </span>
                <ChevronDown size={16} className={`dropdown-arrow ${isDropdownOpen ? 'rotate' : ''}`} />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    <User size={16} />
                    <span>{truncateName(fullName) || "My Profile"}</span>
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} /><span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link">
              <button className="nav-button login">Đăng nhập</button>
            </Link>
            <Link to="/register" className="auth-link">
              <button className="nav-button register">Đăng ký</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;