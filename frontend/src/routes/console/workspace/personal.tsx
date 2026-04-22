import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useLocation } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal')({
  beforeLoad: ({location}) => {
    if(location.pathname === "/console/workspace/personal"){
      throw redirect({to : "/console/workspace/personal/dashboard"})
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
    const pathname = useLocation().pathname
    const active = pathname.includes("/personal/dashboard") ? "dashboard" 
    : pathname.includes('/personal/financa') ? 'financa' 
    : pathname.includes('/personal/notas') ? "notas" 
    : pathname.includes('/personal/pomodoro') ? 'pomodoro' 
    : pathname.includes('/personal/todo') ? "todo" 
    : pathname.includes('/personal/calendario') ? 'calendario' 
    : null

    const tabProps = {
      dashboard : {name: "dashboard", tab: "dashboard" ,linkto: "/console/workspace/personal/dashboard"},
      financa: {name: "finança", tab: "financa", linkto: "/console/workspace/personal/financa"},
      notas: {name: "notas", tab: "notas", linkto: '/console/workspace/personal/notas'},
      pomodoro: {name: "pomodoro", tab: "pomodoro", linkto: '/console/workspace/personal/pomodoro'},
      todo: {name: "todo", tab: "todo", linkto: "/console/workspace/personal/todo"},
      calendario: {name: "calendario", tab: "calendario", linkto: "/console/workspace/personal/calendario"}
    }

  return (
    <div className='w-full h-full'>
      <nav className='h-20 w-full border-b-[0.5px] border-[#252540] flex flex-row items-end justify-center gap-[5%] text-[#9898B0] fixed bg-[#0A0A0F]'>
        {Object.values(tabProps).map((index: any) => (
          <Link key={index.tab} to={index.linkto}
                className={`personal-tab-navbar ${active === index.tab ?  "text-lg text-[#FF6B4A] border-b border-[#FF6B4A]" : ""}`}
          >
            {index.name}
          </Link>
        ))}
      </nav>

      <div className='pt-20 h-full w-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}
