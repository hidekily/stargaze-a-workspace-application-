import { createFileRoute, Outlet } from '@tanstack/react-router'
import { TabBar } from '@/components/featuresTabBar'
import { API_URL } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Modal } from '@/components/modal'

export const Route = createFileRoute('/console/workspace/social')({
  component: RouteComponent,
})

function RouteComponent() {
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
      const response = await fetch(`${API_URL}/api/workspaces/by-ids?type=social`, {
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
            type: "social"
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
            {text:"Criar", onclick: () => {setModal(false), handleWorkspaceCreateMutation.mutate()}, colorVariant: "add"}
          ]}
        >
          <input className='input-modal' placeholder='Escolha o nome do grupo' type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)}/>
          <input className='input-modal' placeholder='Limite de membros' type="number" value={memberLimit } onChange={(e) => setMemberLimit(e.target.valueAsNumber)}/>
        </Modal>
      )}

      <TabBar>
        <button 
          className='bg-white h-10 w-[80%] rounded-full mt-2' 
          onClick={(e) => {e.preventDefault(), setModal(true)}}>
            +
        </button>

        {data.map((index: workspaceSchema) =>(
          <Link 
            to="/console/workspace/social/$workspaceId" 
            key={index.workspace.id} 
            params={{workspaceId: index.workspace.id}}
            className='groups'
          >
            {index.workspace.name}
          </Link>
        ))}
      </TabBar>

      <Outlet/>
    </>
  )}
