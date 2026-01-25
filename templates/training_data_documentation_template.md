# AI System Training Data Documentation Template (Based on EU AI Act Principles)

**System Name:** [Enter AI System Name]
**Model Name/Version:** [Enter Specific Model Name/Version the data pertains to]
**Date of Documentation:** [YYYY-MM-DD]
**Document Author(s):** [Name(s) and Role(s)]
**Document Status:** [Draft / Under Review / Approved]

---

## 1. Data Overview

- **1.1. Purpose of Data:**
  - [ ] Training
  - [ ] Validation
  - [ ] Testing
  - Description: [Explain how this specific dataset was used in the model lifecycle.]
- **1.2. General Description:**
  - [Provide a high-level summary of the dataset, its content, and scope.]
  - Size: [e.g., Number of samples, files, total data volume.]
  - Modality: [e.g., Text, Image, Audio, Tabular, Video, Multimodal.]
  - Temporal Coverage (if applicable): [Time period the data represents.]
  - Geographical Coverage (if applicable): [Regions the data represents.]

---

## 2. Data Sources & Acquisition

- **2.1. Source Identification:**
  - [List all sources from which the data was obtained.]
  - For each source:
    - Name/Origin: [e.g., Public dataset name, Internal database, Third-party provider, Web scraping.]
    - URL/Reference (if public):
    - Acquisition Method: [e.g., Download, API access, Purchase, Scraping.]
    - Date(s) of Acquisition:
- **2.2. Licensing & Copyright:**
  - [For each data source, document the licensing terms.]
  - License Type: [e.g., Public Domain, Creative Commons (specify version/terms), Commercial License, Proprietary, Research Use Only.]
  - Permissions Obtained: [Describe steps taken to ensure legal rights to use the data for AI training (e.g., license agreements, terms of service compliance).]
  - Copyrighted Content Summary (especially for Generative AI / GPAIMs): [Provide a summary of any copyrighted works included, sufficient to meet AI Act transparency requirements. Detail measures taken to respect rights holder reservations (e.g., opt-outs).]
- **2.3. Data Collection Process (if applicable):**
  - [If data was collected directly (e.g., user surveys, sensor data), describe the methodology, tools, and protocols used.]
  - Consent Mechanisms (if personal data involved): [Describe how consent was obtained, referencing GDPR compliance if applicable.]

---

## 3. Data Preparation & Preprocessing

- **3.1. Preprocessing Steps:**
  - [Detail all steps taken to clean, transform, and prepare the data for training.]
  - Examples: Normalization, scaling, tokenization, resizing, augmentation, feature engineering, noise reduction, anonymization, pseudonymization.
  - Tools/Libraries Used:
- **3.2. Data Annotation (if applicable):**
  - Annotation Task: [e.g., Labeling images, transcribing audio, classifying text.]
  - Annotation Guidelines: [Reference or describe the instructions given to annotators.]
  - Annotation Tools:
  - Quality Control: [Describe measures taken to ensure annotation accuracy and consistency (e.g., inter-annotator agreement checks, review process).]
  - Annotator Information (if relevant): [Demographics, expertise, compensation - consider privacy.]
- **3.3. Data Splitting:**
  - Methodology: [e.g., Random split, stratified split, time-based split.]
  - Ratios: [Specify the percentage/size of Training / Validation / Testing sets.]
  - Justification: [Explain why the chosen splitting method is appropriate.]

---

## 4. Data Governance & Quality Management

- **4.1. Data Quality Assessment:**
  - Metrics Used: [e.g., Completeness, accuracy, consistency, timeliness, validity.]
  - Assessment Results: [Summarize findings regarding data quality.]
  - Handling Missing Data: [Describe strategies used (e.g., imputation, removal).]
- **4.2. Representativeness:**
  - [Assess how well the dataset represents the target population or deployment context.]
  - Known Limitations: [Identify any known gaps or limitations in representativeness.]
- **4.3. Bias Examination & Mitigation:**
  - Potential Biases Investigated: [e.g., Demographic bias, sampling bias, historical bias, measurement bias.]
  - Assessment Methods: [Describe tools or techniques used to detect bias.]
  - Findings: [Summarize identified biases.]
  - Mitigation Strategies: [Describe steps taken during data collection, preparation, or annotation to mitigate identified biases (e.g., re-sampling, data augmentation, label correction).]
- **4.4. Data Security & Privacy:**
  - Storage Location & Security: [Describe where data is stored and security measures in place.]
  - Access Controls: [Who has access to the data?]
  - PII/Sensitive Data Handling: [Describe measures taken to identify and protect/remove personal or sensitive information (e.g., anonymization, pseudonymization techniques used).]
  - Compliance: [Reference relevant privacy regulations (e.g., GDPR) and how compliance is ensured.]
- **4.5. Data Retention & Deletion:**
  - Policy: [Describe the policy for how long data is kept and how it is securely deleted.]

---

## 5. Data Maintenance & Updates

- **5.1. Version Control:**
  - [Describe how different versions of the dataset are managed.]
- **5.2. Update Strategy:**
  - [Describe plans (if any) for updating or refreshing the dataset over time.]

---

## 6. Appendices (Optional)

- [Include data dictionaries, detailed bias reports, sample data snippets, etc., or references to their location.]

---

_This template is illustrative and should be adapted based on the specific AI system, its risk level, and the detailed requirements of the EU AI Act, particularly Article 10._
_Go back to the [Main Framework README](../README.md)_
