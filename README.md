# DesignLab AI

"Practice LLD. Get intelligent feedback. Improve your design."

An AI-powered Low-Level Design (LLD) practice platform that allows engineers to practice system design, submit structural solutions, and receive explainable, rubric-based feedback.

## Features
- **Curated LLD Problems**: Practice classic scenarios like Parking Lot, Vending Machine, and Elevator System.
- **Structured Workspace**: Define class designs in JSON, write implementation code, and explain trade-offs.
- **Hybrid Evaluation**: Combines fast deterministic rules with deep LLM reasoning for accurate, grounded feedback.
- **Explainable Feedback**: Get concrete strengths, weaknesses, and actionable recommendations linked to SOLID principles.
- **Attempt History**: Track your progress and score improvements over multiple attempts.

## Architecture
- **Frontend**: Next.js App Router, Tailwind CSS, Monaco Editor
- **Backend**: Next.js Route Handlers, Domain-driven Services
- **Database**: SQLite (via Prisma) for zero-config local development
- **AI**: OpenAI API with structured JSON outputs

The evaluation engine is built on a pluggable `Evaluator` interface, currently utilizing `DeterministicEvaluator` and `LLMEvaluator`.

## Folder Structure
```
app/          # Next.js App Router (UI & API)
components/   # Reusable UI elements (shadcn-like)
domain/       # Core business logic (Problem, Attempt, Evaluation)
docs/         # Architecture and design notes
lib/          # Utilities (Prisma client)
prisma/       # Database schema and seed script
```

## Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and configure:
   ```env
   OPENAI_API_KEY=your_openai_key_here
   ```
   *(If omitted or set to 'dummy', the app falls back to a deterministic Demo Mode evaluator).*

3. **Database Setup**
   The project uses SQLite for easy local setup without Docker.
   ```bash
   npx prisma db push
   npm run prisma.seed
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## Demo Flow
1. Go to `http://localhost:3000`
2. Click **Start Practicing**
3. Select **Parking Lot**
4. Review requirements and click **Start Practice**
5. (Optional) Edit the default JSON design or Code
6. Click **Submit Solution**
7. Wait for the evaluation to complete
8. Review the detailed feedback and scores
9. Click **Try Again** or **View Attempt History** to see progression

## Design Decisions & Limitations
- **SQLite vs PostgreSQL**: Switched to SQLite to ensure reviewers can run the MVP locally immediately without setting up Postgres containers, trading off native array support (solved via JSON parsing in Repositories).
- **Synchronous LLM Calls**: For MVP simplicity, LLM evaluation runs during the API request. Production would use a background job queue.
- **JSON Class Design**: Instead of a full visual drag-and-drop React Flow canvas, the core data model is collected via JSON. This is robust, validateable, and sufficient for LLM context.
