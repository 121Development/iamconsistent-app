import { getHabitColor } from '../lib/colors'

export default function MockActivityCalendar() {
  // Generate mock data for the last ~12 weeks (84 days)
  const generateMockData = () => {
    const data = []
    for (let i = 0; i < 84; i++) {
      // Create varied activity pattern
      let count = 0
      if (i % 7 !== 6 && i % 7 !== 0) {
        // Weekdays - more activity
        count = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0
      } else {
        // Weekends - less activity
        count = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0
      }
      data.push(count)
    }
    return data
  }

  const mockData = generateMockData()

  // Mock habits
  const mockHabits = [
    { id: '1', name: 'Workout', icon: '💪', color: 'emerald' },
    { id: '2', name: 'Meditate', icon: '🧘', color: 'purple' },
    { id: '3', name: 'Write', icon: '✍️', color: 'blue' },
  ]

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-neutral-900 border-neutral-800'
    if (count === 1) return 'bg-emerald-700/60 border-emerald-600/60'
    if (count === 2) return 'bg-emerald-600/80 border-emerald-500/80'
    return 'bg-emerald-500 border-emerald-400'
  }

  // Show day labels every 14th day
  const getDayLabel = (index: number) => {
    if (index % 14 === 0) {
      return <span className="text-[8px] text-neutral-500">{((index / 7) | 0) * 7}</span>
    }
    return null
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded p-6 opacity-90 pointer-events-none">
      <h2 className="text-lg font-bold text-neutral-100 mb-4">Activity</h2>

      <div className="flex gap-2 md:gap-4">
        {/* Habit icons column */}
        <div className="space-y-4 flex-shrink-0 pt-6 pb-2">
          {mockHabits.map((habit) => {
            const colors = getHabitColor(habit.color)
            return (
              <div key={habit.id} className="flex items-center gap-2 h-3">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-sm border"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                  title={habit.name}
                >
                  {habit.icon}
                </div>
              </div>
            )
          })}
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto flex-1">
          <div>
            {/* Day labels */}
            <div className="flex gap-1 mb-2">
              {mockData.map((_, index) => (
                <div key={index} className="w-3 text-center">
                  {getDayLabel(index)}
                </div>
              ))}
            </div>

            {/* Habit rows */}
            <div className="space-y-4 pb-2">
              {mockHabits.map((habit) => (
                <div key={habit.id} className="flex gap-1 h-3">
                  {mockData.map((count, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 border rounded-sm transition-all ${getColorClass(count)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
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
