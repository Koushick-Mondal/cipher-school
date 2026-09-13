import { Problem } from '../../problem/Problem';
import { Attempt } from '../../attempt/Attempt';
import { EvaluationFinding } from '../Evaluation';

export interface EvaluatorResult {
  score: number;
  maxScore: number;
  findings: EvaluationFinding[];
  feedback?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  criteria?: { name: string; score: number; maxScore: number; feedback: string }[];
  summary?: string;
}

export interface Evaluator {
  evaluate(problem: Problem, attempt: Attempt): Promise<EvaluatorResult>;
}
