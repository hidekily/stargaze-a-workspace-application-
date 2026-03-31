import { TabBar2 } from '@/components/workspace/tabBar2'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/job')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TabBar2 type='professional' linkBase='/console/workspace/job/$workspaceId'/> 
  }
