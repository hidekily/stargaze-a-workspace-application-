import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { API_URL } from '@/lib/api'

export const Route = createFileRoute('/console/workspace/personal/todo')({
  component: RouteComponent,
})

function RouteComponent() {
  const {data} = useQuery({
    queryKey: ["todo"],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/todolist`, {
        credentials: 'include',
      })
      return response.json
    }
  })

  const handleCreateTodo = useMutation({
    mutationFn: async() => {
      await fetch(`${API_URL}/api/todolist`, {
        credentials: 'include',
        method: 'POST',
        headers: {"Content-Type" : "applications/json"}
      })
    } 
  })

  return (
    <>
    
    </>
  )
}
