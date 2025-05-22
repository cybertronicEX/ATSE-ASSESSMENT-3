const express = require("express");
const router = express.Router();
const { createBooking, getBookingById, manualBooking, deletePassengerBySeat, updatePassengerBySeat } = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Book seats for passengers on a flight
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightId:
 *                 type: string
 *                 example: "abcd1234"
 *               passengers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     passport:
 *                       type: string
 *                     dob:
 *                       type: string
 *                       format: date
 *                     zone:
 *                       type: string
 *                       enum: [VIP, standard, accessible]
 *     responses:
 *       201:
 *         description: Booking successful
 *       400:
 *         description: Invalid request or no seats available
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, createBooking);


/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get a Booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details with seats
 *       404:
 *         description: Booking not found
 */
router.get("/:id", getBookingById);

/**
 * @swagger
 * /api/booking/manual-booking:
 *   post:
 *     summary: Manually create a booking for a flight seat (Admin use)
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flightId, seat, passenger]
 *             properties:
 *               flightId:
 *                 type: string
 *               seat:
 *                 type: object
 *                 properties:
 *                   row:
 *                     type: number
 *                   column:
 *                     type: string
 *               passenger:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   passport:
 *                     type: string
 *                   dob:
 *                     type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post('/manual-booking', manualBooking)



// PATCH a single passenger by seat
/**
 * @swagger
 * /api/bookings/{bookingId}/passengers/{row}/{column}:
 *   patch:
 *     summary: Change the seat of a passenger (by row+column) within a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: row
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: column
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newRow,newColumn]
 *             properties:
 *               newRow: { type: integer }
 *               newColumn: { type: string }
 *     responses:
 *       200: { description: Passenger seat updated }
 *       400: { description: Invalid request or seat not available }
 *       404: { description: Booking or passenger not found }
 */
router.patch("/:bookingId/passengers/:row/:column", updatePassengerBySeat);

// DELETE a single passenger by seat
/**
 * @swagger
 * /api/bookings/{bookingId}/passengers/{row}/{column}:
 *   delete:
 *     summary: Remove a passenger from a booking by seat
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: row
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: column
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Passenger removed and seat freed }
 *       404: { description: Booking or passenger not found }
 */
router.delete("/:bookingId/passengers/:row/:column", deletePassengerBySeat);
module.exports = router;
