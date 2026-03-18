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
              <section className='w-[80%] h-[10%] bg-teal-800 flex flex-row items-center gap-6'>
                <div className='w-[30%] customfont text-[#] flex justify-center'>
                  <span>{session?.user.name + "👻"}</span>
                </div>
                <div className='w-[70%] flex flex-row justify-center gap-7'>
                  <Link to='/console/workspace/hideki'>hideki</Link>
                  <Link to='/console/workspace/link'>link</Link>
                  <Link to='/console/workspace/teste'>teste</Link>
                </div>
              </section>
              {/* fim da navbar e comeco do outlet */}
              <section>
                <Outlet />
              </section>
            </div>
        </div>
    </>
  )
}
