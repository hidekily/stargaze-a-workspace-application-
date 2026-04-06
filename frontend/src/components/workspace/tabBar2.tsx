import { Outlet } from '@tanstack/react-router'
import { TabBar } from '@/components/featuresTabBar'
import { API_URL } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Modal } from '@/components/modal'
import {useHotkey} from '@tanstack/react-hotkeys'

interface ComponentProps {
    type: "social" | "professional",
    linkBase: "/console/workspace/job/$workspaceId" | "/console/workspace/social/$workspaceId",
}

export function TabBar2({type, linkBase}: ComponentProps) {
  const [workspaceName, setWorkspaceName] = useState<string>("")    
  const [memberLimit, setMemberLimit] = useState<number>(0)
  const [imgFile, setImg] = useState<File | null>(null)
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
    mutationFn: async () => {
      let imgUrl = undefined
        
      console.log(imgFile)
      if (imgFile) {
        const formData = new FormData()
        formData.append('file', imgFile)
        const uploadRes = await fetch(`${API_URL}/api/imgUpload`, {
          method: "POST",
          credentials: "include",
          body: formData  // nota: sem Content-Type header, o browser seta automaticamente
        })
        const uploadData = await uploadRes.json()
        imgUrl = uploadData.url
      }
    
      await fetch(`${API_URL}/api/workspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workspaceName,
          memberLimit,
          img: imgUrl,
          type
        })
      })
    },
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey: ['workspace']})
      setMemberLimit(0)
      setWorkspaceName("")
    },
    onError: () => {}
  })

  // const for hot keys ( i made it a little bit better for user), inclusive eu n preciso chamar elas nas functions e nem fzr const
  useHotkey({key: "Backspace", mod: true}, () => {handleWorkspaceCreateMutation.reset(), setModal(false)})  
  useHotkey({key: "enter", mod:true}, () => {
    if(handleWorkspaceCreateMutation.isSuccess){
      setTimeout(() => {
        handleWorkspaceCreateMutation.reset()
        setModal(false)
      }, 600)
    }
    else if(!getButton.disabled){
      handleWorkspaceCreateMutation.mutate()
    } 
  })

  function getBtn() : {text: string, colorVariant: "mid" | "add" | "danger", disabled: boolean}{
    if(workspaceName === "") return {text: "digite o nome", colorVariant: "mid", disabled: true}
    if(memberLimit <= 0 || isNaN(memberLimit)) return {text: "add o limite", colorVariant: "mid", disabled: true}
    return {text: "create ( enter )", colorVariant: "add", disabled: false}
  }const getButton = getBtn()

  if(isLoading) return <div>calma pae ta carregando</div>
  return(
    <>
      {(modal === true && !handleWorkspaceCreateMutation.isSuccess) && (
        <Modal 
          header={<input 
            type='file' 
            className='rounded-full w-20 h-20' 
            onChange={(e) => setImg(e.target.files?.[0] ?? null)} // pega o primeiro arquivo ou fica null
            accept='image/*'
          />}
          buttons={[
            {text: 'cancel (backspace)', onclick: () => {setModal(false), handleWorkspaceCreateMutation.reset()}, colorVariant: "danger"},
            {
              text: getButton.text, 
              colorVariant: getButton.colorVariant,
              onclick: getButton.disabled ? () => {} : () => {setModal(false), handleWorkspaceCreateMutation.mutate()}
            }
          ]}
        >
          <input className='input-modal' placeholder='Escolha o nome do grupo' type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)}/>
          <span>Limite do Grupo:</span>
          <input className='input-modal w-80' placeholder='Limite de membros' type="number" value={memberLimit} onChange={(e) => setMemberLimit(e.target.valueAsNumber)}/>
        </Modal>
      )}

      {/* mensagem qque deu certo */}
      {(handleWorkspaceCreateMutation.isSuccess) && (
        <Modal 
          header={<div className='bolinhaModal'>🦦</div>}
          subtitle='o seu grupo foi criado com sucesso'
          buttons={[
            {text: "confirm ( enter )", onclick: () => {setModal(false), handleWorkspaceCreateMutation.reset()}, colorVariant: 'add'}
          ]}
        />
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
            <img src={index.workspace.img}/>
            {index.workspace.name}
          </Link>
        ))}
      </TabBar>

      <Outlet />
    </>
  )}
