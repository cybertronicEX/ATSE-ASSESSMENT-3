import { useState } from "react";
import BookingFormModal from "./BookingFormModal";
// Color logic based on seat properties
const getSeatColor = (seat) => {
    if (seat.status === "booked") return "bg-red-400 text-white";
    if (seat.status === "broken") return "bg-gray-400 text-white";
    if (seat.zone === "VIP") return "bg-purple-300 text-white";
    if (seat.zone === "accessible") return "bg-sky-400 text-white";
    return "bg-green-100 text-gray-700";
};

const SeatModal = ({ flight, seats = [], onClose, passengerData, setPassengerData, handleSubmit, errors, setErrors }) => {
    // Determine all columns and rows
    const allColumns = [...new Set(seats.map((s) => s.column))].sort();
    const maxRow = Math.max(...seats.map((s) => s.row));
    const midIndex = Math.ceil(allColumns.length / 2);
    const leftCols = allColumns.slice(0, midIndex);
    const rightCols = allColumns.slice(midIndex);

    // Group seats by row
    const groupedRows = Array.from({ length: maxRow }, (_, i) => {
        const rowNum = i + 1;
        const rowSeats = seats.filter((s) => s.row === rowNum);
        return {
            left: leftCols.map((col) => rowSeats.find((s) => s.column === col)),
            right: rightCols.map((col) => rowSeats.find((s) => s.column === col)),
        };
    });


    //Booking modal
    const [showBookingForm, setShowBookingForm] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative">
                <span className="flex flex-row justify-between">
                    <h3 className="text-2xl font-bold text-sky-600 mb-4">
                        Seats for {flight.flight}
                    </h3>
                    <button
                        className="btn bg-sky-700 text-white hover:bg-sky-800 ml-2"
                        onClick={() => setShowBookingForm(true)}
                    >
                        Book Tickets
                    </button>
                </span>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {[
                        { label: "Available", color: "bg-green-100" },
                        { label: "Booked", color: "bg-red-400 text-white" },
                        { label: "Broken", color: "bg-gray-400 text-white" },
                        { label: "VIP", color: "bg-purple-300 text-white" },
                        { label: "Accessible", color: "bg-sky-400 text-white" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${item.color}`} />
                            <span className="text-sm text-gray-700">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Seat Grid */}
                <div className="border border-gray-300 rounded-xl p-4">
                    <div className="flex gap-10 justify-center">
                        {/* Left Side */}
                        <div>
                            <h4 className="text-center text-gray-500 font-semibold mb-2">
                                Left Side
                            </h4>
                            <div className="flex flex-col gap-2">
                                {groupedRows.map((row, i) => (
                                    <div key={i} className="flex gap-2">
                                        {row.left.map((seat, j) => {
                                            const seatId = `${i + 1}${leftCols[j]}`;
                                            if (!seat) return null;
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={`w-10 text-xs text-center py-2 border rounded-md ${seat ? getSeatColor(seat) : "bg-gray-200 text-gray-500"
                                                        }`}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div>
                            <h4 className="text-center text-gray-500 font-semibold mb-2">
                                Right Side
                            </h4>
                            <div className="flex flex-col gap-2">
                                {groupedRows.map((row, i) => (
                                    <div key={i} className="flex gap-2">
                                        {row.right.map((seat, j) => {
                                            const seatId = `${i + 1}${rightCols[j]}`;
                                            if (!seat) return null;
                                            return (
                                                <div
                                                    key={seatId}
                                                    className={`w-10 text-xs text-center py-2 border rounded-md ${seat ? getSeatColor(seat) : "bg-gray-200 text-gray-500"
                                                        }`}
                                                >
                                                    {seatId}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        className="btn bg-sky-500 text-white hover:bg-sky-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
            {showBookingForm && <BookingFormModal onClose={() => setShowBookingForm(false)} passengerData={passengerData}
                setPassengerData={setPassengerData}
                handleSubmit={handleSubmit}
                errors={errors}
                setErrors={setErrors}
                seats={seats} />}
        </div>
    );

};



export default SeatModal;
