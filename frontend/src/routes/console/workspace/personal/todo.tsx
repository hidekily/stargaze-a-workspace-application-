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
  const [modalDel, setModalDel] = useState<boolean>(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [itemName, setItemName] = useState<string>("")
  const [activeTab, setActiveTab] = useState()
  const [isEditing, setIsEditing] = useState<string | null>()
  const [editValue, setEditValue] = useState<string>()

  const queryClient = useQueryClient()

  const { data: itemsData } = useQuery({
    queryKey: ["todoItems", selectedListId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/todoList/items/${selectedListId}`, {
        credentials: 'include',
      })
      return response.json()
    },
    enabled: !!selectedListId, 
  })  

  const handleCreateTodoItems = useMutation({
    mutationFn: async() => {
      await fetch(`${API_URL}/api/todoList/item/${selectedListId}`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          itemName: itemName,
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['todoItems']})
      setItemName("")
    }
  })

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

  const handleSetStatus = useMutation({
    mutationFn: async({itemId, doneOrNotStatus}: {itemId: string, doneOrNotStatus: string}) => {
      const response = await fetch(`${API_URL}/api/todoList/${itemId}`, {
        method: "PATCH",
        credentials: 'include',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          doneOrNot: doneOrNotStatus === "pending" ? "done" : "pending"
        })
      })
      return response.json()
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey:["todoItems", selectedListId]})
    }
  })

  const handleDeleteTodo = useMutation({
    mutationFn: async(listId: string) => {
      const response = await fetch(`${API_URL}/api/todoList/${listId}`, {
        credentials: 'include',
        method: "DELETE"
      })
      await response.json()
    },
    onSettled: () => {queryClient.invalidateQueries({queryKey: ['todo']})}
  })

  const handleDeleteTodoItems = useMutation({
    mutationFn: async({itemId} : {itemId: string}) => {
      const response = await fetch(`${API_URL}/api/todoList/items/${itemId}`, {
        credentials: 'include',
        method: "DELETE"
      })
      await response.json()
    },
    onSettled: () => {queryClient.invalidateQueries({queryKey: ["todoItems"]})}
  })

  const handleUpdateTodoItems = useMutation({
    mutationFn: async({itemId} : {itemId: string}) => {
      const response = await fetch(`${API_URL}/api/todoList/${itemId}`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
          itemName: editValue
        })
      })
      await response.json()
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['todoItems']})
      setEditValue("")
      setIsEditing(null)
    }
  })

  const selectedList = data?.find((ci: any) => ci.id === selectedListId)

  return (
    <>
      {modal === true && (
        <Modal 
          header=''
          title='Crie sua todo list'
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

      {modalDel === true && (
        <Modal
          header={<>Are you sure you want to delete this todo list: "<span className='text-[#ff6b4a] text-lg'>{selectedList?.listName}</span>" ?</>}
          title=''
          subtitle=''
          buttons={[
            {text: 'cancel', onclick: () => {setModalDel(false),handleDeleteTodo.reset()}, colorVariant: 'add'},
            {text: 'delete', onclick: () => {setModalDel(false),handleDeleteTodo.mutate(selectedListId!)}, colorVariant: 'danger'}
          ]}
        >

        </Modal>
      )}

      <div className='h-full w-full flex flex-row'>
        {/* box das listas */}
        <section className='h-full w-[45%] flex flex-col items-center'>
          <section className='h-[15%] w-[80%] flex flex-row items-center justify-center gap-10 text-white'>
            <span className='text-3xl font-semibold text-[#ff6b4a] tracking-tight'>Your Lists</span>
            <button
              onClick={() => setModal(true)}
              className='text-xl rounded-xl px-4 h-9 bg-[#ff6b4a]/20 hover:bg-[#ff6b4a]/40 border border-[#ff6b4a]/30 text-[#ff6b4a] transition-colors duration-150 flex items-center gap-1'
            >
              <span className='text-lg leading-none'>+</span>
              <span className='text-sm'>New list</span>
            </button>

            <button
              onClick={() => {setModalDel(true)}}
              className='text-xl rounded-xl px-4 h-9 bg-[#ff6b4a]/20 hover:bg-[#ff6b4a]/40 border border-[#ff6b4a]/30 text-[#ff6b4a] transition-colors duration-150 flex items-center gap-1'
            >
              <span className='text-lg leading-none'>-</span>
              <span className='text-sm'>delete</span>
            </button>
          </section>

        {/* listas */}
        <section className='h-[85%] w-full flex flex-col overflow-auto items-center gap-3 pr-1'>
            {data && data.map && data.map((todo: any) => (
              <div  key={todo.id}
                    className={`w-[80%] ${activeTab === todo.id ? "bg-[#ff6b4a]/60" : "bg-[#1A1A2E]"} border border-[#252540] hover:border-[#ff6b4a]/30 flex flex-col gap-1 text-[#E8E8F0] rounded-2xl px-5 py-4 transition-colors duration-150 cursor-default`}
                    onClick={() => {setSelectedListId(todo.id), setActiveTab(todo.id)}}
                >
                <span className='text-base font-medium text-[#E8E8F0] leading-snug'>{todo.listName}</span>
                <span className='text-sm text-[#9898B0] leading-snug'>{todo.description}</span>
                <span className='text-xs text-[#5A5A78] mt-1'>{dataFormater(todo.date)}</span>
              </div>
            ))}
          </section>
        </section>

        <span className='h-full w-[1px] bg-[#252540]'/>

        {/* box dos items */}
        <section className='w-[55%] h-full flex flex-col justify-center items-center overflow-auto'>
            <div className='h-[90%] w-full flex flex-col overflow-auto p-5'>
              <span className='text-2xl text-white'>{selectedList?.listName}</span>
              <span className='text-lg text-white opacity-30'>{selectedList?.description}</span>
              {itemsData && itemsData.data.map && itemsData.data.map((index: any) => (
                <div key={index.id} className='h-15 w-[80%] bg-[#12121C] mt-5 rounded-lg border-1 border-white/50 flex flex-row justify-between items-center'>
                  <button className={`h-10 w-10 rounded-2xl border-1 border-[#252540] flex justify-center items-center ml-2 ${index.doneOrNot === 'pending' ?  "": "bg-[#FFD666]/80"}`}
                          onClick={() => handleSetStatus.mutate({itemId: index.id, doneOrNotStatus: index.doneOrNot})}
                  >
                    {index.doneOrNot === 'pending' ? "" : "✓"}
                  </button>

                  <span onDoubleClick={() => {setIsEditing(index.id), setEditValue(index.itemName)}}>
                    {isEditing === index.id ? 
                      <input type="text"
                             placeholder={`${index.itemName}`}
                             className='bg-zinc-800 text-[#FFB347] rounded-lg' 
                             value={editValue}
                             onBlur={() => setIsEditing(null)}
                             onChange={(e) => setEditValue(e.target.value)}
                             onKeyDown={(e) => { if(e.key === "Enter" && !e.shiftKey){
                              e.preventDefault()
                              handleUpdateTodoItems.mutate({itemId: index.id})
                             }}}
                             /> 
                      :<span className='text-[#FFB347] text-lg'>{index.itemName}</span>
                    }
                  </span>

                  <span className='text-[#FFB347]'>status: {index.doneOrNot}</span>
                  <button className='mr-2' onClick={() => handleDeleteTodoItems.mutate({itemId: index.id})}>🗑️</button>
                </div>
              ))}
            </div>

            {/* input dos items */}
            <div className='h-[10%] w-full flex flex-row justify-center items-center gap-5 text-[#FFB347]'>
              <input type="text" value={itemName} placeholder='digite uma nova tarefa' className='w-[80%] h-[70%] bg-[#1A1A2E] rounded-lg text-center' onChange={(e) => setItemName(e.target.value)}/>
              <button onClick={(e) => {e.preventDefault(), handleCreateTodoItems.mutate()}} className='w-10 h-10 rounded-2xl bg-[#FF6B4A]'>+</button>
            </div>
        </section>
      </div>
    </>
  )
}
