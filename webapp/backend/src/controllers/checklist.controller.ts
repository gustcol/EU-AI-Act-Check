import { Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database.js';
import { createError, AuthRequest } from '../middleware/auth.js';
import { ChecklistItem, AISystem, RiskLevel } from '../types/index.js';
import { checklistTemplates } from '../services/checklist.templates.js';

export class ChecklistController {
  async getBySystem(req: AuthRequest, res: Response): Promise<void> {
    const { systemId } = req.params;
    const { phase } = req.query;

    // Verify ownership
    const system = await queryOne<AISystem>(
      'SELECT id FROM ai_systems WHERE id = $1 AND user_id = $2',
      [systemId, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    let whereClause = 'WHERE system_id = $1';
    const params: unknown[] = [systemId];

    if (phase) {
      whereClause += ' AND phase = $2';
      params.push(phase);
    }

    const items = await query<ChecklistItem>(
      `SELECT * FROM checklist_items ${whereClause} ORDER BY phase, category, id`,
      params
    );

    res.json({ items });
  }

  async generate(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { systemId } = req.params;
    const { risk_level } = req.body;

    // Verify ownership
    const system = await queryOne<AISystem>(
      'SELECT id FROM ai_systems WHERE id = $1 AND user_id = $2',
      [systemId, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    // Get template for risk level
    const template = checklistTemplates[risk_level as RiskLevel];
    if (!template) {
      throw createError('Invalid risk level', 400, 'INVALID_RISK_LEVEL');
    }

    // Delete existing checklist items
    await query('DELETE FROM checklist_items WHERE system_id = $1', [systemId]);

    // Create new items from template
    for (const item of template) {
      await query(
        `INSERT INTO checklist_items
         (id, system_id, category, phase, item_text, is_required, is_completed)
         VALUES ($1, $2, $3, $4, $5, $6, false)`,
        [uuidv4(), systemId, item.category, item.phase, item.item_text, item.is_required]
      );
    }

    const items = await query<ChecklistItem>(
      'SELECT * FROM checklist_items WHERE system_id = $1 ORDER BY phase, category, id',
      [systemId]
    );

    res.status(201).json({ items, count: items.length });
  }

  async updateItem(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { itemId } = req.params;
    const { is_completed, notes, evidence_url } = req.body;

    // Verify ownership through system
    const item = await queryOne<ChecklistItem & { user_id: string }>(
      `SELECT ci.*, s.user_id
       FROM checklist_items ci
       JOIN ai_systems s ON ci.system_id = s.id
       WHERE ci.id = $1`,
      [itemId]
    );

    if (!item) {
      throw createError('Item not found', 404, 'ITEM_NOT_FOUND');
    }

    if (item.user_id !== req.user?.userId) {
      throw createError('Access denied', 403, 'FORBIDDEN');
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (is_completed !== undefined) {
      updates.push(`is_completed = $${paramIndex++}`);
      values.push(is_completed);
      if (is_completed) {
        updates.push(`completed_by = $${paramIndex++}`);
        values.push(req.user?.userId);
        updates.push(`completed_at = NOW()`);
      } else {
        updates.push(`completed_by = NULL`);
        updates.push(`completed_at = NULL`);
      }
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }

    if (evidence_url !== undefined) {
      updates.push(`evidence_url = $${paramIndex++}`);
      values.push(evidence_url);
    }

    if (updates.length === 0) {
      res.json({ item });
      return;
    }

    values.push(itemId);
    const [updated] = await query<ChecklistItem>(
      `UPDATE checklist_items SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    res.json({ item: updated });
  }

  async getProgress(req: AuthRequest, res: Response): Promise<void> {
    const { systemId } = req.params;

    // Verify ownership
    const system = await queryOne<AISystem>(
      'SELECT id FROM ai_systems WHERE id = $1 AND user_id = $2',
      [systemId, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    const progress = await query<{
      phase: string;
      total: string;
      completed: string;
      required_total: string;
      required_completed: string;
    }>(
      `SELECT
        phase,
        COUNT(*) as total,
        SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN is_required THEN 1 ELSE 0 END) as required_total,
        SUM(CASE WHEN is_required AND is_completed THEN 1 ELSE 0 END) as required_completed
       FROM checklist_items
       WHERE system_id = $1
       GROUP BY phase
       ORDER BY phase`,
      [systemId]
    );

    const summary = progress.map(p => ({
      phase: p.phase,
      total: parseInt(p.total, 10),
      completed: parseInt(p.completed, 10),
      required_total: parseInt(p.required_total, 10),
      required_completed: parseInt(p.required_completed, 10),
      percentage: Math.round((parseInt(p.completed, 10) / parseInt(p.total, 10)) * 100)
    }));

    const overall = {
      total: summary.reduce((acc, s) => acc + s.total, 0),
      completed: summary.reduce((acc, s) => acc + s.completed, 0),
      required_total: summary.reduce((acc, s) => acc + s.required_total, 0),
      required_completed: summary.reduce((acc, s) => acc + s.required_completed, 0)
    };

    res.json({
      phases: summary,
      overall: {
        ...overall,
        percentage: Math.round((overall.completed / overall.total) * 100) || 0
      }
    });
  }

  async getTemplates(req: AuthRequest, res: Response): Promise<void> {
    const { risk_level } = req.query;

    const template = checklistTemplates[risk_level as RiskLevel];
    if (!template) {
      throw createError('Invalid risk level', 400, 'INVALID_RISK_LEVEL');
    }

    res.json({ template });
  }
}
