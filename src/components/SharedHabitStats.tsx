import { X, Trophy, Flame, TrendingUp, Users, Target } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getSharedHabitLeaderboard, getSharedHabitMembers } from '../server/shared-habits'
import type { Habit } from '../lib/db'

interface SharedHabitStatsProps {
  isOpen: boolean
  onClose: () => void
  habit: Habit
  sharedHabitId: string
}

export default function SharedHabitStats({
  isOpen,
  onClose,
  habit,
  sharedHabitId,
}: SharedHabitStatsProps) {
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['shared-habit-leaderboard', sharedHabitId],
    queryFn: () => getSharedHabitLeaderboard({ data: { sharedHabitId } }),
    enabled: isOpen,
  })

  const { data: members } = useQuery({
    queryKey: ['shared-habit-members', sharedHabitId],
    queryFn: () => getSharedHabitMembers({ data: { sharedHabitId } }),
    enabled: isOpen,
  })

  if (!isOpen) return null

  // Calculate group metrics
  const totalMembers = leaderboard?.length || 0
  const activeMembers = leaderboard?.filter((m) => m.currentStreak > 0).length || 0
  const avgStreak =
    totalMembers > 0
      ? Math.round(
          leaderboard!.reduce((sum, m) => sum + m.currentStreak, 0) / totalMembers
        )
      : 0
  const avgCompletionRate =
    totalMembers > 0
      ? Math.round(
          leaderboard!.reduce((sum, m) => sum + m.completionRate, 0) / totalMembers
        )
      : 0
  const topStreak = leaderboard?.[0]?.currentStreak || 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            {habit.name} - Group Stats
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {leaderboardLoading ? (
          <div className="text-center py-12">
            <div className="text-neutral-500">Loading stats...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Group Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-3">
                Group Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
                  <div className="text-neutral-400 text-xs mb-1">Total Members</div>
                  <div className="text-2xl font-bold text-neutral-100">{totalMembers}</div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
                  <div className="text-neutral-400 text-xs mb-1">Active Today</div>
                  <div className="text-2xl font-bold text-emerald-400">{activeMembers}</div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
                  <div className="text-neutral-400 text-xs mb-1">Avg Streak</div>
                  <div className="text-2xl font-bold text-orange-400">{avgStreak}</div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
                  <div className="text-neutral-400 text-xs mb-1">Top Streak</div>
                  <div className="text-2xl font-bold text-yellow-400">{topStreak}</div>
                </div>
              </div>
            </div>

            {/* Participation Rate */}
            <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-300">Group Completion Rate (30d)</span>
                <span className="text-lg font-bold text-neutral-100">
                  {avgCompletionRate}%
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 rounded-full h-2 transition-all"
                  style={{ width: `${avgCompletionRate}%` }}
                />
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                Leaderboard
              </h3>
              <div className="space-y-2">
                {leaderboard?.map((member, index) => (
                  <div
                    key={member.userId}
                    className={`flex items-center justify-between p-4 rounded border transition-colors ${
                      index === 0
                        ? 'bg-yellow-500/5 border-yellow-500/20'
                        : index === 1
                        ? 'bg-gray-500/5 border-gray-500/20'
                        : index === 2
                        ? 'bg-orange-800/5 border-orange-800/20'
                        : 'bg-neutral-800 border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : index === 1
                            ? 'bg-gray-500/20 text-gray-400'
                            : index === 2
                            ? 'bg-orange-800/20 text-orange-400'
                            : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* User info */}
                      <div>
                        <div className="text-sm font-medium text-neutral-100">
                          {member.name || member.email}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {member.totalEntries} total entries
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-orange-400">
                          <Flame className="h-3 w-3" />
                          <span className="text-sm font-bold">{member.currentStreak}</span>
                        </div>
                        <div className="text-xs text-neutral-500">streak</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-sm font-bold">{member.completionRate}%</span>
                        </div>
                        <div className="text-xs text-neutral-500">rate</div>
                      </div>
                    </div>
                  </div>
                ))}

                {(!leaderboard || leaderboard.length === 0) && (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    No activity yet. Be the first to log an entry!
                  </div>
                )}
              </div>
            </div>

            {/* Motivation message */}
            {totalMembers > 1 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-4">
                <p className="text-sm text-emerald-400">
                  {activeMembers === totalMembers
                    ? '🎉 Everyone is tracking today! Keep the momentum going!'
                    : activeMembers > totalMembers / 2
                    ? '💪 More than half the group is active! Great work!'
                    : '👀 Your teammates are counting on you. Log today!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
