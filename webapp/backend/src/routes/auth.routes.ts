import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *               organization:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [en, pt, es, de, fr, it]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('organization').optional().trim(),
    body('language').optional().isIn(['en', 'pt', 'es', 'de', 'fr', 'it'])
  ],
  asyncHandler(authController.register.bind(authController))
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  asyncHandler(authController.login.bind(authController))
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user info
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/me',
  authenticate,
  asyncHandler((req, res) => authController.getCurrentUser(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: New token generated
 *       401:
 *         description: Invalid or expired token
 */
router.post(
  '/refresh',
  authenticate,
  asyncHandler((req, res) => authController.refreshToken(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent if user exists
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  asyncHandler(authController.forgotPassword.bind(authController))
);

export default router;
