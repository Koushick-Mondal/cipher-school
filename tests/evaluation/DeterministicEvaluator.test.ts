import { describe, it, expect } from 'vitest';
import { DeterministicEvaluator } from '../../domain/evaluation/evaluators/DeterministicEvaluator';
import { Problem } from '../../domain/problem/Problem';
import { Attempt } from '../../domain/attempt/Attempt';

describe('DeterministicEvaluator', () => {
  const evaluator = new DeterministicEvaluator();
  const mockProblem: Problem = {
    id: '1', title: 'Test', slug: 'test', description: 'test', difficulty: 'Easy',
    requirements: [], constraints: [],
    expectedConcepts: ['RequiredClass']
  };

  it('detects missing required classes', async () => {
    const attempt: Attempt = {
      id: '1', userId: '1', problemId: '1', status: 'SUBMITTED', createdAt: new Date(),
      classDesign: JSON.stringify({ classes: [{ name: 'WrongClass', responsibilities: ['do something'] }] })
    };
    
    const result = await evaluator.evaluate(mockProblem, attempt);
    expect(result.findings.some(f => f.rule === 'RequiredClassRule')).toBe(true);
    expect(result.score).toBeLessThan(100);
  });

  it('detects duplicate classes', async () => {
    const attempt: Attempt = {
      id: '1', userId: '1', problemId: '1', status: 'SUBMITTED', createdAt: new Date(),
      classDesign: JSON.stringify({ classes: [{ name: 'A', responsibilities: ['a'] }, { name: 'A', responsibilities: ['b'] }] })
    };
    
    const result = await evaluator.evaluate(mockProblem, attempt);
    expect(result.findings.some(f => f.rule === 'DuplicateClassRule')).toBe(true);
  });

  it('detects empty classes', async () => {
    const attempt: Attempt = {
      id: '1', userId: '1', problemId: '1', status: 'SUBMITTED', createdAt: new Date(),
      classDesign: JSON.stringify({ classes: [{ name: 'Empty', responsibilities: [], methods: [] }] })
    };
    
    const result = await evaluator.evaluate(mockProblem, attempt);
    expect(result.findings.some(f => f.rule === 'EmptyClassRule')).toBe(true);
  });

  it('detects missing relationships with multiple classes', async () => {
    const attempt: Attempt = {
      id: '1', userId: '1', problemId: '1', status: 'SUBMITTED', createdAt: new Date(),
      classDesign: JSON.stringify({ 
        classes: [{ name: 'A', responsibilities: ['a'] }, { name: 'B', responsibilities: ['b'] }],
        relationships: []
      })
    };
    
    const result = await evaluator.evaluate(mockProblem, attempt);
    expect(result.findings.some(f => f.rule === 'RelationshipRule')).toBe(true);
  });
});
