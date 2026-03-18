import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/job')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='bg-teal-900 w-90 h-90'>Hello '/console/workspace/hideki'!</div>
}
