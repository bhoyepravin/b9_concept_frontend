import React from "react";
import { useAuth } from "../../Contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

const UserDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Upcoming Sessions", value: "2", color: "bg-blue-500" },
    { label: "Completed Sessions", value: "5", color: "bg-green-500" },
    { label: "Pending Requests", value: "1", color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Ready for your next therapy session? We're here to support your
          journey.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>Your upcoming therapy session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">Tomorrow, 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Therapist</span>
                <span className="font-medium">Dr. Sarah Johnson</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mode</span>
                <span className="font-medium text-green-600">Video Call</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Join Session
              </Button>
              <Button variant="outline" className="flex-1">
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>Therapy session preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Preferred Time</span>
                <span className="font-medium">Evening</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Session Type</span>
                <span className="font-medium">Video Call</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Therapy Focus</span>
                <span className="font-medium">Anxiety Management</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6">
              Update Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
