import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal/todo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/console/workspace/personal/todo"!</div>
}
