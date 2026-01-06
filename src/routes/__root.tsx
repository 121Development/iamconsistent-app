import { HeadContent, Scripts, createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import Header from '../components/Header'
import { queryClient } from '../lib/queryClient'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'iamconsistent.io - Track habits. Stay consistent.',
      },
      {
        name: 'description',
        content: 'Track your habits. Add notes or share with friends. See milestones, streaks and achievements. As web and PWA-app',
      },
      {
        name: 'theme-color',
        content: '#0a0a0a',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'iamconsistent.io - Track habits. Stay consistent.',
      },
      {
        property: 'og:description',
        content: 'Track your habits. Add notes or share with friends. See milestones, streaks and achievements. As web and PWA-app',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://iamconsistent.io',
      },
      {
        property: 'og:site_name',
        content: 'iamconsistent',
      },
      {
        property: 'og:image',
        content: 'https://iamconsistent.io/og-image.png',
      },
      {
        property: 'og:image:secure_url',
        content: 'https://iamconsistent.io/og-image.png',
      },
      {
        property: 'og:image:type',
        content: 'image/png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'iamconsistent - Track habits. Stay consistent.',
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'iamconsistent.io - Track habits. Stay consistent.',
      },
      {
        name: 'twitter:description',
        content: 'Track your habits. Add notes or share with friends. See milestones, streaks and achievements. As web and PWA-app',
      },
      {
        name: 'twitter:image',
        content: 'https://iamconsistent.io/twitter-image.png',
      },
    ],
    links: [
      // PWA manifest
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      // Apple touch icon
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
      // Preconnect to Google Fonts for faster loading
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      // Preload critical CSS
      {
        rel: 'preload',
        href: appCss,
        as: 'style',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#171717',
            border: '1px solid #262626',
            color: '#fafafa',
            fontFamily: 'JetBrains Mono, monospace',
          },
        }}
      />
    </>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-100 mb-2">404</h1>
        <p className="text-neutral-500 mb-6">Page not found</p>
        <a
          href="/"
          className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-medium py-2.5 px-6 rounded transition-colors inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <html lang="en">
          <head>
            <HeadContent />
          </head>
          <body>
            {children}
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
            <Scripts />
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
