import React, { useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import UserDashboard from "../Dashboard/UserDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard - Auth state:", { user, loading });

    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <UserDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
// // components/Dashboard/Dashboard.jsx - Add role check
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../../services/api";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem("userRole");

//   // Redirect admins to admin dashboard
//   useEffect(() => {
//     if (userRole === "admin") {
//       navigate("/admindashboard");
//     }
//   }, [userRole, navigate]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("userRole");
//       navigate("/login");
//     }
//   };

//   // If user is admin, this won't render as they'll be redirected
//   if (userRole === "admin") {
//     return null; // or a loading spinner
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Regular user dashboard content */}
//       <nav className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold">User Dashboard</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">Welcome, User!</span>
//               <span className="text-gray-700">Role: {userRole}</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8 text-center">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               Welcome to your User Dashboard!
//             </h2>
//             <p className="text-gray-600">
//               You are logged in as {userRole}. This is your main dashboard.
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
