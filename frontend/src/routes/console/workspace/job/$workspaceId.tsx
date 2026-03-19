import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/console/workspace/job/$workspaceId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
    <div>

    </div>

    <Outlet />
    </>
  )
}
