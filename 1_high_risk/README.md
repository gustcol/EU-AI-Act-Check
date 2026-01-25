# Category: High-Risk AI Systems

## 1. Definition

High-Risk AI systems are those identified by the EU AI Act as having the potential to significantly impact people's health, safety, or fundamental rights. These systems are **permitted** but are subject to **strict, mandatory requirements** throughout their entire lifecycle, from design and development to deployment and post-market monitoring.

The classification as "high-risk" triggers a comprehensive set of legal obligations aimed at ensuring trustworthiness, safety, and respect for fundamental rights.

## 2. Examples of High-Risk AI Systems

The AI Act identifies specific areas and use cases where AI systems are generally considered high-risk (as listed in Annex III or related to safety components under Annex II legislation):

- **Biometric Identification & Categorization:** Remote biometric identification systems (other than the prohibited real-time law enforcement use), biometric categorization based on sensitive characteristics (race, political opinion, etc.), emotion recognition (outside prohibited areas).
- **Critical Infrastructure Management & Operation:** AI used in the management or operation of road traffic, water, gas, heating, or electricity supply.
- **Education and Vocational Training:** Systems determining access, admission, or assignment to educational institutions; systems used for evaluating learning outcomes or monitoring during tests.
- **Employment, Worker Management & Access to Self-Employment:** AI used for recruitment (screening, filtering applications, evaluating candidates), making decisions on promotion/termination, task allocation, monitoring, or evaluating performance and behavior.
- **Access to Essential Private & Public Services and Benefits:** Systems determining eligibility for public assistance benefits/services; systems used for credit scoring or assessing creditworthiness (except for detecting financial fraud); systems dispatching emergency services; systems used for risk assessment and pricing in health and life insurance.
- **Law Enforcement:** AI used for risk assessment of individuals for offending, polygraphs, evaluating evidence reliability, predictive policing (beyond the prohibited type), profiling in criminal investigations, crime analytics.
- **Migration, Asylum, and Border Control Management:** AI used as polygraphs, assessing security/migration risks, verifying travel documents, examining asylum applications.
- **Administration of Justice and Democratic Processes:** AI intended to assist judicial authorities in researching and interpreting facts and the law, or applying the law to concrete facts; AI influencing election outcomes or voter behavior (excluding opinions/content generated without AI).

_Note: AI systems that are safety components of products covered by specific EU safety legislation (e.g., machinery, medical devices) are also classified as high-risk._

## 3. Key Obligations and Requirements

Providers of high-risk AI systems must comply with stringent requirements, including:

- **Risk Management System:** Implement and maintain a continuous process to identify, analyze, evaluate, and mitigate risks throughout the AI system's lifecycle. ([Template](../templates/risk_assessment_template.md))
- **Data Governance:** Ensure training, validation, and testing data are relevant, representative, free of errors, complete, and governed appropriately (including bias examination and mitigation). ([Template](../templates/training_data_documentation_template.md))
- **Technical Documentation:** Maintain comprehensive, up-to-date documentation detailing the system's purpose, capabilities, limitations, design, development, validation, risk management, and compliance measures _before_ placing the system on the market. ([Template](../templates/model_documentation_template.md))
- **Record-Keeping (Logging):** Ensure systems automatically log events relevant to identifying risks and monitoring operation (traceability).
- **Transparency and Provision of Information to Users:** Design systems for transparency, allowing users to interpret outputs and use them appropriately. Provide clear instructions for use, including capabilities, limitations, and necessary human oversight measures.
- **Human Oversight:** Design systems to be effectively overseen by humans, allowing for intervention or disregard of system outputs when necessary.
- **Accuracy, Robustness, and Cybersecurity:** Ensure systems achieve appropriate levels of accuracy, are resilient against errors or inconsistencies, and are secure against vulnerabilities throughout their lifecycle.
- **Conformity Assessment:** Demonstrate compliance through either self-assessment or third-party assessment (depending on the specific system) before placing the system on the market. This often involves obtaining a CE marking.
- **Registration:** Register standalone high-risk AI systems in a public EU database.
- **Quality Management System:** Implement measures to ensure compliance with the Act's requirements.
- **Post-Market Monitoring:** Establish a system to proactively collect and analyze performance data after the AI system is placed on the market and take corrective actions if needed.

## 4. Associated Technologies & Risks

High-risk systems often employ various AI technologies, each carrying specific risks:

- **Machine Learning (Supervised, Unsupervised, Reinforcement):** Used for prediction, classification, decision-making in areas like recruitment, credit scoring, medical diagnosis support.
  - _Risks:_ Algorithmic bias leading to discrimination, lack of explainability, errors impacting critical decisions, data privacy issues.
- **Natural Language Processing (NLP):** Used in recruitment tools (CV analysis), legal tech (document analysis), chatbots providing essential services.
  - _Risks:_ Bias in language models, misinterpretation of text, potential for manipulation, privacy concerns with text data.
- **Computer Vision:** Used in biometric identification, medical image analysis, monitoring workers or students.
  - _Risks:_ Accuracy issues (especially across demographics), potential for surveillance, bias in facial recognition, privacy violations.
- **Expert Systems / Rule-Based Systems:** Can be used in decision support for essential services or legal applications.
  - _Risks:_ Brittleness of rules, difficulty maintaining complex rule sets, potential for embedded biases.

## 5. Implications for Projects

Developing or deploying an AI system likely to fall into the high-risk category requires significant investment in compliance infrastructure from the outset. Key steps include:

1.  **Early Classification:** Determine if the intended use falls under Annex III or related safety regulations.
2.  **Compliance by Design:** Integrate requirements (risk management, data governance, transparency, oversight, etc.) into the design and development process.
3.  **Rigorous Documentation:** Plan for and maintain extensive technical documentation.
4.  **Validation & Testing:** Implement robust testing procedures focusing on accuracy, robustness, bias, and security.
5.  **Resource Allocation:** Budget for conformity assessments, registration, and ongoing monitoring.
6.  **Legal Consultation:** Engage legal experts specializing in the AI Act.

Failure to comply with high-risk requirements can lead to substantial penalties and withdrawal from the market.

---

_Go back to the [Main Framework README](../README.md)_
