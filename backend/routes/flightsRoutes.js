const express = require("express");
const router = express.Router();
const {
    createFlight,
    getFlights,
    updateFlight,
    deleteFlight,
    getFlightById,
    markBrokenSeats
} = require("../controllers/flightsController");
/**
 * @swagger
 * /api/flights:
 *   post:
 *     summary: Create a new flight
 *     tags: [Flights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departure
 *               - destination
 *               - date
 *               - departureTime
 *               - duration
 *               - price
 *               - planeId
 *             properties:
 *               departure:
 *                 type: string
 *                 example: "Colombo"
 *               destination:
 *                 type: string
 *                 example: "Dubai"
 *               date:
 *                 type: string
 *                 description: "Date of the flight in YYYY-MM-DD format"
 *                 example: "2025-05-21"
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *                 description: "Timezone-aware ISO 8601 string (e.g. 2025-05-21T14:30:00+05:30)"
 *                 example: "2025-05-21T14:30:00+05:30"
 *               duration:
 *                 type: number
 *                 example: 4
 *               price:
 *                 type: number
 *                 example: 1200
 *               planeId:
 *                 type: string
 *                 example: "DxVtblMVZ5p4uMgibAu3"
 *     responses:
 *       201:
 *         description: Flight created successfully
 */

router.post("/", createFlight);

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Get list of flights (filters supported)
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: departure
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of flights (without seats)
 */
router.get("/", getFlights);

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Get a flight by ID (includes seats)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     responses:
 *       200:
 *         description: Flight details with seats
 *       404:
 *         description: Flight not found
 */
router.get("/:id", getFlightById);


/**
 * @swagger
 * /api/flights/{id}:
 *   put:
 *     summary: Update a flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Flight updated
 */
router.put("/:id", updateFlight);

/**
 * @swagger
 * /api/flights/{id}:
 *   delete:
 *     summary: Delete a flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Flight deleted
 */
router.delete("/:id", deleteFlight);


/**
 * @swagger
 * /api/flights/{id}/breakSeats:
 *   post:
 *     summary: Randomly mark available seats as broken
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seatCount
 *             properties:
 *               seatCount:
 *                 type: integer
 *                 description: Number of seats to mark broken
 *                 example: 3
 *     responses:
 *       200:
 *         description: Seats marked as broken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brokenSeats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       row:
 *                         type: integer
 *                       column:
 *                         type: string
 *       400:
 *         description: Bad request (e.g., not enough available seats)
 *       404:
 *         description: Flight not found
 */
router.post("/:id/breakSeats", markBrokenSeats);


module.exports = router;
