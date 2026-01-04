import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHabits, createHabit, updateHabit, deleteHabit } from '../server/habits'
import { queryKeys } from '../lib/queryKeys'
import { toast } from 'sonner'

// Fetch all habits
export function useHabits() {
  return useQuery({
    queryKey: queryKeys.habits.all,
    queryFn: () => getHabits(),
  })
}

// Create habit mutation
export function useCreateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof createHabit>[0]['data']) =>
      createHabit({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
      toast.success('Habit created!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create habit')
    },
  })
}

// Update habit mutation
export function useUpdateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateHabit>[0]['data']) =>
      updateHabit({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
      toast.success('Habit updated!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update habit')
    },
  })
}

// Delete habit mutation
export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (habitId: string) =>
      deleteHabit({ data: { id: habitId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all })
      toast.success('Habit deleted!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete habit')
    },
  })
}
