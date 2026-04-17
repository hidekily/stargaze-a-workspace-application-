import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient, useMutation, useQuery} from '@tanstack/react-query'
import { API_URL } from '@/lib/api'
import { useState } from 'react'
import { Modal } from '@/components/modal'
import { dataFormater } from '@/utils/dataFormater'

export const Route = createFileRoute('/console/workspace/personal/todo')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [modal, setModal] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const {data} = useQuery({
    queryKey: ["todo"],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/todoList/by-ids`, {
        credentials: 'include',
      })
      return response.json()
    }
  })

  const handleCreateTodo = useMutation({
    mutationFn: async() => {
      await fetch(`${API_URL}/api/todoList/list`, {
        credentials: 'include',
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          todoName: name,
          description: description
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['todo']}),
      setName("")
      setDescription("")
    }
  })

  return (
    <>
      {modal === true && (
        <Modal 
          header=''
          title=''
          subtitle=''
          buttons={[
            {text: "cancel", onclick: () => {handleCreateTodo.reset(), setModal(false)}, colorVariant: 'danger'},
            {text: "create", onclick: () => {handleCreateTodo.mutate(), setModal(false)}, colorVariant: 'add'}
          ]}
        >
          <input type="text" value={name} className='input-modal' placeholder='name' onChange={(e) => setName(e.target.value)}/>
          <input type="text" value={description} className='input-modal' placeholder='description' onChange={(e) => setDescription(e.target.value)}/>
        </Modal>
      )}

      <div className='h-full w-full flex flex-row'>
        <section className='h-full w-[45%] flex flex-col items-center'>
          <section className='h-[15%] w-[80%] flex flex-row items-center justify-between text-white'>
            <span className='text-3xl font-semibold text-[#ff6b4a] tracking-tight'>Your Lists</span>
            <button
              onClick={() => setModal(true)}
              className='text-xl rounded-xl px-4 h-9 bg-[#ff6b4a]/20 hover:bg-[#ff6b4a]/40 border border-[#ff6b4a]/30 text-[#ff6b4a] transition-colors duration-150 flex items-center gap-1'
            >
              <span className='text-lg leading-none'>+</span>
              <span className='text-sm'>New list</span>
            </button>
          </section>

          <section className='h-[85%] w-full flex flex-col overflow-auto items-center gap-3 pr-1'>
            {data && data.map && data.map((todo: any) => (
              <div key={todo.id} className='w-[80%] bg-zinc-900/70 border border-zinc-800 hover:border-[#ff6b4a]/30 flex flex-col gap-1 text-white rounded-2xl px-5 py-4 transition-colors duration-150 cursor-default'>
                <span className='text-base font-medium text-white leading-snug'>{todo.listName}</span>
                {todo.description && (
                  <span className='text-sm text-zinc-400 leading-snug'>{todo.description}</span>
                )}
                <span className='text-xs text-zinc-600 mt-1'>{dataFormater(todo.date)}</span>
              </div>
            ))}
          </section>
        </section>

        <span className='h-full w-[1px] bg-zinc-800'/>
      </div>
    </>
  )
}
