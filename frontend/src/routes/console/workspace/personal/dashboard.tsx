import { API_URL } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/console/workspace/personal/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {

  const {data: todoData} = useQuery({
    queryKey: [""],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/todo`, {
        credentials: 'include',
        method: 'GET'
      })
      return await response.json()
    }
  })

  return(
    <div className='w-full h-full bg-white'>
      <section className='w-[90%] h-[95%] p-2 bg-black'>

      </section>
    </div>
  )
}
