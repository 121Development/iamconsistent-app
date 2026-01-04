export const queryKeys = {
  habits: {
    all: ['habits'] as const,
    detail: (id: string) => ['habits', id] as const,
  },
  entries: {
    all: ['entries'] as const,
    byHabit: (habitId: string) => ['entries', 'habit', habitId] as const,
    byHabitAndDate: (habitId: string, startDate?: string, endDate?: string) =>
      ['entries', 'habit', habitId, { startDate, endDate }] as const,
  },
}
