// AvailableFlights.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SeatModal from "./SeatsModal"; // We'll define this next

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
    const { state } = useLocation();
    const [page, setPage] = useState(1);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const flightsPerPage = 10;
    const filteredFlights = mockFlights.filter(f => f.date === state?.date);
    const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);
    const start = (page - 1) * flightsPerPage;
    const flightsToShow = filteredFlights.slice(start, start + flightsPerPage);

    return (
        <div className="min-h-screen bg-sky-50 px-4 py-10">
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
                        takenSeats={["2B", "3C", "5F", "7A", "8H"]}
                        rows={12}
                        leftColumns={["A", "B", "C"]}
                        rightColumns={["D", "E", "F"]}
                    />

                )}
            </div>
        </div>
    );
}


// add VIP sections child rows and special needs