import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal')({
  beforeLoad: ({location}) => {
    if(location.pathname === "/console/workspace/personal"){
      throw redirect({to : "/console/workspace/personal/dashboard"})
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "financa" | "notas" | "pomodoro" | "todo" | 'calendario'>()

  return (
    <div className='w-full h-full'>
      <nav className='h-20 w-full border-b-[0.5px] border-zinc-900 flex flex-row items-end justify-center gap-[5%] text-zinc-500 fixed bg-black'>
        <Link to='/console/workspace/personal/dashboard' 
              className={`personal-tab-navbar ${activeTab === 'dashboard' ?  "text-lg text-[#ffd666] border-b border-[#ffd666]" : ""}`} 
              onClick={() => setActiveTab("dashboard")}>
              dashboard
        </Link>
        <Link to='/console/workspace/personal/financa' 
              className={`personal-tab-navbar ${activeTab === 'financa' ?  "text-lg text-[#ffd666] border-b border-[#ffd666]" : ""}`} 
              onClick={() => setActiveTab("financa")}>
              finança
        </Link>
        <Link to='/console/workspace/personal/notas' 
              className={`personal-tab-navbar ${activeTab === 'notas' ?  "text-lg text-[#ffd666] border-b border-[#ffd666]" : ""}`} 
              onClick={() => setActiveTab("notas")}>
              notas
        </Link>
        <Link to='/console/workspace/personal/pomodoro' 
              className={`personal-tab-navbar ${activeTab === 'pomodoro' ?  "text-lg text-[#ffd666] border-b border-[#ffd666]" : ""}`} 
              onClick={() => setActiveTab("pomodoro")}>
              pomodoro
        </Link>
        <Link to='/console/workspace/personal/todo' 
              className={`personal-tab-navbar ${activeTab === 'todo' ?  "text-lg text-[#ffd666] border-b border-[#ffd666]" : ""}`} 
              onClick={() => setActiveTab("todo")}>
              todo
        </Link>
        <Link to='/console/workspace/personal/calendario' 
              className={`personal-tab-navbar ${activeTab === 'calendario' ?  "text-lg text-[#ffd666] border-b border-[#ffd666]" : ""}`} 
              onClick={() => setActiveTab("calendario")}>
              calendario
        </Link>
      </nav>

      <div className='pt-20 h-full w-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}