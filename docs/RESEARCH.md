# Learner Problem

Engineers preparing for Low-Level Design (LLD) interviews or looking to improve their software architecture skills often face a critical lack of actionable feedback. Traditional platforms either provide simple test case validation (like LeetCode for algorithms) or generic subjective feedback (like reading articles).

# Existing Approaches
1. **LeetCode/HackerRank**: Great for algorithms, but LLD questions on these platforms lack design evaluation; they only test if the code compiles and passes specific functional cases.
2. **Mock Interviews (e.g., Pramp, interviewing.io)**: High quality, but expensive, hard to schedule, and intimidating for repeated practice.
3. **ChatGPT/Claude**: Users paste their code and ask for feedback. The AI often gives generic advice, fails to catch structural LLD issues, or hallucinate a completely different "correct" design.

# Key Gaps
- **Explainability**: Feedback needs to be anchored to specific LLD principles (SOLID, Coupling, Cohesion) with clear evidence from the user's code.
- **Measurable Improvement**: Learners have no way to quantify if their second attempt is better than their first.
- **Structured Representation**: LLMs struggle to evaluate sprawling code files accurately. By structuring the design (Classes, Relationships) explicitly, we can provide better evaluation context.

# Product Direction
DesignLab AI will provide a focused, multi-panel workspace where users explicitly define their class design (JSON representation) alongside their code and explanations. We will use a hybrid evaluation approach:
- **Deterministic**: Fast, objective checks (e.g., missing expected concepts, empty classes).
- **LLM-Based**: Subjective architectural reasoning (e.g., SOLID, Cohesion) using the deterministic findings as context to prevent hallucination.

*Assumptions*:
- The MVP can rely on structured JSON submission for class design rather than building a full visual drag-and-drop React Flow canvas, which would be too complex for a 2-day assignment. (Though the UI will pretend to render a diagram, the core data is the JSON structure).
- GPT-4o-mini is capable enough to evaluate LLD if given a strong rubric and deterministic context.
