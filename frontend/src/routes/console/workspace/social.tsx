import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='bg-red-900 w-90 h-90'>Hello '/console/workspace/hideki'!</div>
}
