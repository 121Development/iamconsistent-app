import { Trophy, Flame, Award, Calendar, Target, Rocket, TrendingUp } from 'lucide-react'
import type { Habit, Entry } from '../lib/db'
import { calculateHabitStats } from '../lib/stats'
import { getHabitColor } from '../lib/colors'

interface HabitMilestonesProps {
  habits: Habit[]
  entriesMap: Record<string, Entry[]>
}

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 100, 365]
const TOTAL_MILESTONES = [10, 25, 50, 100, 250, 500, 1000]

export default function HabitMilestones({ habits, entriesMap }: HabitMilestonesProps) {
  if (habits.length === 0) return null

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-6 mt-6">
      <h2 className="text-lg font-bold text-neutral-100 mb-4">Milestones & Achievements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => {
          const entries = entriesMap[habit.id] || []
          const stats = calculateHabitStats(habit, entries)
          const colors = getHabitColor(habit.color)

          return (
            <div key={habit.id} className="border border-neutral-800 bg-neutral-900 rounded p-4">
              {/* Habit header */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-neutral-800">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-lg border"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  {habit.icon}
                </div>
                <span className="text-sm font-semibold text-neutral-100">{habit.name}</span>
              </div>

              {/* Milestones */}
              <div className="flex flex-wrap gap-2">
                {/* Current Streak */}
                {stats.currentStreak > 0 && (
                  <MilestoneBadge
                    icon={<Flame className="w-3 h-3" />}
                    label={`${stats.currentStreak}d streak`}
                    variant={stats.currentStreak >= 7 ? 'orange' : 'gray'}
                  />
                )}

                {/* Longest Streak */}
                {stats.longestStreak > 0 && (
                  <MilestoneBadge
                    icon={<Trophy className="w-3 h-3" />}
                    label={`${stats.longestStreak}d record`}
                    variant={stats.currentStreak === stats.longestStreak ? 'gold' : 'gray'}
                  />
                )}

                {/* Streak Milestones Achieved */}
                {STREAK_MILESTONES.filter(m => stats.longestStreak >= m).map(milestone => (
                  <MilestoneBadge
                    key={`streak-${milestone}`}
                    icon={<Flame className="w-3 h-3" />}
                    label={`${milestone}d`}
                    variant="orange"
                    size="sm"
                  />
                ))}

                {/* Total Completions Milestones */}
                {TOTAL_MILESTONES.filter(m => stats.totalCompletions >= m).map(milestone => (
                  <MilestoneBadge
                    key={`total-${milestone}`}
                    icon={<Award className="w-3 h-3" />}
                    label={`${milestone}`}
                    variant="blue"
                    size="sm"
                  />
                ))}

                {/* Perfect Week (simple habits only) */}
                {!habit.targetCount && stats.completionsThisWeek === 7 && (
                  <MilestoneBadge
                    icon={<Calendar className="w-3 h-3" />}
                    label="Perfect week"
                    variant="green"
                  />
                )}

                {/* Target Status (target habits only) */}
                {habit.targetCount && (
                  <>
                    {stats.completionsThisPeriod >= habit.targetCount && (
                      <MilestoneBadge
                        icon={<Target className="w-3 h-3" />}
                        label={`${stats.completionsThisPeriod}/${habit.targetCount}`}
                        variant="green"
                      />
                    )}
                    {stats.completionsThisPeriod > habit.targetCount && (
                      <MilestoneBadge
                        icon={<Rocket className="w-3 h-3" />}
                        label={`${stats.completionsThisPeriod}/${habit.targetCount}`}
                        variant="purple"
                      />
                    )}
                  </>
                )}

                {/* Completion Rate */}
                {stats.completionRate > 0 && (
                  <MilestoneBadge
                    icon={<TrendingUp className="w-3 h-3" />}
                    label={`${stats.completionRate}%`}
                    variant={stats.completionRate >= 80 ? 'green' : 'gray'}
                    size="sm"
                  />
                )}

                {/* Total Completions */}
                <MilestoneBadge
                  icon={<Award className="w-3 h-3" />}
                  label={`${stats.totalCompletions} total`}
                  variant="gray"
                  size="sm"
                />

                {/* No milestones message */}
                {stats.totalCompletions === 0 && (
                  <span className="text-xs text-neutral-500 italic">No entries yet</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Milestone badge component
interface MilestoneBadgeProps {
  icon: React.ReactNode
  label: string
  variant: 'gold' | 'orange' | 'blue' | 'green' | 'purple' | 'gray'
  size?: 'sm' | 'md'
}

function MilestoneBadge({ icon, label, variant, size = 'md' }: MilestoneBadgeProps) {
  const variantClasses = {
    gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    gray: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium border whitespace-nowrap ${variantClasses[variant]} ${sizeClasses}`}
    >
      {icon}
      {label}
    </span>
  )
}
