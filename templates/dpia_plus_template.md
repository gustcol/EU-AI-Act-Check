# Data Protection Impact Assessment + AI Act Considerations (DPIA+) Template

**Project/System Name:** [Enter Project/AI System Name]
**Version:** [Enter System Version]
**Date of Assessment:** [YYYY-MM-DD]
**Assessor(s):** [Name(s) and Role(s) - Include DPO, AI Compliance Lead, Legal, Technical Lead as appropriate]
**Data Controller:** [Name of Entity]
**Data Processor(s) (if applicable):** [Name(s) of Entity/Entities]

---

## SECTION 1: GDPR DPIA Components

- **1.1. Description of Processing Operations:**
  - Nature: [Describe what personal data is collected, how it's used, stored, accessed, and deleted.]
  - Scope: [Volume of data, types of data subjects, geographical extent.]
  - Context: [Origin of data, relationship with data subjects, internal/external factors.]
  - Purposes: [Clearly define the specific, explicit, and legitimate purposes for processing personal data.]
  - Assets Involved: [Hardware, software, networks, people, paper records.]
- **1.2. Necessity and Proportionality Assessment:**
  - Lawful Basis: [Identify the GDPR lawful basis for processing (e.g., consent, contract, legal obligation, legitimate interests).]
  - Purpose Limitation: [Confirm processing is limited to the stated purposes.]
  - Data Minimisation: [Confirm only necessary personal data is processed.]
  - Accuracy: [Describe measures to ensure data accuracy.]
  - Storage Limitation: [Describe data retention periods and deletion processes.]
  - Necessity: [Explain why this processing of personal data is necessary to achieve the purposes.]
  - Proportionality: [Justify that the processing is proportionate to the purposes, considering alternatives.]
- **1.3. Assessment of Risks to Rights and Freedoms of Data Subjects:**
  - Risk Identification: [Identify potential impacts on data subjects (e.g., discrimination, identity theft, financial loss, reputational damage, loss of confidentiality, re-identification of anonymized data).]
  - Risk Sources: [Internal/external threats, human error, technical failures.]
  - Severity & Likelihood: [Evaluate the potential severity and likelihood of each risk occurring.]
- **1.4. Measures Envisaged to Address Risks (GDPR Safeguards):**
  - Security Measures: [Technical and organizational measures (e.g., encryption, access controls, pseudonymization, staff training).]
  - Data Subject Rights: [Describe procedures for handling access, rectification, erasure, restriction, portability, objection requests.]
  - Data Protection by Design & Default: [Describe how privacy principles are embedded.]
  - Contracts/DPAs: [Ensure appropriate agreements are in place with processors.]
  - Consultation: [Document consultation with DPO, data subjects, or representatives if applicable.]

---

## SECTION 2: AI Act Overlay

- **2.1. AI System Identification & Classification:**
  - AI System Description: [Briefly describe the AI component involved in the processing.]
  - AI Act Risk Classification: [Unacceptable / High / Limited / Minimal / GPAIM / GPAIM with Systemic Risk]
  - Justification: [Explain the reasoning for the classification based on AI Act criteria (Annexes, intended use).]
  - Reference to AI Act Documentation: [Link to Model Documentation, Risk Assessment under AI Act.]
- **2.2. Specific AI-Related Fundamental Rights Impacts:**
  - [Beyond general privacy risks, assess specific impacts related to the AI's function.]
  - Examples: Risk of bias/discrimination in automated decisions, impact on freedom of expression (content moderation), right to non-discrimination, impact on human dignity, chilling effects from monitoring/profiling, impact on democratic processes.
- **2.3. Technical Architecture Assessment (AI Focus):**
  - Model Transparency/Explainability: [Assess the level of transparency and how it impacts data subjects' ability to understand processing.]
  - Automation Level: [Degree of automation in decision-making affecting individuals.]
  - Intervention Capabilities: [Assess human oversight mechanisms and ability to intervene/correct AI outputs affecting personal data.]
- **2.4. Training & Input Data Evaluation (Privacy Focus):**
  - Personal Data in Training/Testing: [Confirm if personal data was used. If so, assess lawfulness, minimization, and safeguards applied during training data lifecycle.]
  - Input Data Necessity: [Assess if the personal data input during inference is necessary and minimized for the AI function.]
  - Bias in Data: [Assess how biases in data used by the AI could lead to discriminatory processing of personal data.]
- **2.5. AI Model Governance Considerations:**
  - [Assess how model updates, monitoring, and maintenance processes might impact personal data processing or introduce new risks.]

---

## SECTION 3: Integrated Risk Assessment & Mitigation

- **3.1. Combined Risk Evaluation:**
  - [Synthesize risks identified in Section 1.3 and Section 2.2/2.3/2.4/2.5.]
  - Evaluate overall risk level considering both GDPR and AI Act perspectives.

| Combined Risk Scenario                                      | GDPR Impact (Severity/Likelihood) | AI Act Impact (Severity/Likelihood) | Overall Risk Level (Critical/High/Medium/Low) | Justification |
| :---------------------------------------------------------- | :-------------------------------- | :---------------------------------- | :-------------------------------------------- | :------------ |
| e.g., Biased AI decision leads to unfair denial of service  | High/Medium                       | High/Medium                         | High                                          |               |
| e.g., Lack of AI explainability hinders data subject rights | Medium/High                       | Medium/High                         | High                                          |               |
| ...                                                         |                                   |                                     |                                               |               |

- **3.2. Unified Mitigation Measures:**
  - [List all measures planned or in place to address the combined risks. Include measures from Section 1.4 and add AI-specific controls.]
  - Examples: Enhanced transparency notices, specific bias mitigation techniques, robust human oversight procedures, specific security controls for AI models, procedures for contesting AI-driven decisions affecting personal data.

| Combined Risk Scenario | Mitigation Measure(s)                   | Responsibility | Status         | Verification |
| :--------------------- | :-------------------------------------- | :------------- | :------------- | :----------- |
| [From 3.1]             | [Combine GDPR safeguards & AI controls] | [Team/Person]  | [Planned/Done] | [Method]     |
| ...                    |                                         |                |                |              |

- **3.3. Regulatory Compliance Verification:**
  - [Confirm that the planned measures satisfy requirements from both GDPR and the AI Act (for the relevant risk level).]
- **3.4. Residual Risk Determination:**
  - [Assess the level of risk remaining after implementing all mitigation measures.]
  - Decision: [Accept residual risk / Implement further measures / Consult Supervisory Authority (if high residual risk under GDPR).]

---

## 4. Consultation & Approval

- **4.1. Data Protection Officer (DPO) Advice:**
  - Date Advice Sought:
  - DPO Advice Received: [Summarize advice and how it was addressed.]
  - DPO Opinion on Residual Risk:
- **4.2. Consultation with Stakeholders (if applicable):**
  - [Document consultation with data subjects, technical experts, legal counsel, etc.]
- **4.3. Approval:**
  - Assessment Approved By: [Name and Role (e.g., Project Lead, DPO)]
  - Date: [YYYY-MM-DD]

---

_This template integrates GDPR DPIA requirements with AI Act considerations. It is illustrative and must be adapted to the specific context, legal requirements, and organizational policies. Always consult with legal and data protection experts._
_Go back to the [Main Framework README](../README.md)_
