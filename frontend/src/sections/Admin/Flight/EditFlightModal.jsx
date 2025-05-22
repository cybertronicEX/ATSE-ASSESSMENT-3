// src/sections/Admin/Flight/EditFlightModal.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

// you’ll need to create these two components exactly as in the last answer
import BookingInfoModal from "./BookingInfoModal";
import ManualBookingModal from "./ManualBookingModal";

const seatColors = {
    available: "bg-green-100 text-gray-700",
    booked: "bg-red-400 text-white",
    broken: "bg-gray-400 text-white",
    VIP: "bg-purple-300 text-white",
    accessible: "bg-sky-400 text-white",
};

const getSeatColor = (seat) => {
    if (seat.status === "broken") return seatColors.broken;
    if (seat.status === "booked") return seatColors.booked;
    if (seat.zone === "VIP") return seatColors.VIP;
    if (seat.zone === "accessible") return seatColors.accessible;
    return seatColors.available;
};

export default function EditFlightModal({ flightId, onClose, onRefresh }) {
    const [flightData, setFlightData] = useState(null);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);

    // for opening the two modals:
    const [setBookingId, setSetBookingId] = useState(null);
    const [passenger, setPassenger] = useState({ row: '', column: '' })
    const [setSeat, setSetSeat] = useState(null);

    // fetch flight + seats
    useEffect(() => {
        axiosInstance.get(`/flights/${flightId}`)
            .then(r => {
                setFlightData(r.data);
                setSeats(r.data.seats || []);
            })
            .catch(() => {
                toast.error("Failed to load flight");
                onClose();
            });
    }, [flightId, onClose]);

    // seat‐click handler
    const onSeatClick = (seat) => {
        if (seat.status === "booked" && seat.assignedTo) {
            // show the booking info
            setSetBookingId(seat.assignedTo);
            setPassenger({ row: seat.row, column: seat.column })

        } else if (seat.status === "available") {
            // open manual‐booking for this seat
            setSetSeat(seat);
        }
    };

    const handleInputChange = (e) => {
        setFlightData({ ...flightData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axiosInstance.put(`/flights/${flightId}`, {
                ...flightData,
                seats
            });
            toast.success("Flight updated");
            onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!flightData) return null;

    // layout seats by left/right
    const allCols = [...new Set(seats.map(s => s.column))].sort();
    const maxRow = Math.max(...seats.map(s => s.row));
    const leftCols = allCols.slice(0, Math.ceil(allCols.length / 2));
    const rightCols = allCols.slice(Math.ceil(allCols.length / 2));

    const rows = Array.from({ length: maxRow }, (_, i) => {
        const r = i + 1;
        const rowSeats = seats.filter(s => s.row === r);
        return {
            left: leftCols.map(c => rowSeats.find(s => s.column === c)),
            right: rightCols.map(c => rowSeats.find(s => s.column === c)),
        };
    });

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-sky-700 mb-4">Edit Flight</h2>

                    {/* flight inputs */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {[
                            ["departure", "text", "Departure"],
                            ["destination", "text", "Destination"],
                            ["date", "date", "Date"],
                            ["departureTime", "time", "Departure Time"],
                            ["duration", "number", "Duration (hrs)"],
                            ["price", "number", "Price ($)"]
                        ].map(([name, type, label]) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700">
                                    {label}
                                </label>
                                <input
                                    name={name}
                                    type={type}
                                    className="input input-bordered w-full"
                                    value={flightData[name]}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                    </div>

                    {/* seat grid */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Seat Map</h3>
                        <div className="flex gap-10 justify-center">
                            {/* left */}
                            <div>
                                <div className="flex flex-col gap-2">
                                    {rows.map((r, i) => (
                                        <div key={i} className="flex gap-2">
                                            {r.left.map((s, j) => {
                                                if (!s) return null;
                                                return (
                                                    <div
                                                        key={`${s.row}${s.column}`}
                                                        onClick={() => onSeatClick(s)}
                                                        className={`cursor-pointer w-10 text-xs text-center py-2 border rounded-md ${getSeatColor(s)}`}
                                                    >
                                                        {s.row}{s.column}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* right */}
                            <div>
                                <div className="flex flex-col gap-2">
                                    {rows.map((r, i) => (
                                        <div key={i} className="flex gap-2">
                                            {r.right.map((s, j) => {
                                                if (!s) return null;
                                                return (
                                                    <div
                                                        key={`${s.row}${s.column}`}
                                                        onClick={() => onSeatClick(s)}
                                                        className={`cursor-pointer w-10 text-xs text-center py-2 border rounded-md ${getSeatColor(s)}`}
                                                    >
                                                        {s.row}{s.column}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* actions */}
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="btn bg-gray-200">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            className="btn bg-sky-600 text-white"
                            disabled={loading}
                        >
                            {loading ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* booked‐seat info */}
            {setBookingId && (
                <BookingInfoModal
                    bookingId={setBookingId}
                    onClose={() => setSetBookingId(null)}
                    passengerRow={passenger.row}
                    passengerColumn={passenger.column}
                    onRefresh={() => {
                        // re‐fetch flight
                        axiosInstance.get(`/flights/${flightId}`)
                            .then(r => setSeats(r.data.seats || []))
                            .catch();
                    }}
                />
            )}

            {/* manual booking */}
            {setSeat && (
                <ManualBookingModal
                    flightId={flightId}
                    seat={setSeat}
                    onClose={() => setSetSeat(null)}
                    onRefresh={() => {
                        // re‐fetch flight
                        axiosInstance.get(`/flights/${flightId}`)
                            .then(r => setSeats(r.data.seats || []))
                            .catch();
                    }}
                />
            )}
        </>
    );
}
