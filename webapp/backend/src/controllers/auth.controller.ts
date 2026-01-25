import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database.js';
import { createError, AuthRequest } from '../middleware/auth.js';
import { EmailService } from '../services/email.service.js';
import { User, RegisterUserDTO, LoginDTO, UserRole } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class AuthController {
  private emailService = new EmailService();

  async register(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, name, organization, language = 'en' } = req.body as RegisterUserDTO;

    // Check if email already exists
    const existingUser = await queryOne<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser) {
      throw createError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    const [user] = await query<User>(
      `INSERT INTO users (id, email, password_hash, name, organization, language, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, organization, language, role, created_at`,
      [userId, email, passwordHash, name, organization, language, UserRole.ASSESSOR]
    );

    // Generate token
    const token = this.generateToken(user!);

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(email, name, language);
    } catch (error) {
      logger.warn('Failed to send welcome email', { email, error });
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role
      },
      token
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body as LoginDTO;

    // Find user
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (!user) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = this.generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language
      },
      token
    });
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
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

  async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    const user = await queryOne<User>(
      'SELECT id, email, role FROM users WHERE id = $1',
      [req.user?.userId]
    );

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    const token = this.generateToken(user);
    res.json({ token });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const user = await queryOne<User>(
      'SELECT id, name, language FROM users WHERE email = $1',
      [email]
    );

    // Always return success to prevent email enumeration
    res.json({ message: 'If the email exists, a reset link will be sent' });

    if (user) {
      // Generate reset token
      const resetToken = uuidv4();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour

      await query(
        `INSERT INTO password_resets (user_id, token, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3`,
        [user.id, resetToken, expiresAt]
      );

      try {
        await this.emailService.sendPasswordResetEmail(
          email,
          user.name,
          resetToken,
          user.language
        );
      } catch (error) {
        logger.error('Failed to send password reset email', { email, error });
      }
    }
  }

  private generateToken(user: Partial<User>): string {
    const secret = process.env['JWT_SECRET'] || 'default-secret';
    const expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );
  }
}
