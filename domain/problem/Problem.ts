export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  requirements: string[];
  constraints: string[];
  expectedConcepts: string[];
}
