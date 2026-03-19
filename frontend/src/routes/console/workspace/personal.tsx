import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal')({
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
