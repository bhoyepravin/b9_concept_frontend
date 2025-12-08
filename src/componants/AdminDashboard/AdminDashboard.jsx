// components/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    therapists: 0,
    patients: 0,
  });
  const navigate = useNavigate();

  // Get userRole from localStorage
  const userRole = localStorage.getItem("userRole");

  // Redirect non-admins to regular dashboard
  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (userRole === "admin") {
      fetchDashboardData();
    }
  }, [userRole]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setUsers([
          {
            id: 1,
            username: "john_doe",
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "patient",
            isActive: true,
            createdAt: "2024-01-15",
          },
          {
            id: 2,
            username: "jane_smith",
            email: "jane@example.com",
            firstName: "Jane",
            lastName: "Smith",
            role: "therapist",
            isActive: true,
            createdAt: "2024-01-10",
          },
          {
            id: 3,
            username: "admin_user",
            email: "admin@example.com",
            firstName: "Admin",
            lastName: "User",
            role: "admin",
            isActive: true,
            createdAt: "2024-01-01",
          },
        ]);

        setStats({
          totalUsers: 150,
          activeUsers: 142,
          therapists: 25,
          patients: 125,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  // If user is not admin, don't render the admin dashboard
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Active Users
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.activeUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Therapists</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.therapists}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Patients</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.patients}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">
                New user registration
              </span>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">
                Therapist session completed
              </span>
            </div>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">
                New appointment scheduled
              </span>
            </div>
            <span className="text-xs text-gray-500">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <p className="text-sm text-gray-600">Manage all users in the system</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "therapist"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        System Settings
      </h3>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            General Settings
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">
            System Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Version:</span>
                <span className="ml-2 text-gray-900">1.0.0</span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 text-gray-900">Jan 15, 2024</span>
              </div>
              <div>
                <span className="text-gray-500">Database:</span>
                <span className="ml-2 text-gray-900">PostgreSQL</span>
              </div>
              <div>
                <span className="text-gray-500">Server Status:</span>
                <span className="ml-2 text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">A</span>
                </div>
                <span className="text-sm text-gray-700">Admin User</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview", icon: "📊" },
                { id: "users", name: "Users", icon: "👥" },
                { id: "settings", name: "Settings", icon: "⚙️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div>
              {activeTab === "overview" && renderOverview()}
              {activeTab === "users" && renderUsers()}
              {activeTab === "settings" && renderSettings()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// // components/AdminDashboard/AdminDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../../services/api";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     therapists: 0,
//     patients: 0,
//   });
//   const navigate = useNavigate();

//   // Get user data from localStorage
//   const userRole = localStorage.getItem("userRole");
//   const userName = localStorage.getItem("userName") || "Admin";
//   const userEmail = localStorage.getItem("userEmail") || "admin@example.com";

//   // Redirect non-admins to regular dashboard
//   useEffect(() => {
//     console.log("AdminDashboard - Current user role:", userRole);
//     if (userRole !== "admin") {
//       console.log("Redirecting non-admin to regular dashboard");
//       navigate("/dashboard");
//     }
//   }, [userRole, navigate]);

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     if (userRole === "admin") {
//       fetchDashboardData();
//     }
//   }, [userRole]);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Mock data - replace with actual API calls
//       setTimeout(() => {
//         setUsers([
//           {
//             id: 1,
//             username: "john_doe",
//             email: "john@example.com",
//             firstName: "John",
//             lastName: "Doe",
//             role: "patient",
//             isActive: true,
//             createdAt: "2024-01-15",
//           },
//           {
//             id: 2,
//             username: "jane_smith",
//             email: "jane@example.com",
//             firstName: "Jane",
//             lastName: "Smith",
//             role: "therapist",
//             isActive: true,
//             createdAt: "2024-01-10",
//           },
//           {
//             id: 3,
//             username: "admin_user",
//             email: "admin@example.com",
//             firstName: "Admin",
//             lastName: "User",
//             role: "admin",
//             isActive: true,
//             createdAt: "2024-01-01",
//           },
//         ]);

//         setStats({
//           totalUsers: 150,
//           activeUsers: 142,
//           therapists: 25,
//           patients: 125,
//         });
//         setLoading(false);
//       }, 1000);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("userRole");
//       localStorage.removeItem("userName");
//       localStorage.removeItem("userEmail");
//       navigate("/login");
//     }
//   };

//   // If user is not admin, don't render the admin dashboard
//   if (userRole !== "admin") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Redirecting to user dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const renderOverview = () => (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
//           <div className="flex items-center">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <svg
//                 className="w-6 h-6 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                 />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {stats.totalUsers}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <svg
//                 className="w-6 h-6 text-green-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">
//                 Active Users
//               </h3>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {stats.activeUsers}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
//           <div className="flex items-center">
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <svg
//                 className="w-6 h-6 text-purple-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
//                 />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Therapists</h3>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {stats.therapists}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
//           <div className="flex items-center">
//             <div className="p-3 bg-orange-100 rounded-lg">
//               <svg
//                 className="w-6 h-6 text-orange-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                 />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Patients</h3>
//               <p className="text-2xl font-semibold text-gray-900">
//                 {stats.patients}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Recent Activity
//         </h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//               <span className="text-sm text-gray-700">
//                 New user registration
//               </span>
//             </div>
//             <span className="text-xs text-gray-500">2 minutes ago</span>
//           </div>
//           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//               <span className="text-sm text-gray-700">
//                 Therapist session completed
//               </span>
//             </div>
//             <span className="text-xs text-gray-500">1 hour ago</span>
//           </div>
//           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
//               <span className="text-sm text-gray-700">
//                 New appointment scheduled
//               </span>
//             </div>
//             <span className="text-xs text-gray-500">3 hours ago</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderUsers = () => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
//         <p className="text-sm text-gray-600">Manage all users in the system</p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Joined
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                       <span className="text-indigo-600 font-medium">
//                         {user.firstName[0]}
//                         {user.lastName[0]}
//                       </span>
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">
//                         {user.firstName} {user.lastName}
//                       </div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       user.role === "admin"
//                         ? "bg-red-100 text-red-800"
//                         : user.role === "therapist"
//                         ? "bg-purple-100 text-purple-800"
//                         : "bg-blue-100 text-blue-800"
//                     }`}
//                   >
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       user.isActive
//                         ? "bg-green-100 text-green-800"
//                         : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {user.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button className="text-indigo-600 hover:text-indigo-900 mr-3">
//                     Edit
//                   </button>
//                   <button className="text-red-600 hover:text-red-900">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderSettings = () => (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-6">
//         System Settings
//       </h3>

//       <div className="space-y-6">
//         <div className="border-b border-gray-200 pb-4">
//           <h4 className="text-md font-medium text-gray-900 mb-3">
//             General Settings
//           </h4>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">Email Notifications</span>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="sr-only peer"
//                   defaultChecked
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
//               </label>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-700">SMS Notifications</span>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" className="sr-only peer" />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h4 className="text-md font-medium text-gray-900 mb-3">
//             System Information
//           </h4>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-500">Version:</span>
//                 <span className="ml-2 text-gray-900">1.0.0</span>
//               </div>
//               <div>
//                 <span className="text-gray-500">Last Updated:</span>
//                 <span className="ml-2 text-gray-900">Jan 15, 2024</span>
//               </div>
//               <div>
//                 <span className="text-gray-500">Database:</span>
//                 <span className="ml-2 text-gray-900">PostgreSQL</span>
//               </div>
//               <div>
//                 <span className="text-gray-500">Server Status:</span>
//                 <span className="ml-2 text-green-600 font-medium">Online</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">A</span>
//                 </div>
//               </div>
//               <div className="ml-3">
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   Admin Dashboard
//                 </h1>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
//                   <span className="text-indigo-600 text-sm font-medium">
//                     {userName[0]?.toUpperCase() || "A"}
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-sm font-medium text-gray-700 block">
//                     {userName}
//                   </span>
//                   <span className="text-xs text-gray-500 block">Admin</span>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {/* Navigation Tabs */}
//           <div className="border-b border-gray-200 mb-6">
//             <nav className="-mb-px flex space-x-8">
//               {[
//                 { id: "overview", name: "Overview", icon: "📊" },
//                 { id: "users", name: "Users", icon: "👥" },
//                 { id: "settings", name: "Settings", icon: "⚙️" },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`${
//                     activeTab === tab.id
//                       ? "border-indigo-500 text-indigo-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
//                 >
//                   <span>{tab.icon}</span>
//                   <span>{tab.name}</span>
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Content Area */}
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//           ) : (
//             <div>
//               {activeTab === "overview" && renderOverview()}
//               {activeTab === "users" && renderUsers()}
//               {activeTab === "settings" && renderSettings()}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
