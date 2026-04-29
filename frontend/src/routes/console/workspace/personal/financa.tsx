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
  const [modal, setModal] = useState(false)

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

  const receita = data?.filter((i: any) => i.tipo === "ganho").reduce((acc: number, i: any) => acc + Number(i.valor), 0) || 0
  const despesas = data?.filter((i: any) => i.tipo === "gasto").reduce((acc: number, i: any) => acc + Number(i.valor), 0) || 0
  const saldo = receita - despesas

  return(
    <>
      {modal === true &&(
        <Modal
          header=''
          title='Defina sua transacao'
          buttons={[
            {text: 'Cancel', onclick: () => {handleCreateFinanca.reset(), setModal(false)}, colorVariant: 'mid'},
            {text: 'Submit', onclick: () => {handleCreateFinanca.mutate(), setModal(false)}, colorVariant: 'add'}
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
                        onClick={() => setModal(true)}
                >
                    <p>+</p>
                </button>
              </section>
              {/* parte que lista todas as transacoes */}
              <section className='h-[85%] w-full flex flex-col items-center overflow-auto gap-2'>
                {data && data.map((index: any) => (
                  <div key={index.id} className='w-[90%] bg-zinc-800 mt-2 rounded-lg flex flex-row justify-between items-center p-2 border-1 border-zinc-700'>
                    <span>{index.name}</span>
                    <span className={`${index.tipo === "ganho" ? "text-green-400" : "text-red-400"} rounded-md`}>{index.tipo === "ganho" ? "+" : "-"} R${index.valor}</span>
                    <span>categoria: {index.categorias}</span>
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
                {data.filter(categoria).map((index: any) => (
                  <div key={index}>
                    
                  </div>
                ))}
              </section>
            </section>
            <section className='flex-[1.5] w-full border border-zinc-700 bg-zinc-900 rounded-2xl p-5'>
              <p className='font-bold text-white text-base'>Filtrar</p>
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
