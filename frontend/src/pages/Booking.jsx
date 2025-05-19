import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cityOptions = [
  "Colombo",
  "Dubai",
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Singapore",
  "Sydney",
];

const Booking = () => {
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (from && destination && date) {
      navigate("/available-flights", { state: { from, destination, date } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-sky-600 mb-6">Book a Flight</h2>
        <div className="space-y-4">

          {/* From City */}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select Departure City</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* To City */}
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select Destination</option>
            {cityOptions
              .filter((city) => city !== from)
              .map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered w-full"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="btn bg-sky-500 hover:bg-sky-600 text-white w-full"
          >
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
