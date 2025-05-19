import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back ✈️</h1>
        <p className="text-gray-500 mt-1">Here’s a summary of your bookings and flights.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Upcoming Flights</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">2</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Total Booked</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">14</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate('/Booking')}>
          Book New Ticket
        </button>
        <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition">
          View Booking History
        </button>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-5 text-sm text-gray-500">Flight</th>
              <th className="py-3 px-5 text-sm text-gray-500">From</th>
              <th className="py-3 px-5 text-sm text-gray-500">To</th>
              <th className="py-3 px-5 text-sm text-gray-500">Date</th>
              <th className="py-3 px-5 text-sm text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-3 px-5">Qatar Airways 231</td>
              <td className="py-3 px-5">Colombo</td>
              <td className="py-3 px-5">Dubai</td>
              <td className="py-3 px-5">May 20, 2025</td>
              <td className="py-3 px-5 text-green-600 font-medium">Confirmed</td>
            </tr>
            <tr className="border-t">
              <td className="py-3 px-5">Emirates EK 74</td>
              <td className="py-3 px-5">Dubai</td>
              <td className="py-3 px-5">London</td>
              <td className="py-3 px-5">June 2, 2025</td>
              <td className="py-3 px-5 text-yellow-600 font-medium">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
