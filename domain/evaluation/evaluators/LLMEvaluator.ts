import { Evaluator, EvaluatorResult } from './Evaluator';
import { Problem } from '../../problem/Problem';
import { Attempt } from '../../attempt/Attempt';
import { EvaluationFinding } from '../Evaluation';
import OpenAI from 'openai';

export class LLMEvaluator implements Evaluator {
  private openai: OpenAI | null;

  constructor() {
    this.openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy' 
      ? new OpenAI({ 
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL || undefined,
        }) 
      : null;
  }

  async evaluate(problem: Problem, attempt: Attempt, deterministicFindings: EvaluationFinding[] = []): Promise<EvaluatorResult> {
    if (!this.openai) {
      return this.fallbackEvaluate();
    }

    const systemPrompt = `You are an expert Low-Level Design interviewer and software architect.
Evaluate a learner's LLD solution against the provided problem.
There can be multiple valid designs.
Do not penalize differences from a reference solution unless the learner's design creates a meaningful engineering problem.

Evaluate:
1. Requirement Coverage
2. Responsibilities
3. Encapsulation
4. Abstraction
5. Coupling
6. Cohesion
7. SOLID Principles
8. Extensibility
9. Design Patterns
10. Code Quality
11. Error Handling
12. Explanation and Trade-offs

For each weakness, explain:
- the problem
- evidence
- why it matters
- a concrete improvement

For each strength, explain:
- the design decision
- why it is good

Prioritize real architectural issues over stylistic preferences.

Return ONLY valid JSON. 
Format:
{
  "overallScore": number,
  "criteria": [
    { "name": string, "score": number, "maxScore": 100, "feedback": string }
  ],
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string],
  "summary": string
}`;

    const userPrompt = `
Problem:
${problem.title}
${problem.description}
Requirements: ${problem.requirements.join(', ')}
Constraints: ${problem.constraints.join(', ')}

Attempt:
Code:
${attempt.code || 'None'}

Class Design:
${attempt.classDesign || 'None'}

Explanation:
${attempt.explanation || 'None'}

Deterministic Findings:
${JSON.stringify(deterministicFindings)}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No response from LLM");

      const result = JSON.parse(content);
      
      return {
        score: result.overallScore || 0,
        maxScore: 100,
        findings: [],
        feedback: result.summary,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
        criteria: result.criteria,
        summary: result.summary
      };

    } catch (error) {
      console.error('LLM Evaluation failed:', error);
      return this.fallbackEvaluate();
    }
  }

  private fallbackEvaluate(): EvaluatorResult {
    return {
      score: 75,
      maxScore: 100,
      findings: [],
      feedback: "This is a demo evaluation. No API key was provided or the API request failed.",
      strengths: ["Good attempt at structuring classes"],
      weaknesses: ["Could improve abstraction"],
      recommendations: ["Review SOLID principles"],
      summary: "Demo evaluation completed. Please configure OPENAI_API_KEY for real feedback.",
      criteria: [
        { name: "Requirement Coverage", score: 80, maxScore: 100, feedback: "Demo feedback" }
      ]
    };
  }
}
