import { useState } from 'react'
import { X, Trash2, Edit2, Check } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Entry } from '../lib/db'
import { useDeleteEntry, useUpdateEntry } from '../hooks/useEntries'
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState<string>('')

  const deleteEntryMutation = useDeleteEntry()
  const updateEntryMutation = useUpdateEntry()

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

  const handleEditClick = (entry: Entry) => {
    setEditingId(entry.id)
    setEditNote(entry.note || '')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditNote('')
  }

  const handleSaveEdit = (entryId: string) => {
    updateEntryMutation.mutate(
      {
        id: entryId,
        note: editNote.trim() || null,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditNote('')
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Edit Entries</h2>
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
          <p className="text-sm text-neutral-500 text-center py-8">No entries yet</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedDates.map((date) => {
              const dateEntries = entriesByDate[date]
              return (
                <div key={date} className="space-y-1">
                  {dateEntries.map((entry, index) => {
                    const isEditing = editingId === entry.id
                    return (
                      <div
                        key={entry.id}
                        className="bg-neutral-950 border border-neutral-800 rounded px-3 py-2 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm text-neutral-300">
                              {format(parseISO(date), 'MMM d, yyyy')}
                            </span>
                            {dateEntries.length > 1 && (
                              <span className="text-xs text-neutral-500">
                                (entry {index + 1} of {dateEntries.length})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(entry)}
                              disabled={isEditing || updateEntryMutation.isPending}
                              className="w-8 h-8 rounded bg-transparent hover:bg-neutral-800 disabled:bg-transparent disabled:text-neutral-700 text-neutral-500 hover:text-blue-400 flex items-center justify-center transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id, date)}
                              disabled={deletingId === entry.id || isEditing}
                              className="w-8 h-8 rounded bg-transparent hover:bg-neutral-800 disabled:bg-transparent disabled:text-neutral-700 text-neutral-500 hover:text-red-400 flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Show note if exists and not editing */}
                        {!isEditing && entry.note && (
                          <div className="mt-2 text-xs text-neutral-400 pl-1 whitespace-pre-wrap">
                            {entry.note}
                          </div>
                        )}

                        {/* Edit mode */}
                        {isEditing && (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              placeholder="Add or edit note..."
                              rows={3}
                              maxLength={500}
                              autoFocus
                              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                              style={{ whiteSpace: 'pre-wrap' }}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-500">
                                {editNote.length}/500
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={updateEntryMutation.isPending}
                                  className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded transition-colors disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(entry.id)}
                                  disabled={updateEntryMutation.isPending}
                                  className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                  <Check className="h-3 w-3" />
                                  {updateEntryMutation.isPending ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
