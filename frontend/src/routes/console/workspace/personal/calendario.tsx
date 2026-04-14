import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal/calendario')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/console/workspace/personal/calendario"!</div>
}
