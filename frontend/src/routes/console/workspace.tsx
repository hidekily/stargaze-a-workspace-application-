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

            <div className='relative w-full h-full flex flex-row md:flex-row'>
              <section className='h-[8%] md:h-full w-full md:w-[7%] bg-[#0A0A0F] flex flex-row md:flex-col opacity-90'>
                <section className='w-[80%] md:w-full h-full md:h-[80%] flex flex-row md:flex-col items-center gap-8'>
                  {/*  */}
                    <Link to='/console/workspace/personal' 
                      className='border-1 rounded-full h-full w-[20%] flex flex-col justify-center items-center lg:mt-5 md:h-[15%] md:w-[80%] text-[#FF6B4A]'>
                      <span className='personal'/>
                      <span className='hidden md:block'>personal</span>
                    </Link>

                    <Link to='/console/workspace/job' 
                      className='border-1 rounded-full h-full w-[20%] flex flex-col justify-center items-center md:h-[15%] md:w-[80%] text-[#4A6BFF]'>
                      <span className='professional'/>
                      <span className='hidden md:block'>work</span>
                    </Link>

                    <Link to='/console/workspace/social' 
                      className='border-1 rounded-full h-full w-[20%] flex flex-col justify-center items-center md:h-[15%] md:w-[80%] text-[#FFD666]'>
                      <span className='social'/>
                      <span className='hidden md:block'>friends</span>
                    </Link>
                  {/*  */}
                </section>

                <section className='w-[20%] md:w-full h-full md:h-[20%] flex flex-row md:flex-col justify-center items-center gap-4 text-[#FFD666]'>
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
