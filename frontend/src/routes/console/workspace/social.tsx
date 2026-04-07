import { TabBar2 } from '@/components/workspace/GroupList'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social')({
  component: RouteComponent,
})

function RouteComponent() {
    return <TabBar2 type="social" linkBase='/console/workspace/social/$workspaceId'/>
}
