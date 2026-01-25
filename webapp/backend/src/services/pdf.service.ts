import PDFDocument from 'pdfkit';
import { AISystem, RiskAssessment, ChecklistItem } from '../types/index.js';

export class PDFService {
  async generateComplianceReport(report: {
    generated_at: string;
    system: Partial<AISystem>;
    assessment: Partial<RiskAssessment> | null;
    compliance: {
      total_items: number;
      completed_items: number;
      required_items: number;
      required_completed: number;
      phases: Record<string, { total: number; completed: number }>;
    };
  }): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(24).text('EU AI Act Compliance Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date(report.generated_at).toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // System Information
      doc.fontSize(16).text('System Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(`Name: ${report.system.name}`);
      doc.text(`Version: ${report.system.version}`);
      doc.text(`Risk Level: ${report.system.risk_level?.toUpperCase() || 'Not Classified'}`);
      doc.text(`Status: ${report.system.status}`);
      doc.moveDown();
      doc.text(`Description: ${report.system.description}`);
      doc.text(`Intended Purpose: ${report.system.intended_purpose}`);
      doc.moveDown(2);

      // Assessment Summary
      if (report.assessment) {
        doc.fontSize(16).text('Risk Assessment Summary', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Preliminary Classification: ${report.assessment.preliminary_classification?.toUpperCase()}`);
        doc.text(`Final Classification: ${report.assessment.final_classification?.toUpperCase()}`);
        if (report.assessment.justification) {
          doc.text(`Justification: ${report.assessment.justification}`);
        }
        doc.text(`Completed: ${report.assessment.completed_at ? new Date(report.assessment.completed_at).toLocaleDateString() : 'In Progress'}`);
        doc.moveDown(2);
      }

      // Compliance Progress
      doc.fontSize(16).text('Compliance Progress', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);

      const percentage = Math.round((report.compliance.completed_items / report.compliance.total_items) * 100) || 0;
      doc.text(`Overall Progress: ${percentage}% (${report.compliance.completed_items}/${report.compliance.total_items} items)`);
      doc.text(`Required Items: ${report.compliance.required_completed}/${report.compliance.required_items} completed`);
      doc.moveDown();

      // Progress by Phase
      doc.fontSize(14).text('Progress by Phase:', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);

      for (const [phase, progress] of Object.entries(report.compliance.phases)) {
        const phasePercentage = Math.round((progress.completed / progress.total) * 100) || 0;
        doc.text(`  ${phase}: ${phasePercentage}% (${progress.completed}/${progress.total})`);
      }

      doc.moveDown(2);

      // Footer
      doc.fontSize(10).fillColor('gray').text('This report is generated for informational purposes only and does not constitute legal advice.', {
        align: 'center'
      });

      doc.end();
    });
  }

  async generateRiskReport(report: {
    generated_at: string;
    system: Partial<AISystem>;
    assessments: Array<Partial<RiskAssessment>>;
    risk_summary: { obligations: string[]; timeline: string } | null;
  }): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(24).text('Risk Assessment Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date(report.generated_at).toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // System
      doc.fontSize(16).text('AI System', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(`Name: ${report.system.name}`);
      doc.text(`Version: ${report.system.version}`);
      doc.text(`Current Risk Level: ${report.system.risk_level?.toUpperCase() || 'Not Classified'}`);
      doc.moveDown(2);

      // Risk Summary
      if (report.risk_summary) {
        doc.fontSize(16).text('Compliance Obligations', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Timeline: ${report.risk_summary.timeline}`);
        doc.moveDown(0.5);
        doc.text('Required Actions:');
        for (const obligation of report.risk_summary.obligations) {
          doc.text(`  • ${obligation}`);
        }
        doc.moveDown(2);
      }

      // Assessment History
      doc.fontSize(16).text('Assessment History', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);

      for (const assessment of report.assessments) {
        doc.text(`Assessment ID: ${assessment.id}`);
        doc.text(`  Status: ${assessment.status}`);
        doc.text(`  Preliminary: ${assessment.preliminary_classification?.toUpperCase()}`);
        doc.text(`  Final: ${assessment.final_classification?.toUpperCase() || 'Pending'}`);
        doc.text(`  Created: ${assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : 'N/A'}`);
        doc.moveDown();
      }

      doc.end();
    });
  }

  async generateTechnicalDocumentation(data: {
    system: AISystem;
    assessment: RiskAssessment | null;
    checklist: ChecklistItem[];
  }): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title Page
      doc.fontSize(28).text('Technical Documentation', { align: 'center' });
      doc.moveDown();
      doc.fontSize(20).text('EU AI Act Compliance', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(16).text(data.system.name, { align: 'center' });
      doc.text(`Version ${data.system.version}`, { align: 'center' });
      doc.moveDown(4);
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

      doc.addPage();

      // Table of Contents
      doc.fontSize(18).text('Table of Contents', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text('1. System Overview');
      doc.text('2. Risk Classification');
      doc.text('3. Compliance Checklist');
      doc.text('4. Assessment Results');

      doc.addPage();

      // Section 1: System Overview
      doc.fontSize(18).text('1. System Overview', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Name: ${data.system.name}`);
      doc.text(`Version: ${data.system.version}`);
      doc.text(`Status: ${data.system.status}`);
      doc.moveDown();
      doc.text('Description:', { underline: true });
      doc.text(data.system.description);
      doc.moveDown();
      doc.text('Intended Purpose:', { underline: true });
      doc.text(data.system.intended_purpose);
      if (data.system.deployment_context) {
        doc.moveDown();
        doc.text('Deployment Context:', { underline: true });
        doc.text(data.system.deployment_context);
      }

      doc.addPage();

      // Section 2: Risk Classification
      doc.fontSize(18).text('2. Risk Classification', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Classification: ${data.system.risk_level?.toUpperCase() || 'Not Yet Classified'}`);

      if (data.assessment) {
        doc.moveDown();
        doc.text(`Assessment Status: ${data.assessment.status}`);
        doc.text(`Preliminary Classification: ${data.assessment.preliminary_classification}`);
        doc.text(`Final Classification: ${data.assessment.final_classification || 'Pending'}`);
        if (data.assessment.justification) {
          doc.moveDown();
          doc.text('Justification:', { underline: true });
          doc.text(data.assessment.justification);
        }
      }

      doc.addPage();

      // Section 3: Compliance Checklist
      doc.fontSize(18).text('3. Compliance Checklist', { underline: true });
      doc.moveDown();

      const phases = [...new Set(data.checklist.map(i => i.phase))];
      for (const phase of phases) {
        doc.fontSize(14).text(phase, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);

        const phaseItems = data.checklist.filter(i => i.phase === phase);
        for (const item of phaseItems) {
          const status = item.is_completed ? '✓' : '○';
          const required = item.is_required ? ' (Required)' : '';
          doc.text(`${status} ${item.item_text}${required}`);
        }
        doc.moveDown();
      }

      // Footer
      doc.fontSize(8).fillColor('gray').text(
        'This document is generated for compliance documentation purposes under the EU AI Act.',
        { align: 'center' }
      );

      doc.end();
    });
  }
}
