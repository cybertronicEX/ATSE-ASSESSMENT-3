const express = require('express');
const router = express.Router();
const {
  signUpWithEmail,
  loginWithEmail,
} = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up with email, password, name and role
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *               username:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 example: user
 *             required:
 *               - email
 *               - password
 *               - username
 *               - role
 *     responses:
 *       201:
 *         description: User created and token returned
 */
router.post('/signup', signUpWithEmail);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MySecurePassword123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully (returns a token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

router.post('/login', loginWithEmail);


module.exports = router;
