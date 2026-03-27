import { API_URL } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/social/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {workspaceId} = useParams({from: "/console/workspace/social/$workspaceId"})

  const {data} = useQuery({
    queryKey:["workspaceId", workspaceId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
        credentials: "include"
      })
      return res.json()
    }
  })

  console.log(data)
  
  return(
    <>
      <div className='h-full w-full bg-white text-black flex justify-center items-center text-6xl'>
        {data?.workspace.name}
      </div>
    </>
  )}
