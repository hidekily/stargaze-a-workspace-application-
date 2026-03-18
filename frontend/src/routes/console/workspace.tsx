import { createFileRoute } from '@tanstack/react-router'
import { StarField } from '@/components/Starfield'
import { Outlet, Link } from '@tanstack/react-router'
import { Session } from '@/types/session'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Personal } from './workspace/personal'

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

            <div className='relative w-full h-full flex flex-col items-center'>
              <section className='w-[80%] h-[10%] flex flex-row items-center gap-6'>
                <div className='w-[30%] customfont text-[#FFB347] flex justify-center'>
                  <span>{session?.user.id + "👻"}</span>
                </div>
                <div className='w-[70%] flex flex-row justify-center gap-7 text-[#FF6B4A]'>
                  <button onClick={() => setTab("personal")} className={`${tab === 'personal' ? 'text-lg' : 'text-md'} duration-400 transition-all`}>
                    Personal
                  </button> |
                  <Link to='/console/workspace/social' onClick={() => setTab("social")} className={`${tab === "social" ? 'text-lg' : 'text-md'} duration-400 transition-all`}>
                    Social
                  </Link> |
                  <Link to='/console/workspace/professional' onClick={() => setTab('professional')} className={`${tab === 'professional' ? 'text-lg ': 'text-md'} duration-400 transition-all`}>
                    Professional
                  </Link>
                </div>
              </section>
              {/* fim da navbar e comeco do outlet */}
              <section>
                {tab === 'personal' ? <Personal /> : <Outlet />}
              </section>
            </div>
        </div>
    </>
  )
}
