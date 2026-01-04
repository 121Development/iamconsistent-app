import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus, UserPlus } from 'lucide-react'
import { format } from 'date-fns'
import HabitCard from '../components/HabitCard'
import HabitCalendar from '../components/HabitCalendar'
import SharedHabitsCalendar from '../components/SharedHabitsCalendar'
import HabitMilestones from '../components/HabitMilestones'
import SettingsPanel from '../components/SettingsPanel'
import CreateHabitModal from '../components/CreateHabitModal'
import InviteFriendModal from '../components/InviteFriendModal'
import ShareHabitModal from '../components/ShareHabitModal'
import Footer from '../components/Footer'
import type { Habit } from '../lib/db'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useHabits } from '../hooks/useHabits'
import { useMultipleHabitEntries } from '../hooks/useEntries'
import { syncUser } from '../server/init'

export const Route = createFileRoute('/myhabits')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInviteFriendModalOpen, setIsInviteFriendModalOpen] = useState(false)
  const [selectedHabitToShare, setSelectedHabitToShare] = useState<Habit | null>(null)
  const [isSyncing, setIsSyncing] = useState(true)
  const navigate = useNavigate()

  // Check for pending invite code and redirect if found
  useEffect(() => {
    const pendingInviteCode = localStorage.getItem('pendingInviteCode')
    if (pendingInviteCode) {
      // Redirect to join page with the pending code
      navigate({ to: `/join/${pendingInviteCode}` })
    }
  }, [navigate])

  // Sync user to database on mount
  useEffect(() => {
    const sync = async () => {
      try {
        await syncUser()
      } catch (error) {
        console.error('Failed to sync user:', error)
      } finally {
        setIsSyncing(false)
      }
    }
    sync()
  }, [])

  // Fetch habits using useQuery
  const { data: habits = [], isLoading: habitsLoading } = useHabits()

  // Fetch entries for all habits using useQueries
  const entriesQueries = useMultipleHabitEntries(habits.map((h) => h.id))

  // Build entries map from queries
  const entriesMap = habits.reduce((acc, habit, index) => {
    acc[habit.id] = entriesQueries[index]?.data || []
    return acc
  }, {} as Record<string, any[]>)

  const isLoading = isSyncing || habitsLoading || entriesQueries.some((q) => q.isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-neutral-500 text-sm">
          {isSyncing ? 'Setting up your account...' : 'Loading...'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-100 mb-1">
              {format(new Date(), 'EEE, MMM d')}
            </h1>
            <p className="text-sm text-neutral-500">
              Track your habits. <br />
              Build consistency.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-medium py-2.5 px-4 rounded transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">New Habit</span>
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="border border-dashed border-neutral-800 rounded-lg p-12 text-center">
            <p className="text-neutral-500 mb-4">No habits yet. Create your first habit to get started!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-medium py-2.5 px-6 rounded transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Create First Habit</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                entries={entriesMap[habit.id] || []}
              />
            ))}
          </div>
        )}

        {habits.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsInviteFriendModalOpen(true)}
              className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-emerald-500/50 text-neutral-300 font-medium py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Track with a Friend</span>
            </button>
          </div>
        )}

        <HabitCalendar habits={habits} entriesMap={entriesMap} />

        <SharedHabitsCalendar habits={habits} />

        <HabitMilestones habits={habits} entriesMap={entriesMap} />

        <SettingsPanel />

        <CreateHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <InviteFriendModal
          isOpen={isInviteFriendModalOpen}
          onClose={() => setIsInviteFriendModalOpen(false)}
          habits={habits}
          onSelectHabit={(habit) => {
            setSelectedHabitToShare(habit)
            setIsInviteFriendModalOpen(false)
          }}
        />

        {selectedHabitToShare && (
          <ShareHabitModal
            isOpen={true}
            onClose={() => setSelectedHabitToShare(null)}
            habit={selectedHabitToShare}
          />
        )}
      </div>
      </div>

      <Footer />
    </div>
  )
}
