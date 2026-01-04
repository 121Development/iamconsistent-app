import { useState } from 'react'
import { Plus, Trophy, Flame, Target, Rocket } from 'lucide-react'
import type { Habit, Entry } from '../lib/db'
import { format } from 'date-fns'
import { useCreateEntry, useDeleteEntry } from '../hooks/useEntries'
import { getHabitColor } from '../lib/colors'
import { calculateHabitStats } from '../lib/stats'
import LogPastDateModal from './LogPastDateModal'
import RemoveEntryModal from './RemoveEntryModal'
import EditHabitModal from './EditHabitModal'

interface HabitCardProps {
  habit: Habit
  entries: Entry[]
}

export default function HabitCard({ habit, entries }: HabitCardProps) {
  const [isPastDateModalOpen, setIsPastDateModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const createEntryMutation = useCreateEntry()
  const deleteEntryMutation = useDeleteEntry()

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayEntries = entries.filter(e => e.date === today)
  const todayCount = todayEntries.length

  const handleIncrement = () => {
    createEntryMutation.mutate({
      habitId: habit.id,
      date: today,
    })
  }

  const handleDecrement = () => {
    if (todayCount === 0) return
    const lastEntry = todayEntries[todayEntries.length - 1]
    deleteEntryMutation.mutate(lastEntry.id)
  }

  const isLoading = createEntryMutation.isPending || deleteEntryMutation.isPending
  const colors = getHabitColor(habit.color)

  // Calculate all stats
  const stats = calculateHabitStats(habit, entries)

  return (
    <>
      <div className="border border-neutral-800 bg-neutral-900/50 p-5 rounded hover:border-neutral-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center text-2xl border"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
            >
              {habit.icon}
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-neutral-100">{habit.name}</h3>
              <StatBadge habit={habit} stats={stats} />
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="w-12 text-center">
              <div className="text-2xl font-bold text-emerald-400">{todayCount}</div>
            </div>

            <button
              onClick={handleIncrement}
              disabled={isLoading}
              className="w-10 h-10 rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-bold flex items-center justify-center transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            edit
          </button>
          |
          <button
            onClick={() => setIsRemoveModalOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            remove entry
          </button>
          |
          <button
            onClick={() => setIsPastDateModalOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            log earlier date
          </button>
          
        </div>
      </div>

      <EditHabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        habit={habit}
      />

      <LogPastDateModal
        isOpen={isPastDateModalOpen}
        onClose={() => setIsPastDateModalOpen(false)}
        habitId={habit.id}
        habitName={habit.name}
      />

      <RemoveEntryModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        habitName={habit.name}
        entries={entries}
      />
    </>
  )
}

// Stat badge component to show most relevant metric
interface StatBadgeProps {
  habit: Habit
  stats: ReturnType<typeof calculateHabitStats>
}

function StatBadge({ habit, stats }: StatBadgeProps) {
  // Show most relevant badge based on priority

  // 1. Currently at longest streak (most impressive)
  if (stats.currentStreak === stats.longestStreak && stats.longestStreak >= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        <Trophy className="w-3 h-3" />
        {stats.longestStreak}
      </span>
    )
  }

  // 2. Active streak (3+ days)
  if (stats.currentStreak >= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
        <Flame className="w-3 h-3" />
        {stats.currentStreak}
      </span>
    )
  }

  // 3. Target met this period (target habits only)
  if (habit.targetCount && stats.completionsThisPeriod >= habit.targetCount) {
    const isOverachieving = stats.completionsThisPeriod > habit.targetCount

    if (isOverachieving) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Rocket className="w-3 h-3" />
          {stats.completionsThisPeriod}/{habit.targetCount}
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Target className="w-3 h-3" />
        {stats.completionsThisPeriod}/{habit.targetCount}
      </span>
    )
  }

  // 4. Show small streak if any
  if (stats.currentStreak > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
        <Flame className="w-3 h-3" />
        {stats.currentStreak}
      </span>
    )
  }

  return null
}
