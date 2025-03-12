import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../style/ProfilePage.css';
import { User, BookOpen, CreditCard, Edit2, Save, XCircle, Calendar, Phone, Mail, MapPin, Shield } from 'lucide-react';

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError('Không tìm thấy ID người dùng');
        setLoading(false);
        return;
      }

      try {
        const customerResponse = await fetch(`http://localhost:8080/customer/findid?id=${userInfo.userId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!customerResponse.ok) throw new Error('Không tìm thấy thông tin khách hàng');
        const customerData = await customerResponse.json();
        console.log('Dữ liệu từ server:', customerData);
        setCustomer(customerData);
      } catch (err) {
        setError('Lỗi khi lấy thông tin: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const handleUpdateClick = () => {
    console.log('customer.dob trước khi truyền:', customer.dob); // Kiểm tra giá trị dob
    setIsEditing(true);
    setFormData({
      customerId: customer.customerId,
      phoneNumber: customer.phoneNumber,
      firstName: customer.firstName,
      lastName: customer.lastName,
      dob: customer.dob || '', // Sử dụng customer.dob thay vì dateOfBirth
      gender: customer.gender,
      password: customer.password,
      address: customer.address || '',
      banking: customer.banking || '',
      email: customer.email || '',
      roleId: customer.roleId,
      active: customer.active,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/customer/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCustomer({ ...customer, ...formData, dob: formData.dob }); // Sử dụng dob thay vì dateOfBirth
        setIsEditing(false);
      } else {
        const errorText = await response.text();
        setError('Lỗi khi cập nhật thông tin khách hàng: ' + errorText);
      }
    } catch (err) {
      setError('Lỗi khi cập nhật: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="profile-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-user-info">
          <div className="profile-avatar">
            {customer?.firstName?.charAt(0)}{customer?.lastName?.charAt(0)}
          </div>
          <div className="profile-user-text">
            <h1>{customer?.firstName} {customer?.lastName}</h1>
            <p>{customer?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div
            className={`profile-sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Thông Tin Cá Nhân</span>
          </div>
          <div className="profile-sidebar-item" onClick={() => navigate('/child-info')}>
            <Calendar size={18} />
            <span>Thông Tin Con</span>
          </div>
          <div
            className={`profile-sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => navigate('/my-bookings')}
          >
            <BookOpen size={18} />
            <span>My Booking</span>
          </div>
          <div className="profile-sidebar-item" onClick={() => navigate('/my-payments')}>
            <CreditCard size={18} />
            <span>My Payment</span>
          </div>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-section" style={{ opacity: 1 }}>
              <div className="profile-section-header">
                <h2>Thông Tin Cá Nhân</h2>
                {!isEditing && (
                  <button className="profile-edit-btn" onClick={handleUpdateClick}>
                    <Edit2 size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="profile-edit-form">
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label>Họ</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ"
                      />
                    </div>
                    <div className="profile-form-group">
                      <label>Tên</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên"
                      />
                    </div>
                  </div>
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                      />
                    </div>
                    <div className="profile-form-group">
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label>Ngày sinh</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="profile-form-group full-width">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>
                  <div className="profile-form-actions">
                    <button className="profile-save-btn" onClick={handleSave}>
                      <Save size={16} />
                      <span>Lưu thông tin</span>
                    </button>
                    <button className="profile-cancel-btn" onClick={() => setIsEditing(false)}>
                      <XCircle size={16} />
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info-card">
                  <div className="profile-info-items">
                    <div className="profile-info-item">
                      <Phone size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Số điện thoại</span>
                        <span className="profile-info-value">{customer?.phoneNumber || 'Chưa có'}</span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Mail size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Email</span>
                        <span className="profile-info-value">{customer?.email || 'Chưa có'}</span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Calendar size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Ngày sinh</span>
                        <span className="profile-info-value">
                          {customer?.dob
                            ? new Date(customer.dob).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })
                            : 'Chưa có'}
                        </span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <MapPin size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Địa chỉ</span>
                        <span className="profile-info-value">{customer?.address || 'Chưa có'}</span>
                      </div>
                    </div>
                    <div className="profile-info-item">
                      <Shield size={18} className="profile-info-icon" />
                      <div className="profile-info-content">
                        <span className="profile-info-label">Trạng thái</span>
                        <span className={`profile-status ${customer?.active ? 'active' : 'inactive'}`}>
                          {customer?.active ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;