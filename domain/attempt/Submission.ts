import { z } from 'zod';

export const ClassDesignSchema = z.object({
  classes: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['class', 'interface', 'abstract']),
      responsibilities: z.array(z.string()),
      methods: z.array(z.string()),
      properties: z.array(z.string()).optional(),
    })
  ),
  relationships: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum(['composition', 'aggregation', 'inheritance', 'dependency', 'realization']),
    })
  ).optional(),
});

export type ClassDesign = z.infer<typeof ClassDesignSchema>;

export interface Submission {
  code: string;
  classDesign: string; // JSON string matching ClassDesignSchema
  explanation: string;
  diagram?: string;
}

export const SubmissionSchema = z.object({
  code: z.string(),
  classDesign: z.string().refine((val) => {
    try {
      ClassDesignSchema.parse(JSON.parse(val));
      return true;
    } catch {
      return false;
    }
  }, { message: "Invalid class design JSON structure" }),
  explanation: z.string(),
  diagram: z.string().optional(),
});
