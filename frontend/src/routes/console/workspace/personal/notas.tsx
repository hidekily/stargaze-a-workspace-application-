import { createFileRoute} from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {useState } from 'react'
import { API_URL } from '@/lib/api'
import { useHotkey } from '@tanstack/react-hotkeys'
import { throttle } from '@tanstack/react-pacer'

export const Route = createFileRoute('/console/workspace/personal/notas')({
  component: RouteComponent,
})

function RouteComponent() {
  const [notaName, setNotaName] = useState<string>()
  const [content, setContent] = useState<string | null>()
  const queryClient = useQueryClient()
  const [selectedNotaId, setSelectedNotaId] = useState<string | null>(null)
  const [saved, setSaved] = useState<boolean>(false)

  const {data} = useQuery({
    queryKey: ['nota'],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/notas`, {
        credentials: 'include',
        method: "GET"
      })
      return await response.json()
    }
  })

  const handleCreateNote = useMutation({
    mutationFn: async() => {
      const response = await fetch(`${API_URL}/api/notas/`, {
        credentials: 'include',
        headers: {"Content-Type" : 'application/json'},
        body: JSON.stringify({
          name: notaName,
          content: ""
        }),
        method: "POST"
      })
      return await response.json()
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['nota']})
      setNotaName("")
      setContent("")
    }
  })

  const handleDeleteNota = useMutation({
    mutationFn: async() => {
      const response = await fetch(`${API_URL}/api/notas/${selectedNotaId}`, {
        credentials: 'include',
        method: 'DELETE'
      })
      return await response.json()
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['nota']})
      setSelectedNotaId(null)
      setContent(null)
    }
  })

  const handleUpdateNote = useMutation({
    mutationFn: async() => {
      const response = await fetch(`${API_URL}/api/notas/${selectedNotaId}`, {
        credentials: 'include',
        headers: {"Content-Type" : 'application/json'},
        body: JSON.stringify({
          content: content
        }),
        method: "PATCH"
      })
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['nota']})
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  })

  useHotkey({key: "S", mod: true},  () => throttleSave())

  const throttleSave = throttle(() => handleUpdateNote.mutate(), {wait: 5000})


  return(
    <>
    {saved && (
      <span className='fixed bottom-5 right-5 bg-[#4ADE80]/20 text-[#4ADE80] px-4 py-2 rounded-lg text-sm'>
        Salvo ✓
      </span>
    )}

      <section className='h-full w-full flex flex-row'>
        <div className='h-full w-[40%] flex flex-col border-r-2 border-zinc-800'>
          <nav className='h-15 bg-black w-full flex flex-row justify-between items-center text-white shrink-0 border-b-2 border-zinc-800'>
            <span className='ml-2'>Notas</span>
            <span>
              <input type="text" value={notaName} onChange={(e) => setNotaName(e.target.value)} placeholder='nome da nota' className='bg-zinc-800 rounded-lg border-1 mr-2 text-center'/>
              <button onClick={() => handleCreateNote.mutate()} className='mr-2'>💡add</button>
            </span>
          </nav>

          <section className='flex-1 overflow-y-auto'>
            {data && data.map((index: any) => (
              <div key={index.id} className='w-full flex flex-col justify-center items-center text-white'>
                <span className={`${selectedNotaId === index.id ? "bg-[#ff6b4a]/60" : "bg-[#1A1A2E]"} h-20 w-[80%] rounded-lg mt-4 p-4 flex flex-row items-center justify-between`}
                      onClick={() => {setSelectedNotaId(index.id), setContent(index.content)}}>
                        <p className='text-lg text-white'>{index.notasName}</p>
                        <button onClick={() => handleDeleteNota.mutate()}>🗑️</button>
                </span>
              </div>
            ))}
          </section>
        </div>
        {/*  */}
        <div className='h-full w-[60%] flex flex-col items-center justify-center'>
          <span className='opacity-60 text-white mt-2'>ctrl + s : save</span>
            {data?.length === 0 && selectedNotaId === null ? <p className='text-white text-4xl'>Crie uma nota</p>
              : data?.length >= 1  &&  selectedNotaId === null ? <p className='text-white text-4xl'>Selecione uma nota</p>
              :           
              <textarea 
                placeholder='digite algo 🦥'
                className='w-[92%] h-[85%] text-[#ffb64a] text-2xl border-1 border-[#ff6b4a] rounded-lg p-3 overflow-auto mt-4 outline-none'
                value={content || ""} 
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => handleUpdateNote.mutate()}
              />
            }
        </div>
      </section>
    </>
  )
}
