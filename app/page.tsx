import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b flex justify-between items-center bg-white">
        <h1 className="font-bold text-xl tracking-tight">DesignLab AI</h1>
        <nav>
          <Link href="/problems">
            <Button variant="ghost">Browse Problems</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gray-50">
        <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Practice LLD. Get intelligent feedback. <br/>
          <span className="text-blue-600">Improve your design.</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Turn every LLD attempt into measurable engineering growth. 
          Submit your designs, get deterministic and AI-powered feedback, and track your improvement.
        </p>
        <Link href="/problems">
          <Button className="h-12 px-8 text-lg">Start Practicing</Button>
        </Link>
      </main>
    </div>
  );
}
