const { db } = require("../config/firebase");
const { generateSeatMap } = require('../helpers/seatGenerator');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
// ✅ Create Flight with validations
exports.createFlight = async (req, res) => {
    try {
        const { planeId, departure, destination, date, price, duration, departureTime } = req.body;

        // ✅ Validate required fields
        if (!planeId || !departure || !destination || !date || !price || !duration || !departureTime) {
            return res.status(400).json({ error: "All fields (planeId, departure, destination, date, departureTime, price, duration) are required." });
        }

        // ✅ Validate departureTime (ISO 8601 format with timezone)
        const parsedTime = dayjs(departureTime);
        if (!parsedTime.isValid()) {
            return res.status(400).json({ error: "Invalid departureTime. Use ISO 8601 format with timezone (e.g. 2025-05-21T14:30:00+05:30)." });
        }

        // ✅ Check plane existence
        const planeDoc = await db.collection("planes").doc(planeId).get();
        if (!planeDoc.exists) {
            return res.status(404).json({ error: "Invalid planeId. Plane not found." });
        }

        const { rows, columns, name } = planeDoc.data();
        const seatMap = generateSeatMap(rows, columns);

        // ✅ Format date to ISO (for date-level filtering)
        const isoDate = dayjs(date).format("YYYY-MM-DD");

        const newFlightRef = db.collection("flights").doc();
        const flightData = {
            planeId,
            departure,
            destination,
            date: isoDate,
            departureTime: parsedTime.toISOString(), // stored in full ISO
            price,
            duration,
            seats: seatMap,
            planeName: name,
            createdAt: new Date(),
        };

        await newFlightRef.set(flightData);
        res.status(201).json({ id: newFlightRef.id, ...flightData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFlights = async (req, res) => {
  try {
    const { departure, destination, date } = req.query;
    let query = db.collection("flights");

    if (departure) query = query.where("departure", "==", departure);
    if (destination) query = query.where("destination", "==", destination);
    if (date) query = query.where("date", "==", date);

    const snapshot = await query.get();
    const now = dayjs(); // current local time (server timezone)

    const flights = snapshot.docs
      .map(doc => {
        const { seats, ...flightData } = doc.data();
        return { id: doc.id, ...flightData };
      })
      .filter(flight => {
        // Only include flights with a valid future departureTime
        if (!flight.departureTime) return false;
        const depTime = dayjs(flight.departureTime);
        return depTime.isAfter(now);
      });

    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a specific flight with seat map
exports.getFlightById = async (req, res) => {
    try {
        const flightId = req.params.id;
        const flightDoc = await db.collection("flights").doc(flightId).get();

        if (!flightDoc.exists) {
            return res.status(404).json({ error: "Flight not found" });
        }

        const flightData = flightDoc.data();
        res.status(200).json({ id: flightDoc.id, ...flightData }); // includes seats
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ Update Flight
exports.updateFlight = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.planeId) {
            const planeCheck = await db.collection("planes").doc(req.body.planeId).get();
            if (!planeCheck.exists) {
                return res.status(400).json({ error: "Updated planeId is invalid." });
            }
        }

        await db.collection("flights").doc(id).update(req.body);
        res.status(200).json({ message: "Flight updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete Flight
exports.deleteFlight = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("flights").doc(id).delete();
        res.status(200).json({ message: "Flight deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.markBrokenSeats = async (req, res) => {
  const flightId = req.params.id;
  const { seatCount } = req.body;

  if (typeof seatCount !== 'number' || seatCount < 1) {
    return res.status(400).json({ error: "seatCount must be a positive integer." });
  }

  try {
    const flightRef = db.collection("flights").doc(flightId);
    const snap = await flightRef.get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Flight not found." });
    }

    const data = snap.data();
    const allSeats = Array.isArray(data.seats) ? [...data.seats] : [];
    const available = allSeats.filter(s => s.status === "available");

    if (available.length < seatCount) {
      return res
        .status(400)
        .json({ error: `Only ${available.length} available seats; cannot break ${seatCount}.` });
    }

    // randomly pick seatCount seats
    // simple shuffle + slice:
    const shuffled = available.sort(() => Math.random() - 0.5);
    const toBreak = shuffled.slice(0, seatCount);

    // mark them broken
    const brokenSeats = toBreak.map(seat => {
      const idx = allSeats.findIndex(
        s => s.row === seat.row && s.column === seat.column
      );
      allSeats[idx] = { ...allSeats[idx], status: "broken" };
      return { row: seat.row, column: seat.column };
    });

    // persist update
    await flightRef.update({ seats: allSeats });

    return res.status(200).json({ brokenSeats });
  } catch (err) {
    console.error("markBrokenSeats error:", err);
    return res.status(500).json({ error: err.message });
  }
};