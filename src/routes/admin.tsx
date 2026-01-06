import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Users, Target, CheckSquare, TrendingUp } from 'lucide-react'
import { isAdmin, getAdminStats, getAdminTrends } from '../server/admin'
import Footer from '../components/Footer'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const navigate = useNavigate()

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
                />
                <StatCard
                  icon={<Target className="h-6 w-6" />}
                  label="Total Habits"
                  value={stats?.totalHabits || 0}
                  color="emerald"
                />
                <StatCard
                  icon={<CheckSquare className="h-6 w-6" />}
                  label="Total Entries"
                  value={stats?.totalEntries || 0}
                  color="purple"
                />
              </div>

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
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>{icon}</div>
        <div>
          <div className="text-sm text-neutral-500 mb-1">{label}</div>
          <div className="text-3xl font-bold text-neutral-100">{value.toLocaleString()}</div>
        </div>
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
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-600 pr-2">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full flex items-end gap-1">
          {data.map((point, index) => {
            const height = maxValue > 0 ? (point.count / maxValue) * 100 : 0
            const date = new Date(point.date)
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`

            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full h-full flex items-end">
                  {/* Bar */}
                  <div
                    className="w-full rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      backgroundColor: color,
                      minHeight: point.count > 0 ? '2px' : '0',
                    }}
                  />

                  {/* Tooltip */}
                  {point.count > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-100 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      {formattedDate}: {point.count}
                    </div>
                  )}
                </div>

                {/* X-axis label (show every 5th day) */}
                {index % 5 === 0 && (
                  <div className="mt-2 text-[10px] text-neutral-600">{formattedDate}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
