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
  const [tab, setTab] = useState<"personal" | "professional" | "social">("personal")

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

            <div className='relative w-full h-full flex flex-col md:flex-row items-center'>
              <section className='h-[8%] md:h-full w-full md:w-[7%] bg-zinc-800 flex flex-row md:flex-col'>
                <section className='w-[80%] md:w-full h-full md:h-[80%] flex flex-row md:flex-col items-center gap-8 text-[#7BA3FF]'>
                    <div className='border-1 rounded-full h-full w-[20%] flex flex-col justify-center items-center lg:mt-5 md:h-[15%] md:w-[80%]'>
                      <span className='personal'/>
                      <Link to="/console/workspace/personal" className='hidden md:block'>personal</Link>
                    </div>
                    <div className='border-1 rounded-full h-full w-[20%] flex flex-col justify-center items-center md:h-[15%] md:w-[80%]'>
                      <span className='professional'/>
                      <Link to="/console/workspace/job" className='hidden md:block'>job</Link>
                    </div>
                    <div className='border-1 rounded-full h-full w-[20%] flex flex-col justify-center items-center md:h-[15%] md:w-[80%]'>
                      <span className='social'/>
                      <Link to="/console/workspace/social" className='hidden md:block'>social</Link>
                    </div>
                </section>

                <section className='w-[20%] md:w-full bg-zinc-500 h-full md:h-[20%] flex flex-row md:flex-col justify-center items-center gap-4'>
                  <span className='profile'/>
                  <span className='hidden md:block md:text-xs'>profile</span>
                </section>
              </section>
            </div>
        </div>
    </>
  )
}
