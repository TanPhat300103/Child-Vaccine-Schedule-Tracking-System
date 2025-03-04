import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const Notification = ({ roleId }) => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hàm gọi API để lấy danh sách thông báo theo roleId
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/notification/findbyrole?roleId=${roleId}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi kết nối API");
      }
      const data = await response.json();
      setNotifications(data);
      console.log("Danh sách thông báo: ", data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  // Gọi API ngay khi component được mount và định kỳ mỗi 30 giây
  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [roleId]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="relative focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-110"
      >
        <FaBell className="text-2xl text-gray-800" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1 transform translate-x-1 -translate-y-1">
            {notifications.length}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 shadow-lg z-50 max-h-96 overflow-y-auto transition-all duration-300 ease-in-out transform origin-top-right">
          <ul className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                >
                  <div className="font-semibold">
                    {notification.tittle || "Tiêu đề không có"}
                  </div>
                  <div className="text-sm text-gray-700">
                    {notification.message || "Thông báo không có nội dung"}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-center text-gray-500">
                Không có thông báo
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
