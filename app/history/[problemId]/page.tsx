import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function HistoryPage({ params }: { params: Promise<{ problemId: string }> }) {
  const { problemId } = await params;
  
  const problem = await prisma.problem.findUnique({
    where: { id: problemId }
  });

  if (!problem) return notFound();

  const userEmail = 'demo@designlab.ai';
  const user = await prisma.user.findUnique({ where: { email: userEmail }});

  const attempts = await prisma.attempt.findMany({
    where: { problemId, userId: user!.id, status: 'COMPLETED' },
    orderBy: { createdAt: 'asc' },
    include: { evaluation: true }
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href={`/problems/${problem.slug}`} className="text-blue-600 hover:underline text-sm mb-4 inline-block">&larr; Back to {problem.title}</Link>
        <h1 className="text-3xl font-bold">Attempt History</h1>
        <p className="text-gray-600">Track your progress for {problem.title}</p>
      </div>

      {attempts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No completed attempts yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40 pt-8 border-b border-l pb-2 pl-2">
                {attempts.map((a, i) => (
                  <div key={a.id} className="relative flex-1 flex flex-col items-center group">
                    <div className="absolute -top-6 text-xs font-bold text-gray-500 group-hover:text-blue-600">{a.evaluation?.overallScore}</div>
                    <div 
                      className="w-full max-w-[40px] bg-blue-100 group-hover:bg-blue-300 transition-colors rounded-t-sm" 
                      style={{ height: `${a.evaluation?.overallScore || 0}%` }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">#{i+1}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mt-8 mb-4">Past Attempts</h2>
          <div className="grid gap-4">
            {attempts.map((a, i) => (
              <Card key={a.id} className="flex justify-between items-center pr-6">
                <CardHeader>
                  <CardTitle className="text-lg">Attempt #{i+1}</CardTitle>
                  <div className="text-sm text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                </CardHeader>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Score</div>
                    <div className="text-2xl font-bold">{a.evaluation?.overallScore}</div>
                  </div>
                  <Link href={`/attempts/${a.id}`}>
                    <Button variant="outline">View Feedback</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
