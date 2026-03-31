import { Outlet } from '@tanstack/react-router'
import { TabBar } from '@/components/featuresTabBar'
import { API_URL } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Modal } from '@/components/modal'

interface ComponentProps {
    type: "social" | "professional",
    linkBase: "/console/workspace/job/$workspaceId" | "/console/workspace/social/$workspaceId",
}

export function TabBar2({type, linkBase}: ComponentProps) {
  const [workspaceName, setWorkspaceName] = useState<string>("")    
  const [memberLimit, setMemberLimit] = useState<number>(0)
  const [img, setImg] = useState<string>()
  const [modal, setModal] = useState<boolean>(false)

  const queryClient = useQueryClient()

  interface workspaceSchema {
    workspace:{id: string, name: string, img: string, memberLimit: number, type: "personal" | "social"},
    workspaceMember: {userId: string, workspaceId: number, role: 'admin'}
  }

  const {data, isLoading, error} = useQuery({
    queryKey:["workspace"],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/workspaces/by-ids?type=${type}`, {
        credentials: 'include',
        headers:{
          "Content-Type" : "application/json"
        }
      })
      return response.json()
    }
  })

  const handleWorkspaceCreateMutation = useMutation({
    
    mutationFn: async() => {
      await fetch(`${API_URL}/api/workspaces`, {
        method: "POST",
        headers: {
         "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(
          {
            workspaceName: workspaceName, 
            memberLimit: memberLimit,
            img: img, 
            type: `${type}`
          }),
      })
    },
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey: ['workspace']})
    },
    onError: () => {}
  })


  if(isLoading) return <div>calma pae ta carregando</div>
  return(
    
    <>
      {(modal === true) && (
        <Modal 
          header="🦦 create your group"
          buttons={[
            {text: 'cancel', onclick: () => {setModal(false), handleWorkspaceCreateMutation.reset()}, colorVariant: "danger"},
            (workspaceName !== "" ? 
                {text: "criar", onclick: () => {setModal(false), handleWorkspaceCreateMutation.mutate}, colorVariant: "add"} 
                : 
                {text: "digite o nome", onclick: () => {}, colorVariant: "mid"} 
            )
          ]}
        >
          <input className='input-modal' placeholder='Escolha o nome do grupo' type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)}/>
          <span>Limite do Grupo:</span>
          <input className='input-modal' placeholder='Limite de membros' type="number" value={memberLimit } onChange={(e) => setMemberLimit(e.target.valueAsNumber)}/>
        </Modal>
      )}

      <TabBar>
        <button 
          className='bg-zinc-800 h-10 w-[80%] rounded-full mt-8 border-dashed border-1 border-white text-white' 
          onClick={(e) => {e.preventDefault(), setModal(true)}}>
            +
        </button>

        {data.map((index: workspaceSchema) =>(
          <Link 
            to={`${linkBase}`}
            key={index.workspace.id} 
            params={{workspaceId: index.workspace.id}}
            className='groups'
          >
            {index.workspace.name}
          </Link>
        ))}
      </TabBar>

      <Outlet />
    </>
  )}
