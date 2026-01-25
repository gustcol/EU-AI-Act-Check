import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { UserRole } from '../types/index.js';

const router = Router();
const userController = new UserController();

router.use(authenticate);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     responses:
 *       200:
 *         description: User profile
 */
router.get(
  '/profile',
  asyncHandler((req, res) => userController.getProfile(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               organization:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [en, pt, es, de, fr, it]
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty(),
    body('organization').optional().trim(),
    body('language').optional().isIn(['en', 'pt', 'es', 'de', 'fr', 'it'])
  ],
  asyncHandler((req, res) => userController.updateProfile(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/users/password:
 *   put:
 *     tags: [Users]
 *     summary: Change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed
 */
router.put(
  '/password',
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 8 })
  ],
  asyncHandler((req, res) => userController.changePassword(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/users/preferences:
 *   put:
 *     tags: [Users]
 *     summary: Update notification preferences
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_notifications:
 *                 type: boolean
 *               deadline_reminders:
 *                 type: boolean
 *               weekly_summary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated
 */
router.put(
  '/preferences',
  [
    body('email_notifications').optional().isBoolean(),
    body('deadline_reminders').optional().isBoolean(),
    body('weekly_summary').optional().isBoolean()
  ],
  asyncHandler((req, res) => userController.updatePreferences(req as AuthRequest, res))
);

// Admin routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users - Admin]
 *     summary: List all users (admin only)
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  authorize(UserRole.ADMIN),
  asyncHandler((req, res) => userController.list(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     tags: [Users - Admin]
 *     summary: Update user role (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, manager, assessor, viewer]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put(
  '/:id/role',
  authorize(UserRole.ADMIN),
  [
    param('id').isUUID(),
    body('role').isIn(Object.values(UserRole))
  ],
  asyncHandler((req, res) => userController.updateRole(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users - Admin]
 *     summary: Delete a user (admin only)
 *     description: Permanently removes a user from the system. Cannot delete your own account.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete own account
 *       403:
 *         description: Forbidden - admin only
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  [param('id').isUUID()],
  asyncHandler((req, res) => userController.deleteUser(req as AuthRequest, res))
);

export default router;
