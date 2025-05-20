// AvailableFlights.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeatModal from "./SeatsModal"; // We'll define this next
import { IoArrowBackCircleOutline } from "react-icons/io5";

const mockFlights = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    flight: `Airline ${i + 1}`,
    date: i % 2 === 0 ? "2025-05-19" : "2025-06-02",
    price: (120 + i * 5).toFixed(2),
    duration: `${1 + (i % 5)}h ${(i * 7) % 60}m`,
    takenSeats: Array.from({ length: Math.floor(Math.random() * 30) }, () =>
        `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 10) + 1}`
    )
}));

export default function AvailableFlights() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [page, setPage] = useState(1);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const flightsPerPage = 10;
    const filteredFlights = mockFlights.filter(f => f.date === state?.date);
    const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);
    const start = (page - 1) * flightsPerPage;
    const flightsToShow = filteredFlights.slice(start, start + flightsPerPage);


    //dummy data
    const seats = [
        // Row 1 - Accessible
        { row: 1, column: "A", type: "window", status: "available", zone: "accessible", assignedTo: null },
        { row: 1, column: "B", type: "middle", status: "available", zone: "accessible", assignedTo: null },
        { row: 1, column: "C", type: "middle", status: "broken", zone: "accessible", assignedTo: null },
        { row: 1, column: "D", type: "window", status: "available", zone: "accessible", assignedTo: null },
        { row: 1, column: "E", type: "window", status: "available", zone: "accessible", assignedTo: null },

        // Row 2 - Standard
        { row: 2, column: "A", type: "window", status: "booked", zone: "standard", assignedTo: "12345678" },
        { row: 2, column: "B", type: "aisle", status: "available", zone: "standard", assignedTo: null },
        { row: 2, column: "C", type: "aisle", status: "available", zone: "standard", assignedTo: null },
        { row: 2, column: "D", type: "window", status: "booked", zone: "standard", assignedTo: "23456789" },

        // Row 3 - Standard
        { row: 3, column: "A", type: "window", status: "available", zone: "standard", assignedTo: null },
        { row: 3, column: "B", type: "middle", status: "broken", zone: "standard", assignedTo: null },
        { row: 3, column: "C", type: "middle", status: "available", zone: "standard", assignedTo: null },
        { row: 3, column: "D", type: "window", status: "booked", zone: "standard", assignedTo: "34567890" },

        // Row 4 - VIP
        { row: 4, column: "A", type: "window", status: "available", zone: "VIP", assignedTo: null },
        { row: 4, column: "B", type: "aisle", status: "booked", zone: "VIP", assignedTo: "45678901" },
        { row: 4, column: "C", type: "aisle", status: "available", zone: "VIP", assignedTo: null },
        { row: 4, column: "D", type: "window", status: "available", zone: "VIP", assignedTo: null },

        // Row 5 - VIP
        { row: 5, column: "A", type: "window", status: "reserved", zone: "VIP", assignedTo: null },
        { row: 5, column: "B", type: "middle", status: "available", zone: "VIP", assignedTo: null },
        { row: 5, column: "C", type: "middle", status: "broken", zone: "VIP", assignedTo: null },
        { row: 5, column: "D", type: "window", status: "available", zone: "VIP", assignedTo: null },
    ];


    return (
        <div className="min-h-screen bg-sky-50 px-4 py-10">
            <div className="w-full max-w-lg mb-4 lg:ml-[10%] ml-3 self-start">
                <button
                    onClick={() => navigate("/booking")}
                    className="text-sky-600 hover:text-sky-800 flex items-center gap-2"
                >
                    <IoArrowBackCircleOutline className="text-5xl md:text-6xl" />
                </button>
            </div>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-sky-600 mb-6">
                    Flights to {state?.destination} on {state?.date}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {flightsToShow.map((flight) => (
                        <button
                            key={flight.id}
                            onClick={() => { setSelectedFlight(flight); setModalOpen(true); }}
                            className="bg-white p-6 rounded-xl shadow-md text-left hover:ring-2 hover:ring-sky-300"
                        >
                            <h3 className="text-xl font-semibold text-sky-700">{flight.flight}</h3>
                            <p className="text-gray-600 mt-1">Date: {flight.date}</p>
                            <p className="text-gray-600">Duration: {flight.duration}</p>
                            <p className="text-lg font-bold text-green-600 mt-2">${flight.price}</p>
                        </button>
                    ))}
                </div>

                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="btn btn-sm bg-sky-400 text-white hover:bg-sky-500"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="btn btn-sm bg-sky-400 text-white hover:bg-sky-500"
                    >
                        Next
                    </button>
                </div>

                {selectedFlight && isModalOpen && (
                    <SeatModal
                        flight={{ flight: "Emirates EK 74" }}
                        onClose={() => setModalOpen(false)}
                        seats={seats}
                    />

                )}
            </div>
        </div>
    );
}


// add VIP sections child rows and special needs