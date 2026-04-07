import { TabBar3 } from '@/components/workspace/GroupChat'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
    return <TabBar3 navigateTo='/console/workspace/social' routeFrom='/console/workspace/social/$workspaceId' />
}