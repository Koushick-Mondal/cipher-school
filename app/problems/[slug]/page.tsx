import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = await prisma.problem.findUnique({
    where: { slug }
  });

  if (!problem) return notFound();

  const requirements = JSON.parse(problem.requirements || '[]');
  const constraints = JSON.parse(problem.constraints || '[]');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/problems" className="text-blue-600 hover:underline text-sm mb-4 inline-block">&larr; Back to problems</Link>
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">{problem.title}</h1>
          <Badge>{problem.difficulty}</Badge>
        </div>
        <p className="text-xl text-gray-600 mb-8">{problem.description}</p>
        
        <form action={async () => {
          'use server';
          // Find or create draft attempt
          const userEmail = 'demo@designlab.ai';
          const user = await prisma.user.findUnique({ where: { email: userEmail }});
          
          let attempt = await prisma.attempt.findFirst({
            where: { userId: user!.id, problemId: problem.id, status: 'DRAFT' }
          });
          
          if (!attempt) {
            attempt = await prisma.attempt.create({
              data: {
                userId: user!.id,
                problemId: problem.id,
                status: 'DRAFT',
                classDesign: '{"classes":[],"relationships":[]}'
              }
            });
          }
          
          redirect(`/practice/${attempt.id}`);
        }}>
          <Button className="h-12 px-8 text-lg">Start Practice</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {requirements.map((req: string, i: number) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constraints</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {constraints.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
