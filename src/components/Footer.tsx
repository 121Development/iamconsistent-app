import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Legal Links */}
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <Link
              to="/privacy"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Contact */}
          <div className="text-sm text-neutral-500">
            Contact:{' '}
            <a
              href="mailto:hello@iamconsistent.io"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              hello@iamconsistent.io
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-neutral-600 mt-6">
          © {new Date().getFullYear()} iamconsistent.io. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
