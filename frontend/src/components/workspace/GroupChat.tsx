import { Modal } from '@/components/modal'
import { API_URL } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useWebSocket } from '@/lib/webHook'

interface componentProps {
    navigateTo: "/console/workspace/social" | "/console/workspace/job"
    routeFrom: "/console/workspace/social/$workspaceId" | "/console/workspace/job/$workspaceId"
}

export function TabBar3({navigateTo, routeFrom}: componentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {workspaceId} = useParams({from: `${routeFrom}`})
  const {messages, connected, sendMessage} = useWebSocket(workspaceId);
  const [content, setContent] = useState<string>('')

  const [modal, setModal] = useState<boolean>(false)


  const {data} = useQuery({
    queryKey:["workspaceId", workspaceId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
        credentials: "include"
      })
      return res.json()
    }
  })

  const handleDeleteGroup = useMutation({
    mutationFn: async() => {
      const response = await fetch(`${API_URL}/api/workspaces/${workspaceId}`, {
        credentials: "include",
        method: "DELETE"
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['workspaceId', workspaceId]}),
      queryClient.invalidateQueries({queryKey: ["workspace"]}),
      navigate({to: `${navigateTo}`})
    },
  })

  return(
    <>
      {(modal === true) && (
        <Modal 
          header={`${data?.workspace.name} are you sure you want to delete this?`}
          subtitle='teste'
          buttons={[
            {text: 'Cancel', onclick: () => {setModal(false), handleDeleteGroup.reset()}, colorVariant: 'add'},
            {text: 'delete', onclick: () => {setModal(false), handleDeleteGroup.mutate()}, colorVariant: 'danger'}
          ]}
        />
      )}

      <div className='h-full w-[70%] bg-[#0A0A0F]/80 text-black flex flex-col text-white'>
        <nav className='w-full h-[10%] bg-zinc-900'>
          <section className='w-[50%] h-full flex flex-row gap-5 items-center'>
            {data?.workspace.img && <img src={data?.workspace.img} className='w-15 h-15 rounded-full bg-cover bg-no-repeat bg-center ml-5'/>}
            <span className='text-2xl text-[#FFD666] ml-2'>{data?.workspace.name}</span>
          </section>

          <section className='w-[50%] h-full'>

          </section>
        </nav>

        <section className='h-[80%] w-full bg-[#1A1A2E]'> {/* display da msg  e activities*/}
          {messages.map((message, index) => (
            <div key={index} className='bg-zinc-800 p-2'>
              <p>{message.content}</p>
            </div>
          ))}
        </section>

        <section> {/* input da msg + enviar */}
          <input 
            type="text" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='digite sua mensagem...'
            maxLength={2000}
            className={"bg-green-900 rounded p-2"}
          />

          <button 
            disabled={!connected || !content.trim()}
            onClick={() => {
              sendMessage(content.trim())
              setContent("")
            }}
            className={"bg-teal-900 rounded p-2 disabled:opacity-70"}
          >
            enviar
          </button>
        </section>

      </div>
    </>
  )}
