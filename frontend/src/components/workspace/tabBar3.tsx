import { Modal } from '@/components/modal'
import { API_URL } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'

interface componentProps {
    navigateTo: "/console/workspace/social" | "/console/workspace/job"
    routeFrom: "/console/workspace/social/$workspaceId" | "/console/workspace/job/$workspaceId"
}

export function TabBar3({navigateTo, routeFrom}: componentProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {workspaceId} = useParams({from: `${routeFrom}`})

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
        <nav className='w-full h-[10%] bg-zinc-900 flex flex-row items-center'>
          <span className='ml-6'>{data?.workspace.name}</span>
        </nav>

        <section className='h-[80%] w-full bg-white'> {/* display da msg  e activities*/}

        </section>
          <button className='w-20 h-20 bg-teal-900' onClick={(e) => {e.preventDefault(), handleDeleteGroup.mutate()}}></button>
        <section> {/* input da msg + enviar */}

        </section>
      </div>
    </>
  )}
