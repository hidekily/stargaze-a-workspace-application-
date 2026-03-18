import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/console/workspace/job/$workspaceId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/console/workspace/professional/$professional"!</div>
}
