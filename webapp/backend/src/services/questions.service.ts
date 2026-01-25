import { RiskLevel } from '../types/index.js';

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'boolean' | 'select' | 'multiselect' | 'text';
  options?: string[];
  help_text?: string;
  applicable_levels: RiskLevel[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Prohibited Practices Questions
  {
    id: 'prohibited_social_scoring',
    category: 'Prohibited Practices (Article 5)',
    question: 'Does the system evaluate or classify individuals based on their social behavior or personal characteristics for governmental social scoring?',
    type: 'boolean',
    help_text: 'Social scoring by public authorities that leads to detrimental treatment is prohibited.',
    applicable_levels: []
  },
  {
    id: 'prohibited_manipulation',
    category: 'Prohibited Practices (Article 5)',
    question: 'Does the system deploy subliminal techniques to materially distort behavior in a way likely to cause harm?',
    type: 'boolean',
    help_text: 'AI that manipulates persons beyond their consciousness to cause harm is prohibited.',
    applicable_levels: []
  },
  {
    id: 'prohibited_vulnerability',
    category: 'Prohibited Practices (Article 5)',
    question: 'Does the system exploit vulnerabilities of specific groups (age, disability) to distort behavior?',
    type: 'boolean',
    help_text: 'Exploiting vulnerable groups for harmful manipulation is prohibited.',
    applicable_levels: []
  },
  {
    id: 'prohibited_biometric',
    category: 'Prohibited Practices (Article 5)',
    question: 'Is the system used for real-time remote biometric identification in publicly accessible spaces for law enforcement?',
    type: 'boolean',
    help_text: 'Generally prohibited with very narrow exceptions requiring authorization.',
    applicable_levels: []
  },
  {
    id: 'prohibited_emotion_workplace',
    category: 'Prohibited Practices (Article 5)',
    question: 'Is the system used for emotion recognition in workplaces or educational institutions (except medical/safety)?',
    type: 'boolean',
    help_text: 'Emotion recognition in workplace/education contexts is generally prohibited.',
    applicable_levels: []
  },
  {
    id: 'prohibited_predictive_policing',
    category: 'Prohibited Practices (Article 5)',
    question: 'Does the system perform predictive policing based solely on profiling?',
    type: 'boolean',
    help_text: 'Predictive policing based solely on profiling or personality assessment is prohibited.',
    applicable_levels: []
  },

  // High-Risk Identification
  {
    id: 'high_risk_biometric',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used for biometric identification or categorization of natural persons?',
    type: 'boolean',
    help_text: 'Includes facial recognition, biometric categorization by sensitive attributes.',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_critical_infrastructure',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used in management/operation of critical infrastructure (traffic, water, gas, heating, electricity)?',
    type: 'boolean',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_education',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used for educational access, evaluation, or monitoring students?',
    type: 'boolean',
    help_text: 'Includes admission decisions, learning evaluation, exam monitoring.',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_employment',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used for recruitment, employee evaluation, or workforce management decisions?',
    type: 'boolean',
    help_text: 'Includes CV screening, candidate evaluation, performance monitoring, termination decisions.',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_essential_services',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used for access to essential services (credit scoring, benefits, emergency services)?',
    type: 'boolean',
    help_text: 'Includes creditworthiness assessment, public benefits eligibility, insurance risk assessment.',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_law_enforcement',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used in law enforcement contexts (risk assessment, evidence evaluation, profiling)?',
    type: 'boolean',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_migration',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used in migration, asylum, or border control contexts?',
    type: 'boolean',
    help_text: 'Includes risk assessment, document verification, asylum application examination.',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_justice',
    category: 'High-Risk Areas (Annex III)',
    question: 'Is the system used in administration of justice or democratic processes?',
    type: 'boolean',
    help_text: 'Includes legal research/interpretation assistance, systems influencing elections.',
    applicable_levels: [RiskLevel.HIGH]
  },
  {
    id: 'high_risk_safety_component',
    category: 'High-Risk Areas (Annex II)',
    question: 'Is the system a safety component of a product covered by EU harmonization legislation?',
    type: 'boolean',
    help_text: 'E.g., machinery, medical devices, toys, lifts, radio equipment, etc.',
    applicable_levels: [RiskLevel.HIGH]
  },

  // Transparency Questions (Limited Risk)
  {
    id: 'transparency_chatbot',
    category: 'Transparency Obligations (Article 52)',
    question: 'Does the system interact directly with natural persons (e.g., chatbot, virtual assistant)?',
    type: 'boolean',
    help_text: 'Users must be informed they are interacting with AI.',
    applicable_levels: [RiskLevel.LIMITED]
  },
  {
    id: 'transparency_emotion',
    category: 'Transparency Obligations (Article 52)',
    question: 'Does the system perform emotion recognition on individuals?',
    type: 'boolean',
    help_text: 'Individuals must be informed of emotion recognition operation.',
    applicable_levels: [RiskLevel.LIMITED]
  },
  {
    id: 'transparency_biometric_categorization',
    category: 'Transparency Obligations (Article 52)',
    question: 'Does the system perform biometric categorization?',
    type: 'boolean',
    help_text: 'Individuals must be informed of categorization system operation.',
    applicable_levels: [RiskLevel.LIMITED]
  },
  {
    id: 'transparency_deepfake',
    category: 'Transparency Obligations (Article 52)',
    question: 'Does the system generate or manipulate content that resembles existing persons, places, or events (deepfakes)?',
    type: 'boolean',
    help_text: 'Content must be disclosed as AI-generated/manipulated.',
    applicable_levels: [RiskLevel.LIMITED]
  },
  {
    id: 'transparency_text_generation',
    category: 'Transparency Obligations (Article 52)',
    question: 'Does the system generate text published to inform the public on matters of public interest?',
    type: 'boolean',
    help_text: 'Must disclose AI generation unless human-reviewed for editorial control.',
    applicable_levels: [RiskLevel.LIMITED]
  },

  // General Questions
  {
    id: 'general_purpose',
    category: 'General',
    question: 'What is the primary purpose of this AI system?',
    type: 'text',
    applicable_levels: []
  },
  {
    id: 'general_users',
    category: 'General',
    question: 'Who are the intended users of this system?',
    type: 'select',
    options: [
      'Internal business users',
      'Professional users (B2B)',
      'General public (B2C)',
      'Government/Public authorities',
      'Mixed audiences'
    ],
    applicable_levels: []
  },
  {
    id: 'general_ai_techniques',
    category: 'General',
    question: 'What AI techniques does this system use?',
    type: 'multiselect',
    options: [
      'Machine learning (supervised)',
      'Machine learning (unsupervised)',
      'Deep learning / Neural networks',
      'Natural language processing',
      'Computer vision',
      'Reinforcement learning',
      'Expert systems / Rule-based',
      'Generative AI / LLM',
      'Other'
    ],
    applicable_levels: []
  },
  {
    id: 'general_personal_data',
    category: 'General',
    question: 'Does the system process personal data?',
    type: 'boolean',
    help_text: 'If yes, GDPR compliance is also required.',
    applicable_levels: []
  }
];
