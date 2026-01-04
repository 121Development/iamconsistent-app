import { useState } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { createEntry } from '../server/entries'
import { toast } from 'sonner'

interface LogPastDateModalProps {
  isOpen: boolean
  onClose: () => void
  habitId: string
  habitName: string
  onSuccess: () => void
}

export default function LogPastDateModal({
  isOpen,
  onClose,
  habitId,
  habitName,
  onSuccess,
}: LogPastDateModalProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      await createEntry({ data: { habitId, date: selectedDate } })
      toast.success(`Entry logged for ${selectedDate}`)
      onClose()
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to log entry')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Log Past Entry</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              {habitName}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full max-w-[200px] bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-2.5 px-4 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-medium py-2.5 px-4 rounded transition-colors"
            >
              {isLoading ? 'Logging...' : 'Log Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
