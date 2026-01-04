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

          {/* Terms of Service – iamconsistent.io */}

<section className="mb-8">
  <h1 className="text-3xl font-bold text-neutral-100 mb-2">Terms of Service</h1>
  <p className="text-neutral-300 mb-2">Last updated: January 2026</p>
  <p className="text-neutral-300">
    These Terms of Service (&quot;Terms&quot;) govern your access to and use of iamconsistent.io
    (&quot;the Service&quot;). The Service is provided by <span className="font-semibold">Exsudo AB</span>{" "}
    (VAT No. <span className="font-semibold">556778142101</span>) (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
    Address: <span className="font-semibold">Laggarebo 2, 57892 Aneby, Sweden</span>.
  </p>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">1. Acceptance of Terms</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>By accessing or using the Service, you agree to be bound by these Terms</li>
    <li>If you do not agree, do not use the Service</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">2. Description of the Service</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Create and track daily habits</li>
    <li>Set target-based habit goals</li>
    <li>View streaks, statistics, and progress</li>
    <li>Log habit completions with optional notes</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">3. Account Registration and Security</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>You must provide accurate and complete information when creating an account</li>
    <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account</li>
    <li>One account per person (unless we approve otherwise)</li>
    <li>You must notify us promptly if you suspect unauthorized access</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">4. Free Trial / Beta Access</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>The Service is currently provided in a beta state and is free to use during the beta period</li>
    <li>We currently estimate the Service will be production-ready during February 2026 (this is an estimate and may change)</li>
    <li>Until the Service is production-ready, we may allow broad access without payment</li>
    <li>Once the Service is production-ready, we may introduce paid plans and/or limitations for non-paying accounts</li>
    <li>We will provide reasonable notice in the Service (and/or by email) before introducing material limitations or paid access requirements</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">5. Fees, Payment, and Taxes</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>
      After beta, continued access may require a one-time payment of <span className="font-semibold">$10 USD</span>{" "}
      (&quot;Lifetime Access&quot;)
    </li>
    <li>Lifetime Access unlocks all features and includes unlimited habits while the Service is available</li>
    <li>&quot;Lifetime&quot; means for as long as we operate the Service in substantially the same form</li>
    <li>Payments are processed by Stripe</li>
    <li>We do not store your full payment card details</li>
    <li>Prices are shown in USD; Stripe may display the charge in your local currency based on its rates and fees</li>
    <li>Where applicable, VAT/sales taxes may be added depending on your location and tax rules</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">6. Right of Withdrawal (EEA/UK Consumers) and Refunds</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>If you are a consumer in the EEA/UK, you may have a legal right to withdraw from a distance purchase within 14 days, unless an exception applies</li>
    <li>For digital services, your withdrawal right may be lost once performance begins with your request/acknowledgment, where permitted by law</li>
    <li>By purchasing and accessing paid features immediately, you request immediate performance of the digital service</li>
    <li>Payments are non-refundable except as required by law</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">7. Acceptable Use</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Do not use the Service for any unlawful purpose</li>
    <li>Do not attempt to gain unauthorized access to systems or accounts</li>
    <li>Do not interfere with or disrupt the Service (including probing, scanning, or testing vulnerabilities without permission)</li>
    <li>Do not share, sell, or transfer your account access to others</li>
    <li>Do not use automated tools (bots/scrapers) to access the Service except where explicitly permitted</li>
    <li>Do not reverse engineer, decompile, or attempt to extract source code except to the extent permitted by mandatory law</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">8. Intellectual Property and Your Data</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>The Service (including its software, design, features, and branding) is owned by Exsudo AB and/or its licensors</li>
    <li>Your habit data belongs to you</li>
    <li>You grant us a limited, non-exclusive license to host, process, and display your data only as needed to provide and improve the Service and to keep it secure</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">9. Privacy</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>Our processing of personal data is described in our Privacy Policy</li>
    <li>By using the Service, you acknowledge that you have read and understood the Privacy Policy</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">10. Service Availability and Changes</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>We aim for high availability but do not guarantee uninterrupted access</li>
    <li>We may perform maintenance that temporarily affects availability</li>
    <li>We may modify, add, or remove features</li>
    <li>If a change materially reduces core functionality for paid users, we will provide reasonable notice when practical</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">11. Termination and Account Deletion</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>You may delete your account at any time</li>
    <li>We may suspend or terminate your account if you materially breach these Terms or misuse the Service</li>
    <li>If we terminate your account for breach, you may lose access without refund (except where required by law)</li>
    <li>Upon account deletion/termination, we will delete or anonymize your data in accordance with our Privacy Policy and backup retention practices (some data may persist in backups for a limited period)</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">12. Disclaimer of Warranties</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>The Service is provided “AS IS” and “AS AVAILABLE”</li>
    <li>To the maximum extent permitted by law, we disclaim all warranties, express or implied</li>
    <li>We do not warrant that the Service will be uninterrupted, error-free, or completely secure</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">13. Limitation of Liability</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>To the maximum extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, or data</li>
    <li>Our total liability for any claim arising out of or relating to the Service will not exceed the amount you paid for the Service (e.g., $10 USD)</li>
    <li>Nothing in these Terms limits or excludes liability that cannot be limited or excluded under applicable law (including mandatory consumer rights)</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">14. Indemnification (Business Users)</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>If you use the Service on behalf of a business or organization, you agree to indemnify and hold harmless Exsudo AB and its operators from claims, damages, and expenses arising from your unlawful use of the Service or violation of these Terms</li>
    <li>Consumers are not required to provide indemnities to the extent prohibited or limited by applicable consumer law</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">15. Changes to These Terms</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>We may update these Terms from time to time</li>
    <li>If changes are material, we will provide reasonable notice (e.g., in the app or by email)</li>
    <li>Continued use of the Service after changes become effective constitutes acceptance of the updated Terms</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">16. Governing Law and Disputes</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>These Terms are governed by the laws of Sweden</li>
    <li>If you are a consumer in the EEA/UK, you may also benefit from mandatory consumer protections and may have the right to bring disputes in your country of residence to the extent required by applicable law</li>
  </ul>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold text-neutral-100 mb-4">17. Contact</h2>
  <ul className="text-neutral-300 list-disc list-inside space-y-2">
    <li>For questions about these Terms, email us at hello@iamconsistent.io</li>
  </ul>
</section>

        </div>
      </div>

      <Footer />
    </div>
  )
}
