import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { AssessmentController } from '../controllers/assessment.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { RiskLevel, AssessmentStatus } from '../types/index.js';

const router = Router();
const assessmentController = new AssessmentController();

router.use(authenticate);

/**
 * @swagger
 * /api/assessments:
 *   get:
 *     tags: [Risk Assessments]
 *     summary: List all assessments
 *     parameters:
 *       - in: query
 *         name: system_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, needs_review]
 *     responses:
 *       200:
 *         description: List of assessments
 */
router.get(
  '/',
  [
    query('system_id').optional().isUUID(),
    query('status').optional().isIn(Object.values(AssessmentStatus))
  ],
  asyncHandler((req, res) => assessmentController.list(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/assessments:
 *   post:
 *     tags: [Risk Assessments]
 *     summary: Create a new risk assessment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [system_id, preliminary_classification]
 *             properties:
 *               system_id:
 *                 type: string
 *                 format: uuid
 *               preliminary_classification:
 *                 type: string
 *                 enum: [unacceptable, high, limited, minimal]
 *     responses:
 *       201:
 *         description: Assessment created
 */
router.post(
  '/',
  [
    body('system_id').isUUID(),
    body('preliminary_classification').isIn(Object.values(RiskLevel))
  ],
  asyncHandler((req, res) => assessmentController.create(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/assessments/questions:
 *   get:
 *     tags: [Risk Assessments]
 *     summary: Get assessment questionnaire
 *     parameters:
 *       - in: query
 *         name: risk_level
 *         schema:
 *           type: string
 *           enum: [unacceptable, high, limited, minimal]
 *     responses:
 *       200:
 *         description: Assessment questions
 */
router.get(
  '/questions',
  [query('risk_level').optional().isIn(Object.values(RiskLevel))],
  asyncHandler((req, res) => assessmentController.getQuestions(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/assessments/{id}:
 *   get:
 *     tags: [Risk Assessments]
 *     summary: Get assessment details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Assessment details
 */
router.get(
  '/:id',
  [param('id').isUUID()],
  asyncHandler((req, res) => assessmentController.getById(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/assessments/{id}/responses:
 *   post:
 *     tags: [Risk Assessments]
 *     summary: Submit assessment responses
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
 *             required: [responses]
 *             properties:
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: string
 *                     answer:
 *                       type: string
 *                     notes:
 *                       type: string
 *     responses:
 *       200:
 *         description: Responses saved
 */
router.post(
  '/:id/responses',
  [
    param('id').isUUID(),
    body('responses').isArray({ min: 1 }),
    body('responses.*.question_id').notEmpty(),
    body('responses.*.answer').notEmpty()
  ],
  asyncHandler((req, res) => assessmentController.submitResponses(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/assessments/{id}/complete:
 *   post:
 *     tags: [Risk Assessments]
 *     summary: Complete assessment and calculate final classification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               justification:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assessment completed
 */
router.post(
  '/:id/complete',
  [
    param('id').isUUID(),
    body('justification').optional().trim()
  ],
  asyncHandler((req, res) => assessmentController.complete(req as AuthRequest, res))
);

export default router;
