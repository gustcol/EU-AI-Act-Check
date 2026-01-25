# Category: Minimal or No Risk AI Systems

## 1. Definition

This category encompasses the vast majority of AI systems currently in use and development. These systems are considered to pose **minimal or no risk** to citizens' rights or safety according to the EU AI Act.

The Act adopts a permissive approach for this category, meaning these AI systems can be developed and used within the EU **without facing additional legal obligations** under the AI Act itself.

## 2. Examples of Minimal Risk AI Systems

Many common AI applications fall into this category:

- **AI-enabled Video Games:** AI used for non-player characters (NPCs), game balancing, or procedural content generation within a game context.
- **Spam Filters:** AI systems used to classify emails or messages as spam.
- **Inventory Management Systems:** AI used for optimizing stock levels or predicting demand.
- **Basic Recommendation Systems:** Systems suggesting products, music, or movies based on user preferences (unless they cross into high-risk areas like influencing democratic processes).
- **AI for Creative Tools:** Systems assisting in graphic design, music composition, or code generation where the output doesn't fall under specific limited-risk transparency rules (like deepfakes needing disclosure).
- **Simple Automation Tools:** AI used for basic task automation that doesn't impact critical infrastructure or employment decisions.

## 3. Key Considerations

- **No Specific AI Act Obligations:** The primary characteristic of this category is the absence of specific requirements imposed by the AI Act.
- **Voluntary Codes of Conduct:** While not mandatory, providers of minimal-risk AI systems are encouraged to voluntarily apply requirements similar to high-risk systems (like robustness, transparency) or adhere to codes of conduct to build trust.
- **Other Laws Still Apply:** Importantly, even if an AI system is minimal risk under the AI Act, it must still comply with all other applicable laws, such as GDPR (if processing personal data), consumer protection laws, intellectual property laws, and non-discrimination laws.
- **Risk Re-evaluation:** The classification is based on the _intended purpose_ and _context_. If the use case of a seemingly minimal-risk system changes or expands into a high-risk area, its classification and obligations would need to be reassessed.

## 4. Associated Technologies & Risks

Minimal risk systems utilize the full spectrum of AI technologies, but in contexts deemed non-critical:

- **Machine Learning:** Used for recommendations, game AI, simple predictions.
  - _Risks:_ While minimal under the Act, poor design could still lead to user dissatisfaction or minor biases, but not typically impacting fundamental rights or safety.
- **Natural Language Processing (NLP):** Used in simple chatbots (not meeting limited-risk criteria), translation tools, basic text analysis.
  - _Risks:_ Potential for minor inaccuracies or misunderstandings.
- **Computer Vision:** Used in simple image filters, object recognition in non-critical applications.
  - _Risks:_ Minor performance issues.

The key differentiator is the _application context_, which prevents these technologies from triggering higher risk classifications.

## 5. Implications for Projects

For projects falling into the minimal risk category:

1.  **Confirm Classification:** Ensure the intended purpose and context firmly place the system in this category and don't stray into limited or high-risk areas.
2.  **Focus on General Best Practices:** While AI Act obligations don't apply, adhere to general software development best practices, ethical considerations, and relevant existing laws (like GDPR).
3.  **Consider Voluntary Measures:** Evaluate adopting voluntary codes of conduct or transparency measures to enhance user trust.
4.  **Monitor Use Cases:** Be mindful that changes in deployment or functionality could potentially shift the system into a higher risk category later.

This category allows for significant freedom and innovation, provided developers remain aware of other applicable legal frameworks.

---

_Go back to the [Main Framework README](../README.md)_
