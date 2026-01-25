export enum RiskLevel {
  UNACCEPTABLE = 'unacceptable',
  HIGH = 'high',
  LIMITED = 'limited',
  MINIMAL = 'minimal',
}

export enum SystemStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum AssessmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  language: string;
  role: 'admin' | 'assessor' | 'viewer';
  created_at: string;
  updated_at: string;
  last_login?: string;
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
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AssessmentResponse {
  question_id: string;
  answer: boolean | string | string[];
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
  completed_at?: string;
  notes?: string;
  evidence_url?: string;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'boolean' | 'select' | 'multiselect' | 'text';
  options?: string[];
  help_text?: string;
  applicable_levels: RiskLevel[];
}

export interface DashboardStats {
  total_systems: number;
  systems_by_risk: Record<RiskLevel, number>;
  pending_assessments: number;
  completed_assessments: number;
  compliance_progress: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
