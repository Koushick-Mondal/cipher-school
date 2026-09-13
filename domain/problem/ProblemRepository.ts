import prisma from '@/lib/prisma';
import { Problem } from './Problem';

export class ProblemRepository {
  async findAll(): Promise<Problem[]> {
    const problems = await prisma.problem.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return problems.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Problem | null> {
    const problem = await prisma.problem.findUnique({ where: { id } });
    if (!problem) return null;
    return this.mapToDomain(problem);
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    const problem = await prisma.problem.findUnique({ where: { slug } });
    if (!problem) return null;
    return this.mapToDomain(problem);
  }

  private mapToDomain(prismaProblem: import('@prisma/client').Problem): Problem {
    return {
      id: prismaProblem.id,
      title: prismaProblem.title,
      slug: prismaProblem.slug,
      description: prismaProblem.description,
      difficulty: prismaProblem.difficulty,
      requirements: JSON.parse(prismaProblem.requirements),
      constraints: JSON.parse(prismaProblem.constraints),
      expectedConcepts: JSON.parse(prismaProblem.expectedConcepts),
    };
  }
}
