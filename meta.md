function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Meta />
        <Links />
        
        {/* Basic meta */}
        <title>iamconsistent.io - Track habits. Stay consistent.</title>
        <meta name="description" content="Track your habits. Add notes or share with friends. Se milestones, streaks and achievements. As web and PWA-app" />
        
        {/* Open Graph */}
        <meta property="og:title" content="iamconsistent.io - Track habits. Stay consistent." />
        <meta property="og:description" content="Track your habits. Add notes or share with friends. Se milestones, streaks and achievements. As web and PWA-app" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iamconsistent.io" />
        <meta property="og:image" content="https://iamconsistent.io/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="iamconsistent.io - Track habits. Stay consistent." />
        <meta name="twitter:description" content="Track your habits. Add notes or share with friends. Se milestones, streaks and achievements. As web and PWA-app" />
        <meta name="twitter:image" content="https://iamconsistent.io/twitter-image.png" />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}