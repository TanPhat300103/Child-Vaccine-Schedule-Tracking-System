import React from "react";
import { Outlet, Link } from "react-router-dom";
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
} from "react-icons/fi";

const AdminPage = () => {
  const adminData = {
    firstName: "Placeholder",
    lastName: "Admin",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar với sticky */}
      <aside className="w-80 bg-indigo-900 text-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Header trong sidebar: Nút Home và Admin Panel */}
        <div className="p-4 border-b border-indigo-800 flex items-center space-x-3">
          <Link
            to="/home"
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xl"
          >
            <FiHome className="mr-2 w-6 h-6" />
            Home
          </Link>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-3">
            {/* Dashboard */}
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <FiGrid className="w-6 h-6" />
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/staffs"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <FiUser className="w-6 h-6" />
                <span className="ml-4">Quản Lý Nhân Viên</span>
              </Link>
            </li>
            {/* Customers */}
            <li>
              <Link
                to="/admin/customers"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <FiUsers className="w-6 h-6" />
                <span className="ml-4">Quản Lý Khách Hàng</span>
              </Link>
            </li>
            {/* Bookings */}
            <li>
              <Link
                to="/admin/bookings"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <FiCalendar className="w-6 h-6" />
                <span className="ml-4">Bookings</span>
              </Link>
            </li>
            {/* Marketing */}
            <li>
              <Link
                to="/admin/marketing-campains"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-indigo-700 transition-colors"
              >
                <FiBarChart2 className="w-6 h-6" />
                <span className="ml-4">Marketing</span>
              </Link>
            </li>
            {/* Vaccine với submenu */}
            <li className="relative group">
              <div className="flex items-center p-3 text-lg font-medium rounded hover:bg-indigo-700 transition-colors cursor-pointer">
                <FiFolder className="w-6 h-6" />
                <span className="ml-4">Vaccine</span>
                <FiChevronDown className="ml-auto w-5 h-5" />
              </div>
              <ul className="mt-1 ml-8 space-y-2 hidden group-hover:block">
                {/* Quản Lý Vaccine */}
                <li>
                  <Link
                    to="/admin/vaccines"
                    className="flex items-center text-lg font-medium hover:text-gray-300 transition-colors"
                  >
                    <FiShield className="w-5 h-5 mr-2" />
                    Quản Lý Vaccine
                  </Link>
                </li>
                {/* Vaccine Combo */}
                <li>
                  <Link
                    to="/admin/vaccine-combos"
                    className="flex items-center text-lg font-medium hover:text-gray-300 transition-colors"
                  >
                    <FiBox className="w-5 h-5 mr-2" />
                    Vaccine Combo
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Thông tin admin */}
        <div className="p-4 border-t border-indigo-800">
          <p className="text-lg">
            Xin chào, {adminData.firstName} {adminData.lastName}!
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, {adminData.firstName} {adminData.lastName}!
            </h1>
          </div>
        </header>
        <main className="px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
