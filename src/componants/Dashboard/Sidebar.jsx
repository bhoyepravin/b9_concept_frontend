import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { Button } from "../ui/button";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.roleId === 1;

  const menuItems = [
    { path: "/dashboard", label: "Overview", icon: "📊" },
    { path: "/dashboard/appointments", label: "Appointments", icon: "📅" },
    { path: "/dashboard/profile", label: "Profile", icon: "👤" },
    ...(isAdmin
      ? [{ path: "/admindashboard", label: "Admin Panel", icon: "⚙️" }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Therapy Manager</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome, {user?.firstName}!
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start space-x-3"
        >
          <span>🚪</span>
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
