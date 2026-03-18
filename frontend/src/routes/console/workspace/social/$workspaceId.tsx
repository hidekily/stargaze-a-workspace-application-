import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/console/workspace/social/$social"!</div>
}
