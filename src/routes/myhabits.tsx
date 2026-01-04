import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import HabitCard from '../components/HabitCard'
import HabitCalendar from '../components/HabitCalendar'
import CreateHabitModal from '../components/CreateHabitModal'
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
  const [isSyncing, setIsSyncing] = useState(true)

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
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-100 mb-1">
              {format(new Date(), 'EEEE, MMMM d')}
            </h1>
            <p className="text-sm text-neutral-500">
              Track your habits and build consistency
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

        <HabitCalendar habits={habits} entriesMap={entriesMap} />

        <CreateHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  )
}
