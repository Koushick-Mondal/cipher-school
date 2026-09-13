export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface Attempt {
  id: string;
  userId: string;
  problemId: string;
  status: AttemptStatus;
  code?: string | null;
  classDesign?: string | null;
  diagram?: string | null;
  explanation?: string | null;
  createdAt: Date;
  submittedAt?: Date | null;
}
