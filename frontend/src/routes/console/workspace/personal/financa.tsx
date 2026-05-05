import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '@/lib/api'
import { useState } from 'react'
import { Modal } from '@/components/modal'

export const Route = createFileRoute('/console/workspace/personal/financa')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const [name, setName] = useState<string>()
  const [tipo, setTipo] = useState<"gasto" | "ganho">("gasto")
  const [valor, setValor] = useState<string>()
  const [categoria, setCategoria] = useState<"despesa fixa" | "lazer" | "escola" | "assinaturas" | "investimentos" | "trabalho" | "freelance" | "outros">("despesa fixa")
  const [modal, setModal] = useState<"delete" | "create" | null>()
  const [deleteId, setDeletingId] = useState()
  const [filtro, setFiltro] = useState<"todos" | "ganho" | "gasto">("todos")
  const [isEditing, setIsEditing] = useState<string | null>()
  const [editValue, setEditValue] = useState<string>()
  const [editValueValor, setEditValueValor] = useState<string>()


  const {data} = useQuery({
    queryKey: ['financa'],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/financa`, {
        credentials: 'include',
        method: "GET"
      })
      return response.json()
    }
  })

  const handleCreateFinanca = useMutation({
    mutationFn: async() => {
      const response = await fetch(`${API_URL}/api/financa`, {
        credentials: 'include',
        method: "POST",
        body: JSON.stringify({
          name: name,
          tipo: tipo, 
          valor: valor, 
          categorias: categoria
        }),
        headers: {"Content-Type" : "application/json"}
      })
      return response.json()
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['financa']})
      setName('')
      setValor('')
    }
  })

  const handleDeleteFinanca = useMutation({
    mutationFn: async() => {
      const response = await fetch(`${API_URL}/api/financa/${deleteId}`, {
        credentials: 'include',
        method: "DELETE"
      })
      return await response.json()
    },
    onSettled: async() => {
      queryClient.invalidateQueries({queryKey: ['financa']})
    }
  })

  const handleUpdateFinanca = useMutation({
    mutationFn: async({itemId} : {itemId: string}) => {
      const response = await fetch(`${API_URL}/api/financa/${itemId}`, {
        method: "PATCH",
        credentials: 'include',
        body: JSON.stringify({
          valor: editValueValor,
          name: editValue,
        }),
        headers: {"Content-Type" : "application/json"}
      })
      return await response.json()
    },
    onSettled: async() => {
      queryClient.invalidateQueries({queryKey: ['financa']})
      setEditValue("")
      setIsEditing(null)
    }
  })

  const receita = data?.filter((i: any) => i.tipo === "ganho").reduce((acc: number, i: any) => acc + Number(i.valor), 0) || 0
  const despesas = data?.filter((i: any) => i.tipo === "gasto").reduce((acc: number, i: any) => acc + Number(i.valor), 0) || 0
  const saldo = receita - despesas
  const categorias = [...new Set(data?.filter((i: any) => i.tipo === "gasto").map((i: any) => i.categorias))]
  const dataFiltrada = filtro === "todos" ? data : data?.filter((i: any) => i.tipo === filtro)

  return(
    <>
      {modal === "create" &&(
        <Modal
          header=''
          title='Defina sua transacao'
          buttons={[
            {text: 'Cancel', onclick: () => {handleCreateFinanca.reset(), setModal(null)}, colorVariant: 'mid'},
            {text: 'Submit', onclick: () => {handleCreateFinanca.mutate(), setModal(null)}, colorVariant: 'add'}
          ]}
        >
          {/* nome da transacao  */}
          <input type="text" placeholder='digite o nome/titulo da transacao' className='input-modal' value={name} onChange={(e) => setName(e.target.value)}/>
          {/* valor */}
          <input type="text" placeholder='digite o valor' className='input-modal' value={valor} onChange={(e) => setValor(e.target.value)}/>
          {/* label de options p tipo */}
          <label className='input-modal'>
            <select
              className='w-[98%] h-full'
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "ganho" | "gasto")}
            >
              <option className='bg-zinc-800 text-white' value="ganho">ganho</option>
              <option className='bg-zinc-800 text-white' value="gasto">gasto</option>
            </select>
          </label>
          {/* label de options p categoria */}
          <label className='input-modal'>
            <select
              className='w-[98%] h-full flex'
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
            >
              <option  className='bg-zinc-800 text-white' value="despesa fixa">despesa fixa</option>
              <option  className='bg-zinc-800 text-white' value="lazer">lazer</option>
              <option  className='bg-zinc-800 text-white' value="escola">escola</option>
              <option  className='bg-zinc-800 text-white' value="assinaturas">assinaturas</option>
              <option  className='bg-zinc-800 text-white' value="investimentos">investimentos</option>
              <option  className='bg-zinc-800 text-white' value="trabalho">trabalho</option>
              <option  className='bg-zinc-800 text-white' value="freelance">freelance</option>
              <option  className='bg-zinc-800 text-white' value="outros">outros</option>
            </select>
          </label>
        </Modal>
      )}

      {modal === "delete" && (
        <Modal
          header=''
          buttons={[
            {text: 'cancel', onclick: () => {setModal(null), handleDeleteFinanca.reset()}, colorVariant: "add"},
            {text: 'delete', onclick: () => {setModal(null), handleDeleteFinanca.mutate(deleteId)}, colorVariant: "add"}
          ]}
        >

        </Modal>
      )}


      {/* a porra do Modal ficou gigante kkkkkkkkkkk */}
      
      <div className='h-full w-full flex flex-col gap-4 p-4'>
        {/* section com as boxes de cada coisa */}
        <section className='w-full flex flex-row gap-4'>
          <span className='financa-top-box bg-[#4ADE80]/10 border-[#4ADE80]'>
            <p className='text-sm font-medium opacity-60 text-[#4ADE80]'>Receita</p>
            <span className='text-[#4ADE80] text-4xl font-bold'>R$ {receita}</span>
          </span>
          <span className='financa-top-box bg-[#FF5A5A]/10 border-[#FF5A5A]'>
            <p className='text-sm font-medium opacity-60 text-[#FF5A5A]'>Despesas</p>
            <span className='text-[#FF5A5A] text-4xl font-bold'>R$ {despesas}</span>
          </span>
          <span className='financa-top-box bg-[#7BA3FF]/10 border-[#7BA3FF]'>
            <p className='text-sm font-medium opacity-60 text-[#7BA3FF]'>Saldo</p>
            <span className='text-[#7BA3FF] text-4xl font-bold'>R$ {saldo}</span>
          </span>
        </section>

        {/* section das transacoes */}
        <section className='flex-1 w-full flex flex-row gap-4 overflow-hidden'>
          <section className='h-full w-[65%]'>
            <div className='h-full w-full border border-zinc-700 bg-zinc-900 rounded-2xl text-white overflow-hidden'>
              <section className='p-6 h-[15%] w-full flex flex-row justify-between items-center border-b border-zinc-700'>
                <p className='font-bold text-lg'>Transacoes</p>
                <button className='h-8 w-8 rounded-lg border border-[#4ADE80] bg-[#4ADE80]/20 
                                   text-[#4ADE80] font-bold text-md flex items-center justify-center'
                        onClick={() => setModal("create")}
                >
                    <p>+</p>
                </button>
              </section>

              {/* parte que lista todas as transacoes */}
              <section className='h-[85%] w-full flex flex-col items-center overflow-auto gap-2'>
                {dataFiltrada && dataFiltrada.map((index: any) => (
                  <div key={index.id} className='w-[90%] bg-zinc-800 mt-2 rounded-lg flex flex-row justify-between items-center p-4 border-1 border-zinc-700 gap-2'>
                    {isEditing === index.id 
                      ? <input type="text"
                              placeholder={`${index.name}`}
                              className='bg-zinc-900 text-[#FFB347] rounded-lg' 
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => { if(e.key === "Enter" && !e.shiftKey){
                               setIsEditing(null)
                               e.preventDefault()
                               handleUpdateFinanca.mutate({itemId: index.id})
                              }}}
                         /> 
                      : <span className='w/3'>{index.name}</span>
                    }
                    {isEditing === index.id 
                      ? <input type="text"
                              placeholder={`${index.valor}`}
                              className='bg-zinc-900 text-[#FFB347] rounded-lg' 
                              value={editValueValor}
                              onChange={(e) => setEditValueValor(e.target.value)}
                              onKeyDown={(e) => { if(e.key === "Enter" && !e.shiftKey){
                               setIsEditing(null)
                               e.preventDefault()
                               handleUpdateFinanca.mutate({itemId: index.id})
                              }}}
                         /> 
                      :            
                        <span className={`w-1/3 text-center ${index.tipo === "ganho" ? "text-green-400" : "text-red-400"}`}>
                          {index.tipo === "ganho" ? "+" : "-"} R${index.valor}
                        </span>
                    }
                    <span className='w-1/3 text-right text-zinc-400 text-sm mr-2'>categoria: {index.categorias}</span>
                    <button className='w-1/50 text-sm mr-2' 
                            onClick={() => {setIsEditing(index.id), setEditValue(index.name), setEditValueValor(index.valor)}}>
                              ✎
                    </button>
                    <button className='w-1/50 text-sm' onClick={() => {setDeletingId(index.id), setModal("delete")}}>🗑️</button>
                  </div>
                ))}
              </section>
            </div>
          </section>

          {/* parte onde tem as boxes menores */}
          <section className='h-full w-[35%] flex flex-col gap-4'>
            <section className='flex-[2] w-full border border-zinc-700 bg-zinc-900 rounded-2xl p-5'>
              <p className='font-bold text-white text-base h-[10%]'>Por categoria</p>
              <section className='h-[90%] w-full flex flex-col p-2'>
                {categorias.map((index: any) => {
                  const totalCat = data?.filter((i: any) => i.categorias === index)
                    .reduce((acc: number, i: any) => acc + Number(i.valor), 0) || 0
                  const percent = despesas > 0 ? Math.round((totalCat * 100) / despesas) : 0

                  return (
                    <div key={index}>
                      <span className='text-[#ff6b4a]'>{index}</span>
                      <span className='text-[#ff6b4a] ml-1'>{percent}%</span>
                        <div className='w-full h-2 bg-zinc-800 rounded-full mt-1'>
                          <div 
                            className='h-full bg-[#7BA3FF] rounded-full' 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                    </div>
                  )
                })}
              </section>
            </section>
            <section className='flex-[1.5] w-full border border-zinc-700 bg-zinc-900 rounded-2xl p-5'>
              <p className='font-bold text-white text-base'>Filtrar</p>
              <section className='flex flex-row gap-3 items-center h-[90%]'>
                <button className={`h-8 w-18 rounded-lg ${filtro === "ganho" ? "bg-green-600/50" : "bg-zinc-800"} text-white`} onClick={() => setFiltro('ganho')}>ganhos</button>
                <button className={`h-8 w-18 rounded-lg ${filtro === "gasto" ? "bg-red-600/50" : "bg-zinc-800"} text-white`} onClick={() => setFiltro('gasto')}>gastos</button>
                <button className={`h-8 w-18 rounded-lg ${filtro === "todos" ? "bg-yellow-600/50" : "bg-zinc-800"} text-white`} onClick={() => setFiltro('todos')}>todos</button>
              </section>
            </section>
            <section className='flex-1 w-full border border-zinc-700 bg-zinc-900 rounded-2xl p-5'>
              <p className='font-bold text-white text-base'>Exportar</p>
            </section>
          </section>
        </section>
      </div>
    </>
  )
}