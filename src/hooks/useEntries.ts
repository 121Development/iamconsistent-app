import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query'
import { getEntries, createEntry, deleteEntry } from '../server/entries'
import { queryKeys } from '../lib/queryKeys'
import { toast } from 'sonner'
import { calculateHabitStats } from '../lib/stats'
import { checkCelebrations } from '../lib/celebrations'
import type { Entry, Habit } from '../lib/db'

// Fetch entries for a habit
export function useEntries(habitId: string, options?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: queryKeys.entries.byHabitAndDate(habitId, options?.startDate, options?.endDate),
    queryFn: () =>
      getEntries({
        data: {
          habitId,
          ...options,
        },
      }),
    enabled: !!habitId, // Only run if habitId exists
  })
}

// Fetch entries for multiple habits
export function useMultipleHabitEntries(habitIds: string[]) {
  return useQueries({
    queries: habitIds.map((habitId) => ({
      queryKey: queryKeys.entries.byHabit(habitId),
      queryFn: () => getEntries({ data: { habitId } }),
    })),
  })
}

// Create entry mutation
export function useCreateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Parameters<typeof createEntry>[0]['data']) => {
      // Get previous entries and habit data before mutation
      const previousEntries = queryClient.getQueryData<Entry[]>(
        queryKeys.entries.byHabit(data.habitId)
      ) || []

      const habit = queryClient.getQueriesData<Habit[]>({
        queryKey: queryKeys.habits.all
      })[0]?.[1]?.find(h => h.id === data.habitId)

      // Create the entry
      const result = await createEntry({ data })

      return { result, previousEntries, habit }
    },
    onSuccess: async (data, variables) => {
      const { previousEntries, habit } = data

      // Invalidate and refetch entries for this specific habit
      await queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byHabit(variables.habitId),
      })

      // Get new entries after refetch
      const newEntries = queryClient.getQueryData<Entry[]>(
        queryKeys.entries.byHabit(variables.habitId)
      ) || []

      // Check for celebrations if we have all necessary data
      if (habit && previousEntries && newEntries) {
        const previousStats = calculateHabitStats(habit, previousEntries)
        const newStats = calculateHabitStats(habit, newEntries)
        const celebrations = checkCelebrations(habit, previousStats, newStats)

        // Show celebration toast (only the most important one)
        if (celebrations.length > 0) {
          // Priority order: new_longest_streak > streak_milestone > total_milestone > perfect_week > overachiever > target_hit > comeback
          const priority: Record<string, number> = {
            new_longest_streak: 1,
            streak_milestone: 2,
            total_milestone: 3,
            perfect_week: 4,
            overachiever: 5,
            target_hit: 6,
            comeback: 7,
          }

          // Sort by priority and show only the most important
          const topCelebration = celebrations.sort(
            (a, b) => priority[a.type] - priority[b.type]
          )[0]

          toast.success(`${topCelebration.emoji} ${topCelebration.title}`, {
            description: topCelebration.description,
            duration: 4000,
          })
        } else {
          // Show default success toast if no celebrations
          toast.success('Entry logged!')
        }
      } else {
        toast.success('Entry logged!')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to log entry')
    },
  })
}

// Delete entry mutation
export function useDeleteEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (entryId: string) =>
      deleteEntry({ data: { id: entryId } }),
    onSuccess: () => {
      // Invalidate all entries queries to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all })
      toast.success('Entry removed!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete entry')
    },
  })
}
