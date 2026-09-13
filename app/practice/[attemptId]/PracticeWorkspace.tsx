'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Editor from '@monaco-editor/react';
import type { Attempt, Problem } from '@prisma/client';

export function PracticeWorkspace({ attempt, problem }: { attempt: Attempt, problem: Problem }) {
  const router = useRouter();
  const [classDesign, setClassDesign] = useState(attempt.classDesign || '{\n  "classes": [\n    {\n      "name": "ParkingLot",\n      "type": "class",\n      "responsibilities": ["Manage floors"],\n      "methods": ["parkVehicle()"]\n    }\n  ],\n  "relationships": []\n}');
  const [code, setCode] = useState(attempt.code || '// Write your code here');
  const [explanation, setExplanation] = useState(attempt.explanation || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reqs = JSON.parse(problem.requirements);
  const constrs = JSON.parse(problem.constraints);

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('Saving submission...');
    try {
      const res = await fetch(`/api/attempts/${attempt.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          classDesign,
          explanation,
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save submission');
      }

      setSubmitStatus('Analyzing your design...');
      
      const evalRes = await fetch(`/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt.id })
      });
      
      const evalData = await evalRes.json();
      
      if (!evalRes.ok || !evalData.success) {
        throw new Error(evalData.error || 'Evaluation failed');
      }

      router.push(`/attempts/${attempt.id}`);
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.');
    }
    setIsSubmitting(false);
    setSubmitStatus(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col overflow-hidden">
      <header className="px-4 py-3 bg-white border-b flex justify-between items-center shrink-0">
        <h1 className="font-semibold text-lg">{problem.title}</h1>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (submitStatus || 'Submitting...') : 'Submit Solution'}
        </Button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Requirements */}
        <div className="w-1/4 border-r bg-white p-4 overflow-y-auto">
          <h2 className="font-bold text-lg mb-4">Requirements</h2>
          <ul className="list-disc pl-5 mb-6 text-sm space-y-2">
            {reqs.map((req: string, i: number) => <li key={i}>{req}</li>)}
          </ul>
          
          <h2 className="font-bold text-lg mb-4">Constraints</h2>
          <ul className="list-disc pl-5 text-sm space-y-2">
            {constrs.map((req: string, i: number) => <li key={i}>{req}</li>)}
          </ul>
        </div>

        {/* Center Panel: Editor */}
        <div className="w-2/4 flex flex-col border-r bg-gray-100">
          <div className="flex-1 p-4 flex flex-col">
            <h3 className="text-sm font-semibold mb-2">Class Design (JSON)</h3>
            <Editor
              height="40%"
              defaultLanguage="json"
              value={classDesign}
              onChange={(val) => setClassDesign(val || '')}
              theme="vs-light"
              options={{ minimap: { enabled: false } }}
            />
            <h3 className="text-sm font-semibold mt-4 mb-2">Code Implementation</h3>
            <Editor
              height="50%"
              defaultLanguage="typescript"
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-light"
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </div>

        {/* Right Panel: Explanation & Diagram */}
        <div className="w-1/4 bg-white flex flex-col">
          <div className="p-4 border-b flex-1">
            <h3 className="text-sm font-semibold mb-2">Diagram Preview</h3>
            <div className="h-full bg-gray-50 flex items-center justify-center border text-sm text-gray-400">
              (React Flow preview renders here based on JSON)
            </div>
          </div>
          <div className="p-4 flex-1">
            <h3 className="text-sm font-semibold mb-2">Explanation & Trade-offs</h3>
            <Textarea 
              className="h-[80%] resize-none" 
              placeholder="Explain your design decisions..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
