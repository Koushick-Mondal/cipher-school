import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PracticeWorkspace } from './PracticeWorkspace';

export default async function PracticePage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: { problem: true }
  });

  if (!attempt) return notFound();

  return <PracticeWorkspace attempt={attempt} problem={attempt.problem} />;
}
