import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TabBar } from '@/components/featuresTabBar'

export const Route = createFileRoute('/console/workspace/social')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
      <TabBar>

      </TabBar>

      <Outlet/>
    </>
  )}
