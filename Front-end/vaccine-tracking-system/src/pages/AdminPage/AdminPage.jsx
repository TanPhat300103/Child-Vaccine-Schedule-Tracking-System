import React, { useEffect, useState } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext.jsx";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiFolder,
  FiChevronDown,
  FiUser,
  FiBarChart2,
  FiShield,
  FiBox,
  FiHome,
  FiAlertTriangle,
  FiMessageSquare,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiActivity
} from "react-icons/fi";
import { RiSyringeLine, RiVirusLine, RiHospitalLine } from "react-icons/ri";

const AdminPage = () => {
  const adminData = {
    firstName: "Lord",
    lastName: "Of Cinder",
  };
  // Các phần comment về authentication giữ nguyên như code gốc
   // const { userInfo } = useAuth();
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  // const [proFileData, setProFileData] = useState(null);

  // useEffect(() => {
  //   // Kiểm tra xem người dùng đã đăng nhập chưa
  //   const data = fetch("http://localhost:8080/auth/myprofile", {
  //     method: "GET",
  //     credentials: "include", // Gửi cookie/session
  //   })
  //     .then((response) => {
  //       if (response.status === 401) {
  //         setIsAuthenticated(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setIsAuthenticated(false);
  //     });
  //   setProFileData(data);
  //   console.log("my profile data: ", proFileData);
  // }, []);
  // // take data
  // console.log("user id la: ", userInfo.userId);
  // useEffect(() => {
  //   // Lấy cookie và hiển thị trên console
  //   console.log("Cookie: ", document.cookie); // Hiển thị tất cả cookies
  // }, []);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar với thiết kế mới theo chủ đề y tế */}
      <aside className="w-80 bg-teal-700 text-white flex flex-col sticky top-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out">
        {/* Logo và tiêu đề */}
        <div className="p-6 flex flex-col items-center border-b border-teal-600">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3">
            <RiSyringeLine className="text-teal-600 w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">VacciCare Admin</h2>
          <p className="text-teal-200 text-sm">Hệ thống quản lý tiêm chủng</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="mb-4 px-2">
            <Link
              to="/home"
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors text-sm font-medium shadow-sm"
            >
              <FiHome className="mr-2 w-5 h-5" />
              Trang chủ
            </Link>
          </div>
          
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Tổng quan</p>
          </div>
          
          <ul className="space-y-1 mb-6">
            {/* Dashboard */}
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiGrid className="w-5 h-5" />
                <span className="ml-3">Bảng điều khiển</span>
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/staffs"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span className="ml-3">Nhân viên Y tế</span>
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/customers"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiUsers className="w-5 h-5" />
                <span className="ml-3">Bệnh nhân</span>
              </Link>
            </li>
          </ul>
          
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Quản lý tiêm chủng</p>
          </div>
          
          <ul className="space-y-1 mb-6">
            <li>
              <Link
                to="/admin/bookings"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiCalendar className="w-5 h-5" />
                <span className="ml-3">Lịch hẹn tiêm chủng</span>
              </Link>
            </li>
            
            {/* Vaccine với submenu */}
            <li className="relative group">
              <div className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors cursor-pointer">
                <RiSyringeLine className="w-5 h-5" />
                <span className="ml-3">Vaccine</span>
                <FiChevronDown className="ml-auto w-4 h-4" />
              </div>
              <ul className="mt-1 ml-8 space-y-1 hidden group-hover:block">
                <li>
                  <Link
                    to="/admin/vaccines"
                    className="flex items-center py-2 px-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <FiShield className="w-4 h-4 mr-2" />
                    Quản lý Vaccine
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/vaccine-combos"
                    className="flex items-center py-2 px-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <FiBox className="w-4 h-4 mr-2" />
                    Gói Vaccine
                  </Link>
                </li>
              </ul>
            </li>
            
            <li>
              <Link
                to="/admin/records"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiActivity className="w-5 h-5" />
                <span className="ml-3">Biểu hiện sau tiêm</span>
              </Link>
            </li>
          </ul>
          
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Hệ thống</p>
          </div>
          
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin/feedbacks"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiMessageSquare className="w-5 h-5" />
                <span className="ml-3">Phản hồi bệnh nhân</span>
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/marketing-campains"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiBarChart2 className="w-5 h-5" />
                <span className="ml-3">Chiến dịch Y tế</span>
              </Link>
            </li>
            
            {/* <li>
              <Link
                to="/admin/settings"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiSettings className="w-5 h-5" />
                <span className="ml-3">Cài đặt hệ thống</span>
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* Thông tin admin */}
        <div className="p-4 border-t border-teal-600 mt-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
              {adminData.firstName.charAt(0)}{adminData.lastName.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {adminData.firstName} {adminData.lastName}
              </p>
              <p className="text-xs text-teal-300">Quản trị viên Y tế</p>
            </div>
            <button className="ml-auto text-teal-300 hover:text-white">
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Chào mừng, {adminData.firstName} {adminData.lastName}!
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiHelpCircle className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiMessageSquare className="w-5 h-5 text-gray-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiAlertTriangle className="w-5 h-5 text-gray-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiCalendar className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Lịch hẹn hôm nay</p>
                    <p className="text-xl font-semibold">24</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <RiSyringeLine className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Tiêm chủng hôm nay</p>
                    <p className="text-xl font-semibold">18</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-yellow-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <FiAlertTriangle className="text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Cần theo dõi</p>
                    <p className="text-xl font-semibold">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Outlet />
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-gray-500 text-center">
              © 2025 VacciCare - Hệ thống quản lý tiêm chủng | Phiên bản 1.0.2
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;