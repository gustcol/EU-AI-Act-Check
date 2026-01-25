import { AISystem, RiskLevel } from '../types/index.js';

interface ClassificationResult {
  risk_level: RiskLevel;
  confidence: number;
  reasons: string[];
  warnings: string[];
}

export class ClassificationService {
  // Keywords indicating prohibited/unacceptable risk practices
  private prohibitedKeywords = [
    'social scoring', 'social credit',
    'subliminal manipulation', 'exploit vulnerabilities',
    'real-time biometric', 'facial recognition law enforcement',
    'emotion recognition workplace', 'emotion recognition school',
    'predictive policing profiling',
    'facial scraping', 'biometric database scraping'
  ];

  // Keywords indicating high-risk use cases (Annex III)
  private highRiskKeywords = [
    'biometric identification', 'biometric categorization',
    'critical infrastructure', 'water supply', 'gas supply', 'electricity', 'traffic management',
    'education', 'vocational training', 'student evaluation', 'exam monitoring',
    'recruitment', 'hiring', 'employee evaluation', 'workforce management', 'termination',
    'credit scoring', 'creditworthiness', 'insurance risk', 'health insurance', 'life insurance',
    'public benefits', 'social assistance', 'emergency services',
    'law enforcement', 'criminal investigation', 'evidence evaluation',
    'migration', 'asylum', 'border control', 'visa',
    'judicial', 'legal research', 'court', 'justice',
    'election', 'voting', 'democratic'
  ];

  // Keywords indicating transparency/limited risk
  private limitedRiskKeywords = [
    'chatbot', 'conversational ai', 'virtual assistant',
    'emotion recognition', 'emotion detection', 'sentiment analysis face',
    'deepfake', 'synthetic media', 'face swap', 'voice clone',
    'ai generated content', 'text generation', 'image generation'
  ];

  classify(system: AISystem): ClassificationResult {
    const reasons: string[] = [];
    const warnings: string[] = [];
    let confidence = 0.5;

    const searchText = [
      system.name,
      system.description,
      system.intended_purpose,
      system.deployment_context || ''
    ].join(' ').toLowerCase();

    // Check for prohibited practices (highest priority)
    for (const keyword of this.prohibitedKeywords) {
      if (searchText.includes(keyword)) {
        reasons.push(`Detected prohibited practice indicator: "${keyword}"`);
        warnings.push('This system may involve practices prohibited under Article 5 of the EU AI Act');
        return {
          risk_level: RiskLevel.UNACCEPTABLE,
          confidence: 0.9,
          reasons,
          warnings
        };
      }
    }

    // Check for high-risk indicators
    let highRiskScore = 0;
    for (const keyword of this.highRiskKeywords) {
      if (searchText.includes(keyword)) {
        highRiskScore++;
        reasons.push(`High-risk indicator detected: "${keyword}"`);
      }
    }

    if (highRiskScore >= 2) {
      confidence = Math.min(0.7 + (highRiskScore * 0.05), 0.95);
      warnings.push('This system likely falls under Annex III high-risk categories');
      return {
        risk_level: RiskLevel.HIGH,
        confidence,
        reasons,
        warnings
      };
    }

    // Check for limited risk indicators
    let limitedRiskScore = 0;
    for (const keyword of this.limitedRiskKeywords) {
      if (searchText.includes(keyword)) {
        limitedRiskScore++;
        reasons.push(`Transparency obligation indicator: "${keyword}"`);
      }
    }

    if (limitedRiskScore > 0) {
      confidence = Math.min(0.6 + (limitedRiskScore * 0.1), 0.85);
      warnings.push('This system requires specific transparency obligations under Article 52');
      return {
        risk_level: RiskLevel.LIMITED,
        confidence,
        reasons,
        warnings
      };
    }

    // Default to minimal risk
    reasons.push('No specific risk indicators detected');
    return {
      risk_level: RiskLevel.MINIMAL,
      confidence: 0.6,
      reasons,
      warnings: ['Classification based on available information. Please verify manually.']
    };
  }

  getRequirementsForLevel(level: RiskLevel): string[] {
    const requirements: Record<RiskLevel, string[]> = {
      [RiskLevel.UNACCEPTABLE]: [
        'PROHIBITED: This AI practice is not allowed under the EU AI Act',
        'Do not deploy this system in the EU market',
        'Consult legal counsel immediately'
      ],
      [RiskLevel.HIGH]: [
        'Implement a Risk Management System (Article 9)',
        'Ensure Data Governance compliance (Article 10)',
        'Maintain Technical Documentation (Article 11)',
        'Implement Record-Keeping/Logging (Article 12)',
        'Provide Transparency & User Information (Article 13)',
        'Enable Human Oversight capabilities (Article 14)',
        'Ensure Accuracy, Robustness & Cybersecurity (Article 15)',
        'Implement Quality Management System (Article 17)',
        'Complete Conformity Assessment before market placement',
        'Register in EU Database',
        'Establish Post-Market Monitoring'
      ],
      [RiskLevel.LIMITED]: [
        'Implement transparency disclosures',
        'For chatbots: Inform users they are interacting with AI',
        'For emotion recognition: Inform exposed individuals',
        'For deepfakes/AI content: Label as artificially generated',
        'Ensure content is machine-readable as AI-generated'
      ],
      [RiskLevel.MINIMAL]: [
        'No specific AI Act obligations apply',
        'Consider voluntary codes of conduct',
        'Follow general software best practices',
        'Ensure GDPR compliance if processing personal data',
        'Monitor for changes that could affect classification'
      ]
    };

    return requirements[level];
  }
}
