import { useState } from 'react'
import { X } from 'lucide-react'

interface NoteEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: string) => void
  habitName: string
  isLoading: boolean
}

export default function NoteEntryModal({
  isOpen,
  onClose,
  onSave,
  habitName,
  isLoading,
}: NoteEntryModalProps) {
  const [note, setNote] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    onSave(note.trim())
    setNote('')
  }

  const handleDiscard = () => {
    setNote('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Add Note</h2>
          <button
            onClick={handleDiscard}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-neutral-400 mb-4">
          Add a note for <span className="text-neutral-200 font-medium">{habitName}</span>
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Felt great today! Did an extra 10 minutes."
          rows={6}
          maxLength={500}
          autoFocus
          className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          style={{ whiteSpace: 'pre-wrap' }}
        />

        <div className="text-xs text-neutral-500 text-right mt-2 mb-4">
          {note.length}/500 characters
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={isLoading}
            className="flex-1 bg-red-950/50 hover:bg-red-950 border border-red-900/50 hover:border-red-800 text-red-400 hover:text-red-300 font-medium py-2.5 px-4 rounded transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-medium py-2.5 px-4 rounded transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
