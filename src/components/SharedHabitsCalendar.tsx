import { format, subDays } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useEffect, useState } from 'react'
import { Share2, Trash2, BarChart3 } from 'lucide-react'
import { useUser } from '@clerk/tanstack-react-start'
import {
  getSharedHabitMembers,
  getSharedHabitLeaderboard,
  getSharedHabitMemberActivity,
  deleteSharedHabit,
  leaveSharedHabit,
} from '../server/shared-habits'
import type { Habit } from '../lib/db'
import { getHabitColor } from '../lib/colors'
import ShareHabitModal from './ShareHabitModal'
import SharedHabitStats from './SharedHabitStats'
import { toast } from 'sonner'

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const { user } = useUser()
  const queryClient = useQueryClient()

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

  // Delete shared habit mutation
  const deleteSharedMutation = useMutation({
    mutationFn: () =>
      deleteSharedHabit({ data: { sharedHabitId: habit.sharedHabitId! } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit unshared. All members can continue tracking individually.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unshare habit')
    },
  })

  // Leave shared habit mutation (for members)
  const leaveSharedMutation = useMutation({
    mutationFn: () =>
      leaveSharedHabit({ data: { habitId: habit.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('You have left the shared habit.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to leave shared habit')
    },
  })

  // Scroll to the right (latest entries) on mount and when data changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [memberActivity])

  const colors = getHabitColor(habit.color)

  // Check if current user is owner
  const currentUserMember = members?.find((m) => m.userId === user?.id)
  const isOwner = currentUserMember?.role === 'owner'

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

  // Format member name - use custom display name if set, otherwise format as "FirstName L."
  const formatMemberName = (name: string | null, email: string) => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(/\s+/)

      // If name has multiple parts (e.g., "Erik Erikson"), format as "FirstName L."
      if (nameParts.length >= 2) {
        const firstName = nameParts[0]
        const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        return `${firstName} ${lastInitial}.`
      }

      // If single word (custom display name), use as-is
      return name.trim()
    }

    // No name set, extract from email
    const namePart = email.split('@')[0]
    const parts = namePart.split(/[._-]/).filter(Boolean)

    if (parts.length >= 2) {
      // Format as "FirstName L."
      const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()
      const lastInitial = parts[1].charAt(0).toUpperCase()
      return `${firstName} ${lastInitial}.`
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

  // Calculate medal rankings (count from when 2nd person joined)
  const getMedalForUser = (userId: string): string | null => {
    if (!members || members.length < 2 || !memberActivity) return null

    // Find the date when the 2nd person joined
    const sortedMembers = [...members].sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
    const secondMemberJoinDate = sortedMembers[1].joinedAt.split('T')[0] // Get YYYY-MM-DD

    // Count total entries for each user from that date onwards
    const userTotals = members.map((member) => {
      const activity = memberActivity.find((m) => m.userId === member.userId)
      if (!activity) return { userId: member.userId, total: 0 }

      const total = Object.entries(activity.entriesByDate)
        .filter(([date]) => date >= secondMemberJoinDate)
        .reduce((sum, [, count]) => sum + count, 0)

      return { userId: member.userId, total }
    })

    // Sort by total (descending) and assign ranks
    const sorted = userTotals.sort((a, b) => b.total - a.total)
    const userRank = sorted.findIndex((u) => u.userId === userId)

    if (userRank === 0 && sorted[0].total > 0) return '🥇'
    if (userRank === 1 && sorted[1].total > 0) return '🥈'
    if (userRank === 2 && sorted[2].total > 0) return '🥉'

    return null
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-4">
      {/* Habit header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
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
      </div>

      {/* Calendar grid */}
      <div className="flex gap-4">
        {/* Fixed member names column */}
        <div className="space-y-2 flex-shrink-0 pt-6">
          {members.map((member) => {
            const medal = getMedalForUser(member.userId)
            return (
              <div key={member.userId} className="h-4 flex items-center gap-1">
                <span className="text-xs text-neutral-400 w-20 truncate">
                  {formatMemberName(member.name, member.email)}
                </span>
                {medal && <span className="text-sm">{medal}</span>}
              </div>
            )
          })}
        </div>

        {/* Scrollable calendar grid */}
        <div ref={scrollContainerRef} className="overflow-x-auto flex-1">
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
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <div className="flex gap-4 text-xs text-neutral-500 mb-3">
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

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <button
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to unshare this habit? All members will keep their individual progress, but group tracking will end.'
                  )
                ) {
                  deleteSharedMutation.mutate()
                }
              }}
              disabled={deleteSharedMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 border border-red-900/50 hover:border-red-800 rounded transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteSharedMutation.isPending ? 'Removing...' : 'Unshare'}
            </button>
          ) : (
            <button
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to leave this shared habit? Your individual progress will be archived, but you can continue tracking this habit on your own.'
                  )
                ) {
                  leaveSharedMutation.mutate()
                }
              }}
              disabled={leaveSharedMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 border border-red-900/50 hover:border-red-800 rounded transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {leaveSharedMutation.isPending ? 'Leaving...' : 'Leave'}
            </button>
          )}

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-neutral-600 rounded transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 rounded transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Stats
          </button>
        </div>
      </div>

      <ShareHabitModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        habit={habit}
      />

      {habit.sharedHabitId && (
        <SharedHabitStats
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
          habit={habit}
          sharedHabitId={habit.sharedHabitId}
        />
      )}
    </div>
  )
}
