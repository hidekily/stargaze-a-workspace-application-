import { TabBar3 } from '@/components/workspace/GroupChat'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/job/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
    return <TabBar3 navigateTo='/console/workspace/job' routeFrom='/console/workspace/job/$workspaceId' />
}