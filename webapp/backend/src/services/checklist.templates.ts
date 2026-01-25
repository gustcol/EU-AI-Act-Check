import { RiskLevel } from '../types/index.js';

interface ChecklistTemplate {
  category: string;
  phase: string;
  item_text: string;
  is_required: boolean;
}

export const checklistTemplates: Record<RiskLevel, ChecklistTemplate[]> = {
  [RiskLevel.UNACCEPTABLE]: [
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Confirm system falls under prohibited practices (Article 5)',
      is_required: true
    },
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Document reasoning for unacceptable risk classification',
      is_required: true
    },
    {
      category: 'Legal Review',
      phase: 'Phase 1: Classification',
      item_text: 'Consult with legal counsel regarding prohibition',
      is_required: true
    },
    {
      category: 'Action',
      phase: 'Phase 2: Remediation',
      item_text: 'Cease development/deployment of prohibited AI system',
      is_required: true
    },
    {
      category: 'Action',
      phase: 'Phase 2: Remediation',
      item_text: 'Explore alternative approaches that comply with the Act',
      is_required: false
    }
  ],

  [RiskLevel.HIGH]: [
    // Phase 1: Classification
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Identify AI system components and boundaries',
      is_required: true
    },
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Document intended purpose and use cases',
      is_required: true
    },
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Confirm high-risk classification under Annex III',
      is_required: true
    },
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Review classification with legal/compliance team',
      is_required: true
    },

    // Phase 2: Core Compliance
    {
      category: 'Risk Management',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Establish risk management system (Article 9)',
      is_required: true
    },
    {
      category: 'Risk Management',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Conduct initial risk assessment',
      is_required: true
    },
    {
      category: 'Risk Management',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Document risk mitigation measures',
      is_required: true
    },
    {
      category: 'Risk Management',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Establish ongoing risk monitoring procedures',
      is_required: true
    },
    {
      category: 'Data Governance',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Document training, validation, and testing data (Article 10)',
      is_required: true
    },
    {
      category: 'Data Governance',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Ensure data relevance and representativeness',
      is_required: true
    },
    {
      category: 'Data Governance',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Examine data for potential biases',
      is_required: true
    },
    {
      category: 'Data Governance',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Implement bias mitigation measures',
      is_required: true
    },
    {
      category: 'Data Governance',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Verify GDPR compliance for personal data',
      is_required: true
    },
    {
      category: 'Technical Documentation',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Prepare technical documentation (Article 11)',
      is_required: true
    },
    {
      category: 'Technical Documentation',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Document system architecture and components',
      is_required: true
    },
    {
      category: 'Technical Documentation',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Document development and training process',
      is_required: true
    },
    {
      category: 'Technical Documentation',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Document performance metrics and limitations',
      is_required: true
    },
    {
      category: 'Record-Keeping',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Implement automatic logging capabilities (Article 12)',
      is_required: true
    },
    {
      category: 'Record-Keeping',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Ensure logs are secure and timestamped',
      is_required: true
    },
    {
      category: 'Transparency',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Design for interpretability (Article 13)',
      is_required: true
    },
    {
      category: 'Transparency',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Prepare user instructions and documentation',
      is_required: true
    },
    {
      category: 'Human Oversight',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Design human oversight mechanisms (Article 14)',
      is_required: true
    },
    {
      category: 'Human Oversight',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Define intervention capabilities',
      is_required: true
    },
    {
      category: 'Technical Requirements',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Define accuracy requirements (Article 15)',
      is_required: true
    },
    {
      category: 'Technical Requirements',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Conduct robustness testing',
      is_required: true
    },
    {
      category: 'Technical Requirements',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Implement cybersecurity measures',
      is_required: true
    },
    {
      category: 'Quality Management',
      phase: 'Phase 2: Core Compliance',
      item_text: 'Implement Quality Management System (Article 17)',
      is_required: true
    },

    // Phase 3: Conformity & Registration
    {
      category: 'Conformity Assessment',
      phase: 'Phase 3: Conformity & Market',
      item_text: 'Determine conformity assessment procedure',
      is_required: true
    },
    {
      category: 'Conformity Assessment',
      phase: 'Phase 3: Conformity & Market',
      item_text: 'Complete conformity assessment',
      is_required: true
    },
    {
      category: 'Conformity Assessment',
      phase: 'Phase 3: Conformity & Market',
      item_text: 'Prepare EU Declaration of Conformity',
      is_required: true
    },
    {
      category: 'Conformity Assessment',
      phase: 'Phase 3: Conformity & Market',
      item_text: 'Affix CE marking',
      is_required: true
    },
    {
      category: 'Registration',
      phase: 'Phase 3: Conformity & Market',
      item_text: 'Register in EU Database before market placement',
      is_required: true
    },

    // Phase 4: Post-Market
    {
      category: 'Monitoring',
      phase: 'Phase 4: Post-Market',
      item_text: 'Establish post-market monitoring system (Article 61)',
      is_required: true
    },
    {
      category: 'Monitoring',
      phase: 'Phase 4: Post-Market',
      item_text: 'Define monitoring metrics and KPIs',
      is_required: true
    },
    {
      category: 'Monitoring',
      phase: 'Phase 4: Post-Market',
      item_text: 'Establish incident reporting procedures',
      is_required: true
    },
    {
      category: 'Maintenance',
      phase: 'Phase 4: Post-Market',
      item_text: 'Keep documentation updated',
      is_required: true
    },
    {
      category: 'Maintenance',
      phase: 'Phase 4: Post-Market',
      item_text: 'Review compliance regularly',
      is_required: true
    }
  ],

  [RiskLevel.LIMITED]: [
    // Phase 1: Classification
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Confirm limited risk classification',
      is_required: true
    },
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Identify applicable transparency obligations',
      is_required: true
    },

    // Phase 2: Transparency
    {
      category: 'User Disclosure',
      phase: 'Phase 2: Transparency',
      item_text: 'Implement AI interaction disclosure (chatbots)',
      is_required: true
    },
    {
      category: 'User Disclosure',
      phase: 'Phase 2: Transparency',
      item_text: 'Inform users of emotion recognition use',
      is_required: true
    },
    {
      category: 'Content Labeling',
      phase: 'Phase 2: Transparency',
      item_text: 'Label AI-generated/manipulated content (deepfakes)',
      is_required: true
    },
    {
      category: 'Content Labeling',
      phase: 'Phase 2: Transparency',
      item_text: 'Implement machine-readable AI content markers',
      is_required: true
    },
    {
      category: 'Documentation',
      phase: 'Phase 2: Transparency',
      item_text: 'Document transparency implementation',
      is_required: true
    },

    // Phase 3: Verification
    {
      category: 'Testing',
      phase: 'Phase 3: Verification',
      item_text: 'Test transparency disclosures effectiveness',
      is_required: false
    },
    {
      category: 'Testing',
      phase: 'Phase 3: Verification',
      item_text: 'Verify disclosure visibility and clarity',
      is_required: true
    }
  ],

  [RiskLevel.MINIMAL]: [
    // Phase 1: Classification
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Confirm minimal risk classification',
      is_required: true
    },
    {
      category: 'Classification',
      phase: 'Phase 1: Classification',
      item_text: 'Document reasoning for classification',
      is_required: true
    },

    // Phase 2: Best Practices (Voluntary)
    {
      category: 'Voluntary Measures',
      phase: 'Phase 2: Best Practices',
      item_text: 'Consider adopting voluntary code of conduct',
      is_required: false
    },
    {
      category: 'Voluntary Measures',
      phase: 'Phase 2: Best Practices',
      item_text: 'Follow software development best practices',
      is_required: false
    },
    {
      category: 'GDPR',
      phase: 'Phase 2: Best Practices',
      item_text: 'Verify GDPR compliance if processing personal data',
      is_required: true
    },

    // Phase 3: Monitoring
    {
      category: 'Monitoring',
      phase: 'Phase 3: Monitoring',
      item_text: 'Monitor for use case changes affecting classification',
      is_required: false
    },
    {
      category: 'Monitoring',
      phase: 'Phase 3: Monitoring',
      item_text: 'Re-evaluate classification periodically',
      is_required: false
    }
  ]
};
