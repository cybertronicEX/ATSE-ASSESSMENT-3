const express = require('express');
const router = express.Router();
const {
  createPlane,
  getPlanes,
  getPlaneById,
  updatePlane,
  deletePlane
} = require('../controllers/planeController');

/**
 * @swagger
 * tags:
 *   name: Planes
 *   description: Plane configuration (rows, columns) without seat mapping
 */

/**
 * @swagger
 * /api/planes:
 *   post:
 *     summary: Create a new plane (no seats assigned)
 *     tags: [Planes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rows:
 *                 type: integer
 *               columns:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Plane created
 */
router.post('/', createPlane);

/**
 * @swagger
 * /api/planes:
 *   get:
 *     summary: Get all planes
 *     tags: [Planes]
 *     responses:
 *       200:
 *         description: Array of planes
 */
router.get('/', getPlanes);

/**
 * @swagger
 * /api/planes/{id}:
 *   get:
 *     summary: Get a specific plane by ID
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Plane data
 */
router.get('/:id', getPlaneById);

/**
 * @swagger
 * /api/planes/{id}:
 *   put:
 *     summary: Update a plane
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', updatePlane);

/**
 * @swagger
 * /api/planes/{id}:
 *   delete:
 *     summary: Delete a plane
 *     tags: [Planes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', deletePlane);

module.exports = router;
