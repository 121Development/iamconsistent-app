import { useState } from 'react'
import { X, Minus } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Entry } from '../lib/db'
import { useDeleteEntry } from '../hooks/useEntries'
import { toast } from 'sonner'

interface RemoveEntryModalProps {
  isOpen: boolean
  onClose: () => void
  habitName: string
  entries: Entry[]
}

export default function RemoveEntryModal({
  isOpen,
  onClose,
  habitName,
  entries,
}: RemoveEntryModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteEntryMutation = useDeleteEntry()

  if (!isOpen) return null

  // Group entries by date and count them
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = []
    }
    acc[entry.date].push(entry)
    return acc
  }, {} as Record<string, Entry[]>)

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => b.localeCompare(a))

  const handleDelete = (entryId: string, date: string) => {
    setDeletingId(entryId)
    deleteEntryMutation.mutate(entryId, {
      onSuccess: () => {
        toast.success(`Entry removed for ${date}`)
        setDeletingId(null)
      },
      onError: () => {
        setDeletingId(null)
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Remove Entries</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-neutral-300">{habitName}</p>
        </div>

        {sortedDates.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-8">No entries to remove</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedDates.map((date) => {
              const dateEntries = entriesByDate[date]
              return (
                <div key={date} className="space-y-1">
                  {dateEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded px-3 py-2 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-300">
                          {format(parseISO(date), 'MMM d, yyyy')}
                        </span>
                        {dateEntries.length > 1 && (
                          <span className="text-xs text-neutral-500">
                            (entry {index + 1} of {dateEntries.length})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id, date)}
                        disabled={deletingId === entry.id}
                        className="w-8 h-8 rounded bg-transparent hover:bg-neutral-800 disabled:bg-transparent disabled:text-neutral-700 text-neutral-500 hover:text-neutral-300 flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-2.5 px-4 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
