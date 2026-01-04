import { useMemo, useState, useRef, useEffect } from 'react'
import type { Habit, Entry } from '../lib/db'
import { format, eachDayOfInterval, startOfDay, parseISO } from 'date-fns'
import { getHabitColor } from '../lib/colors'

interface HabitCalendarProps {
  habits: Habit[]
  entriesMap: Record<string, Entry[]>
}

export default function HabitCalendar({ habits, entriesMap }: HabitCalendarProps) {
  const [hoveredCell, setHoveredCell] = useState<{ habitId: string; date: string } | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to the right (latest entries) on mount and when data changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [habits, entriesMap])

  // Find the earliest entry date across ALL habits
  const getEarliestDate = (): Date => {
    let earliestDate: Date | null = null

    for (const habit of habits) {
      const entries = entriesMap[habit.id] || []
      if (entries.length > 0) {
        const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date))
        const firstEntryDate = parseISO(sortedEntries[0].date)

        if (!earliestDate || firstEntryDate < earliestDate) {
          earliestDate = firstEntryDate
        }
      }
    }

    // If no entries exist, return today
    return earliestDate || startOfDay(new Date())
  }

  // Get all days from earliest entry to today (same for all habits)
  const allDays = useMemo(() => {
    const startDate = getEarliestDate()
    const today = startOfDay(new Date())
    return eachDayOfInterval({ start: startDate, end: today })
  }, [habits, entriesMap])

  // Get entry count for a specific habit and date
  const getEntryCount = (habitId: string, date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const entries = entriesMap[habitId] || []
    return entries.filter(e => e.date === dateStr).length
  }

  // Get color intensity based on entry count
  const getColorClass = (count: number): string => {
    if (count === 0) return 'bg-neutral-900 border-neutral-800'
    if (count === 1) return 'bg-emerald-700/60 border-emerald-600/60'
    if (count === 2) return 'bg-emerald-600/80 border-emerald-500/80'
    return 'bg-emerald-500 border-emerald-400' // 3+
  }

  if (habits.length === 0) return null

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-6 mt-8">
      <h2 className="text-lg font-bold text-neutral-100 mb-4">Activity</h2>

      <div className="flex gap-4">
        {/* Fixed habit names column */}
        <div className="space-y-4 flex-shrink-0">
          {habits.map((habit) => {
            const colors = getHabitColor(habit.color)
            return (
              <div key={habit.id} className="flex items-center gap-2 h-3">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-sm border"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  {habit.icon}
                </div>
                <span className="text-sm text-neutral-300 truncate w-32">{habit.name}</span>
              </div>
            )
          })}
        </div>

        {/* Scrollable calendar grid */}
        <div ref={scrollContainerRef} className="overflow-x-auto flex-1">
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex gap-1 h-3">
                {allDays.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd')
                  const count = getEntryCount(habit.id, day)
                  const isHovered = hoveredCell?.habitId === habit.id && hoveredCell?.date === dateStr

                  return (
                    <div
                      key={dateStr}
                      className="relative"
                      onMouseEnter={() => setHoveredCell({ habitId: habit.id, date: dateStr })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className={`w-3 h-3 border rounded-sm transition-all ${getColorClass(count)} ${
                          isHovered ? 'ring-1 ring-emerald-400 ring-offset-1 ring-offset-neutral-950' : ''
                        }`}
                        title={`${format(day, 'MMM d, yyyy')}: ${count} ${count === 1 ? 'entry' : 'entries'}`}
                      />

                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-100 whitespace-nowrap pointer-events-none">
                          {format(day, 'MMM d, yyyy')}: {count} {count === 1 ? 'entry' : 'entries'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
        <span>Less</span>
        <div className="w-3 h-3 border rounded-sm bg-neutral-900 border-neutral-800" />
        <div className="w-3 h-3 border rounded-sm bg-emerald-700/60 border-emerald-600/60" />
        <div className="w-3 h-3 border rounded-sm bg-emerald-600/80 border-emerald-500/80" />
        <div className="w-3 h-3 border rounded-sm bg-emerald-500 border-emerald-400" />
        <span>More</span>
      </div>
    </div>
  )
}

//<span className="text-sm text-neutral-300 truncate">{habit.name}</span>