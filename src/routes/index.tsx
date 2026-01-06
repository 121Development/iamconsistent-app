import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Users } from 'lucide-react'
import { useState } from 'react'
import JoinHabitModal from '../components/JoinHabitModal'
import Footer from '../components/Footer'
import MockHabitCard from '../components/MockHabitCard'
import MockActivityCalendar from '../components/MockActivityCalendar'
import MockAchievements from '../components/MockAchievements'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        <div className="mb-6 sm:mb-8">
          <CheckCircle2 className="h-16 sm:h-20 w-16 sm:w-20 text-emerald-400 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-100 mb-3 sm:mb-4 tracking-tight">
            iamconsistent.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-400 mb-8 sm:mb-12 px-4">
            Biggest secret to success is consistency.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/myhabits"
            className="inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded transition-colors"
          >
            Track my first habit
            <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
          </Link>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-neutral-100 font-medium text-sm py-3 px-6 rounded transition-colors border border-neutral-700"
          >
            <Users className="h-4 w-4" />
            Join shared habit
          </button>
        </div>

        <JoinHabitModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
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
              Watch your streaks grow. Github style progress tracking and achievements board.
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-900/50 p-6 rounded">
            <div className="text-emerald-400 text-3xl mb-3">✓</div>
            <h3 className="text-neutral-100 font-semibold mb-2">Features</h3>
            <p className="text-neutral-500 text-sm">
              - Track habits easy. <br /> 
              - Set target goals. <br />
              - Add notes. <br /> 
              - Share with friends. <br />
              - Install as PWA on phone.
            </p>
          </div>
        </div>

        {/* Mock Habit Cards Section */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mb-2 text-center">
            See it in action
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 text-center mb-6 sm:mb-8">
            Track anything. Stay consistent.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MockHabitCard
              icon="💪"
              name="Workout"
              color="emerald"
              todayCount={1}
              statType="streak"
              statValue="7"
            />
            <MockHabitCard
              icon="🧘"
              name="Meditate"
              color="purple"
              todayCount={1}
              statType="longest"
              statValue="14"
            />
            <MockHabitCard
              icon="✍️"
              name="Write"
              color="blue"
              todayCount={3}
              statType="target"
              statValue="3/3"
            />
          </div>
        </div>

        {/* Mock Activity Calendar */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          <MockActivityCalendar />
        </div>

        {/* Mock Achievements */}
        <div className="mt-6 sm:mt-8 mb-8 sm:mb-12">
          <MockAchievements />
        </div>
      </div>
      </div>

      <Footer />
    </div>
  )
}
