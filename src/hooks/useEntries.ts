import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query'
import { getEntries, createEntry, deleteEntry } from '../server/entries'
import { queryKeys } from '../lib/queryKeys'
import { toast } from 'sonner'

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
    mutationFn: (data: Parameters<typeof createEntry>[0]['data']) =>
      createEntry({ data }),
    onSuccess: (_, variables) => {
      // Invalidate entries for this specific habit
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.byHabit(variables.habitId),
      })
      toast.success('Entry logged!')
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
