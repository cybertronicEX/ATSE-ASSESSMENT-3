import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import SeatModal from "./SeatsModal";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/Loader";


export default function AvailableFlights() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [page, setPage] = useState(1);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [seats, setSeats] = useState([]);
    const flights = state?.flights || [];
    const [loading, setLoading] = useState(false)

    const flightsPerPage = 10;
    const totalPages = Math.ceil(flights.length / flightsPerPage);
    const start = (page - 1) * flightsPerPage;
    const flightsToShow = flights.slice(start, start + flightsPerPage);

    const fetchSeats = async (flightId) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/flights/${flightId}`);
            if (res.data?.seats) {
                setSeats(res.data.seats);
            } else {
                toast.error("No seat map found.");
                setSeats([]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching seat map.");
        }
        finally {
            setLoading(false);
        }
    };

    const handleFlightClick = async (flight) => {
        setSelectedFlight(flight);
        await fetchSeats(flight.id);
        setModalOpen(true);
    };

    // Booking Data 
    const [passengerData, setPassengerData] = useState([
        { name: "", passport: "", dob: "", zone: "" },
    ]);
    const [errors, setErrors] = useState([]);

    const validate = () => {
        const newErrors = passengerData.map((p) => ({
            name: !p.name,
            passport: !p.passport,
            dob: !p.dob,
            zone: !p.zone,
        }));
        setErrors(newErrors);
        return !newErrors.some((e) => Object.values(e).some(Boolean));
    };

    const handleSubmit = async () => {
        if (!validate()) return;


        try {
            const response = await axiosInstance.post("/booking", {
                flightId: selectedFlight.id,
                passengers: passengerData,
            });
            toast.success("Booking Success:", response.data);
            await fetchSeats(selectedFlight.id);
            setPassengerData([
                { name: "", passport: "", dob: "", zone: "" },
            ])
        } catch (err) {
            console.error("Booking failed:", err);
            const message = err.response?.data?.error || "Something went wrong. Please try again.";
            toast.error(`Booking failed. ${message}`);
        }
    };


    if (loading) return <FullScreenLoader />

    return (
        <div className="min-h-screen bg-sky-50 px-4 py-10">
            {/* Back Button */}
            <div className="w-full max-w-lg mb-4 lg:ml-[10%] ml-3 self-start">
                <button
                    onClick={() => navigate("/booking")}
                    className="text-sky-600 hover:text-sky-800 flex items-center gap-2"
                >
                    <IoArrowBackCircleOutline className="text-5xl md:text-6xl" />
                </button>
            </div>

            {/* Title */}
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-sky-600 mb-6">
                    Flights to {state?.destination} on {state?.date}
                </h2>

                {/* Flight Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {flightsToShow.map((flight) => (
                        <button
                            key={flight.id}
                            onClick={() => handleFlightClick(flight)}
                            className="bg-white p-6 rounded-xl shadow-md text-left hover:ring-2 hover:ring-sky-300"
                        >
                            <h3 className="text-xl font-semibold text-sky-700">{flight.planeName || flight.id}</h3>
                            <p className="text-gray-600 mt-1">Date: {flight.date}</p>
                            <p className="text-gray-600">From: {flight.departure} → {flight.destination}</p>
                            <p className="text-gray-600">Duration: {flight.duration}</p>
                            <p className="text-lg font-bold text-green-600 mt-2">${flight.price}</p>
                        </button>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="btn btn-sm bg-sky-400 text-white hover:bg-sky-500"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="btn btn-sm bg-sky-400 text-white hover:bg-sky-500"
                    >
                        Next
                    </button>
                </div>

                {/* Seat Modal */}
                {selectedFlight && isModalOpen && (
                    <SeatModal
                        flight={selectedFlight}
                        onClose={() => setModalOpen(false)}
                        seats={seats}
                        passengerData={passengerData}
                        setPassengerData={setPassengerData}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        setErrors={setErrors}
                    />
                )}
            </div>
        </div>
    );
}
