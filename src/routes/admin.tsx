import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Users, Target, CheckSquare, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { isAdmin, getAdminStats, getAdminTrends, getAdminUsers, getAdminHabits } from '../server/admin'
import Footer from '../components/Footer'
import { format } from 'date-fns'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const navigate = useNavigate()
  const [expandedCard, setExpandedCard] = useState<'users' | 'habits' | null>(null)

  // Check if user is admin
  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery({
    queryKey: ['admin-check'],
    queryFn: () => isAdmin(),
    retry: false,
  })

  // Redirect if not admin
  useEffect(() => {
    if (!adminCheckLoading && !adminCheck?.isAdmin) {
      navigate({ to: '/myhabits' })
    }
  }, [adminCheck, adminCheckLoading, navigate])

  // Get stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getAdminStats(),
    enabled: adminCheck?.isAdmin === true,
  })

  // Get trends
  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['admin-trends'],
    queryFn: () => getAdminTrends(),
    enabled: adminCheck?.isAdmin === true,
  })

  // Get users list (only when expanded)
  const { data: usersList, isLoading: usersListLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => getAdminUsers(),
    enabled: adminCheck?.isAdmin === true && expandedCard === 'users',
  })

  // Get habits list (only when expanded)
  const { data: habitsList, isLoading: habitsListLoading } = useQuery({
    queryKey: ['admin-habits-list'],
    queryFn: () => getAdminHabits(),
    enabled: adminCheck?.isAdmin === true && expandedCard === 'habits',
  })

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-500">Checking permissions...</div>
      </div>
    )
  }

  if (!adminCheck?.isAdmin) {
    return null // Will redirect
  }

  const isLoading = statsLoading || trendsLoading

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-100 mb-2">Admin Dashboard</h1>
            <p className="text-neutral-500">Platform statistics and trends</p>
          </div>

          {isLoading ? (
            <div className="text-neutral-500">Loading stats...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  icon={<Users className="h-6 w-6" />}
                  label="Total Users"
                  value={stats?.totalUsers || 0}
                  color="blue"
                  isExpandable
                  isExpanded={expandedCard === 'users'}
                  onToggle={() => setExpandedCard(expandedCard === 'users' ? null : 'users')}
                />
                <StatCard
                  icon={<Target className="h-6 w-6" />}
                  label="Total Habits"
                  value={stats?.totalHabits || 0}
                  color="emerald"
                  isExpandable
                  isExpanded={expandedCard === 'habits'}
                  onToggle={() => setExpandedCard(expandedCard === 'habits' ? null : 'habits')}
                />
                <StatCard
                  icon={<CheckSquare className="h-6 w-6" />}
                  label="Total Entries"
                  value={stats?.totalEntries || 0}
                  color="purple"
                />
              </div>

              {/* Expanded Lists */}
              {expandedCard === 'users' && (
                <div className="mb-8">
                  <UsersList users={usersList || []} isLoading={usersListLoading} />
                </div>
              )}

              {expandedCard === 'habits' && (
                <div className="mb-8">
                  <HabitsList habits={habitsList || []} isLoading={habitsListLoading} />
                </div>
              )}

              {/* Trend Charts */}
              <div className="space-y-6">
                <TrendChart
                  title="User Signups (Last 30 Days)"
                  data={trends?.users || []}
                  color="rgb(59, 130, 246)"
                />
                <TrendChart
                  title="Habits Created (Last 30 Days)"
                  data={trends?.habits || []}
                  color="rgb(16, 185, 129)"
                />
                <TrendChart
                  title="Entries Logged (Last 30 Days)"
                  data={trends?.entries || []}
                  color="rgb(168, 85, 247)"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: 'blue' | 'emerald' | 'purple'
  isExpandable?: boolean
  isExpanded?: boolean
  onToggle?: () => void
}

function StatCard({ icon, label, value, color, isExpandable, isExpanded, onToggle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  const Component = isExpandable ? 'button' : 'div'

  return (
    <Component
      onClick={isExpandable ? onToggle : undefined}
      className={`border border-neutral-800 bg-neutral-900/50 rounded-lg p-6 ${
        isExpandable ? 'cursor-pointer hover:border-neutral-700 transition-colors' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-neutral-500 mb-1">{label}</div>
          <div className="text-3xl font-bold text-neutral-100">{value.toLocaleString()}</div>
        </div>
        {isExpandable && (
          <div className="text-neutral-500">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        )}
      </div>
    </Component>
  )
}

interface UsersListProps {
  users: Array<{
    id: string
    email: string
    name: string | null
    subscriptionTier: string
    createdAt: string
  }>
  isLoading: boolean
}

function UsersList({ users, isLoading }: UsersListProps) {
  if (isLoading) {
    return (
      <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-6">
        <div className="text-neutral-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-100">All Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-800/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Subscription
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="px-4 py-3 text-sm text-neutral-100">
                  {user.name || <span className="text-neutral-500 italic">No name</span>}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-300">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      user.subscriptionTier === 'pro'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    {user.subscriptionTier}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-400">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface HabitsListProps {
  habits: Array<{
    id: string
    name: string
    icon: string
    targetCount: number | null
    targetPeriod: string | null
    userId: string
    createdAt: string
  }>
  isLoading: boolean
}

function HabitsList({ habits, isLoading }: HabitsListProps) {
  if (isLoading) {
    return (
      <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-6">
        <div className="text-neutral-500">Loading habits...</div>
      </div>
    )
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-lg font-semibold text-neutral-100">All Habits</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-800/50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Habit
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Target
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {habits.map((habit) => (
              <tr key={habit.id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{habit.icon}</span>
                    <span className="text-sm text-neutral-100">{habit.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-300">
                  {habit.targetCount && habit.targetPeriod ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Target className="w-3 h-3" />
                      {habit.targetCount}x per {habit.targetPeriod}
                    </span>
                  ) : (
                    <span className="text-neutral-500 italic">No target</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-400">
                  {format(new Date(habit.createdAt), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TrendChartProps {
  title: string
  data: Array<{ date: string; count: number }>
  color: string
}

function TrendChart({ title, data, color }: TrendChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-100 mb-1">{title}</h3>
          <p className="text-sm text-neutral-500">
            Total: <span className="text-neutral-300 font-medium">{total.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">30 days</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-neutral-600 pr-2">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-8">
          <div className="h-48 flex items-end gap-1">
            {data.map((point, index) => {
              const height = maxValue > 0 ? (point.count / maxValue) * 100 : 0
              const date = new Date(point.date)
              const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`

              return (
                <div key={index} className="flex-1 group relative" style={{ height: '100%' }}>
                  <div className="h-full flex items-end">
                    {/* Bar */}
                    <div
                      className="w-full rounded-t transition-all hover:opacity-80 relative"
                      style={{
                        height: `${height}%`,
                        backgroundColor: color,
                        minHeight: point.count > 0 ? '2px' : '0',
                      }}
                    >
                      {/* Tooltip */}
                      {point.count > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-100 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {formattedDate}: {point.count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1 mt-2">
            {data.map((point, index) => {
              const date = new Date(point.date)
              const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
              return (
                <div key={index} className="flex-1 text-center">
                  {index % 5 === 0 && (
                    <span className="text-[10px] text-neutral-600">{formattedDate}</span>
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
