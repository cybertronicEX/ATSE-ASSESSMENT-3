const { db } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");


exports.createBooking = async (req, res) => {
    const { flightId, passengers } = req.body;
    const userId = req.user.uid;
    if (
        !flightId ||
        !Array.isArray(passengers) ||
        passengers.length === 0 ||
        passengers.length > 7
    ) {
        return res.status(400).json({
            error: "Flight ID and between 1-7 passengers are required."
        });
    }

    try {
        const flightRef = db.collection("flights").doc(flightId);
        const flightDoc = await flightRef.get();
        if (!flightDoc.exists) {
            return res.status(404).json({ error: "Flight not found." });
        }
        const flightData = flightDoc.data();
        let allSeats = Array.isArray(flightData.seats)
            ? [...flightData.seats]
            : [];
        if (allSeats.length === 0) {
            return res
                .status(400)
                .json({ error: "No seats are configured on this flight." });
        }

        const isChild = dob => dayjs().diff(dayjs(dob), "year") < 12;
        const isSenior = dob => dayjs().diff(dayjs(dob), "year") >= 60;

        // Only consider currently available seats
        let available = allSeats.filter(s => s.status === "available");
        if (available.length < passengers.length) {
            return res
                .status(400)
                .json({ error: "Not enough available seats for that many passengers." });
        }

        const bookingId = uuidv4();
        const N = passengers.length;
        const assigned = [];

        // SINGLE-PASSENGER CASE
        if (N === 1) {
            const p = passengers[0];
            // Filter to this passenger’s requested zone
            let cands = available.filter(
                s => s.zone.toLowerCase() === p.zone.toLowerCase()
            );

            // apply age-based preferences
            if (isChild(p.dob)) {
                cands = cands.filter(s => s.type !== "aisle");
            } else if (isSenior(p.dob)) {
                const aisle = cands.find(s => s.type === "aisle");
                if (aisle) cands = [aisle];
            } else {
                // adult: window preferred, then aisle
                const win = cands.find(s => s.type === "window");
                if (win) {
                    cands = [win];
                } else {
                    const aisle = cands.find(s => s.type === "aisle");
                    if (aisle) cands = [aisle];
                }
            }

            const seat = cands[0];
            if (!seat) {
                return res
                    .status(400)
                    .json({ error: `No suitable seat available for ${p.name}` });
            }

            // Mark as booked
            seat.status = "booked";
            seat.assignedTo = bookingId;
            const idx = allSeats.findIndex(
                s => s.row === seat.row && s.column === seat.column
            );
            allSeats[idx] = seat;

            assigned.push({ ...p, row: seat.row, column: seat.column });
        }

        // GROUP CASE (2–7 PASSENGERS)
        else {
            // If they requested more than one zone, assign each passenger individually
            const uniqueZones = [
                ...new Set(passengers.map(p => p.zone.toLowerCase()))
            ];
            if (uniqueZones.length > 1) {
                for (const p of passengers) {
                    // Available in that passenger’s zone
                    let pAvailable = allSeats.filter(
                        s =>
                            s.status === "available" &&
                            s.zone.toLowerCase() === p.zone.toLowerCase()
                    );

                    // apply the same age-based logic
                    if (isChild(p.dob)) {
                        pAvailable = pAvailable.filter(s => s.type !== "aisle");
                    } else if (isSenior(p.dob)) {
                        const aisle = pAvailable.find(s => s.type === "aisle");
                        if (aisle) pAvailable = [aisle];
                    } else {
                        const win = pAvailable.find(s => s.type === "window");
                        if (win) {
                            pAvailable = [win];
                        } else {
                            const aisle = pAvailable.find(s => s.type === "aisle");
                            if (aisle) pAvailable = [aisle];
                        }
                    }

                    const seat = pAvailable[0];
                    if (!seat) {
                        return res
                            .status(400)
                            .json({ error: `No suitable ${p.zone} seat available for ${p.name}` });
                    }

                    // Mark booked in both lists
                    seat.status = "booked";
                    seat.assignedTo = bookingId;
                    const allIdx = allSeats.findIndex(
                        s => s.row === seat.row && s.column === seat.column
                    );
                    allSeats[allIdx] = seat;

                    assigned.push({
                        ...p,
                        row: seat.row,
                        column: seat.column
                    });
                }
            } else {
                // All in the same zone → use original contiguous-block logic

                // split into kids, seniors, adults
                const kids = passengers.filter(p => isChild(p.dob));
                const seniors = passengers.filter(p => isSenior(p.dob));
                const rest = passengers.filter(
                    p => !isChild(p.dob) && !isSenior(p.dob)
                );

                // ASSIGN KIDS (never aisle)
                for (const p of kids) {
                    let idx = available.findIndex(
                        s => s.type === "window" || s.type === "middle"
                    );
                    if (idx < 0) {
                        idx = available.findIndex(s => s.type !== "aisle");
                    }
                    if (idx < 0) {
                        return res
                            .status(400)
                            .json({ error: `No non-aisle seat available for child ${p.name}` });
                    }
                    const seat = available.splice(idx, 1)[0];
                    const allIdx = allSeats.findIndex(
                        s => s.row === seat.row && s.column === seat.column
                    );
                    seat.status = "booked";
                    seat.assignedTo = bookingId;
                    allSeats[allIdx] = seat;
                    assigned.push({ ...p, row: seat.row, column: seat.column });
                }

                // remaining: seniors first, then adults
                const ordered = [...seniors, ...rest];
                const M = ordered.length;

                // group seats by row for contiguity
                const rowsMap = available.reduce((acc, s) => {
                    acc[s.row] = acc[s.row] || [];
                    acc[s.row].push(s);
                    return acc;
                }, {});

                // find a contiguous block of size M
                let block = [];
                for (const row of Object.keys(rowsMap)) {
                    const seatsInRow = rowsMap[row].sort((a, b) =>
                        a.column.localeCompare(b.column)
                    );
                    for (let i = 0; i <= seatsInRow.length - M; i++) {
                        const cand = seatsInRow.slice(i, i + M);
                        if (cand.length === M) {
                            block = cand;
                            break;
                        }
                    }
                    if (block.length) break;
                }
                // fallback: first M seats
                if (!block.length) {
                    block = available
                        .sort((a, b) =>
                            a.row !== b.row
                                ? a.row - b.row
                                : a.column.localeCompare(b.column)
                        )
                        .slice(0, M);
                }

                // assign block seats: seniors prefer aisle
                const pool = [...block];
                for (const p of ordered) {
                    let pickIndex = -1;
                    if (isSenior(p.dob)) {
                        pickIndex = pool.findIndex(s => s.type === "aisle");
                    }
                    if (pickIndex < 0) {
                        pickIndex = 0;
                    }
                    const seat = pool.splice(pickIndex, 1)[0];
                    const availIdx = available.findIndex(
                        s => s.row === seat.row && s.column === seat.column
                    );
                    available.splice(availIdx, 1);

                    const allIdx = allSeats.findIndex(
                        s => s.row === seat.row && s.column === seat.column
                    );
                    seat.status = "booked";
                    seat.assignedTo = bookingId;
                    allSeats[allIdx] = seat;

                    assigned.push({ ...p, row: seat.row, column: seat.column });
                }
            }
        }

        // Persist the updated seats and booking record
        await flightRef.update({ seats: allSeats });
        await db
            .collection("bookings")
            .doc(bookingId)
            .set({
                bookingId,
                flightId,
                userId,
                passengers: assigned,
                createdAt: new Date()
            });

        return res
            .status(201)
            .json({ message: "Booking successful", bookingId, passengers: assigned });
    } catch (err) {
        console.error("Booking error:", err);
        return res.status(500).json({ error: err.message });
    }
};


// controllers/bookingController.js
exports.getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await db.collection("bookings").doc(id).get();
        if (!doc.exists) return res.status(404).json({ error: "Booking not found" });
        res.status(200).json(doc.data());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.manualBooking = async (req, res) => {
    const { flightId, seat, passenger } = req.body;

    try {
        const flightRef = db.collection("flights").doc(flightId);
        const flightDoc = await flightRef.get();
        if (!flightDoc.exists) return res.status(404).json({ error: "Flight not found" });

        const flightData = flightDoc.data();
        const bookingId = uuidv4();

        const seatIndex = flightData.seats.findIndex(
            s => s.row === seat.row && s.column === seat.column
        );

        if (seatIndex === -1) return res.status(404).json({ error: "Seat not found" });
        if (flightData.seats[seatIndex].status !== "available") {
            return res.status(400).json({ error: "Seat is not available" });
        }

        // Update seat
        flightData.seats[seatIndex].status = "booked";
        flightData.seats[seatIndex].assignedTo = bookingId;

        // Save booking
        await db.collection("bookings").doc(bookingId).set({
            bookingId,
            flightId,
            passengers: [{ ...passenger, ...seat }],
            createdAt: new Date()
        });

        await flightRef.update({ seats: flightData.seats });

        res.status(201).json({ message: "Manual booking successful", bookingId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updatePassengerBySeat = async (req, res) => {
    const { bookingId, row, column } = req.params;
    const { newRow, newColumn } = req.body;
    if (!newRow || !newColumn) {
        return res.status(400).json({ error: "newRow and newColumn are required." });
    }

    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) return res.status(404).json({ error: "Booking not found." });
    const booking = bookingSnap.data();

    // find the passenger by old seat
    const passenger = booking.passengers.find(p => p.row === +row && p.column === column);
    if (!passenger) return res.status(404).json({ error: "Passenger not found at that seat." });

    // load flight & seats array
    const flightRef = db.collection("flights").doc(booking.flightId);
    const flightSnap = await flightRef.get();
    if (!flightSnap.exists) return res.status(404).json({ error: "Flight not found." });
    const seats = flightSnap.data().seats;

    // free old seat
    seats.forEach(s => {
        if (s.row === passenger.row && s.column === passenger.column) {
            s.status = "available";
            s.assignedTo = null;
        }
    });

    // claim new seat
    const target = seats.find(s => s.row === newRow && s.column === newColumn);
    if (!target) return res.status(400).json({ error: "Requested seat does not exist." });
    if (target.status !== "available") return res.status(400).json({ error: "Requested seat is not available." });
    target.status = "booked";
    target.assignedTo = bookingId;

    // update passenger entry
    const updatedPassengers = booking.passengers.map(p =>
        p.row === +row && p.column === column
            ? { ...p, row: newRow, column: newColumn }
            : p
    );

    // persist both
    await flightRef.update({ seats });
    await bookingRef.update({ passengers: updatedPassengers });

    return res.json({ message: "Passenger seat updated", passport: passenger.passport });
};


exports.deletePassengerBySeat = async (req, res) => {
    const { bookingId, row, column } = req.params;

    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) return res.status(404).json({ error: "Booking not found." });
    const booking = bookingSnap.data();

    // find passenger
    const passenger = booking.passengers.find(p => p.row === +row && p.column === column);
    if (!passenger) return res.status(404).json({ error: "Passenger not found at that seat." });

    // load flight & seats
    const flightRef = db.collection("flights").doc(booking.flightId);
    const flightSnap = await flightRef.get();
    if (!flightSnap.exists) return res.status(404).json({ error: "Flight not found." });
    const seats = flightSnap.data().seats;

    // free seat
    seats.forEach(s => {
        if (s.row === passenger.row && s.column === passenger.column) {
            s.status = "available";
            s.assignedTo = null;
        }
    });

    // remove passenger
    const updatedPassengers = booking.passengers.filter(p => !(p.row === +row && p.column === column));

    // persist
    await flightRef.update({ seats });
    await bookingRef.update({ passengers: updatedPassengers });

    return res.json({ message: "Passenger removed", seat: { row, column } });
};