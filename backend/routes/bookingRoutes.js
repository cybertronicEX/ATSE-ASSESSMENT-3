const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");

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
router.post("/", createBooking);

module.exports = router;
