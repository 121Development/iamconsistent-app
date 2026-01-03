import { Link } from '@tanstack/react-router'
import { SignedIn, UserButton } from '@clerk/tanstack-react-start'
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

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
