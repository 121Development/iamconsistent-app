// Color mapping for habit colors
export const habitColors = {
  emerald: {
    bg: '#022c22',
    border: '#065f46',
  },
  blue: {
    bg: '#172554',
    border: '#1e40af',
  },
  purple: {
    bg: '#2e1065',
    border: '#6b21a8',
  },
  orange: {
    bg: '#431407',
    border: '#c2410c',
  },
  pink: {
    bg: '#500724',
    border: '#be185d',
  },
  cyan: {
    bg: '#083344',
    border: '#0e7490',
  },
} as const

export type HabitColor = keyof typeof habitColors

export function getHabitColor(color: string) {
  return habitColors[color as HabitColor] || habitColors.emerald
}
