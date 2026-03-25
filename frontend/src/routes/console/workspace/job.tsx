import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TabBar } from '@/components/featuresTabBar'

export const Route = createFileRoute('/console/workspace/job')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
      <TabBar>
        <div></div>
      </TabBar>

      <Outlet />
    </>
  )
}
