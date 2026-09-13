import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EvaluationEngine } from '@/domain/evaluation/EvaluationEngine';
import { ProblemRepository } from '@/domain/problem/ProblemRepository';
import { AttemptRepository } from '@/domain/attempt/AttemptRepository';

export async function POST(req: NextRequest) {
  const { attemptId } = await req.json();

  const attemptRepo = new AttemptRepository();
  const problemRepo = new ProblemRepository();
  const engine = new EvaluationEngine();

  const attempt = await attemptRepo.findById(attemptId);
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  const problem = await problemRepo.findById(attempt.problemId);
  if (!problem) return NextResponse.json({ error: 'Problem not found' }, { status: 404 });

  // Update status
  await prisma.attempt.update({ where: { id: attemptId }, data: { status: 'EVALUATING' } });

  try {
    const evaluation = await engine.runEvaluation(problem, attempt);
    return NextResponse.json({ 
      success: true, 
      status: 'COMPLETED',
      attemptId: attempt.id,
      evaluationId: evaluation.id,
      redirectUrl: `/attempts/${attempt.id}`
    });
  } catch (error: unknown) {
    console.error('[EVALUATION] error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Evaluation failed';
    return NextResponse.json({ success: false, status: 'FAILED', error: errorMessage }, { status: 500 });
  }
}
