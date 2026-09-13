import { AttemptRepository } from './AttemptRepository';
import { Attempt } from './Attempt';
import { Submission, SubmissionSchema } from './Submission';
import { ProblemRepository } from '../problem/ProblemRepository';

export class AttemptService {
  private repository: AttemptRepository;
  private problemRepo: ProblemRepository;
  
  constructor(
    repository: AttemptRepository = new AttemptRepository(),
    problemRepo: ProblemRepository = new ProblemRepository()
  ) {
    this.repository = repository;
    this.problemRepo = problemRepo;
  }

  async getAttempt(id: string): Promise<Attempt | null> {
    return this.repository.findById(id);
  }

  async getAttemptsForUserAndProblem(userId: string, problemId: string): Promise<Attempt[]> {
    return this.repository.findByUserIdAndProblemId(userId, problemId);
  }

  async getOrCreateDraft(userId: string, problemId: string): Promise<Attempt> {
    const attempts = await this.repository.findByUserIdAndProblemId(userId, problemId);
    const draft = attempts.find(a => a.status === 'DRAFT');
    if (draft) return draft;
    
    return this.repository.create({ userId, problemId });
  }

  async saveDraft(id: string, submission: Partial<Submission>): Promise<Attempt> {
    return this.repository.update(id, {
      code: submission.code,
      classDesign: submission.classDesign,
      explanation: submission.explanation,
      diagram: submission.diagram,
    });
  }

  async submitAttempt(id: string, submission: Submission): Promise<Attempt> {
    // Validate submission format
    SubmissionSchema.parse(submission);

    // Update status to EVALUATING
    const updatedAttempt = await this.repository.update(id, {
      ...submission,
      status: 'EVALUATING',
      submittedAt: new Date(),
    });

    // We do NOT await evaluate here in a real production system normally to avoid blocking, 
    // but for this MVP we can trigger it asynchronously or await it.
    // Given Vercel limitations, triggering an API route or awaiting it is standard.
    // For simplicity, we'll return the EVALUATING attempt, and trigger evaluate via a separate API call or background promise.
    
    return updatedAttempt;
  }
}
