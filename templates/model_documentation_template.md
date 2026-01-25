# AI System Model Documentation Template (Based on EU AI Act Principles)

**System Name:** [Enter AI System Name]
**Model Name:** [Enter Specific Model Name, if applicable]
**Version:** [Enter System/Model Version]
**Date of Documentation:** [YYYY-MM-DD]
**Document Author(s):** [Name(s) and Role(s)]
**Document Status:** [Draft / Under Review / Approved]

---

## 1. System Overview & Identification

- **1.1. Provider Information:**
  - Name: [Provider Legal Name]
  - Address: [Provider Address]
  - Contact Person: [Name, Email, Phone]
  - EU Representative (if applicable): [Name, Contact Details]
- **1.2. System/Model Identification:**
  - Commercial Name(s): [If applicable]
  - Unique Identifier(s): [e.g., Model ID, Version Hash]
  - Model Type: [e.g., Classifier, Regressor, Generative Language Model, Object Detector]
  - General Description: [High-level summary of what the model/system does.]
- **1.3. Intended Purpose(s):**
  - [Clearly define the specific goals and use cases the system is designed for, as placed on the market.]
- **1.4. Reasonably Foreseeable Misuse(s):**
  - [Describe potential uses outside the intended purpose that could occur.]
- **1.5. AI Act Classification:**
  - [High-Risk / Limited Risk / Minimal Risk / GPAIM / GPAIM with Systemic Risk]
  - Justification: [Explain the reasoning based on Annexes or GPAIM criteria.]

---

## 2. Technical Specifications & Architecture

- **2.1. Model Architecture:**
  - Description: [Detail the type of model architecture (e.g., CNN, RNN, Transformer, Decision Tree).]
  - Key Components: [Describe major layers, modules, or components.]
  - Parameters: [Number of parameters, key hyperparameters.]
  - Diagrams: [Include or reference architectural diagrams.]
- **2.2. Input/Output:**
  - Input Data Specification: [Type, format, expected range, constraints.]
  - Output Data Specification: [Type, format, interpretation (e.g., classification scores, generated text).]
- **2.3. Computational Requirements:**
  - Hardware: [Minimum/recommended hardware specifications for training and inference.]
  - Software Dependencies: [Libraries, frameworks, operating systems.]
  - Computational Resources: [Estimated resources for training/inference (e.g., FLOPs, memory).]
- **2.4. APIs & Integration:**
  - [Describe how the system/model integrates with other systems, including API specifications if applicable.]

---

## 3. Training, Validation & Testing Information

- **3.1. Training Data:**
  - Reference to Training Data Documentation: [Link to or reference `training_data_documentation_template.md` or equivalent.]
  - Summary: [Brief overview of data sources, size, and characteristics relevant to the model.]
- **3.2. Training Methodology:**
  - Algorithm(s) Used: [Specific algorithms used for training.]
  - Training Process: [Describe the steps involved in training the model.]
  - Optimization Techniques: [e.g., Optimizer used, learning rate schedule.]
  - Tools/Frameworks Used: [e.g., TensorFlow, PyTorch, scikit-learn.]
  - Training Duration & Environment: [Approximate time, hardware used.]
- **3.3. Validation & Testing Procedures:**
  - Validation Data: [Description of data used for hyperparameter tuning and model selection.]
  - Testing Data: [Description of data used for final performance evaluation.]
  - Evaluation Metrics: [List all metrics used (e.g., accuracy, precision, recall, F1-score, AUC, BLEU, ROUGE) and justify their relevance.]
  - Testing Methodology: [Describe how tests were conducted (e.g., cross-validation, hold-out set).]
  - Bias & Fairness Assessment: [Describe methods used to assess and mitigate bias across relevant groups. Include metrics and results.]
  - Robustness Testing: [Describe tests for performance under noisy data, adversarial attacks, or distributional shifts. Include results.]
  - Cybersecurity Testing: [Describe security testing performed (e.g., vulnerability scanning, penetration testing). Include results.]
- **3.4. Performance Results:**
  - [Summarize key performance results based on the evaluation metrics on the testing data. Include confidence intervals if applicable.]
  - Performance Disaggregation: [Show performance across relevant subgroups (e.g., demographic groups) if applicable.]

---

## 4. Risk Management & Mitigation

- **4.1. Risk Management System:**
  - Reference to Risk Assessment: [Link to or reference `risk_assessment_template.md` or equivalent.]
  - Summary: [Brief overview of the risk management process applied.]
- **4.2. Identified Risks & Mitigations:**
  - [Summarize key risks identified (especially residual risks) and the technical/organizational measures implemented to mitigate them.]
- **4.3. System Limitations:**
  - [Clearly state known limitations, edge cases where performance may degrade, and conditions under which the system should not be used.]

---

## 5. Human Oversight

- **5.1. Design for Human Oversight:**
  - [Describe features designed to enable human oversight (e.g., interpretability tools, confidence scores, intervention mechanisms).]
- **5.2. Recommended Oversight Measures:**
  - [Specify the nature, frequency, and expertise required for human oversight during operation.]
  - [Detail conditions under which human intervention is recommended or required.]

---

## 6. Operational Information

- **6.1. Instructions for Use:**
  - [Provide clear instructions for deployment, operation, and interpretation of outputs for the intended users.]
- **6.2. Maintenance & Updates:**
  - [Describe the process for system maintenance, updates, and version control.]
  - [Explain how users will be notified of significant updates.]
- **6.3. Monitoring Requirements:**
  - [Specify requirements for monitoring the system's performance and safety post-deployment.]
  - [Reference Post-Market Monitoring Plan, if applicable.]
- **6.4. Record-Keeping (Logging):**
  - [Describe the system's logging capabilities as required by the AI Act (event types, data recorded, retention period).]

---

## 7. Compliance Information

- **7.1. Conformity Assessment:**
  - Procedure Used: [Self-assessment / Third-party assessment]
  - Notified Body (if applicable): [Name, ID Number]
  - Declaration of Conformity Reference: [Link or ID]
  - CE Marking Status: [Yes/No/Not Applicable]
- **7.2. Harmonized Standards Applied:**
  - [List any harmonized standards, common specifications, or other relevant benchmarks used.]
- **7.3. EU Database Registration (if applicable):**
  - Registration ID: [If registered]

---

## 8. Appendices (Optional)

- [Include supplementary materials, detailed test reports, diagrams, etc., or references to their location.]

---

_This template is illustrative and should be adapted based on the specific AI system, its risk level, and the detailed requirements of the EU AI Act._
_Go back to the [Main Framework README](../README.md)_
