import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ChecklistController } from '../controllers/checklist.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { RiskLevel } from '../types/index.js';

const router = Router();
const checklistController = new ChecklistController();

router.use(authenticate);

/**
 * @swagger
 * /api/checklists/system/{systemId}:
 *   get:
 *     tags: [Compliance Checklists]
 *     summary: Get checklist for an AI system
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: phase
 *         schema:
 *           type: string
 *           enum: [classification, core_compliance, specific_obligations, conformity, post_market]
 *     responses:
 *       200:
 *         description: Checklist items
 */
router.get(
  '/system/:systemId',
  [
    param('systemId').isUUID(),
    query('phase').optional().isString()
  ],
  asyncHandler((req, res) => checklistController.getBySystem(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/checklists/system/{systemId}/generate:
 *   post:
 *     tags: [Compliance Checklists]
 *     summary: Generate checklist based on risk level
 *     parameters:
 *       - in: path
 *         name: systemId
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
 *             required: [risk_level]
 *             properties:
 *               risk_level:
 *                 type: string
 *                 enum: [unacceptable, high, limited, minimal]
 *     responses:
 *       201:
 *         description: Checklist generated
 */
router.post(
  '/system/:systemId/generate',
  [
    param('systemId').isUUID(),
    body('risk_level').isIn(Object.values(RiskLevel))
  ],
  asyncHandler((req, res) => checklistController.generate(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/checklists/items/{itemId}:
 *   patch:
 *     tags: [Compliance Checklists]
 *     summary: Update checklist item status
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               is_completed:
 *                 type: boolean
 *               notes:
 *                 type: string
 *               evidence_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated
 */
router.patch(
  '/items/:itemId',
  [
    param('itemId').isUUID(),
    body('is_completed').optional().isBoolean(),
    body('notes').optional().trim(),
    body('evidence_url').optional().isURL()
  ],
  asyncHandler((req, res) => checklistController.updateItem(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/checklists/system/{systemId}/progress:
 *   get:
 *     tags: [Compliance Checklists]
 *     summary: Get compliance progress summary
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Progress summary by phase
 */
router.get(
  '/system/:systemId/progress',
  [param('systemId').isUUID()],
  asyncHandler((req, res) => checklistController.getProgress(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/checklists/templates:
 *   get:
 *     tags: [Compliance Checklists]
 *     summary: Get checklist templates by risk level
 *     parameters:
 *       - in: query
 *         name: risk_level
 *         required: true
 *         schema:
 *           type: string
 *           enum: [unacceptable, high, limited, minimal]
 *     responses:
 *       200:
 *         description: Checklist template
 */
router.get(
  '/templates',
  [query('risk_level').isIn(Object.values(RiskLevel))],
  asyncHandler((req, res) => checklistController.getTemplates(req as AuthRequest, res))
);

export default router;
