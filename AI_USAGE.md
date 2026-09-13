# AI Usage

During the development of this 2-day MVP, several key architectural decisions were made regarding how AI should evaluate code.

## 1. Hybrid Evaluation over LLM-Only
- **What AI Suggested**: Initially considered sending the entire raw text (code + explanation) to an LLM to generate the entire score and feedback.
- **What I Accepted/Rejected**: I rejected a pure LLM approach in favor of a hybrid Evaluation Engine.
- **Why**: LLMs are prone to hallucinating structural issues or missing obvious basic requirements (like an empty class). By running a `DeterministicEvaluator` first and passing its findings to the `LLMEvaluator`, the AI's feedback is grounded in objective reality.

## 2. Structured JSON Submissions
- **What AI Suggested**: Parsing raw code text using ASTs to determine class structures.
- **What I Accepted/Rejected**: I rejected raw code parsing in favor of forcing a structured JSON submission for the class design.
- **Why**: AST parsing across multiple languages in a 2-day MVP is error-prone and complex. By having the user explicitly define their architecture in JSON, deterministic rules can easily evaluate the structure, and the LLM has a clean, unambiguous representation of the design intent.

## 3. Pluggable Evaluator Interface
- **What AI Suggested**: Hardcoding the evaluation logic directly inside the API route.
- **What I Accepted/Rejected**: I rejected this and implemented an `Evaluator` interface (`evaluate(problem, attempt) -> Result`).
- **Why**: LLD evaluation will inevitably need more layers (static analysis, peer review). The interface abstraction allows for high extensibility without rewriting the core engine.

## 4. Synchronous API Evaluation
- **What AI Suggested**: Building a complex distributed event bus (Kafka/Redis) to handle the long-running LLM evaluation asynchronously.
- **What I Accepted/Rejected**: I rejected distributed infrastructure.
- **Why**: It violated the "Do NOT over-engineer" project constraint. For a 2-day MVP, running the evaluation synchronously (or via a simple async fetch) and displaying a loading state is sufficient and drastically reduces operational overhead.
