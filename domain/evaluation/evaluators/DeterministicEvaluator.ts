import { Evaluator, EvaluatorResult } from './Evaluator';
import { Problem } from '../../problem/Problem';
import { Attempt } from '../../attempt/Attempt';
import { EvaluationFinding } from '../Evaluation';

export class DeterministicEvaluator implements Evaluator {
  async evaluate(problem: Problem, attempt: Attempt): Promise<EvaluatorResult> {
    const findings: EvaluationFinding[] = [];
    let score = 100;

    if (!attempt.classDesign) {
      return { score: 0, maxScore: 100, findings: [{ rule: 'BasicStructureRule', severity: 'critical', message: 'Missing class design', evidence: 'No class design provided' }] };
    }

    try {
      const design = JSON.parse(attempt.classDesign);
      
      // 1. EmptyClassRule
      design.classes.forEach((cls: { name: string; responsibilities?: string[]; methods?: string[]; properties?: string[] }) => {
        if (!cls.responsibilities?.length && !cls.methods?.length && !cls.properties?.length) {
          findings.push({
            rule: 'EmptyClassRule',
            severity: 'moderate',
            message: `Class ${cls.name} has no defined responsibilities, properties, or methods.`,
            evidence: `Class ${cls.name} is empty.`
          });
          score -= 10;
        }
      });

      // 2. DuplicateClassRule
      const classNames = design.classes.map((c: { name: string }) => c.name);
      const uniqueNames = new Set(classNames);
      if (classNames.length !== uniqueNames.size) {
        findings.push({
          rule: 'DuplicateClassRule',
          severity: 'moderate',
          message: 'Duplicate class definitions found.',
          evidence: 'Some classes share the same name.'
        });
        score -= 15;
      }

      // 3. RequiredClassRule (Expected Concepts)
      // A naive check: does the class name or responsibilities contain the expected concept keywords?
      const designText = attempt.classDesign.toLowerCase();
      problem.expectedConcepts.forEach(concept => {
        if (!designText.includes(concept.toLowerCase())) {
          findings.push({
            rule: 'RequiredClassRule',
            severity: 'minor',
            message: `Expected concept "${concept}" not clearly represented.`,
            evidence: `Could not find "${concept}" in the class design.`
          });
          score -= 5;
        }
      });

      // 4. RelationshipRule
      if (design.relationships && design.classes.length > 1 && design.relationships.length === 0) {
        findings.push({
          rule: 'RelationshipRule',
          severity: 'moderate',
          message: 'No relationships defined between classes.',
          evidence: 'Relationships array is empty despite having multiple classes.'
        });
        score -= 10;
      }

    } catch {
      findings.push({
        rule: 'BasicStructureRule',
        severity: 'critical',
        message: 'Invalid class design format.',
        evidence: 'Failed to parse JSON.'
      });
      score = 0;
    }

    return {
      score: Math.max(0, score),
      maxScore: 100,
      findings
    };
  }
}
