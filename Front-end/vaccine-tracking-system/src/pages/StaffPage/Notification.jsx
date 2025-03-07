// Notification.jsx
import React, { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";

const Notification = ({ roleId }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Dữ liệu mẫu cho thông báo (có thể thay bằng dữ liệu thực tế từ API)
  const notifications = [
    {
      id: 1,
      title: "Lịch hẹn mới",
      message: "Bệnh nhân Nguyễn Văn B đã đặt lịch tiêm vào 10:00, 07/03/2025.",
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      title: "Phản hồi mới",
      message: "Bệnh nhân Trần Thị C gửi phản hồi về vaccine combo.",
      time: "1 giờ trước",
      unread: false,
    },
    {
      id: 3,
      title: "Cảnh báo",
      message: "Hết vaccine Pfizer trong kho.",
      time: "2 giờ trước",
      unread: true,
    },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Nút chuông thông báo */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150 relative focus:outline-none"
      >
        <FiMessageSquare className="w-5 h-5" />
        {notifications.some((notif) => notif.unread) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown thông báo */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="bg-teal-700 text-white px-4 py-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Thông báo</h3>
            <span className="text-xs">
              {notifications.filter((notif) => notif.unread).length} chưa đọc
            </span>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-3 border-b border-gray-200 hover:bg-teal-50 transition-colors ${
                    notif.unread ? "bg-teal-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          notif.unread ? "text-teal-700" : "text-gray-800"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                    {notif.unread && (
                      <span className="w-2 h-2 bg-teal-600 rounded-full mt-1"></span>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-sm text-gray-500 text-center">
                Không có thông báo nào
              </li>
            )}
          </ul>
          <div className="p-2 bg-gray-100 text-center">
            <Link
              to="/staff/notifications"
              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;