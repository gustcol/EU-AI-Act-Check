// Risk Classification Types
export enum RiskLevel {
  UNACCEPTABLE = 'unacceptable',
  HIGH = 'high',
  LIMITED = 'limited',
  MINIMAL = 'minimal'
}

export enum SystemStatus {
  DRAFT = 'draft',
  IN_ASSESSMENT = 'in_assessment',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  ARCHIVED = 'archived'
}

export enum AssessmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  NEEDS_REVIEW = 'needs_review'
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ASSESSOR = 'assessor',
  VIEWER = 'viewer'
}

// Database Models
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  organization?: string;
  language: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface AISystem {
  id: string;
  user_id: string;
  name: string;
  description: string;
  version: string;
  intended_purpose: string;
  deployment_context?: string;
  ai_techniques?: string[];
  risk_level?: RiskLevel;
  status: SystemStatus;
  created_at: Date;
  updated_at: Date;
}

export interface RiskAssessment {
  id: string;
  system_id: string;
  assessor_id: string;
  status: AssessmentStatus;
  preliminary_classification: RiskLevel;
  final_classification?: RiskLevel;
  justification?: string;
  responses: AssessmentResponse[];
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface AssessmentResponse {
  question_id: string;
  answer: string | boolean | string[];
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  system_id: string;
  category: string;
  phase: string;
  item_text: string;
  is_required: boolean;
  is_completed: boolean;
  completed_by?: string;
  completed_at?: Date;
  notes?: string;
  evidence_url?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// API DTOs
export interface CreateSystemDTO {
  name: string;
  description: string;
  version: string;
  intended_purpose: string;
  deployment_context?: string;
  ai_techniques?: string[];
}

export interface UpdateSystemDTO extends Partial<CreateSystemDTO> {
  risk_level?: RiskLevel;
  status?: SystemStatus;
}

export interface CreateAssessmentDTO {
  system_id: string;
  preliminary_classification: RiskLevel;
}

export interface AssessmentAnswerDTO {
  question_id: string;
  answer: string | boolean | string[];
  notes?: string;
}

export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
  organization?: string;
  language?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
