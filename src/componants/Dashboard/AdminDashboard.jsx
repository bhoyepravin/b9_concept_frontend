import React, { useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import Sidebar from "../Dashboard/Sidebar";
import AdminDashboard from "../Dashboard/AdminDashboard";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AdminDashboard - Auth state:", { user, loading });

    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    }

    if (!loading && user && user.roleId !== 1) {
      console.log("User is not admin, redirecting to user dashboard");
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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

  if (user.roleId !== 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminDashboardPage;
