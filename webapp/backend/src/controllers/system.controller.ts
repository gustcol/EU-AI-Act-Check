import { Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database.js';
import { createError, AuthRequest } from '../middleware/auth.js';
import { ClassificationService } from '../services/classification.service.js';
import { AISystem, CreateSystemDTO, UpdateSystemDTO, SystemStatus, RiskLevel } from '../types/index.js';

export class SystemController {
  private classificationService = new ClassificationService();

  async list(req: AuthRequest, res: Response): Promise<void> {
    const { page = 1, limit = 10, status, risk_level } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = 'WHERE user_id = $1';
    const params: unknown[] = [req.user?.userId];
    let paramIndex = 2;

    if (status) {
      whereClause += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (risk_level) {
      whereClause += ` AND risk_level = $${paramIndex++}`;
      params.push(risk_level);
    }

    const [countResult] = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM ai_systems ${whereClause}`,
      params
    );

    params.push(Number(limit), offset);
    const systems = await query<AISystem>(
      `SELECT * FROM ai_systems ${whereClause}
       ORDER BY updated_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    const total = parseInt(countResult?.count || '0', 10);

    res.json({
      data: systems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / Number(limit))
      }
    });
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const dto = req.body as CreateSystemDTO;
    const systemId = uuidv4();

    const [system] = await query<AISystem>(
      `INSERT INTO ai_systems
       (id, user_id, name, description, version, intended_purpose, deployment_context, ai_techniques, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        systemId,
        req.user?.userId,
        dto.name,
        dto.description,
        dto.version,
        dto.intended_purpose,
        dto.deployment_context,
        dto.ai_techniques ? JSON.stringify(dto.ai_techniques) : null,
        SystemStatus.DRAFT
      ]
    );

    res.status(201).json({ system });
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const system = await queryOne<AISystem>(
      'SELECT * FROM ai_systems WHERE id = $1 AND user_id = $2',
      [id, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    res.json({ system });
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const dto = req.body as UpdateSystemDTO;

    // Check ownership
    const existing = await queryOne<AISystem>(
      'SELECT id FROM ai_systems WHERE id = $1 AND user_id = $2',
      [id, req.user?.userId]
    );

    if (!existing) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const fields: (keyof UpdateSystemDTO)[] = [
      'name', 'description', 'version', 'intended_purpose',
      'deployment_context', 'risk_level', 'status'
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(dto[field]);
      }
    }

    if (dto.ai_techniques !== undefined) {
      updates.push(`ai_techniques = $${paramIndex++}`);
      values.push(JSON.stringify(dto.ai_techniques));
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const [system] = await query<AISystem>(
      `UPDATE ai_systems SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({ system });
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM ai_systems WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user?.userId]
    );

    if (result.length === 0) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    res.status(204).send();
  }

  async classify(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;

    const system = await queryOne<AISystem>(
      'SELECT * FROM ai_systems WHERE id = $1 AND user_id = $2',
      [id, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    const classification = this.classificationService.classify(system);

    // Update system with suggested classification
    await query(
      `UPDATE ai_systems SET risk_level = $1, status = $2, updated_at = NOW() WHERE id = $3`,
      [classification.risk_level, SystemStatus.IN_ASSESSMENT, id]
    );

    res.json({
      classification,
      message: 'Classification completed. Please review and confirm.'
    });
  }
}
