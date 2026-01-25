import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '../config/database.js';
import { createError, AuthRequest } from '../middleware/auth.js';
import { User, UserRole } from '../types/index.js';

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    const user = await queryOne<User>(
      `SELECT id, email, name, organization, language, role, created_at, last_login
       FROM users WHERE id = $1`,
      [req.user?.userId]
    );

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({ user });
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, organization, language } = req.body;

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (organization !== undefined) {
      updates.push(`organization = $${paramIndex++}`);
      values.push(organization);
    }

    if (language !== undefined) {
      updates.push(`language = $${paramIndex++}`);
      values.push(language);
    }

    if (updates.length === 0) {
      const user = await queryOne<User>(
        'SELECT id, email, name, organization, language, role FROM users WHERE id = $1',
        [req.user?.userId]
      );
      res.json({ user });
      return;
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user?.userId);

    const [user] = await query<User>(
      `UPDATE users SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, email, name, organization, language, role`,
      values
    );

    res.json({ user });
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { current_password, new_password } = req.body;

    const user = await queryOne<User>(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user?.userId]
    );

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    const isValid = await bcrypt.compare(current_password, user.password_hash);
    if (!isValid) {
      throw createError('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(new_password, salt);

    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, req.user?.userId]
    );

    res.json({ message: 'Password changed successfully' });
  }

  async updatePreferences(req: AuthRequest, res: Response): Promise<void> {
    const { email_notifications, deadline_reminders, weekly_summary } = req.body;

    const preferences = {
      email_notifications: email_notifications ?? true,
      deadline_reminders: deadline_reminders ?? true,
      weekly_summary: weekly_summary ?? false
    };

    await query(
      `UPDATE users SET preferences = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(preferences), req.user?.userId]
    );

    res.json({ preferences });
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    const users = await query<Omit<User, 'password_hash'>>(
      `SELECT id, email, name, organization, language, role, created_at, last_login
       FROM users ORDER BY created_at DESC`
    );

    res.json({ users });
  }

  async updateRole(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { role } = req.body;

    // Prevent self-demotion
    if (id === req.user?.userId) {
      throw createError('Cannot change your own role', 400, 'SELF_ROLE_CHANGE');
    }

    const [user] = await query<User>(
      `UPDATE users SET role = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, email, name, role`,
      [role, id]
    );

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({ user });
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user?.userId) {
      throw createError('Cannot delete your own account', 400, 'SELF_DELETE');
    }

    // Check if user exists
    const user = await queryOne<User>('SELECT id, email FROM users WHERE id = $1', [id]);
    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Delete user (cascade will handle related records)
    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'User deleted successfully', user: { id: user.id, email: user.email } });
  }
}
