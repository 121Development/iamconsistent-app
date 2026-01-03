import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import HabitCard from '../components/HabitCard'
import CreateHabitModal from '../components/CreateHabitModal'
import { getHabits, getEntries, createHabit, createEntry, deleteEntry } from '../server'

export const Route = createFileRoute('/create')({
  component: Dashboard,
})

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [habits, setHabits] = useState<any[]>([])
  const [entriesMap, setEntriesMap] = useState<Record<string, any[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load habits and entries
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      console.log('Loading habits...')
      const habitsData = await getHabits()
      console.log('Habits loaded:', habitsData)
      setHabits(habitsData)

      // Load entries for each habit
      const entriesData: Record<string, any[]> = {}
      for (const habit of habitsData) {
        console.log('Loading entries for habit:', habit.id)
        const entries = await getEntries({ data: { habitId: habit.id } })
        entriesData[habit.id] = entries
      }
      setEntriesMap(entriesData)
      console.log('All data loaded successfully')
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error(`Failed to load habits: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateHabit(data: {
    name: string
    icon: string
    color: string
    targetCount?: number
    targetPeriod?: 'week' | 'month'
  }) {
    try {
      const newHabit = await createHabit({ data })
      setHabits([...habits, newHabit])
      setEntriesMap({ ...entriesMap, [newHabit.id]: [] })
      toast.success('Habit created!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create habit')
      throw error
    }
  }

  async function handleLogEntry(habitId: string, date: string) {
    try {
      const newEntry = await createEntry({ data: { habitId, date } })
      setEntriesMap({
        ...entriesMap,
        [habitId]: [...(entriesMap[habitId] || []), newEntry],
      })
      toast.success('Entry logged!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to log entry')
    }
  }

  async function handleDeleteEntry(entryId: string) {
    try {
      await deleteEntry({ data: { id: entryId } })

      // Find and remove the entry from the map
      const newEntriesMap = { ...entriesMap }
      for (const habitId in newEntriesMap) {
        newEntriesMap[habitId] = newEntriesMap[habitId].filter(e => e.id !== entryId)
      }
      setEntriesMap(newEntriesMap)
      toast.success('Entry deleted!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete entry')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
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
                onLogEntry={handleLogEntry}
                onDeleteEntry={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateHabit}
      />
    </div>
  )
}
