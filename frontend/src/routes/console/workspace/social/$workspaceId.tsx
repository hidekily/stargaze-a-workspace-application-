import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
      <div>

      </div>
    </>
  )}
