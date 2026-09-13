export interface EvaluationCriterion {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface Evaluation {
  id?: string;
  attemptId: string;
  overallScore: number;
  deterministicScore: number;
  llmScore: number;
  feedback: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  criteria: EvaluationCriterion[];
  createdAt?: Date;
}

export interface EvaluationFinding {
  rule: string;
  severity: 'critical' | 'moderate' | 'minor' | 'positive';
  message: string;
  evidence: string;
  scoreImpact?: number;
}
