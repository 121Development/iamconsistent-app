import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, UserButton } from '@clerk/tanstack-react-start'
import { Terminal } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:text-emerald-400 transition-colors">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <span className="text-lg font-semibold tracking-tight">$ iamconsistent</span>
          </Link>

          <nav className="flex items-center gap-4">
            <SignedIn>
              <Link
                to="/myhabits"
                className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                My Habits
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  }
                }}
              />
            </SignedIn>

            <SignedOut>
              <Link
                to="/sign-in"
                className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="text-sm bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-medium px-4 py-2 rounded transition-colors"
              >
                Sign Up
              </Link>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  )
}
