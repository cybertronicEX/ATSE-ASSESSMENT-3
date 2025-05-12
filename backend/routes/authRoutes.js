const express = require('express');
const router = express.Router();
const {
  signUpWithEmail,
  loginWithEmail,
  signInWithGoogle,
} = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up with email and password
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: email
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: User created
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

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Sign in with Google ID token
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: idToken
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Google sign-in successful
 */
router.post('/google', signInWithGoogle);

module.exports = router;
