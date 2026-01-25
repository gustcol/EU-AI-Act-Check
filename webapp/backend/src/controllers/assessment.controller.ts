import { Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database.js';
import { createError, AuthRequest } from '../middleware/auth.js';
import { RiskAssessment, AssessmentStatus, RiskLevel, AISystem, AssessmentResponse } from '../types/index.js';
import { assessmentQuestions } from '../services/questions.service.js';

export class AssessmentController {
  async list(req: AuthRequest, res: Response): Promise<void> {
    const { system_id, status } = req.query;

    let whereClause = `WHERE ra.assessor_id = $1`;
    const params: unknown[] = [req.user?.userId];
    let paramIndex = 2;

    if (system_id) {
      whereClause += ` AND ra.system_id = $${paramIndex++}`;
      params.push(system_id);
    }

    if (status) {
      whereClause += ` AND ra.status = $${paramIndex++}`;
      params.push(status);
    }

    const assessments = await query<RiskAssessment & { system_name: string }>(
      `SELECT ra.*, s.name as system_name
       FROM risk_assessments ra
       JOIN ai_systems s ON ra.system_id = s.id
       ${whereClause}
       ORDER BY ra.updated_at DESC`,
      params
    );

    res.json({ assessments });
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { system_id, preliminary_classification } = req.body;

    // Verify system ownership
    const system = await queryOne<AISystem>(
      'SELECT id FROM ai_systems WHERE id = $1 AND user_id = $2',
      [system_id, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    const assessmentId = uuidv4();

    const [assessment] = await query<RiskAssessment>(
      `INSERT INTO risk_assessments
       (id, system_id, assessor_id, preliminary_classification, status, responses)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        assessmentId,
        system_id,
        req.user?.userId,
        preliminary_classification,
        AssessmentStatus.PENDING,
        JSON.stringify([])
      ]
    );

    res.status(201).json({ assessment });
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const assessment = await queryOne<RiskAssessment & { system_name: string }>(
      `SELECT ra.*, s.name as system_name
       FROM risk_assessments ra
       JOIN ai_systems s ON ra.system_id = s.id
       WHERE ra.id = $1 AND ra.assessor_id = $2`,
      [id, req.user?.userId]
    );

    if (!assessment) {
      throw createError('Assessment not found', 404, 'ASSESSMENT_NOT_FOUND');
    }

    res.json({ assessment });
  }

  async submitResponses(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { responses } = req.body;

    const assessment = await queryOne<RiskAssessment>(
      'SELECT id, status FROM risk_assessments WHERE id = $1 AND assessor_id = $2',
      [id, req.user?.userId]
    );

    if (!assessment) {
      throw createError('Assessment not found', 404, 'ASSESSMENT_NOT_FOUND');
    }

    if (assessment.status === AssessmentStatus.COMPLETED) {
      throw createError('Assessment already completed', 400, 'ASSESSMENT_COMPLETED');
    }

    const [updated] = await query<RiskAssessment>(
      `UPDATE risk_assessments
       SET responses = $1, status = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [JSON.stringify(responses), AssessmentStatus.IN_PROGRESS, id]
    );

    res.json({ assessment: updated });
  }

  async complete(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { justification } = req.body;

    const assessment = await queryOne<RiskAssessment>(
      'SELECT * FROM risk_assessments WHERE id = $1 AND assessor_id = $2',
      [id, req.user?.userId]
    );

    if (!assessment) {
      throw createError('Assessment not found', 404, 'ASSESSMENT_NOT_FOUND');
    }

    // Calculate final classification based on responses
    const finalClassification = this.calculateClassification(
      assessment.preliminary_classification,
      assessment.responses
    );

    const [updated] = await query<RiskAssessment>(
      `UPDATE risk_assessments
       SET final_classification = $1, justification = $2, status = $3, completed_at = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [finalClassification, justification, AssessmentStatus.COMPLETED, id]
    );

    // Update system risk level
    await query(
      'UPDATE ai_systems SET risk_level = $1, updated_at = NOW() WHERE id = $2',
      [finalClassification, assessment.system_id]
    );

    res.json({
      assessment: updated,
      final_classification: finalClassification
    });
  }

  async getQuestions(req: AuthRequest, res: Response): Promise<void> {
    const { risk_level } = req.query;

    let questions = assessmentQuestions;

    if (risk_level) {
      questions = assessmentQuestions.filter(
        q => q.applicable_levels.includes(risk_level as RiskLevel) || q.applicable_levels.length === 0
      );
    }

    res.json({ questions });
  }

  private calculateClassification(
    preliminary: RiskLevel,
    responses: AssessmentResponse[]
  ): RiskLevel {
    // Simple classification logic based on responses
    // In production, this would be more sophisticated

    const prohibitedAnswers = responses.filter(
      r => r.question_id.startsWith('prohibited_') && r.answer === true
    );

    if (prohibitedAnswers.length > 0) {
      return RiskLevel.UNACCEPTABLE;
    }

    const highRiskIndicators = responses.filter(
      r => r.question_id.startsWith('high_risk_') && r.answer === true
    );

    if (highRiskIndicators.length >= 2) {
      return RiskLevel.HIGH;
    }

    const transparencyRequired = responses.filter(
      r => r.question_id.startsWith('transparency_') && r.answer === true
    );

    if (transparencyRequired.length > 0) {
      return RiskLevel.LIMITED;
    }

    return preliminary;
  }
}
