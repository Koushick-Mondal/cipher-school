import { Problem } from '../problem/Problem';
import { Attempt } from '../attempt/Attempt';
import { DeterministicEvaluator } from './evaluators/DeterministicEvaluator';
import { LLMEvaluator } from './evaluators/LLMEvaluator';
import { Evaluation } from './Evaluation';
import prisma from '@/lib/prisma';

export class EvaluationEngine {
  private deterministicEvaluator: DeterministicEvaluator;
  private llmEvaluator: LLMEvaluator;

  constructor(
    deterministicEvaluator = new DeterministicEvaluator(),
    llmEvaluator = new LLMEvaluator()
  ) {
    this.deterministicEvaluator = deterministicEvaluator;
    this.llmEvaluator = llmEvaluator;
  }

  async runEvaluation(problem: Problem, attempt: Attempt): Promise<Evaluation> {
    try {
      // Run deterministic evaluation
      const deterministicResult = await this.deterministicEvaluator.evaluate(problem, attempt);
      
      // Run LLM evaluation, passing deterministic findings as context
      const llmResult = await this.llmEvaluator.evaluate(problem, attempt, deterministicResult.findings);

      // Scoring: 40% deterministic, 60% LLM
      const overallScore = Math.round((deterministicResult.score * 0.4) + (llmResult.score * 0.6));
      const data = {
          overallScore,
          deterministicScore: deterministicResult.score,
          llmScore: llmResult.score,
          summary: llmResult.summary || '',
          feedback: JSON.stringify(deterministicResult.findings),
          strengths: JSON.stringify(llmResult.strengths || []),
          weaknesses: JSON.stringify(llmResult.weaknesses || []),
          recommendations: JSON.stringify(llmResult.recommendations || []),
          criteria: {
            create: llmResult.criteria?.map(c => ({
              name: c.name,
              score: c.score,
              maxScore: c.maxScore,
              feedback: c.feedback
            })) || []
          }
      };

      let evaluation;
      const existing = await prisma.evaluation.findUnique({ where: { attemptId: attempt.id } });
      
      if (existing) {
        await prisma.evaluationCriterion.deleteMany({ where: { evaluationId: existing.id } });
        evaluation = await prisma.evaluation.update({
          where: { id: existing.id },
          data,
          include: { criteria: true }
        });
      } else {
        evaluation = await prisma.evaluation.create({
          data: { ...data, attemptId: attempt.id },
          include: { criteria: true }
        });
      }

      // Update attempt status
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: 'COMPLETED' }
      });

      return {
        ...evaluation,
        overallScore: evaluation.overallScore ?? 0,
        deterministicScore: evaluation.deterministicScore ?? 0,
        llmScore: evaluation.llmScore ?? 0,
        summary: evaluation.summary ?? '',
        feedback: evaluation.feedback ?? '',
        strengths: JSON.parse(evaluation.strengths || '[]'),
        weaknesses: JSON.parse(evaluation.weaknesses || '[]'),
        recommendations: JSON.parse(evaluation.recommendations || '[]'),
        criteria: evaluation.criteria.map(c => ({
          name: c.name,
          score: c.score,
          maxScore: c.maxScore,
          feedback: c.feedback || ''
        }))
      };

    } catch (error) {
      console.error("Evaluation Engine failed:", error);
      
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: 'FAILED' }
      });

      throw error;
    }
  }
}
