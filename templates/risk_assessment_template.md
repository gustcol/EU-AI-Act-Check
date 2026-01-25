# AI System Risk Assessment Template (Based on EU AI Act Principles)

**System Name:** [Enter AI System Name]
**Version:** [Enter System Version]
**Date of Assessment:** [YYYY-MM-DD]
**Assessor(s):** [Name(s) and Role(s)]

---

## 1. System Description & Intended Purpose

- **Brief Description:** [Provide a concise overview of the AI system.]
- **Intended Purpose(s):** [Clearly define the specific goals and use cases the system is designed for.]
- **Target Users:** [Identify the intended users of the system.]
- **Deployment Context:** [Describe the environment(s) where the system will operate.]
- **AI Techniques Used:** [List the core AI techniques employed (e.g., ML classification, NLP, computer vision).]
- **Preliminary Risk Classification (Based on AI Act):** [Unacceptable / High / Limited / Minimal - Justify briefly based on intended purpose and context.]

---

## 2. Identification of Foreseeable Risks & Harms

_Identify potential risks and reasonably foreseeable misuses throughout the system's lifecycle. Consider impacts on fundamental rights, health, safety, discrimination, privacy, security, etc._

| Risk Category                              | Specific Risk Scenario / Foreseeable Misuse                            | Potential Harm(s)                                                           | Affected Stakeholders                         |
| :----------------------------------------- | :--------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :-------------------------------------------- |
| **Bias & Discrimination**                  | e.g., System performs poorly for certain demographic groups.           | e.g., Unfair denial of service, reinforcement of societal biases.           | e.g., End-users, specific demographic groups. |
|                                            | e.g., Training data reflects historical biases.                        |                                                                             |                                               |
| **Safety & Security**                      | e.g., System malfunction leads to unsafe conditions (if applicable).   | e.g., Physical injury, property damage.                                     | e.g., Users, public.                          |
|                                            | e.g., System vulnerable to adversarial attacks.                        | e.g., Incorrect outputs, system manipulation, data breaches.                |                                               |
| **Fundamental Rights**                     | e.g., System impacts freedom of expression, right to privacy.          | e.g., Chilling effects, unwarranted surveillance.                           | e.g., Users, public.                          |
|                                            | e.g., Lack of transparency hinders due process.                        | e.g., Inability to contest decisions.                                       |                                               |
| **Performance & Robustness**               | e.g., System provides inaccurate outputs in edge cases.                | e.g., Incorrect decisions, financial loss, loss of trust.                   | e.g., Users, operators.                       |
|                                            | e.g., Performance degrades over time (model drift).                    |                                                                             |                                               |
| **Transparency & Explainability**          | e.g., Users cannot understand why the system made a specific decision. | e.g., Difficulty in identifying errors, lack of trust, inability to appeal. | e.g., Users, auditors.                        |
| **Generative AI Specific (if applicable)** | e.g., Generation of harmful, illegal, or biased content.               | e.g., Spread of misinformation, reputational damage, psychological harm.    | e.g., Users, public.                          |
|                                            | e.g., Factual hallucinations / inaccurate information generation.      | e.g., Poor decision-making based on false info.                             |                                               |
| **Other (Specify)**                        |                                                                        |                                                                             |                                               |
|                                            |                                                                        |                                                                             |                                               |

---

## 3. Risk Estimation & Evaluation

_Estimate the severity and probability of the identified risks occurring._

| Identified Risk Scenario | Severity (High/Medium/Low) | Probability (High/Medium/Low) | Overall Risk Level (Critical/High/Medium/Low) | Justification for Evaluation |
| :----------------------- | :------------------------- | :---------------------------- | :-------------------------------------------- | :--------------------------- |
| [From Section 2]         |                            |                               |                                               |                              |
| [From Section 2]         |                            |                               |                                               |                              |
| ...                      |                            |                               |                                               |                              |

_(Define Severity/Probability scales if needed, e.g., based on impact magnitude and likelihood)_

---

## 4. Risk Mitigation & Control Measures

_For each significant risk (e.g., Medium level and above), define mitigation measures._

| Identified Risk Scenario | Proposed Mitigation Measure(s)                                                                 | Implementation Status (Planned/In Progress/Implemented) | Responsible Team/Person | Verification Method               |
| :----------------------- | :--------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :---------------------- | :-------------------------------- |
| [From Section 2]         | e.g., Implement specific bias detection tools, diversify training data, add human review step. |                                                         |                         | e.g., Testing results, audit log. |
| [From Section 2]         | e.g., Implement input validation, adversarial testing, security hardening protocols.           |                                                         |                         | e.g., Penetration test report.    |
| ...                      |                                                                                                |                                                         |                         |                                   |

---

## 5. Residual Risk Assessment

_After implementing mitigation measures, re-evaluate the risks._

| Identified Risk Scenario | Mitigation Measures Implemented | Residual Severity (High/Medium/Low) | Residual Probability (High/Medium/Low) | Residual Risk Level (Critical/High/Medium/Low) | Justification / Acceptance Criteria |
| :----------------------- | :------------------------------ | :---------------------------------- | :------------------------------------- | :--------------------------------------------- | :---------------------------------- |
| [From Section 2]         | [List measures from Section 4]  |                                     |                                        |                                                |                                     |
| [From Section 2]         | [List measures from Section 4]  |                                     |                                        |                                                |                                     |
| ...                      |                                 |                                     |                                        |                                                |                                     |

---

## 6. Ongoing Monitoring & Review Plan

_Describe how risks will be monitored post-deployment and how the risk management system will be updated._

- **Monitoring Metrics:** [e.g., Accuracy drift, bias indicators, user feedback themes, security alerts.]
- **Monitoring Frequency:** [e.g., Real-time, daily, weekly, monthly.]
- **Review Cycle:** [e.g., Quarterly, annually, upon significant system updates.]
- **Triggers for Re-assessment:** [e.g., New regulations, major incidents, significant performance changes, new foreseeable misuses identified.]
- **Responsible Team/Person:**

---

## 7. Approval

**Risk Assessment Approved By:** [Name and Role]
**Date:** [YYYY-MM-DD]

---

_This template is illustrative and should be adapted based on the specific AI system and context._
_Go back to the [Main Framework README](../README.md)_
