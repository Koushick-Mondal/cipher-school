import { ProblemRepository } from './ProblemRepository';
import { Problem } from './Problem';

export class ProblemService {
  private repository: ProblemRepository;

  constructor(repository: ProblemRepository = new ProblemRepository()) {
    this.repository = repository;
  }

  async getAllProblems(): Promise<Problem[]> {
    return this.repository.findAll();
  }

  async getProblemBySlug(slug: string): Promise<Problem | null> {
    return this.repository.findBySlug(slug);
  }

  async getProblemById(id: string): Promise<Problem | null> {
    return this.repository.findById(id);
  }
}
