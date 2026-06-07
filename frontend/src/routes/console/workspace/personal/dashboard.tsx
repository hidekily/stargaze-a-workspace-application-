import { API_URL } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()

  const {data: dataFinanca} = useQuery({
    queryKey: ['summaryFinanca'],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/financa/summary`,{
        credentials: 'include',
        method: "GET"
      })
      return await response.json()
    }
  })

  const {data: dataTodos} = useQuery({
    queryKey: ["todoSummary"],
    queryFn: async() => {
      const response = await fetch(`${API_URL}/api/todoList/summary`, {
        credentials: 'include',
        method: "GET"
      })
      return await response.json()
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
      queryClient.invalidateQueries({queryKey:["todoSummary"]})
    }
  })



  return(
    <div className='w-full h-full flex justify-center items-center'>
      <section className='w-[93%] h-[95%] p-2 flex flex-col gap-2'>
        <div className='h-[55%] w-full flex gap-2'>
          {/* box da financa */}
          <section className='w-[65%] h-full border-1 border-red-800 rounded-lg'>
            <section className='h-[20%] flex justify-between border-b-1 border-red-800'>
              <p className='p-4 text-red-800 text-2xl'>💸 Finanças</p>
              <Link to='/console/workspace/personal/financa' className='text-red-800 p-4 text-lg'>ver todas →</Link>
            </section>
            <section className='h-[80%] w-full flex flex-col'>
              <h1 className='text-red-500 text-2xl p-2'>Ultimas 3 transacoes: </h1>
              {dataFinanca?.ultimas3?.map((index: any) => (
                <div key={index.id} className='flex flex-row justify-between'>
                  <p className={`text-3xl p-2 ${index.tipo === "ganho" ? "text-green-600" : "text-red-600"}`}>
                    {index.tipo}
                  </p>
                  <p className={`text-3xl p-2 ${index.tipo === "ganho" ? "text-green-600" : "text-red-600"}`}>
                    {index.valor}
                  </p>
                </div>
              ))}
            </section>
          {/* box das todos */}
          </section>
          {/* box das todos */}
          <section className='w-[35%] h-full border-1 border-red-800 rounded-lg'>
            <section className='h-[20%] flex justify-between border-b-1 border-red-800'>
              <p className='p-4 text-red-800 text-2xl'>📌 todos</p>
              <Link to='/console/workspace/personal/todo' className='text-red-800 p-4 text-lg'>ver todas →</Link>
            </section>
            <section className='h-[80%] w-full flex flex-col gap-4'>
              {dataTodos?.ultimas3?.map((index: any) => (
                <div key={index.id} className='flex flex-row justify-between mt-2 items-center gap-5'>
                  <p className='text-white text-3xl p-2'>{index.itemName}</p>
                  <button className={`h-10 w-10 rounded-2xl border-1 border-[#252540] flex justify-center items-center mr-2 ${index.doneOrNot === 'pending' ?  "": "bg-[#FFD666]/80"}`}
                          onClick={() => handleSetStatus.mutate({itemId: index.id, doneOrNotStatus: index.doneOrNot})}
                  >
                    {index.doneOrNot === 'pending' ? "" : "✓"}
                  </button>
                </div>
              ))}
            </section>
          </section>
        </div>

        <div className='h-[45%] w-full'>
          <section className='h-full w-full border-1 border-red-800 rounded-lg flex flex-col'>
            {/* box das notas */}
            <section className='h-[20%] flex justify-between border-b-1 border-red-800'>
              <p className='p-4 text-red-800 text-2xl'>📝 Notas Recentes</p>
              <Link to='/console/workspace/personal/notas' className='text-red-800 p-4 text-lg'>ver todas →</Link>
            </section>
            <section className='h-[80%]'>

            </section>
          </section>
        </div>
      </section>
    </div>
  )
}
