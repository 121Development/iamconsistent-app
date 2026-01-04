import { useRef, useEffect } from 'react'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to the right on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [habits, entriesMap])

  if (habits.length === 0) return null

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-6 mt-6">
      <h2 className="text-lg font-bold text-neutral-100 mb-4">Milestones & Achievements</h2>

      <div className="flex gap-4">
        {/* Fixed habit names column */}
        <div className="space-y-3 flex-shrink-0">
          {habits.map((habit) => {
            const colors = getHabitColor(habit.color)
            return (
              <div key={habit.id} className="flex items-center gap-2 h-8">
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

        {/* Scrollable milestones */}
        <div ref={scrollContainerRef} className="overflow-x-auto flex-1">
          <div className="space-y-3">
            {habits.map((habit) => {
              const entries = entriesMap[habit.id] || []
              const stats = calculateHabitStats(habit, entries)

              return (
                <div key={habit.id} className="flex gap-2 h-8 items-center">
                  {/* Current Streak */}
                  {stats.currentStreak > 0 && (
                    <MilestoneBadge
                      icon={<Flame className="w-3 h-3" />}
                      label={`${stats.currentStreak} day streak`}
                      variant={stats.currentStreak >= 7 ? 'orange' : 'gray'}
                    />
                  )}

                  {/* Longest Streak */}
                  {stats.longestStreak > 0 && (
                    <MilestoneBadge
                      icon={<Trophy className="w-3 h-3" />}
                      label={`${stats.longestStreak} day record`}
                      variant={stats.currentStreak === stats.longestStreak ? 'gold' : 'gray'}
                    />
                  )}

                  {/* Streak Milestones Achieved */}
                  {STREAK_MILESTONES.filter(m => stats.longestStreak >= m).map(milestone => (
                    <MilestoneBadge
                      key={`streak-${milestone}`}
                      icon={<Flame className="w-3 h-3" />}
                      label={`${milestone} day milestone`}
                      variant="orange"
                      size="sm"
                    />
                  ))}

                  {/* Total Completions Milestones */}
                  {TOTAL_MILESTONES.filter(m => stats.totalCompletions >= m).map(milestone => (
                    <MilestoneBadge
                      key={`total-${milestone}`}
                      icon={<Award className="w-3 h-3" />}
                      label={`${milestone} completions`}
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
                          label={`Target hit (${stats.completionsThisPeriod}/${habit.targetCount})`}
                          variant="green"
                        />
                      )}
                      {stats.completionsThisPeriod > habit.targetCount && (
                        <MilestoneBadge
                          icon={<Rocket className="w-3 h-3" />}
                          label={`Overachiever (${stats.completionsThisPeriod}/${habit.targetCount})`}
                          variant="purple"
                        />
                      )}
                    </>
                  )}

                  {/* Completion Rate */}
                  {stats.completionRate > 0 && (
                    <MilestoneBadge
                      icon={<TrendingUp className="w-3 h-3" />}
                      label={`${stats.completionRate}% (30d)`}
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
              )
            })}
          </div>
        </div>
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
