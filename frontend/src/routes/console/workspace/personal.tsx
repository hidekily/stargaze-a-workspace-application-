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
  const [activeTab, setActiveTab] = useState<"dashboard" | "financa" | "notas" | "pomodoro" | "todo" | 'calendario'>("dashboard")

  return (
    <div className='w-full h-full'>
      <nav className='h-20 bg-zinc-900 w-full border-b-[0.5px] border-red-900 flex flex-row items-end gap-[5%] text-white'>
        <Link to='/console/workspace/personal/dashboard' 
              className={`personal-tab-navbar ${activeTab === 'dashboard' ?  "text-lg border-b" : ""}`} 
              onClick={() => setActiveTab("dashboard")}>
              dashboard
        </Link>
        <Link to='/console/workspace/personal/financa' 
              className={`personal-tab-navbar ${activeTab === 'financa' ?  "text-lg border-b" : ""}`} 
              onClick={() => setActiveTab("financa")}>
              finança
        </Link>
        <Link to='/console/workspace/personal/notas' 
              className={`personal-tab-navbar ${activeTab === 'notas' ?  "text-lg border-b" : ""}`} 
              onClick={() => setActiveTab("notas")}>
              notas
        </Link>
        <Link to='/console/workspace/personal/pomodoro' 
              className={`personal-tab-navbar ${activeTab === 'pomodoro' ?  "text-lg border-b" : ""}`} 
              onClick={() => setActiveTab("pomodoro")}>
              pomodoro
        </Link>
        <Link to='/console/workspace/personal/todo' 
              className={`personal-tab-navbar ${activeTab === 'todo' ?  "text-lg border-b" : ""}`} 
              onClick={() => setActiveTab("todo")}>
              todo
        </Link>
        <Link to='/console/workspace/personal/calendario' 
              className={`personal-tab-navbar ${activeTab === 'calendario' ?  "text-lg border-b" : ""}`} 
              onClick={() => setActiveTab("calendario")}>
              calendario
        </Link>
      </nav>

      <Outlet />
    </div>
  )
}