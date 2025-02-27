// src/pages/Staff/StaffPage.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";

import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";

const AdminPage = () => {
  const adminData = {
    firstName: "Placeholder",
    lastName: "Admin",
    // TODO: Sau này lấy từ API
  }; // Lấy từ API hoặc state

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Logo hoặc tên Brand */}
        <div className="p-4 font-bold text-xl border-b border-gray-700">
          Admin Panel
        </div>

        {/* Các đường dẫn */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            // to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 block px-3 py-2 rounded"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 block px-3 py-2 rounded"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Customers
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 block px-3 py-2 rounded"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Bookings
          </NavLink>
          <NavLink
            to="/admin/staffs"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 block px-3 py-2 rounded"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Staffs
          </NavLink>
          <NavLink
            to="/admin/incomes"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 block px-3 py-2 rounded"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Incomes
          </NavLink>
          <NavLink
            to="/admin/vaccines"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-700 block px-3 py-2 rounded"
                : "block px-3 py-2 hover:bg-gray-700 rounded"
            }
          >
            Vaccines
          </NavLink>
        </nav>

        {/* Thông tin admin tạm */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm">
            Xin chào, {adminData.firstName} {adminData.lastName}!
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Outlet để render các trang con */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
