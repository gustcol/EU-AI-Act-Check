import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import { t, changeLanguage } from '../config/i18n.js';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
      port: parseInt(process.env['SMTP_PORT'] || '587', 10),
      secure: false,
      auth: {
        user: process.env['SMTP_USER'],
        pass: process.env['SMTP_PASS']
      }
    });
  }

  async sendWelcomeEmail(email: string, name: string, language: string): Promise<void> {
    await changeLanguage(language);

    const subject = t('email:welcome.subject');
    const html = `
      <h1>${t('email:welcome.title', { name })}</h1>
      <p>${t('email:welcome.body')}</p>
      <p>${t('email:welcome.getting_started')}</p>
      <ul>
        <li>${t('email:welcome.step1')}</li>
        <li>${t('email:welcome.step2')}</li>
        <li>${t('email:welcome.step3')}</li>
      </ul>
      <p>${t('email:welcome.footer')}</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
    language: string
  ): Promise<void> {
    await changeLanguage(language);

    const resetUrl = `${process.env['FRONTEND_URL']}/reset-password?token=${resetToken}`;
    const subject = t('email:password_reset.subject');
    const html = `
      <h1>${t('email:password_reset.title')}</h1>
      <p>${t('email:password_reset.body', { name })}</p>
      <p><a href="${resetUrl}">${t('email:password_reset.link_text')}</a></p>
      <p>${t('email:password_reset.expiry')}</p>
      <p>${t('email:password_reset.ignore')}</p>
    `;

    await this.sendEmail(email, subject, html);
  }

  async sendDeadlineReminder(
    email: string,
    name: string,
    systemName: string,
    deadline: string,
    language: string
  ): Promise<void> {
    await changeLanguage(language);

    const subject = t('email:deadline.subject', { systemName });
    const html = `
      <h1>${t('email:deadline.title')}</h1>
      <p>${t('email:deadline.body', { name, systemName, deadline })}</p>
      <p><a href="${process.env['FRONTEND_URL']}/systems">${t('email:deadline.action')}</a></p>
    `;

    await this.sendEmail(email, subject, html);
  }

  async sendWeeklySummary(
    email: string,
    name: string,
    summary: {
      total_systems: number;
      compliant: number;
      pending_items: number;
    },
    language: string
  ): Promise<void> {
    await changeLanguage(language);

    const subject = t('email:weekly_summary.subject');
    const html = `
      <h1>${t('email:weekly_summary.title', { name })}</h1>
      <p>${t('email:weekly_summary.overview')}</p>
      <ul>
        <li>${t('email:weekly_summary.total_systems', { count: summary.total_systems })}</li>
        <li>${t('email:weekly_summary.compliant', { count: summary.compliant })}</li>
        <li>${t('email:weekly_summary.pending', { count: summary.pending_items })}</li>
      </ul>
      <p><a href="${process.env['FRONTEND_URL']}/dashboard">${t('email:weekly_summary.action')}</a></p>
    `;

    await this.sendEmail(email, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!process.env['SMTP_USER']) {
      logger.warn('SMTP not configured, skipping email', { to, subject });
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"EU AI Act Compliance" <${process.env['SMTP_USER']}>`,
        to,
        subject,
        html
      });
      logger.info('Email sent', { to, subject });
    } catch (error) {
      logger.error('Failed to send email', { to, subject, error });
      throw error;
    }
  }
}
