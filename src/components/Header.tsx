import { Link } from '@tanstack/react-router'
import { SignedIn, UserButton } from '@clerk/tanstack-react-start'
import { CheckCircle2 } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">iamconsistent</span>
          </Link>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
