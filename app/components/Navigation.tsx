import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-[#1a1f2e] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-red-500 font-bold text-2xl">PYROSPHERE</Link>
          <div className="flex space-x-6">
            <Link href="/" className="text-gray-400 hover:text-white">Overview</Link>
            <Link href="/resources" className="text-white font-semibold">Resources</Link>
            <Link href="/intelligence" className="text-gray-400 hover:text-white">Intelligence</Link>
            <Link href="/analytics" className="text-gray-400 hover:text-white">Analytics</Link>
          </div>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
          Report Incident
        </button>
      </div>
    </nav>
  );
} 