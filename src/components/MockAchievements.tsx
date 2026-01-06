import { Trophy, Flame, Award, Calendar, Target, Rocket, TrendingUp } from 'lucide-react'
import { getHabitColor } from '../lib/colors'

export default function MockAchievements() {
  const mockHabits = [
    {
      id: '1',
      name: 'Workout',
      icon: '💪',
      color: 'emerald',
      achievements: [
        { icon: <Flame className="w-3 h-3" />, label: '7d streak', variant: 'orange' as const },
        { icon: <Trophy className="w-3 h-3" />, label: '7d record', variant: 'gold' as const },
        { icon: <Flame className="w-3 h-3" />, label: '7d', variant: 'orange' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '25', variant: 'blue' as const, size: 'sm' as const },
        { icon: <TrendingUp className="w-3 h-3" />, label: '85%', variant: 'green' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '28 total', variant: 'gray' as const, size: 'sm' as const },
      ],
    },
    {
      id: '2',
      name: 'Meditate',
      icon: '🧘',
      color: 'purple',
      achievements: [
        { icon: <Flame className="w-3 h-3" />, label: '14d streak', variant: 'orange' as const },
        { icon: <Trophy className="w-3 h-3" />, label: '14d record', variant: 'gold' as const },
        { icon: <Calendar className="w-3 h-3" />, label: 'Perfect week', variant: 'green' as const },
        { icon: <Flame className="w-3 h-3" />, label: '14d', variant: 'orange' as const, size: 'sm' as const },
        { icon: <Flame className="w-3 h-3" />, label: '7d', variant: 'orange' as const, size: 'sm' as const },
        { icon: <Flame className="w-3 h-3" />, label: '3d', variant: 'orange' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '50', variant: 'blue' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '25', variant: 'blue' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '10', variant: 'blue' as const, size: 'sm' as const },
        { icon: <TrendingUp className="w-3 h-3" />, label: '92%', variant: 'green' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '54 total', variant: 'gray' as const, size: 'sm' as const },
      ],
    },
    {
      id: '3',
      name: 'Write',
      icon: '✍️',
      color: 'blue',
      achievements: [
        { icon: <Target className="w-3 h-3" />, label: '3/3', variant: 'green' as const },
        { icon: <Flame className="w-3 h-3" />, label: '5d streak', variant: 'orange' as const },
        { icon: <Trophy className="w-3 h-3" />, label: '5d record', variant: 'gray' as const },
        { icon: <Flame className="w-3 h-3" />, label: '5d', variant: 'orange' as const, size: 'sm' as const },
        { icon: <Flame className="w-3 h-3" />, label: '3d', variant: 'orange' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '10', variant: 'blue' as const, size: 'sm' as const },
        { icon: <TrendingUp className="w-3 h-3" />, label: '67%', variant: 'gray' as const, size: 'sm' as const },
        { icon: <Award className="w-3 h-3" />, label: '15 total', variant: 'gray' as const, size: 'sm' as const },
      ],
    },
  ]

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-6 opacity-90 pointer-events-none">
      <h2 className="text-lg font-bold text-neutral-100 mb-4">Milestones & Achievements</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockHabits.map((habit) => {
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

              {/* Achievement badges */}
              <div className="flex flex-wrap gap-2">
                {habit.achievements.map((achievement, index) => (
                  <MilestoneBadge
                    key={index}
                    icon={achievement.icon}
                    label={achievement.label}
                    variant={achievement.variant}
                    size={achievement.size}
                  />
                ))}
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
