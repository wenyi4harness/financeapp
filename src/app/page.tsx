import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Personal Finance App</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/blogs"
            className="p-6 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">📚 Blogs</h2>
            <p className="text-gray-600">Save and organize your favorite finance blog posts</p>
          </Link>

          <Link
            href="/goals"
            className="p-6 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">🎯 Goals</h2>
            <p className="text-gray-600">Set and track your financial goals</p>
          </Link>

          <Link
            href="/planning"
            className="p-6 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">📅 Weekly Planning</h2>
            <p className="text-gray-600">Plan your weekly finances and budget</p>
          </Link>

          <Link
            href="/review"
            className="p-6 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">📰 News & Review</h2>
            <p className="text-gray-600">Review financial news and your performance</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
