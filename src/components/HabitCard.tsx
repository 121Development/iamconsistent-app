import { useState, useEffect, useRef } from 'react'
import { Plus, Trophy, Flame, Target, Rocket, Users } from 'lucide-react'
import type { Habit, Entry } from '../lib/db'
import { format } from 'date-fns'
import { useCreateEntry, useDeleteEntry } from '../hooks/useEntries'
import { getHabitColor } from '../lib/colors'
import { calculateHabitStats } from '../lib/stats'
import LogPastDateModal from './LogPastDateModal'
import RemoveEntryModal from './RemoveEntryModal'
import EditHabitModal from './EditHabitModal'
import SharedHabitStats from './SharedHabitStats'
import NoteEntryModal from './NoteEntryModal'

interface HabitCardProps {
  habit: Habit
  entries: Entry[]
}

export default function HabitCard({ habit, entries }: HabitCardProps) {
  const [isPastDateModalOpen, setIsPastDateModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const iconRef = useRef<HTMLButtonElement>(null)

  const createEntryMutation = useCreateEntry()
  const deleteEntryMutation = useDeleteEntry()

  // Close description when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
        setShowDescription(false)
      }
    }

    if (showDescription) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDescription])

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayEntries = entries.filter(e => e.date === today)
  const todayCount = todayEntries.length

  const handleIncrement = () => {
    // If notes are enabled, show the note modal first
    if (habit.notesEnabled) {
      setIsNoteModalOpen(true)
    } else {
      // Otherwise, create entry directly without a note
      createEntryMutation.mutate({
        habitId: habit.id,
        date: today,
      })
    }
  }

  const handleSaveNote = (note: string) => {
    createEntryMutation.mutate(
      {
        habitId: habit.id,
        date: today,
        note: note || undefined,
      },
      {
        onSuccess: () => {
          setIsNoteModalOpen(false)
        },
      }
    )
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
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              ref={iconRef}
              onClick={() => habit.description && setShowDescription(!showDescription)}
              className={`w-10 h-10 rounded flex items-center justify-center text-2xl border flex-shrink-0 group relative ${
                habit.description ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
              title={habit.description || habit.name}
              type="button"
            >
              {habit.icon}
              {habit.description && (
                <div className={`absolute left-full ml-2 top-0 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-100 whitespace-nowrap pointer-events-none transition-opacity z-50 max-w-xs ${
                  showDescription ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {habit.description}
                </div>
              )}
            </button>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="text-base font-semibold text-neutral-100 break-words group relative"
                  title={habit.description || habit.name}
                >
                  {habit.name}
                  {habit.description && (
                    <span className="absolute left-0 top-full mt-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-100 font-normal whitespace-normal pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 max-w-xs">
                      {habit.description}
                    </span>
                  )}
                </h3>
                {habit.isShared && (
                  <button
                    onClick={() => setIsStatsModalOpen(true)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex-shrink-0"
                    title="View group stats"
                  >
                    <Users className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div>
                <StatBadge habit={habit} stats={stats} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
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
            edit entry
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

      {habit.isShared && habit.sharedHabitId && (
        <SharedHabitStats
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          habit={habit}
          sharedHabitId={habit.sharedHabitId}
        />
      )}

      <NoteEntryModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        habitName={habit.name}
        isLoading={createEntryMutation.isPending}
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
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
        title={`At longest streak: ${stats.longestStreak} day${stats.longestStreak === 1 ? '' : 's'}`}
      >
        <Trophy className="w-3 h-3" />
        {stats.longestStreak}
      </span>
    )
  }

  // 2. Active streak (3+ days)
  if (stats.currentStreak >= 3) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20"
        title={`Current streak: ${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`}
      >
        <Flame className="w-3 h-3" />
        {stats.currentStreak}
      </span>
    )
  }

  // 3. Target met this period (target habits only)
  if (habit.targetCount && stats.completionsThisPeriod >= habit.targetCount) {
    const isOverachieving = stats.completionsThisPeriod > habit.targetCount
    const periodLabel = habit.targetPeriod === 'day' ? 'today' : `this ${habit.targetPeriod}`

    if (isOverachieving) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
          title={`Overachieving! ${stats.completionsThisPeriod} of ${habit.targetCount} ${periodLabel}`}
        >
          <Rocket className="w-3 h-3" />
          {stats.completionsThisPeriod}/{habit.targetCount}
        </span>
      )
    }

    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        title={`Target met: ${stats.completionsThisPeriod} of ${habit.targetCount} ${periodLabel}`}
      >
        <Target className="w-3 h-3" />
        {stats.completionsThisPeriod}/{habit.targetCount}
      </span>
    )
  }

  // 4. Show small streak if any
  if (stats.currentStreak > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700"
        title={`Current streak: ${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`}
      >
        <Flame className="w-3 h-3" />
        {stats.currentStreak}
      </span>
    )
  }

  return null
}
