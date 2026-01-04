import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Users } from 'lucide-react'
import { useState } from 'react'
import JoinHabitModal from '../components/JoinHabitModal'
import Footer from '../components/Footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle2 className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-100 mb-4 tracking-tight">
            iamconsistent
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 mb-12">
            Track your habits. Build consistency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/myhabits"
            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-lg py-4 px-8 rounded transition-colors"
          >
            Track my first habit
            <ArrowRight className="h-5 w-5" />
          </Link>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-neutral-100 font-medium text-sm py-3 px-6 rounded transition-colors border border-neutral-700"
          >
            <Users className="h-4 w-4" />
            Join shared habit
          </button>
        </div>

        <JoinHabitModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="border border-neutral-800 bg-neutral-900/50 p-6 rounded">
            <div className="text-emerald-400 text-3xl mb-3">→</div>
            <h3 className="text-neutral-100 font-semibold mb-2">Simple Tracking</h3>
            <p className="text-neutral-500 text-sm">
              Log your habits daily with a single click. No complexity, just consistency.
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/50 p-6 rounded">
            <div className="text-emerald-400 text-3xl mb-3">↑</div>
            <h3 className="text-neutral-100 font-semibold mb-2">Track Streaks</h3>
            <p className="text-neutral-500 text-sm">
              Watch your streaks grow. Stay motivated by seeing your progress.
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/50 p-6 rounded">
            <div className="text-emerald-400 text-3xl mb-3">✓</div>
            <h3 className="text-neutral-100 font-semibold mb-2">Build Habits</h3>
            <p className="text-neutral-500 text-sm">
              Turn actions into habits. Consistency is the key to lasting change.
            </p>
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </div>
  )
}
