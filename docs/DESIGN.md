# MVP Design

## User Journey
1. **Discover**: Browse available LLD problems (e.g., Parking Lot, Elevator).
2. **Understand**: Review requirements and constraints.
3. **Practice**: Define class structure in JSON and write implementation code. Provide explanations.
4. **Evaluate**: Submit the attempt. The engine runs deterministic rules, then queries an LLM.
5. **Review**: See a comprehensive feedback dashboard with an overall score, criteria breakdown, strengths, and actionable weaknesses.
6. **Iterate**: Try the problem again and compare attempts in the history view.

## Architecture
- **Next.js App Router**: Full-stack framework handling UI, API routes, and SSR.
- **Prisma & SQLite**: For the 2-day MVP, SQLite is used to allow seamless local testing without Docker dependencies, while maintaining standard ORM patterns. (Easily swappable to PostgreSQL).
- **Domain Layer**: Clean architecture principles applied to `Problem`, `Attempt`, and `Evaluation` domains.

## Domain Model
- `Problem`: Definition of the task.
- `Attempt`: A specific learner submission (Draft -> Submitted -> Completed).
- `Evaluation`: The result containing scores and feedback.

## Evaluation Approach
We use a **hybrid pluggable evaluation engine**:
1. `DeterministicEvaluator`: Runs fast, objective rules (Empty classes, Duplicate names, Missing concepts).
2. `LLMEvaluator`: Takes the user's design, code, explanation, AND the deterministic findings, outputting a structured JSON score against a fixed rubric.

This prevents the LLM from missing obvious structural flaws and grounds its feedback in objective reality.

## Extensibility & Trade-offs
- **Evaluator Interface**: `interface Evaluator { evaluate(...) }` allows adding a `StaticAnalysisEvaluator` or `HumanEvaluator` in the future without changing the `EvaluationEngine`.
- **SQLite Arrays**: SQLite doesn't support arrays natively in Prisma. As a trade-off for the MVP's local runnability, arrays are stored as JSON strings and parsed in the Repository layer. This keeps the Domain model clean (arrays) while working around database limitations.
- **Background Jobs**: Vercel serverless functions have timeouts. In this MVP, we await the LLM call directly. In a real system, we would use a queue (e.g., Inngest or SQS) for the `EVALUATING` phase.
