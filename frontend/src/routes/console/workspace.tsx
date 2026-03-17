import { createFileRoute } from '@tanstack/react-router'
import { StarField } from '@/components/Starfield'
import { Outlet, Link } from '@tanstack/react-router'
import { Session } from '@/types/session'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/console/workspace')({
  component: RouteComponent,
})

function RouteComponent() {
  const [session, setSession] = useState<Session | null>()

  async function fetchSesssion(){
    const {data} = await authClient.getSession();
    setSession(data)
  }

  useEffect(() =>{
    fetchSesssion()
  }, [])

  return (
    <>
        <div className='w-full h-full relative bg-black'>
            <StarField />

            <div className='relative w-full h-full flex flex-col items-center'>
              <section className='w-[80%] h-[10%] bg-teal-800 flex flex-row justify-center items-center gap-6'>
                {session?.user.name + "✨"}
                <Link to={'/console/workspace/hideki'}>Hideki</Link>
                <Link to={'/console/workspace/link'}>link</Link>
                <Link to={'/console/workspace/teste'}>teste</Link>
              </section>
              <section>
                <Outlet />
              </section>
            </div>
            //ainda tenho q pensar no design... + configurar o ambiente pq o backend ta sem o docker p drizzle rodar. dps disso -- fzr o design, pensar no workflow das functions e fzr a API com fastify p functions. AMEM DEUS EU ODEIO git merge conflict
        </div>
    </>
  )
}
