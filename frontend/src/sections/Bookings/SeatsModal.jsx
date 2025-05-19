export default function SeatModal({
    flight,
    onClose,
    takenSeats,
    rows,
    leftColumns,
    rightColumns,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative">
                <h3 className="text-2xl font-bold text-sky-600 mb-4">
                    Seats for {flight.flight}
                </h3>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Left side */}
                    <div>
                        <h4 className="text-center text-gray-500 font-semibold mb-2">Left Side</h4>
                        <div className={`grid grid-cols-${leftColumns.length} gap-2`}>
                            {Array.from({ length: rows }).map((_, rowIdx) =>
                                leftColumns.map((col) => {
                                    const seatId = `${rowIdx + 1}${col}`;
                                    const isTaken = takenSeats.includes(seatId);
                                    return (
                                        <div
                                            key={seatId}
                                            className={`text-xs text-center py-2 border rounded-md ${isTaken
                                                    ? "bg-red-400 text-white"
                                                    : "bg-green-100 text-gray-700"
                                                }`}
                                        >
                                            {seatId}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                  
                    {/* Right side */}
                    <div>
                        <h4 className="text-center text-gray-500 font-semibold mb-2">Right Side</h4>
                        <div className={`grid grid-cols-${rightColumns.length} gap-2`}>
                            {Array.from({ length: rows }).map((_, rowIdx) =>
                                rightColumns.map((col) => {
                                    const seatId = `${rowIdx + 1}${col}`;
                                    const isTaken = takenSeats.includes(seatId);
                                    return (
                                        <div
                                            key={seatId}
                                            className={`text-xs text-center py-2 border rounded-md ${isTaken
                                                    ? "bg-red-400 text-white"
                                                    : "bg-green-100 text-gray-700"
                                                }`}
                                        >
                                            {seatId}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        className="btn bg-sky-500 text-white hover:bg-sky-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
