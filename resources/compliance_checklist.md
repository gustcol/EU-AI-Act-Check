# EU AI Act Compliance Checklist for Generative AI Systems (Based on Appendix A)

This checklist provides a high-level overview of key compliance areas based on the EU AI Act, particularly relevant for Generative AI and High-Risk systems. It should be used as a starting point and adapted based on the specific system, its classification, and detailed legal requirements.

---

### Phase 1: System Understanding & Classification

- [ ] **Identify AI System:** Clearly define the AI system, its components, and boundaries.
- [ ] **Determine Intended Purpose:** Document the specific purpose(s) for which the system will be placed on the market or put into service.
- [ ] **Assess Applicability:** Confirm the system falls under the definition of an AI system according to the Act (Annex I techniques).
- [ ] **Initial Risk Classification:**
  - [ ] Check against Prohibited Practices (Article 5). Is the intended use banned? (If yes, STOP development for EU market).
  - [ ] Check if the system is a safety component of a product listed in Annex II. (If yes, likely High-Risk).
  - [ ] Check if the intended use falls under the High-Risk areas listed in Annex III. (If yes, High-Risk).
  - [ ] Check if the system requires specific Transparency Obligations (Article 52 - Chatbots, Emotion Recognition, Biometric Categorization, Deepfakes). (If yes, Limited Risk obligations apply).
  - [ ] Check if the system qualifies as a General Purpose AI Model (GPAIM).
    - [ ] If GPAIM, assess if it meets criteria for Systemic Risk.
- [ ] **Document Classification Reasoning:** Clearly record the justification for the final classification(s).
- [ ] **Review Classification:** Discuss and confirm the classification with legal/compliance experts.

---

### Phase 2: Core Compliance Requirements (Primarily for High-Risk & GPAIMs)

- [ ] **Risk Management System (Article 9):**
  - [ ] Establish and document a continuous risk management process (identification, analysis, evaluation, mitigation, monitoring).
  - [ ] Conduct initial and ongoing risk assessments ([Template](../templates/risk_assessment_template.md)).
  - [ ] Implement and document risk mitigation measures.
  - [ ] Establish post-market monitoring procedures for risks.
- [ ] **Data Governance (Article 10):**
  - [ ] Document training, validation, and testing data processes ([Template](../templates/training_data_documentation_template.md)).
  - [ ] Ensure data is relevant, representative, free of errors, and complete for the intended purpose.
  - [ ] Examine data for potential biases and implement mitigation measures.
  - [ ] Ensure appropriate data governance and management practices are in place.
  - [ ] Comply with relevant data protection laws (e.g., GDPR) if personal data is used.
  - [ ] (GPAIMs) Document data sources, including copyrighted material summaries.
- [ ] **Technical Documentation (Article 11 & Annex IV):**
  - [ ] Prepare comprehensive technical documentation _before_ market placement.
  - [ ] Include system description, intended purpose, architecture, development process, data details, risk management, performance, limitations, human oversight, instructions, etc. ([Template](../templates/model_documentation_template.md)).
  - [ ] Keep documentation up-to-date throughout the lifecycle.
- [ ] **Record-Keeping / Logging (Article 12):**
  - [ ] Implement automatic logging capabilities for traceability (events, inputs, outputs, interactions).
  - [ ] Ensure logs are secure, timestamped, and retained appropriately.
- [ ] **Transparency & Provision of Information to Users (Article 13):**
  - [ ] Design for interpretability appropriate to the use case.
  - [ ] Provide clear instructions for use, including capabilities, limitations, intended purpose, cybersecurity measures, and required human oversight.
- [ ] **Human Oversight (Article 14):**
  - [ ] Design system to allow effective human oversight (understanding, monitoring, intervention).
  - [ ] Define oversight measures appropriate for the risks.
  - [ ] Ensure persons assigned oversight have necessary competence and authority.
- [ ] **Accuracy, Robustness, Cybersecurity (Article 15):**
  - [ ] Define and achieve appropriate levels of accuracy for the intended purpose.
  - [ ] Ensure system is resilient to errors, faults, inconsistencies, and adversarial attacks.
  - [ ] Implement appropriate cybersecurity measures.
- [ ] **Quality Management System (Article 17):**
  - [ ] Implement a QMS ensuring compliance with the Act (covering strategy, design, development, verification, validation, post-market monitoring, etc.).

---

### Phase 3: Specific Obligations

- [ ] **Transparency Obligations for Limited Risk Systems (Article 52):**
  - [ ] Implement disclosure for AI interaction (e.g., chatbots).
  - [ ] Implement disclosure for emotion recognition/biometric categorization use.
  - [ ] Implement disclosure/labeling for AI-generated/manipulated content (deepfakes).
  - [ ] (Generative AI) Ensure outputs are marked as AI-generated.
- [ ] **Obligations for GPAIM Providers (Article 28b):**
  - [ ] Maintain up-to-date technical documentation.
  - [ ] Provide documentation to downstream providers.
  - [ ] Establish a policy for respecting EU copyright law.
  - [ ] Publish detailed summaries of content used for training.
  - [ ] (GPAIMs with Systemic Risk) Additional obligations: model evaluation, risk assessment/mitigation, adversarial testing, incident reporting, cybersecurity.

---

### Phase 4: Conformity, Registration & Market Placement

- [ ] **Conformity Assessment (Article 19 & 43):**
  - [ ] Determine the required conformity assessment procedure (Annex VI - self-assessment, Annex VII - third-party assessment).
  - [ ] Perform the assessment and document results.
  - [ ] Engage a Notified Body if third-party assessment is required.
  - [ ] Prepare and sign the EU Declaration of Conformity (Article 48 & Annex V).
  - [ ] Affix CE marking (Article 49) if applicable (usually for High-Risk).
- [ ] **Registration (Article 51):**
  - [ ] Register standalone High-Risk AI systems in the EU database before market placement.
  - [ ] Register certain GPAIMs.
  - [ ] Keep registration information updated.
- [ ] **Information Obligations (Article 20, 21, 22):**
  - [ ] Fulfill obligations as manufacturer, importer, distributor, or authorized representative as applicable.

---

### Phase 5: Post-Market Monitoring & Ongoing Compliance

- [ ] **Post-Market Monitoring System (Article 61):**
  - [ ] Establish and implement a PMM system proportionate to the risk level.
  - [ ] Proactively collect and analyze performance, usage, and incident data.
  - [ ] Report serious incidents and malfunctions to market surveillance authorities.
  - [ ] Take corrective actions when necessary.
- [ ] **Documentation Maintenance:** Keep all required documentation (technical docs, risk assessments, logs, QMS records) updated.
- [ ] **Continuous Improvement:** Regularly review and update compliance processes based on monitoring data, regulatory changes, and evolving best practices.

---

_Disclaimer: This checklist is based on the provided document and is not exhaustive. It does not constitute legal advice. Always consult the official AI Act text and legal professionals for specific compliance guidance._
_Go back to the [Main Framework README](../README.md)_
