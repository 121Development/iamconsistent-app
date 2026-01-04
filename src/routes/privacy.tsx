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

          {/* Privacy Policy – iamconsistent.io */}

<section className="mb-8">
  <h1 className="text-3xl font-bold text-neutral-100 mb-2">Privacy Policy</h1>
  <p className="text-neutral-300 mb-2">Last updated: January 2026</p>
  <p className="text-neutral-300">
    iamconsistent.io (&quot;Service&quot;) is committed to protecting your privacy. This Privacy Policy explains how we
    collect, use, share, and safeguard information when you use our habit tracking application.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">1. Who We Are (Data Controller)</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>
      The Service is provided by <span className="font-semibold">Exsudo AB</span> (VAT No.{" "}
      <span className="font-semibold">556778142101</span>)
    </li>
    <li>Exsudo AB is the data controller for personal data processed under this Privacy Policy</li>
    <li>
      Address: <span className="font-semibold">Laggarebo 2, 57892 Aneby, Sweden</span>
    </li>
    <li>
      Contact: <span className="font-semibold">hello@iamconsistent.io</span>
    </li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">2. Information We Collect</h2>

  <h3 className="text-xl font-semibold text-neutral-100 mb-2">A) Account Information</h3>
  <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
    <li>Email address (provided via Clerk authentication)</li>
    <li>Account creation date</li>
    <li>Authentication-related data managed by Clerk (e.g., identifiers needed to sign you in)</li>
  </ul>

  <h3 className="text-xl font-semibold text-neutral-100 mb-2">B) Habit Data (User Content)</h3>
  <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
    <li>Habit names and descriptions you create</li>
    <li>Habit completion entries and dates</li>
    <li>Optional notes you add to entries</li>
    <li>Streak and progress statistics derived from your habit activity</li>
  </ul>

  <h3 className="text-xl font-semibold text-neutral-100 mb-2">C) Payment Information</h3>
  <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
    <li>Payment processing is handled by Stripe</li>
    <li>We do not store credit card numbers or full payment details</li>
    <li>We receive confirmation of payment status (and related records needed for accounting/receipts)</li>
  </ul>

  <h3 className="text-xl font-semibold text-neutral-100 mb-2">D) Technical and Usage Data</h3>
  <ul className="text-neutral-300 list-disc list-inside space-y-2 mb-4">
    <li>Browser type and version</li>
    <li>Device information (high-level)</li>
    <li>IP address (primarily for security and abuse prevention)</li>
    <li>Basic usage patterns and feature interactions (to operate and improve the Service)</li>
  </ul>

  <h3 className="text-xl font-semibold text-neutral-100 mb-2">Cookies</h3>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>We do not use cookies at this time</li>
    <li>If we introduce cookies or similar tracking technologies later, we will update this Privacy Policy and, where required, provide appropriate choices</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">3. How We Use Your Information</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Provide and operate the habit tracking service (including syncing, saving, and displaying your habits)</li>
    <li>Calculate streaks, statistics, and progress</li>
    <li>Authenticate you and secure accounts</li>
    <li>Process payments and manage access to paid features (if applicable)</li>
    <li>Send essential service communications (e.g., important account or service notices)</li>
    <li>Improve reliability, performance, and user experience</li>
    <li>Prevent fraud, abuse, and ensure security</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">4. Legal Bases for Processing (GDPR/EEA)</h2>
  <p className="text-neutral-300 mb-4">
    If you are in the EEA/UK, we rely on the following legal bases under GDPR. Where we rely on legitimate interests,
    you can object (see “Your Rights” below).
  </p>

  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-neutral-700">
          <th className="py-2 pr-4 text-neutral-100 font-semibold">Purpose</th>
          <th className="py-2 pr-4 text-neutral-100 font-semibold">Example Data</th>
          <th className="py-2 text-neutral-100 font-semibold">Legal Basis</th>
        </tr>
      </thead>
      <tbody className="text-neutral-300">
        <tr className="border-b border-neutral-800">
          <td className="py-2 pr-4">Provide the Service and core features</td>
          <td className="py-2 pr-4">Account info, habit data</td>
          <td className="py-2">Contract (performance of a contract)</td>
        </tr>
        <tr className="border-b border-neutral-800">
          <td className="py-2 pr-4">Authentication and account security</td>
          <td className="py-2 pr-4">Account info, technical data</td>
          <td className="py-2">Legitimate interests (keeping the Service secure) and/or Contract</td>
        </tr>
        <tr className="border-b border-neutral-800">
          <td className="py-2 pr-4">Payments and access management</td>
          <td className="py-2 pr-4">Payment status, account info</td>
          <td className="py-2">Contract and/or Legal obligation (accounting/tax recordkeeping where required)</td>
        </tr>
        <tr className="border-b border-neutral-800">
          <td className="py-2 pr-4">Essential service communications</td>
          <td className="py-2 pr-4">Email address</td>
          <td className="py-2">Contract and/or Legitimate interests (service operation)</td>
        </tr>
        <tr className="border-b border-neutral-800">
          <td className="py-2 pr-4">Fraud prevention, abuse detection, security monitoring</td>
          <td className="py-2 pr-4">IP address, technical data</td>
          <td className="py-2">Legitimate interests (protecting users and the Service)</td>
        </tr>
        <tr>
          <td className="py-2 pr-4">Product improvement and debugging</td>
          <td className="py-2 pr-4">Usage patterns, technical data</td>
          <td className="py-2">Legitimate interests (improving reliability and UX)</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">5. How We Share Information</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>We do not sell your personal data</li>
    <li>
      We share information only as needed to operate the Service, including with service providers that act as data
      processors on our behalf, such as Clerk (authentication), Stripe (payments), and Cloudflare (hosting and database)
    </li>
    <li>We may also share information if required to comply with law, enforce our terms, or protect rights and safety</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">6. International Data Transfers</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Some service providers may process data outside the EU/EEA</li>
    <li>Where required, we use appropriate safeguards for international transfers (such as Standard Contractual Clauses) and other lawful transfer mechanisms</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">7. Data Storage and Security</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Your data is stored on Cloudflare’s infrastructure, including a D1 database</li>
    <li>Data is encrypted in transit using HTTPS</li>
    <li>Authentication is handled by Clerk and payment processing by Stripe</li>
    <li>We use reasonable, industry-standard security measures designed to protect your data</li>
    <li>No method of transmission or storage is 100% secure, but we work to reduce risk and improve safeguards over time</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">8. Data Retention</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Habit data is retained for as long as your account is active</li>
    <li>Cloudflare logs are retained for the lifetime of the hosting account (primarily for security, reliability, and troubleshooting)</li>
    <li>
      When you delete your account, we delete or anonymize your personal data within 30 days, except where we must retain
      certain information for legal, tax, accounting, or security purposes
    </li>
    <li>Deleted data may persist in backups for a limited period before being fully overwritten/removed as part of normal backup cycling</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">9. Your Rights</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Access your personal data</li>
    <li>Correct inaccurate data</li>
    <li>Delete your account and associated data</li>
    <li>Export your data (data portability, where applicable)</li>
    <li>Restrict processing in certain circumstances</li>
    <li>Object to processing based on legitimate interests</li>
    <li>Lodge a complaint with your supervisory authority</li>
    <li>
      To exercise these rights, contact: <span className="font-semibold">hello@iamconsistent.io</span> (we may need to verify your identity)
    </li>
    <li>If you are in Sweden, you can lodge a complaint with IMY (Integritetsskyddsmyndigheten); if you are elsewhere in the EEA/UK, you can contact your local authority</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">10. Changes to This Policy</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>We may update this Privacy Policy from time to time</li>
    <li>We will post the updated version on this page and update the “Last updated” date</li>
    <li>If changes are material, we will take reasonable steps to notify you</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">11. Contact</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>
      For privacy-related questions or requests, contact:{" "}
      <span className="font-semibold">hello@iamconsistent.io</span>
    </li>
  </ul>
</section>

        </div>
      </div>

      <Footer />
    </div>
  )
}
