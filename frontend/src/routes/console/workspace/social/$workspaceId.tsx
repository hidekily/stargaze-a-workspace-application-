import { API_URL } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {workspaceId} = useParams({from: "/console/workspace/social/$workspaceId"})

  const {data} = useQuery({
    queryKey:["routeId"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/workspace/${workspaceId}`)
      return res.json()
    }
  })
  
  return(
    <>
      <div>
        {data.map((index) => (
          <div></div>
        ))}
      </div>
    </>
  )}
