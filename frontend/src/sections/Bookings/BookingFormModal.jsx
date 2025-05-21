import React, { useState } from "react";

const BookingFormModal = ({ onClose, passengerData, setPassengerData, handleSubmit, errors, setErrors, seats }) => {
  const [seatCount, setSeatCount] = useState(1);


  const handleSeatCountChange = (e) => {
    const count = Number(e.target.value);
    setSeatCount(count);
    setPassengerData((prev) =>
      Array.from({ length: count }, (_, i) => prev[i] || { name: "", passport: "", dob: "", zone: "" })
    );
    setErrors([]);
  };

  const handleInputChange = (i, field, value) => {
    const updated = [...passengerData];
    updated[i][field] = value;
    setPassengerData(updated);
  };


  const handleSubmitFunctions = async () => {
    await handleSubmit();
    onClose();
    setSeatCount(1);
  }


  // Check if all VIP or Accessible seats are booked
  const isZoneFullyBooked = (zoneName) => {
    const zoneSeats = seats.filter(seat => seat.zone.toLowerCase() === zoneName.toLowerCase());
    return zoneSeats.length > 0 && zoneSeats.every(seat => seat.status !== "available");
  };

  const vipDisabled = isZoneFullyBooked("VIP");
  const accessibleDisabled = isZoneFullyBooked("Accessible");

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-sky-600 mb-4">Passenger Details</h2>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Number of Seats</span>
          <select
            value={seatCount}
            onChange={handleSeatCountChange}
            className="select select-bordered w-full"
          >
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-6">
          {passengerData.map((passenger, i) => (
            <div key={i} className="border border-gray-300 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Passenger {i + 1}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={`input input-bordered w-full ${errors[i]?.name ? "border-red-500" : ""}`}
                    value={passenger.name}
                    onChange={(e) => handleInputChange(i, "name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Passport Number</label>
                  <input
                    type="text"
                    placeholder="Passport Number"
                    className={`input input-bordered w-full ${errors[i]?.passport ? "border-red-500" : ""}`}
                    value={passenger.passport}
                    onChange={(e) => handleInputChange(i, "passport", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors[i]?.dob ? "border-red-500" : ""}`}
                    value={passenger.dob}
                    onChange={(e) => handleInputChange(i, "dob", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Zone</label>
                  <select
                    className={`select select-bordered w-full ${errors[i]?.zone ? "border-red-500" : ""}`}
                    value={passenger.zone}
                    onChange={(e) => handleInputChange(i, "zone", e.target.value)}
                  >
                    <option value="standard">Standard</option>
                    <option value="VIP" disabled={vipDisabled}>VIP {vipDisabled ? "(Fully Booked)" : ""}</option>
                    <option value="accessible" disabled={accessibleDisabled}>Accessible {accessibleDisabled ? "(Fully Booked)" : ""}</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="btn bg-white border border-sky-500 text-sky-500 hover:text-white hover:bg-sky-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn bg-sky-500 text-white border-none hover:bg-sky-600"
            onClick={handleSubmitFunctions}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
