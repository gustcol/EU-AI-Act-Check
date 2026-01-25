import { Router } from 'express';
import { param, query } from 'express-validator';
import { ReportController } from '../controllers/report.controller.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

/**
 * @swagger
 * /api/reports/system/{systemId}/compliance:
 *   get:
 *     tags: [Reports]
 *     summary: Generate compliance report for a system
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, pdf]
 *           default: json
 *     responses:
 *       200:
 *         description: Compliance report
 */
router.get(
  '/system/:systemId/compliance',
  [
    param('systemId').isUUID(),
    query('format').optional().isIn(['json', 'pdf'])
  ],
  asyncHandler((req, res) => reportController.generateComplianceReport(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/reports/system/{systemId}/risk-assessment:
 *   get:
 *     tags: [Reports]
 *     summary: Generate risk assessment report
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, pdf]
 *           default: json
 *     responses:
 *       200:
 *         description: Risk assessment report
 */
router.get(
  '/system/:systemId/risk-assessment',
  [
    param('systemId').isUUID(),
    query('format').optional().isIn(['json', 'pdf'])
  ],
  asyncHandler((req, res) => reportController.generateRiskReport(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     tags: [Reports]
 *     summary: Get dashboard statistics
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get(
  '/dashboard',
  asyncHandler((req, res) => reportController.getDashboard(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/reports/system/{systemId}/documentation:
 *   get:
 *     tags: [Reports]
 *     summary: Generate technical documentation package
 *     parameters:
 *       - in: path
 *         name: systemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Documentation package (PDF)
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  '/system/:systemId/documentation',
  [param('systemId').isUUID()],
  asyncHandler((req, res) => reportController.generateDocumentation(req as AuthRequest, res))
);

/**
 * @swagger
 * /api/reports/deadlines:
 *   get:
 *     tags: [Reports]
 *     summary: Get upcoming compliance deadlines
 *     responses:
 *       200:
 *         description: List of deadlines
 */
router.get(
  '/deadlines',
  asyncHandler((req, res) => reportController.getDeadlines(req as AuthRequest, res))
);

export default router;
