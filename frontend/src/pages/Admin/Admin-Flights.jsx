import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import EditFlightModal from "../../sections/Admin/Flight/EditFlightModal";
const AdminFlights = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const flightsPerPage = 5;

    const fetchFlights = async () => {
        try {
            const res = await axios.get("/flights");
            setFlights(res.data);
        } catch (err) {
            toast.error("Failed to fetch flights");
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/flights/${id}`);
            toast.success("Flight deleted");
            fetchFlights();
        } catch (err) {
            toast.error("Failed to delete flight");
        }
    };

    const paginated = flights.slice((page - 1) * flightsPerPage, page * flightsPerPage);
    const totalPages = Math.ceil(flights.length / flightsPerPage);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-sky-700 mb-4">Manage Flights</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Flight ID</th>
                            <th>Departure</th>
                            <th>Destination</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Plane</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((flight) => (
                            <tr key={flight.id}>
                                <td>{flight.id}</td>
                                <td>{flight.departure}</td>
                                <td>{flight.destination}</td>
                                <td>{flight.date}</td>
                                <td>{flight.duration}h</td>
                                <td>${flight.price}</td>
                                <td>{flight.planeName || "-"}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info mr-2"
                                        onClick={() => {
                                            setSelectedFlight(flight.id);
                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDelete(flight.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center space-x-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-sm">
                    Prev
                </button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-sm">
                    Next
                </button>
            </div>

            {showModal && (
                <EditFlightModal
                    flightId={selectedFlight}        // ✅ Pass only flightId
                    onClose={() => {
                        setShowModal(false);
                        setSelectedFlight(null);       // Reset after closing
                        fetchFlights();                // Refresh data
                    }}
                    onRefresh={fetchFlights}         // Optionally pass refresh
                />
            )}
        </div>
    );
};

export default AdminFlights;
