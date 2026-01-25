import { Response } from 'express';
import { query, queryOne } from '../config/database.js';
import { createError, AuthRequest } from '../middleware/auth.js';
import { PDFService } from '../services/pdf.service.js';
import { AISystem, RiskAssessment, ChecklistItem, RiskLevel } from '../types/index.js';

export class ReportController {
  private pdfService = new PDFService();

  async generateComplianceReport(req: AuthRequest, res: Response): Promise<void> {
    const { systemId } = req.params;
    const { format = 'json' } = req.query;

    const system = await queryOne<AISystem>(
      'SELECT * FROM ai_systems WHERE id = $1 AND user_id = $2',
      [systemId, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    // Get latest assessment
    const assessment = await queryOne<RiskAssessment>(
      `SELECT * FROM risk_assessments
       WHERE system_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [systemId]
    );

    // Get checklist progress
    const checklistItems = await query<ChecklistItem>(
      'SELECT * FROM checklist_items WHERE system_id = $1 ORDER BY phase, category',
      [systemId]
    );

    const report = {
      generated_at: new Date().toISOString(),
      system: {
        id: system.id,
        name: system.name,
        version: system.version,
        description: system.description,
        intended_purpose: system.intended_purpose,
        risk_level: system.risk_level,
        status: system.status
      },
      assessment: assessment ? {
        id: assessment.id,
        preliminary_classification: assessment.preliminary_classification,
        final_classification: assessment.final_classification,
        justification: assessment.justification,
        completed_at: assessment.completed_at
      } : null,
      compliance: {
        total_items: checklistItems.length,
        completed_items: checklistItems.filter(i => i.is_completed).length,
        required_items: checklistItems.filter(i => i.is_required).length,
        required_completed: checklistItems.filter(i => i.is_required && i.is_completed).length,
        phases: this.groupByPhase(checklistItems)
      }
    };

    if (format === 'pdf') {
      const pdf = await this.pdfService.generateComplianceReport(report);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=compliance-report-${system.name}.pdf`);
      res.send(pdf);
    } else {
      res.json(report);
    }
  }

  async generateRiskReport(req: AuthRequest, res: Response): Promise<void> {
    const { systemId } = req.params;
    const { format = 'json' } = req.query;

    const system = await queryOne<AISystem>(
      'SELECT * FROM ai_systems WHERE id = $1 AND user_id = $2',
      [systemId, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    const assessments = await query<RiskAssessment>(
      `SELECT * FROM risk_assessments
       WHERE system_id = $1
       ORDER BY created_at DESC`,
      [systemId]
    );

    const report = {
      generated_at: new Date().toISOString(),
      system: {
        id: system.id,
        name: system.name,
        version: system.version,
        risk_level: system.risk_level
      },
      assessments: assessments.map(a => ({
        id: a.id,
        preliminary_classification: a.preliminary_classification,
        final_classification: a.final_classification,
        status: a.status,
        justification: a.justification,
        created_at: a.created_at,
        completed_at: a.completed_at
      })),
      risk_summary: this.generateRiskSummary(system.risk_level)
    };

    if (format === 'pdf') {
      const pdf = await this.pdfService.generateRiskReport(report);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=risk-report-${system.name}.pdf`);
      res.send(pdf);
    } else {
      res.json(report);
    }
  }

  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;

    // Systems by status
    const systemsByStatus = await query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count
       FROM ai_systems WHERE user_id = $1
       GROUP BY status`,
      [userId]
    );

    // Systems by risk level
    const systemsByRisk = await query<{ risk_level: string; count: string }>(
      `SELECT risk_level, COUNT(*) as count
       FROM ai_systems WHERE user_id = $1 AND risk_level IS NOT NULL
       GROUP BY risk_level`,
      [userId]
    );

    // Recent activity
    const recentSystems = await query<AISystem>(
      `SELECT id, name, risk_level, status, updated_at
       FROM ai_systems WHERE user_id = $1
       ORDER BY updated_at DESC LIMIT 5`,
      [userId]
    );

    // Compliance progress across all systems
    const overallProgress = await query<{ total: string; completed: string }>(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN ci.is_completed THEN 1 ELSE 0 END) as completed
       FROM checklist_items ci
       JOIN ai_systems s ON ci.system_id = s.id
       WHERE s.user_id = $1`,
      [userId]
    );

    res.json({
      systems_by_status: systemsByStatus.map(s => ({
        status: s.status,
        count: parseInt(s.count, 10)
      })),
      systems_by_risk: systemsByRisk.map(s => ({
        risk_level: s.risk_level,
        count: parseInt(s.count, 10)
      })),
      recent_systems: recentSystems,
      overall_compliance: {
        total: parseInt(overallProgress[0]?.total || '0', 10),
        completed: parseInt(overallProgress[0]?.completed || '0', 10),
        percentage: overallProgress[0]
          ? Math.round((parseInt(overallProgress[0].completed, 10) / parseInt(overallProgress[0].total, 10)) * 100) || 0
          : 0
      }
    });
  }

  async generateDocumentation(req: AuthRequest, res: Response): Promise<void> {
    const { systemId } = req.params;

    const system = await queryOne<AISystem>(
      'SELECT * FROM ai_systems WHERE id = $1 AND user_id = $2',
      [systemId, req.user?.userId]
    );

    if (!system) {
      throw createError('System not found', 404, 'SYSTEM_NOT_FOUND');
    }

    const assessment = await queryOne<RiskAssessment>(
      `SELECT * FROM risk_assessments
       WHERE system_id = $1 AND status = 'completed'
       ORDER BY completed_at DESC LIMIT 1`,
      [systemId]
    );

    const checklistItems = await query<ChecklistItem>(
      'SELECT * FROM checklist_items WHERE system_id = $1 ORDER BY phase, category',
      [systemId]
    );

    const pdf = await this.pdfService.generateTechnicalDocumentation({
      system,
      assessment,
      checklist: checklistItems
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=technical-documentation-${system.name}.pdf`);
    res.send(pdf);
  }

  async getDeadlines(req: AuthRequest, res: Response): Promise<void> {
    // EU AI Act implementation deadlines
    const deadlines = [
      {
        date: '2025-02-02',
        title: 'Prohibitions on Unacceptable Risk AI',
        description: 'AI practices posing unacceptable risk become prohibited',
        applicable_to: [RiskLevel.UNACCEPTABLE]
      },
      {
        date: '2025-08-02',
        title: 'GPAIM Obligations',
        description: 'General Purpose AI Model requirements come into effect',
        applicable_to: ['gpaim']
      },
      {
        date: '2026-08-02',
        title: 'Full High-Risk Obligations',
        description: 'Complete set of requirements for high-risk AI systems apply',
        applicable_to: [RiskLevel.HIGH]
      }
    ];

    // Get user's systems to show relevant deadlines
    const systems = await query<AISystem>(
      'SELECT risk_level FROM ai_systems WHERE user_id = $1 AND risk_level IS NOT NULL',
      [req.user?.userId]
    );

    const userRiskLevels = [...new Set(systems.map(s => s.risk_level))];

    const relevantDeadlines = deadlines.filter(d =>
      d.applicable_to.some(level => userRiskLevels.includes(level as RiskLevel))
    );

    res.json({
      all_deadlines: deadlines,
      relevant_deadlines: relevantDeadlines,
      user_risk_levels: userRiskLevels
    });
  }

  private groupByPhase(items: ChecklistItem[]): Record<string, { total: number; completed: number }> {
    return items.reduce((acc, item) => {
      if (!acc[item.phase]) {
        acc[item.phase] = { total: 0, completed: 0 };
      }
      acc[item.phase]!.total++;
      if (item.is_completed) {
        acc[item.phase]!.completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
  }

  private generateRiskSummary(riskLevel: RiskLevel | undefined) {
    const summaries: Record<RiskLevel, { obligations: string[]; timeline: string }> = {
      [RiskLevel.UNACCEPTABLE]: {
        obligations: ['System is PROHIBITED under the EU AI Act'],
        timeline: 'Prohibition in effect from February 2, 2025'
      },
      [RiskLevel.HIGH]: {
        obligations: [
          'Risk Management System required',
          'Data Governance measures',
          'Technical Documentation',
          'Record-keeping (Logging)',
          'Transparency & User Information',
          'Human Oversight',
          'Accuracy, Robustness & Cybersecurity',
          'Conformity Assessment',
          'EU Database Registration'
        ],
        timeline: 'Full compliance required by August 2, 2026'
      },
      [RiskLevel.LIMITED]: {
        obligations: [
          'Transparency obligations',
          'User disclosure (chatbots)',
          'Content labeling (deepfakes)',
          'Emotion recognition disclosure'
        ],
        timeline: 'Obligations apply from August 2, 2025'
      },
      [RiskLevel.MINIMAL]: {
        obligations: ['No specific AI Act obligations', 'Voluntary codes of conduct encouraged'],
        timeline: 'N/A - Free use allowed'
      }
    };

    return riskLevel ? summaries[riskLevel] : null;
  }
}
