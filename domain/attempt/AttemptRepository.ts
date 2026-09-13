import prisma from '@/lib/prisma';
import { Attempt, AttemptStatus } from './Attempt';

export class AttemptRepository {
  async create(data: { userId: string; problemId: string }): Promise<Attempt> {
    const attempt = await prisma.attempt.create({
      data: {
        userId: data.userId,
        problemId: data.problemId,
        status: 'DRAFT',
      },
    });
    return this.mapToDomain(attempt);
  }

  async update(id: string, data: Partial<Attempt>): Promise<Attempt> {
    const attempt = await prisma.attempt.update({
      where: { id },
      data,
    });
    return this.mapToDomain(attempt);
  }

  async findById(id: string): Promise<Attempt | null> {
    const attempt = await prisma.attempt.findUnique({
      where: { id },
    });
    if (!attempt) return null;
    return this.mapToDomain(attempt);
  }

  async findByUserIdAndProblemId(userId: string, problemId: string): Promise<Attempt[]> {
    const attempts = await prisma.attempt.findMany({
      where: { userId, problemId },
      orderBy: { createdAt: 'asc' },
    });
    return attempts.map(this.mapToDomain);
  }

  private mapToDomain(prismaAttempt: import('@prisma/client').Attempt): Attempt {
    return {
      id: prismaAttempt.id,
      userId: prismaAttempt.userId,
      problemId: prismaAttempt.problemId,
      status: prismaAttempt.status as AttemptStatus,
      code: prismaAttempt.code,
      classDesign: prismaAttempt.classDesign,
      diagram: prismaAttempt.diagram,
      explanation: prismaAttempt.explanation,
      createdAt: prismaAttempt.createdAt,
      submittedAt: prismaAttempt.submittedAt,
    };
  }
}
