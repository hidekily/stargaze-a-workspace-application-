import { API_URL } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {

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
            <section className='h-[80%]'>
              {dataFinanca?.last3ItemsFromFinanca?.map((index: any) => (
                <div key={index.id}>
                  <p>{index.name}</p>
                </div>
              ))}
            </section>
          {/* box das todos */}
          </section>
          <section className='w-[35%] h-full border-1 border-red-800 rounded-lg'>
            <section className='h-[20%] flex justify-between border-b-1 border-red-800'>
              <p className='p-4 text-red-800 text-2xl'>📌 todos</p>
              <Link to='/console/workspace/personal/todo' className='text-red-800 p-4 text-lg'>ver todas →</Link>
            </section>
            <section className='h-[80%]'>

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
