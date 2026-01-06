import { Trophy, Flame, Target } from 'lucide-react'
import { getHabitColor } from '../lib/colors'

interface MockHabitCardProps {
  icon: string
  name: string
  color: string
  todayCount: number
  statType: 'streak' | 'longest' | 'target'
  statValue: string
}

export default function MockHabitCard({
  icon,
  name,
  color,
  todayCount,
  statType,
  statValue,
}: MockHabitCardProps) {
  const colors = getHabitColor(color)

  const getStatBadge = () => {
    if (statType === 'longest') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          <Trophy className="w-3 h-3" />
          {statValue}
        </span>
      )
    }

    if (statType === 'streak') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Flame className="w-3 h-3" />
          {statValue}
        </span>
      )
    }

    if (statType === 'target') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Target className="w-3 h-3" />
          {statValue}
        </span>
      )
    }

    return null
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 p-5 rounded opacity-90 pointer-events-none">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded flex items-center justify-center text-2xl border flex-shrink-0"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
            }}
          >
            {icon}
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-neutral-100 break-words">
                {name}
              </h3>
            </div>
            <div>{getStatBadge()}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-12 text-center">
            <div className="text-2xl font-bold text-emerald-400">{todayCount}</div>
          </div>
          <div className="w-10 h-10 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
            +
          </div>
        </div>
      </div>
    </div>
  )
}
