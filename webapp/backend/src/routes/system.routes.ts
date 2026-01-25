import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { SystemController } from '../controllers/system.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { RiskLevel, SystemStatus } from '../types/index.js';

const router = Router();
const systemController = new SystemController();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/systems:
 *   get:
 *     tags: [AI Systems]
 *     summary: List all AI systems for the current user
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, in_assessment, compliant, non_compliant, archived]
 *       - in: query
 *         name: risk_level
 *         schema:
 *           type: string
 *           enum: [unacceptable, high, limited, minimal]
 *     responses:
 *       200:
 *         description: List of AI systems
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(Object.values(SystemStatus)),
    query('risk_level').optional().isIn(Object.values(RiskLevel))
  ],
  asyncHandler((req, res) => systemController.list(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/systems:
 *   post:
 *     tags: [AI Systems]
 *     summary: Create a new AI system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, version, intended_purpose]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               version:
 *                 type: string
 *               intended_purpose:
 *                 type: string
 *               deployment_context:
 *                 type: string
 *               ai_techniques:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: System created successfully
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().isLength({ max: 255 }),
    body('description').trim().notEmpty(),
    body('version').trim().notEmpty().isLength({ max: 50 }),
    body('intended_purpose').trim().notEmpty(),
    body('deployment_context').optional().trim(),
    body('ai_techniques').optional().isArray()
  ],
  asyncHandler((req, res) => systemController.create(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/systems/{id}:
 *   get:
 *     tags: [AI Systems]
 *     summary: Get a specific AI system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: AI system details
 *       404:
 *         description: System not found
 */
router.get(
  '/:id',
  [param('id').isUUID()],
  asyncHandler((req, res) => systemController.getById(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/systems/{id}:
 *   put:
 *     tags: [AI Systems]
 *     summary: Update an AI system
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               version:
 *                 type: string
 *               intended_purpose:
 *                 type: string
 *               deployment_context:
 *                 type: string
 *               ai_techniques:
 *                 type: array
 *                 items:
 *                   type: string
 *               risk_level:
 *                 type: string
 *                 enum: [unacceptable, high, limited, minimal]
 *               status:
 *                 type: string
 *                 enum: [draft, in_assessment, compliant, non_compliant, archived]
 *     responses:
 *       200:
 *         description: System updated successfully
 *       404:
 *         description: System not found
 */
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ max: 255 }),
    body('description').optional().trim(),
    body('version').optional().trim().isLength({ max: 50 }),
    body('intended_purpose').optional().trim(),
    body('deployment_context').optional().trim(),
    body('ai_techniques').optional().isArray(),
    body('risk_level').optional().isIn(Object.values(RiskLevel)),
    body('status').optional().isIn(Object.values(SystemStatus))
  ],
  asyncHandler((req, res) => systemController.update(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/systems/{id}:
 *   delete:
 *     tags: [AI Systems]
 *     summary: Delete an AI system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: System deleted successfully
 *       404:
 *         description: System not found
 */
router.delete(
  '/:id',
  [param('id').isUUID()],
  asyncHandler((req, res) => systemController.delete(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/systems/{id}/classify:
 *   post:
 *     tags: [AI Systems]
 *     summary: Run automatic risk classification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Classification result
 */
router.post(
  '/:id/classify',
  [param('id').isUUID()],
  asyncHandler((req, res) => systemController.classify(req as AuthRequest, res))
);

export default router;
