import { Outlet } from "@tanstack/react-router"

export function TabBar(){
  return(
    <>
        <div className="h-full w-[14%] bg-[#12121C] opacity-95">
            {data.map(() => (
                
            ))}
        </div>

        <Outlet />
    </>
  )
}