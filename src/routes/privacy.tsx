import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="prose prose-invert prose-neutral max-w-none">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Privacy Policy</h1>
          <p className="text-sm text-neutral-500 mb-8">Last updated: January 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Introduction</h2>
            <p className="text-neutral-300 leading-relaxed">
              iamconsistent.io ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our habit tracking application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Account Information</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
              <li>Email address (provided via Clerk authentication)</li>
              <li>Account creation date</li>
              <li>Authentication data managed by Clerk</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Habit Data</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
              <li>Habit names and descriptions you create</li>
              <li>Habit completion entries and dates</li>
              <li>Optional notes you add to entries</li>
              <li>Streak and progress statistics</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Payment Information</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
              <li>Payment processing is handled by Stripe</li>
              <li>We do not store credit card numbers or payment details</li>
              <li>We receive confirmation of payment status only</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Technical Data</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address (for security purposes)</li>
              <li>Usage patterns and feature interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">How We Use Your Information</h2>
            <p className="text-neutral-300 mb-3">We use your information to:</p>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Provide and maintain the habit tracking service</li>
              <li>Calculate streaks, statistics, and progress</li>
              <li>Process payments for lifetime access</li>
              <li>Send essential service communications</li>
              <li>Improve our application and user experience</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Data Storage and Security</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Your data is stored on Cloudflare's infrastructure (D1 database)</li>
              <li>All data is encrypted in transit using HTTPS</li>
              <li>Authentication is handled securely by Clerk</li>
              <li>Payment processing is handled securely by Stripe</li>
              <li>We implement industry-standard security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Data Retention</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Your habit data is retained as long as your account is active</li>
              <li>Upon account deletion, your data is permanently removed within 30 days</li>
              <li>Payment records are retained as required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Third-Party Services</h2>
            <p className="text-neutral-300 mb-4">We use the following third-party services:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-neutral-800">
                <thead className="bg-neutral-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-neutral-100">Service</th>
                    <th className="px-4 py-2 text-left text-neutral-100">Purpose</th>
                    <th className="px-4 py-2 text-left text-neutral-100">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-t border-neutral-800">
                    <td className="px-4 py-2">Clerk</td>
                    <td className="px-4 py-2">Authentication</td>
                    <td className="px-4 py-2">
                      <a href="https://clerk.com/legal/privacy" className="text-emerald-400 hover:text-emerald-300" target="_blank" rel="noopener noreferrer">
                        clerk.com/legal/privacy
                      </a>
                    </td>
                  </tr>
                  <tr className="border-t border-neutral-800">
                    <td className="px-4 py-2">Stripe</td>
                    <td className="px-4 py-2">Payment processing</td>
                    <td className="px-4 py-2">
                      <a href="https://stripe.com/privacy" className="text-emerald-400 hover:text-emerald-300" target="_blank" rel="noopener noreferrer">
                        stripe.com/privacy
                      </a>
                    </td>
                  </tr>
                  <tr className="border-t border-neutral-800">
                    <td className="px-4 py-2">Cloudflare</td>
                    <td className="px-4 py-2">Hosting and database</td>
                    <td className="px-4 py-2">
                      <a href="https://cloudflare.com/privacypolicy" className="text-emerald-400 hover:text-emerald-300" target="_blank" rel="noopener noreferrer">
                        cloudflare.com/privacypolicy
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Your Rights</h2>
            <p className="text-neutral-300 mb-3">You have the right to:</p>
            <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Export your habit data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and all associated data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-neutral-300">
              To exercise these rights, contact us at{' '}
              <a href="mailto:hello@iamconsistent.io" className="text-emerald-400 hover:text-emerald-300">
                hello@iamconsistent.io
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">GDPR Compliance (EU Users)</h2>
            <p className="text-neutral-300 mb-3">If you are located in the European Union:</p>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>We process data based on legitimate interest and consent</li>
              <li>You have the right to lodge a complaint with your local data protection authority</li>
              <li>Data transfers outside the EU are protected by appropriate safeguards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Children's Privacy</h2>
            <p className="text-neutral-300">
              iamconsistent.io is not intended for children under 13. We do not knowingly collect data from children under 13. If you believe we have collected such data, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Changes to This Policy</h2>
            <p className="text-neutral-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">Contact Us</h2>
            <p className="text-neutral-300">
              For privacy-related questions or concerns, email us at{' '}
              <a href="mailto:hello@iamconsistent.io" className="text-emerald-400 hover:text-emerald-300">
                hello@iamconsistent.io
              </a>.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
