import prisma from '@/lib/prisma';
import { Evaluation } from './Evaluation';

export class EvaluationRepository {
  async findByAttemptId(attemptId: string): Promise<Evaluation | null> {
    const evaluation = await prisma.evaluation.findUnique({
      where: { attemptId },
      include: { criteria: true }
    });
    if (!evaluation) return null;
    
    return {
      id: evaluation.id,
      attemptId: evaluation.attemptId,
      overallScore: evaluation.overallScore || 0,
      deterministicScore: evaluation.deterministicScore || 0,
      llmScore: evaluation.llmScore || 0,
      feedback: evaluation.feedback || '',
      summary: evaluation.summary || '',
      strengths: JSON.parse(evaluation.strengths || '[]'),
      weaknesses: JSON.parse(evaluation.weaknesses || '[]'),
      recommendations: JSON.parse(evaluation.recommendations || '[]'),
      createdAt: evaluation.createdAt,
      criteria: evaluation.criteria.map(c => ({
        name: c.name,
        score: c.score,
        maxScore: c.maxScore,
        feedback: c.feedback || ''
      }))
    };
  }
}
