import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TabBar } from '@/components/featuresTabBar'
import { API_URL } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/console/workspace/social')({
  component: RouteComponent,
})

function RouteComponent() {
  const {data, isLoading, error} = useQuery({
    queryKey:["workspace"],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/workspaces/by-ids?type=social`, {
        credentials: 'include'
      })
      return response.json()
    }
  })


  if(isLoading) return <div>calma pae ta carregando</div>
  return(
    <>
      <TabBar>
        {data.map((index: string) =>(
          <div key={index}></div>
        ))}
      </TabBar>

      <Outlet/>
    </>
  )}
