import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserButton, useAuth } from '@clerk/tanstack-react-start'
import { LogOut, Trash2, Mail } from 'lucide-react'
import { getUserSettings, updateEmailNotifications, deleteUserAccount } from '../server/user'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

export default function SettingsPanel() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const queryClient = useQueryClient()

  // Get user settings
  const { data: settings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => getUserSettings(),
  })

  // Update email notifications
  const updateEmailMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      updateEmailNotifications({ data: { enabled } }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] })
      toast.success(
        data.emailNotifications
          ? 'Email notifications enabled'
          : 'Email notifications disabled'
      )
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings')
    },
  })

  // Delete account
  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteUserAccount(),
    onSuccess: async () => {
      toast.success('Account deleted successfully')
      // Sign out and redirect
      await signOut()
      navigate({ to: '/' })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account')
    },
  })

  const handleEmailToggle = () => {
    if (settings) {
      updateEmailMutation.mutate(!settings.emailNotifications)
    }
  }

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
    setIsDeleteModalOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <>
      <div className="border border-neutral-800 bg-neutral-900/50 rounded p-6 mt-6">
        <h2 className="text-lg font-bold text-neutral-100 mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neutral-400" />
              <div>
                <div className="text-sm font-medium text-neutral-100">
                  Allow email sendouts
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Receive progress updates and reminders
                </div>
              </div>
            </div>
            <button
              onClick={handleEmailToggle}
              disabled={updateEmailMutation.isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings?.emailNotifications
                  ? 'bg-emerald-500'
                  : 'bg-neutral-700'
              } ${updateEmailMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings?.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-300">Account</h3>

            {/* User Profile */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                    },
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-neutral-100">
                    Manage profile
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    Update your profile information
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full p-3 rounded bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-neutral-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign out</span>
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-3 w-full p-3 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Delete account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-neutral-100 mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-neutral-400 mb-6">
              Are you sure you want to delete your account? This will permanently
              delete all your habits, entries, and data. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteAccountMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-neutral-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium disabled:opacity-50"
              >
                {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
