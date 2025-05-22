// src/sections/Admin/Flight/BookingInfoModal.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/Loader";
const seatColors = {
    available: "bg-green-100 text-gray-700",
    booked: "bg-red-400 text-white",
    broken: "bg-gray-400 text-white",
    VIP: "bg-purple-300 text-white",
    accessible: "bg-sky-400 text-white",
};

const getSeatColor = seat => {
    if (seat.status === "broken") return seatColors.broken;
    if (seat.status === "booked") return seatColors.booked;
    if (seat.zone === "VIP") return seatColors.VIP;
    if (seat.zone === "accessible") return seatColors.accessible;
    return seatColors.available;
};

export default function BookingInfoModal({
    bookingId,
    passengerRow,
    passengerColumn,
    onClose,
    onRefresh
}) {
    const [booking, setBooking] = useState(null);
    const [passenger, setPassenger] = useState(null);
    const [flightSeats, setFlightSeats] = useState([]);
    const [loading, setLoading] = useState(false)
    const [showMap, setShowMap] = useState(false);
    const [chosen, setChosen] = useState({ row: null, column: "" });

    useEffect(() => {
        axiosInstance.get(`/booking/${bookingId}`)
            .then(r => {
                setBooking(r.data);
                const p = r.data.passengers.find(p => p.row === passengerRow && p.column === passengerColumn);
                if (!p) throw new Error("Passenger not found in booking");
                setPassenger(p);
                return axiosInstance.get(`/flights/${r.data.flightId}`);
            })
            .then(r => setFlightSeats(r.data.seats || []))
            .catch(err => {
                console.error(err);
                toast.error("Failed to load booking or flight data");
                onClose();
            });
    }, [bookingId, passengerRow, passengerColumn, onClose]);

    const startChange = () => {
        setChosen({ row: null, column: "" });
        setShowMap(true);
    };

    const selectSeat = s => {
        if (s.status !== "available") return;
        setChosen({ row: s.row, column: s.column });
    };

    const saveSeat = async () => {
        if (!chosen.row) return toast.warn("Please click an available seat");
        try {
            setLoading(true)
            await axiosInstance.patch(
                `/booking/${bookingId}/passengers/${passengerRow}/${passengerColumn}`,
                { newRow: chosen.row, newColumn: chosen.column }
            );
            toast.success("Seat updated");
            onRefresh();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update seat");
        } finally {
            setLoading(false)
        }
    };

    const cancelChange = () => {
        setShowMap(false);
    };

    const handleRemove = async () => {
        if (!window.confirm("Remove this passenger?")) return;
        try {
            setLoading(true)
            await axiosInstance.delete(
                `/booking/${bookingId}/passengers/${passengerRow}/${passengerColumn}`
            );
            toast.success("Passenger removed");
            onRefresh();
            onClose();
        } catch (err) {
            toast.error("Failed to remove passenger");
        } finally {
            setLoading(false)
        }
    };

    if (!booking || !passenger) return null;

    const cols = [...new Set(flightSeats.map(s => s.column))].sort();
    const maxRow = Math.max(...flightSeats.map(s => s.row));
    const mid = Math.ceil(cols.length / 2);
    const leftCols = cols.slice(0, mid);
    const rightCols = cols.slice(mid);

    const rows = Array.from({ length: maxRow }, (_, i) => {
        const r = i + 1;
        const rowSeats = flightSeats.filter(s => s.row === r);
        return {
            left: leftCols.map(c => rowSeats.find(s => s.column === c)),
            right: rightCols.map(c => rowSeats.find(s => s.column === c)),
        };
    });

    if (loading) {
        return <div><FullScreenLoader /></div>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-sky-700 mb-4">
                    Booking #{booking.bookingId}
                </h2>

                <div className="mb-4 border p-4 rounded">
                    <p className="text-md  text-sky-700 mb-1"><b>Name:</b>     {passenger.name}</p>
                    <p className="text-md  text-sky-700 mb-1"><b>Passport:</b> {passenger.passport}</p>
                    <p className="text-md  text-sky-700 mb-1"><b>DOB:</b>      {passenger.dob}</p>
                    <p className="text-md  text-sky-700 mb-1"><b>Seat:</b>     {passenger.row}{passenger.column}</p>
                    <div className="mt-3 space-x-2">
                        <button
                            onClick={startChange}
                            className="btn btn-sm bg-yellow-400 text-white"
                        >
                            Change Seat
                        </button>
                        <button
                            onClick={handleRemove}
                            className="btn btn-sm btn-error"
                        >
                            Remove
                        </button>
                    </div>
                </div>

                {showMap && (
                    <div className="mb-4 p-4 border rounded">
                        <h3 className="font-semibold mb-2">
                            Select new seat for {passengerRow}{passengerColumn}
                        </h3>
                        <div className="flex gap-6 justify-center mb-4">
                            <div>
                                {rows.map((r, i) => (
                                    <div key={i} className="flex gap-1 mb-1">
                                        {r.left.map(s => s ? (
                                            <div
                                                key={`${s.row}${s.column}`}
                                                onClick={() => selectSeat(s)}
                                                className={`cursor-pointer w-8 h-8 flex items-center justify-center text-xs border rounded ${chosen.row === s.row && chosen.column === s.column
                                                    ? "ring-2 ring-sky-600"
                                                    : getSeatColor(s)
                                                    }`}
                                            >
                                                {s.row}{s.column}
                                            </div>
                                        ) : <div key={`${i}-e`} className="w-8 h-8" />)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                {rows.map((r, i) => (
                                    <div key={i} className="flex gap-1 mb-1">
                                        {r.right.map(s => s ? (
                                            <div
                                                key={`${s.row}${s.column}`}
                                                onClick={() => selectSeat(s)}
                                                className={`cursor-pointer w-8 h-8 flex items-center justify-center text-xs border rounded ${chosen.row === s.row && chosen.column === s.column
                                                    ? "ring-2 ring-sky-600"
                                                    : getSeatColor(s)
                                                    }`}
                                            >
                                                {s.row}{s.column}
                                            </div>
                                        ) : <div key={`${i}-r`} className="w-8 h-8" />)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={cancelChange} className="btn bg-sky-700">
                                Cancel
                            </button>
                            <button onClick={saveSeat} className="btn bg-sky-500 text-white">
                                Save
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-right mt-4">
                    <button onClick={onClose} className="btn bg-sky-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
