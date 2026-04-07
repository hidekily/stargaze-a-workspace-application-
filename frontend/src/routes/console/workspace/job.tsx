import { TabBar2 } from '@/components/workspace/GroupList'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/job')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TabBar2 type='professional' linkBase='/console/workspace/job/$workspaceId'/> 
  }
