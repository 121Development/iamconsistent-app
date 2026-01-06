import { createFileRoute, Link } from '@tanstack/react-router'
import Footer from '../components/Footer'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-neutral-100 mb-8">About</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              Hi, my name is Erik and I wanted a simpler way to track habits.
            </p>
          </div>

          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
