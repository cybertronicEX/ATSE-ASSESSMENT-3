const { db } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

exports.createBooking = async (req, res) => {
    const { flightId, passengers } = req.body;

    if (!flightId || !Array.isArray(passengers) || passengers.length === 0 || passengers.length > 7) {
        return res.status(400).json({ error: "Flight ID and 1-7 passengers are required." });
    }

    try {
        const flightRef = db.collection("flights").doc(flightId);
        const flightDoc = await flightRef.get();
        if (!flightDoc.exists) {
            return res.status(404).json({ error: "Flight not found." });
        }

        const flightData = flightDoc.data();
        let allSeats = flightData.seats || [];

        if (!Array.isArray(allSeats) || allSeats.length === 0) {
            return res.status(400).json({ error: "No seats available in this flight." });
        }

        const bookingId = uuidv4();
        const assignedSeats = [];
        const passengerCount = passengers.length;

        const isChild = (dob) => {
            const age = dayjs().diff(dayjs(dob), "year");
            return age < 12;
        };

        // Get only available seats
        let availableSeats = allSeats.filter(seat => seat.status === "available");

        const zone = passengers[0].zone.toLowerCase();

        // If group (2-7): try to find block of adjacent seats
        if (passengerCount > 1) {
            let zoneSeats = availableSeats.filter(seat => seat.zone.toLowerCase() === zone);

            const rows = {};
            for (const seat of zoneSeats) {
                if (!rows[seat.row]) rows[seat.row] = [];
                rows[seat.row].push(seat);
            }

            let foundBlock = [];

            for (const row in rows) {
                const seatsInRow = rows[row].sort((a, b) => a.column.localeCompare(b.column));
                for (let i = 0; i <= seatsInRow.length - passengerCount; i++) {
                    const block = seatsInRow.slice(i, i + passengerCount);
                    if (block.length === passengerCount) {
                        foundBlock = block;
                        break;
                    }
                }
                if (foundBlock.length) break;
            }

            if (!foundBlock.length) {
                return res.status(400).json({ error: `No block of ${passengerCount} seats available in ${zone} zone.` });
            }

            // Assign block to passengers
            for (let i = 0; i < passengerCount; i++) {
                const seat = foundBlock[i];
                const passenger = passengers[i];

                seat.status = "booked";
                seat.assignedTo = bookingId;

                assignedSeats.push({ ...passenger, row: seat.row, column: seat.column });

                const index = allSeats.findIndex(s => s.row === seat.row && s.column === seat.column);
                if (index > -1) allSeats[index] = seat;
            }

        } else {
            // Single passenger logic
            const passenger = passengers[0];

            let candidateSeats = availableSeats.filter(seat =>
                seat.zone.toLowerCase() === zone
            );

            if (isChild(passenger.dob)) {
                candidateSeats = candidateSeats.filter(seat => seat.type !== "aisle");
            }

            // Prioritize window or Aisle if not a child
            if (!isChild(passenger.dob)) {
                const lonerSeat = candidateSeats.find(seat => seat.type === "window" || seat.type === "aisle");
                if (lonerSeat) {
                    candidateSeats = [lonerSeat];
                }
            }

            const seat = candidateSeats[0];
            if (!seat) {
                return res.status(400).json({ error: `No suitable seat available for ${passenger.name}` });
            }

            seat.status = "booked";
            seat.assignedTo = bookingId;

            assignedSeats.push({ ...passenger, row: seat.row, column: seat.column });

            const index = allSeats.findIndex(s => s.row === seat.row && s.column === seat.column);
            if (index > -1) allSeats[index] = seat;
        }

        // Save booking
        await db.collection("bookings").doc(bookingId).set({
            bookingId,
            flightId,
            passengers: assignedSeats,
            createdAt: new Date(),
        });

        // Update seats array in flight
        await flightRef.update({ seats: allSeats });

        res.status(201).json({ message: "Booking successful", bookingId, passengers: assignedSeats });

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: error.message });
    }
};
