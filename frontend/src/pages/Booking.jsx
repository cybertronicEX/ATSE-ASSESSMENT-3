import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";
import FullScreenLoader from "../components/Loader";

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
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  
  const handleSearch = async () => {
    if (from && destination) {
      
      try {
        setLoading(true)
        const res = await axiosInstance.get("/flights", {
          params: { departure: from, destination, date },
        });

        const flights = res.data;

        if (flights.length > 0) {
          navigate("/available-flights", {
            state: { from, destination, date, flights },
          });
        } else {
          toast.error("No flights found for the selected criteria.");
        }
      } catch (err) {
        console.error(err)
        toast.error("An error occurred while fetching flights.");
      } finally {
        setLoading(false)
      }
    } else {
      toast.warn("Please fill in all fields.");
    }
  };

  if (loading) return <FullScreenLoader />
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 px-4 py-10">
      {/* Back button */}
      <div className="w-full max-w-lg mb-4 lg:ml-[30%] ml-3 self-start">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sky-600 hover:text-sky-800 flex items-center gap-2"
        >
          <IoArrowBackCircleOutline className="text-5xl md:text-6xl" />
        </button>
      </div>
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
