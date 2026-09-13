import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SubmissionSchema } from '@/domain/attempt/Submission';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const parsed = SubmissionSchema.parse(body);

    const attempt = await prisma.attempt.update({
      where: { id },
      data: {
        code: parsed.code,
        classDesign: parsed.classDesign,
        explanation: parsed.explanation,
        diagram: parsed.diagram,
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });

    return NextResponse.json(attempt);
  } catch {
    return NextResponse.json({ error: 'Invalid submission format' }, { status: 400 });
  }
}
