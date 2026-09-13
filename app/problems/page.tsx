import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function ProblemsPage() {
  const problems = await prisma.problem.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">LLD Problems</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map(problem => (
          <Card key={problem.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle>{problem.title}</CardTitle>
                <Badge variant={problem.difficulty === 'Easy' ? 'secondary' : problem.difficulty === 'Medium' ? 'default' : 'outline'}>
                  {problem.difficulty}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{problem.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4 border-t">
              <Link href={`/problems/${problem.slug}`} className="w-full">
                <Button variant="outline" className="w-full">View Problem</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
