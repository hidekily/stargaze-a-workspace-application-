import { TabBar3 } from '@/components/workspace/tabBar3'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/job/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
    <TabBar3 navigateTo='/console/workspace/job' routeFrom='/console/workspace/job/$workspaceId' />
}