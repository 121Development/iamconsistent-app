import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up/$')({
  component: Page,
})

function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-neutral-900 border border-neutral-800',
          },
        }}
      />
    </div>
  )
}
