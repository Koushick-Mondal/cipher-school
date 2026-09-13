import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function FeedbackPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: { problem: true, evaluation: { include: { criteria: true } } }
  });

  if (!attempt) return notFound();

  const evalResult = attempt.evaluation;
  
  if (!evalResult) {
    if (attempt.status === 'FAILED') {
      return (
        <div className="max-w-4xl mx-auto py-24 text-center px-4">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Evaluation failed</h1>
          <p className="text-gray-500 mb-8">An error occurred while evaluating your submission. Your design was saved.</p>
          <form action={async () => {
            'use server';
            const { redirect } = await import('next/navigation');
            const Engine = (await import('@/domain/evaluation/EvaluationEngine')).EvaluationEngine;
            const engine = new Engine();
            try {
              await prisma.attempt.update({ where: { id: attempt.id }, data: { status: 'EVALUATING' } });
              
              const domainProblem = {
                ...attempt.problem,
                requirements: JSON.parse(attempt.problem.requirements),
                constraints: JSON.parse(attempt.problem.constraints),
                expectedConcepts: JSON.parse(attempt.problem.expectedConcepts)
              };

              await engine.runEvaluation(domainProblem, attempt as unknown as import('@/domain/attempt/Attempt').Attempt);
            } catch {} // Handle failure silently on retry, will just stay FAILED
            redirect(`/attempts/${attempt.id}`);
          }}>
            <Button className="h-12 px-8">Retry Evaluation</Button>
          </form>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-24 text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Analyzing your design...</h1>
        <p className="text-gray-500 mb-8">This usually takes a few seconds.</p>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <div className="mt-8">
          <Link href={`/attempts/${attemptId}`}>
            <Button variant="outline">Refresh</Button>
          </Link>
        </div>
      </div>
    );
  }

  const strengths = JSON.parse(evalResult.strengths || '[]');
  const weaknesses = JSON.parse(evalResult.weaknesses || '[]');
  const recommendations = JSON.parse(evalResult.recommendations || '[]');
  const deterministicFindings = JSON.parse(evalResult.feedback || '[]');

  // Fetch previous attempt for comparison
  const pastAttempts = await prisma.attempt.findMany({
    where: { problemId: attempt.problemId, userId: attempt.userId, status: 'COMPLETED' },
    orderBy: { createdAt: 'asc' },
    include: { evaluation: true }
  });
  const currentAttemptIndex = pastAttempts.findIndex(a => a.id === attempt.id);
  const previousAttempt = currentAttemptIndex > 0 ? pastAttempts[currentAttemptIndex - 1] : null;
  const improvement = previousAttempt?.evaluation ? (evalResult.overallScore || 0) - (previousAttempt.evaluation.overallScore || 0) : null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/problems" className="text-blue-600 text-sm hover:underline">&larr; Back to problems</Link>
          <div className="flex items-center gap-4 mt-2">
            <h1 className="text-3xl font-bold">Feedback: {attempt.problem.title}</h1>
            <Badge variant={process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy' ? 'default' : 'secondary'}>
              {process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy' ? 'AI Evaluation' : 'Demo Evaluation'}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">OVERALL SCORE</div>
          <div className="text-5xl font-black text-blue-600">
            {evalResult.overallScore} <span className="text-xl text-gray-400">/ 100</span>
          </div>
          {improvement !== null && (
            <div className={`text-sm mt-1 font-bold ${improvement > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {improvement > 0 ? '+' : ''}{improvement} from previous attempt
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{evalResult.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-green-800">✓ What you did well</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {strengths.map((s: string, i: number) => (
                  <li key={i} className="flex gap-2 text-green-900">
                    <span>✓</span> <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-800">⚠ Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-4">
                {weaknesses.map((w: string, i: number) => (
                  <li key={i} className="text-amber-900 bg-white p-3 rounded border border-amber-100 shadow-sm">
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-800">💡 Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {recommendations.map((r: string, i: number) => (
                  <li key={i} className="flex gap-2 text-blue-900">
                    <span>•</span> <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Criteria Breakdowns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evalResult.criteria.map((c) => (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{c.name}</span>
                    <span>{c.score}/{c.maxScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(c.score/c.maxScore)*100}%` }}></div>
                  </div>
                </div>
              ))}
              
              <hr className="my-4"/>
              
              <div className="text-sm">
                <p><strong>Deterministic Score:</strong> {evalResult.deterministicScore}</p>
                <p><strong>LLM Reasoning Score:</strong> {evalResult.llmScore}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deterministic Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deterministicFindings.length === 0 ? (
                <p className="text-sm text-gray-500">No issues found.</p>
              ) : deterministicFindings.map((f: { rule: string; message: string; severity?: string; evidence?: string }, i: number) => (
                <div key={i} className={`p-2 rounded text-xs border ${
                  f.severity === 'critical' ? 'bg-red-50 border-red-200 text-red-800' :
                  f.severity === 'moderate' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                  'bg-yellow-50 border-yellow-200 text-yellow-800'
                }`}>
                  <strong>{f.rule}:</strong> {f.message}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="pt-4 flex flex-col gap-3">
            <form action={async () => {
              'use server';
              const userEmail = 'demo@designlab.ai';
              const user = await prisma.user.findUnique({ where: { email: userEmail }});
              
              const newAttempt = await prisma.attempt.create({
                data: {
                  userId: user!.id,
                  problemId: attempt.problemId,
                  status: 'DRAFT',
                  classDesign: attempt.classDesign,
                  code: attempt.code,
                  explanation: attempt.explanation
                }
              });
              
              const { redirect } = await import('next/navigation');
              redirect(`/practice/${newAttempt.id}`);
            }}>
              <Button className="w-full h-12">Try Again</Button>
            </form>
            
            <Link href={`/history/${attempt.problemId}`} className="w-full">
              <Button variant="outline" className="w-full">View Attempt History</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
