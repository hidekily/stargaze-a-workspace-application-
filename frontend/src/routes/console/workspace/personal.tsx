import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='bg-zinc-900 w-90 h-90'>Hello '/console/workspace/hideki'!</div>
}
