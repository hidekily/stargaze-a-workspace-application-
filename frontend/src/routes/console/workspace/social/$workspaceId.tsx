import { Modal } from '@/components/modal'
import { API_URL } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { workspace } from './../../../../../../shared/src/db/schema';

export const Route = createFileRoute('/console/workspace/social/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {workspaceId} = useParams({from: "/console/workspace/social/$workspaceId"})

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
      navigate({to: '/console/workspace/social'})
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

      <div className='h-full w-[100%] bg-[#ffc6a8] text-black flex flex-col text-6xl'>
        <nav className='w-full h-[10%] bg-black flex flex-row'>
          <button onClick={() => setModal(true)} className='w-20 h-10 bg-white rounded-full'></button>
        </nav>
      </div>
    </>
  )}
