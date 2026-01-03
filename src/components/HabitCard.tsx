import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import type { Habit, Entry } from '../lib/db'
import { format } from 'date-fns'

interface HabitCardProps {
  habit: Habit
  entries: Entry[]
  onLogEntry: (habitId: string, date: string) => Promise<void>
  onDeleteEntry: (entryId: string) => Promise<void>
}

export default function HabitCard({ habit, entries, onLogEntry, onDeleteEntry }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')
  const hasLoggedToday = entries.some(e => e.date === today)

  const handleLogToday = async () => {
    setIsLoading(true)
    try {
      await onLogEntry(habit.id, today)
    } finally {
      setIsLoading(false)
    }
  }

  const todayEntry = entries.find(e => e.date === today)

  const handleDeleteToday = async () => {
    if (!todayEntry) return
    setIsLoading(true)
    try {
      await onDeleteEntry(todayEntry.id)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate simple streak (consecutive days)
  const calculateStreak = () => {
    if (entries.length === 0) return 0

    const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date))
    let streak = 0
    let currentDate = new Date()

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const currentStreak = calculateStreak()

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 p-5 rounded hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded flex items-center justify-center text-2xl bg-${habit.color}-950 border border-${habit.color}-800`}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-100">{habit.name}</h3>
            {habit.targetCount && habit.targetPeriod && (
              <p className="text-xs text-neutral-500 mt-0.5">
                Target: {habit.targetCount}x per {habit.targetPeriod}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{currentStreak}</div>
          <div className="text-xs text-neutral-500">day streak</div>
        </div>
      </div>

      <div className="flex gap-2">
        {!hasLoggedToday ? (
          <button
            onClick={handleLogToday}
            disabled={isLoading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-medium py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span className="text-sm">Log Today</span>
          </button>
        ) : (
          <button
            onClick={handleDeleteToday}
            disabled={isLoading}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 text-neutral-300 font-medium py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">Logged ✓</span>
          </button>
        )}
      </div>
    </div>
  )
}
