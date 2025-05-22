// src/sections/Admin/Flight/ManualBookingModal.jsx
import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function ManualBookingModal({ flightId, seat, onClose, onRefresh }) {
  const [passenger, setPassenger] = useState({ name: "", passport: "", dob: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPassenger(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!passenger.name || !passenger.passport || !passenger.dob) {
      return toast.warn("Please fill all passenger fields");
    }
    setLoading(true);
    try {
      await axiosInstance.post("/booking/manual-booking", { flightId, seat, passenger });
      toast.success("Seat booked manually");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Manual booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-sky-700 mb-4">Manual Booking for {seat.row}{seat.column}</h2>
        <div className="space-y-4">
          {["name","passport"].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field === "name" ? "Full Name" : "Passport #"}
              </label>
              <input
                name={field}
                value={passenger[field]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={passenger.dob}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="btn bg-gray-200">Cancel</button>
          <button
            onClick={handleSubmit}
            className="btn bg-sky-600 text-white"
            disabled={loading}
          >
            {loading ? "Booking…" : "Book Seat"}
          </button>
        </div>
      </div>
    </div>
  );
}
