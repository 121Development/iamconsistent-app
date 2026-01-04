import { format, subDays } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  getSharedHabitMembers,
  getSharedHabitLeaderboard,
  getSharedHabitMemberActivity,
} from '../server/shared-habits'
import type { Habit } from '../lib/db'
import { getHabitColor } from '../lib/colors'

interface SharedHabitsCalendarProps {
  habits: Habit[]
}

export default function SharedHabitsCalendar({ habits }: SharedHabitsCalendarProps) {
  // Filter to only shared habits
  const sharedHabits = habits.filter((h) => h.isShared && h.sharedHabitId)

  if (sharedHabits.length === 0) {
    return null
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-xl font-bold text-neutral-100">Shared Habits Activity</h2>
      {sharedHabits.map((habit) => (
        <SharedHabitCalendar key={habit.id} habit={habit} />
      ))}
    </div>
  )
}

interface SharedHabitCalendarProps {
  habit: Habit
}

function SharedHabitCalendar({ habit }: SharedHabitCalendarProps) {
  const { data: members } = useQuery({
    queryKey: ['shared-habit-members', habit.sharedHabitId],
    queryFn: () =>
      habit.sharedHabitId
        ? getSharedHabitMembers({ data: { sharedHabitId: habit.sharedHabitId } })
        : Promise.resolve([]),
    enabled: !!habit.sharedHabitId,
  })

  const { data: leaderboard } = useQuery({
    queryKey: ['shared-habit-leaderboard', habit.sharedHabitId],
    queryFn: () =>
      habit.sharedHabitId
        ? getSharedHabitLeaderboard({ data: { sharedHabitId: habit.sharedHabitId } })
        : Promise.resolve([]),
    enabled: !!habit.sharedHabitId,
  })

  const { data: memberActivity } = useQuery({
    queryKey: ['shared-habit-member-activity', habit.sharedHabitId],
    queryFn: () =>
      habit.sharedHabitId
        ? getSharedHabitMemberActivity({ data: { sharedHabitId: habit.sharedHabitId } })
        : Promise.resolve([]),
    enabled: !!habit.sharedHabitId,
  })

  const colors = getHabitColor(habit.color)

  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return {
      date: format(date, 'yyyy-MM-dd'),
      dayOfWeek: format(date, 'EEE'),
      dayOfMonth: format(date, 'd'),
    }
  })

  if (!members || members.length === 0) {
    return null
  }

  // Format member name - use name if set, otherwise extract from email
  const formatMemberName = (name: string | null, email: string) => {
    // If name is set, use it directly
    if (name && name.trim()) {
      return name
    }

    // Otherwise, extract from email
    const namePart = email.split('@')[0]
    const parts = namePart.split(/[._-]/).filter(Boolean)

    if (parts.length >= 2) {
      // Capitalize first name and get first letter of last name
      const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
      const lastInitial = parts[1].charAt(0).toUpperCase()
      return `${firstName} ${lastInitial}`
    } else if (parts.length === 1) {
      // Just capitalize the single name
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
    }

    return email.split('@')[0]
  }

  // Get member activity data by userId and date
  const getMemberEntries = (userId: string, date: string): number => {
    const activity = memberActivity?.find((m) => m.userId === userId)
    return activity?.entriesByDate[date] || 0
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-4">
      {/* Habit header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
        <div
          className="w-8 h-8 rounded flex items-center justify-center text-xl border"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
          }}
        >
          {habit.icon}
        </div>
        <h3 className="text-lg font-semibold text-neutral-100">{habit.name}</h3>
        <span className="text-xs text-neutral-500">({members.length} members)</span>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-4">
          {/* Member names column */}
          <div className="space-y-2 flex-shrink-0 pt-6">
            {members.map((member) => (
              <div key={member.userId} className="h-4 flex items-center">
                <span className="text-xs text-neutral-400 w-20 truncate">
                  {formatMemberName(member.name, member.email)}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div>
            {/* Day labels */}
            <div className="flex gap-1 mb-2">
              {days.map((day, index) => (
                <div
                  key={day.date}
                  className="w-4 text-center"
                  title={`${day.dayOfWeek} ${day.dayOfMonth}`}
                >
                  {index % 7 === 0 && (
                    <span className="text-[8px] text-neutral-500">{day.dayOfMonth}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Member activity rows */}
            <div className="space-y-2">
              {members.map((member) => {
                return (
                  <div key={member.userId} className="flex gap-1">
                    {days.map((day) => {
                      const entryCount = getMemberEntries(member.userId, day.date)
                      const hasActivity = entryCount > 0

                      // Calculate opacity based on entry count (1-4+ entries)
                      const opacity = hasActivity
                        ? Math.min(0.3 + entryCount * 0.2, 1)
                        : 0.15

                      return (
                        <div
                          key={day.date}
                          className="w-4 h-4 rounded-sm border transition-colors"
                          style={{
                            backgroundColor: hasActivity ? colors.bg : 'transparent',
                            borderColor: hasActivity ? colors.border : 'rgb(38, 38, 38)',
                            opacity,
                          }}
                          title={`${formatMemberName(member.name, member.email)} - ${day.date}${
                            hasActivity ? `: ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}` : ''
                          }`}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-4 pt-4 border-t border-neutral-800 flex gap-4 text-xs text-neutral-500">
        <span>
          Top streak: {Math.max(...(leaderboard?.map((m) => m.currentStreak) || [0]))} days
        </span>
        <span>•</span>
        <span>
          Avg completion: {leaderboard && leaderboard.length > 0
            ? Math.round(
                leaderboard.reduce((sum, m) => sum + m.completionRate, 0) / leaderboard.length
              )
            : 0}%
        </span>
      </div>
    </div>
  )
}
