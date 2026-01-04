import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
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
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Terms of Service</h1>
          <p className="text-sm text-neutral-500 mb-8">Last updated: January 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-300">
              By accessing or using iamconsistent.io ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">2. Description of Service</h2>
            <p className="text-neutral-300 mb-3">iamconsistent.io is a habit tracking application that allows you to:</p>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Create and track daily habits</li>
              <li>Set target-based habit goals</li>
              <li>View streaks, statistics, and progress</li>
              <li>Log habit completions with optional notes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">3. Account Registration</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must be at least 13 years old to use the Service</li>
              <li>One account per person</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">4. Free Trial and Payment</h2>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Trial Period</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
              <li>New accounts receive a 10-day free trial</li>
              <li>During the trial, you may create up to 3 habits</li>
              <li>Full functionality is available during the trial</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Lifetime Access</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
              <li>After the trial, continued access requires a one-time payment of $10 USD</li>
              <li>Payment grants lifetime access to all features</li>
              <li>Lifetime access includes unlimited habits</li>
              <li>Payments are non-refundable except as required by law</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-200 mb-3">Payment Processing</h3>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Payments are processed securely by Stripe</li>
              <li>We do not store your payment card details</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">5. Acceptable Use</h2>
            <p className="text-neutral-300 mb-3">You agree not to:</p>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Share your account with others</li>
              <li>Use automated tools to access the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">6. Intellectual Property</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>The Service, including its design, features, and content, is owned by iamconsistent.io</li>
              <li>Your habit data belongs to you</li>
              <li>You grant us a limited license to process your data to provide the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">7. Data and Privacy</h2>
            <p className="text-neutral-300">
              Your use of the Service is also governed by our{' '}
              <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">
                Privacy Policy
              </Link>
              . By using the Service, you consent to the collection and use of data as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">8. Service Availability</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>We strive to maintain high availability but do not guarantee uninterrupted service</li>
              <li>We may perform maintenance that temporarily affects availability</li>
              <li>We reserve the right to modify or discontinue features with reasonable notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-neutral-300 uppercase">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">10. Limitation of Liability</h2>
            <p className="text-neutral-300 uppercase mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR DATA, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-neutral-300 uppercase">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE ($10 USD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">11. Indemnification</h2>
            <p className="text-neutral-300">
              You agree to indemnify and hold harmless iamconsistent.io and its operators from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">12. Termination</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-2">
              <li>You may delete your account at any time</li>
              <li>We may terminate or suspend your account for violation of these Terms</li>
              <li>Upon termination, your data will be deleted in accordance with our Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">13. Changes to Terms</h2>
            <p className="text-neutral-300">
              We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">14. Governing Law</h2>
            <p className="text-neutral-300">
              These Terms are governed by the laws of Sweden. Any disputes shall be resolved in the courts of Sweden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">15. Contact</h2>
            <p className="text-neutral-300">
              For questions about these Terms, email us at{' '}
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
