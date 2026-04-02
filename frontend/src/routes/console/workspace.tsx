import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Outlet, Link } from '@tanstack/react-router'
import { Session } from '@/types/session'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace')({
  component: RouteComponent,
})

function RouteComponent() {
  const [session, setSession] = useState<Session | null>()
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const active = pathname.includes("/personal") ? "P" : pathname.includes('/social') ? 'S' : pathname.includes('/job') ? "W" : null


  async function fetchSesssion(){
    const {data} = await authClient.getSession();
    setSession(data)
  }

  useEffect(() =>{
    fetchSesssion()
    // navigate({to: '/console/workspace/personal'})
  }, [])

  return (
    <>
        <div className='w-full h-full relative bg-black'>
            <div className='relative w-full h-full flex flex-row md:flex-row'>
              <section className='h-[8%] md:h-full w-full md:w-[10%] bg-[#0A0A0F] flex flex-row md:flex-col opacity-90'>
                <section className='w-[80%] md:w-full h-full md:h-[80%] flex flex-row md:flex-col items-center gap-8'>
                  {/*  */}
                    <Link to='/console/workspace/personal' 
                      className={`border-1 ${active === 'P' ? "bg-[#FF6B4A]/50" : "bg-[#FF6B4A]/10"} rounded-full h-full w-[20%] flex flex-col justify-center items-center lg:mt-5 md:h-[15%] md:w-[80%] text-[#FF6B4A]`}>
                      <span>P</span>
                    </Link>

                    <Link to='/console/workspace/job' 
                      className={`border-1 ${active === 'W' ? "bg-[#4A6BFF]/50" : "bg-[#4A6BFF]/10"} rounded-full h-full w-[20%] flex flex-col justify-center items-center md:h-[15%] md:w-[80%] text-[#4A6BFF]`}>
                      <span>W</span>
                    </Link>

                    <Link to='/console/workspace/social' 
                      className={`border-1 ${active === 'S' ? "bg-[#FFD666]/50" : "bg-[#FFD666]/10"} rounded-full h-full w-[20%] flex flex-col justify-center items-center md:h-[15%] md:w-[80%] text-[#FFD666]`}>
                      <span>S</span>
                    </Link>
                  {/*  */}
                </section>

                <section className='w-full md:w-full h-full md:h-[20%] flex flex-row md:flex-col justify-center items-center gap-4 text-[#FFD666]'>
                  <span className='profile'/>
                  <span className='hidden md:block md:text-xs'>{session?.user.name + "🦥 "}</span>
                </section>
              </section>

              {/*  */}
              <Outlet />
              {/*  */}
            </div>
        </div>
    </>
  )
}
