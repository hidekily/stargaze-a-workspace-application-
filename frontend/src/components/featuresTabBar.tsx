import React from "react"

export function TabBar({children} : {children: React.ReactNode}){
  return(
    <>
        <div className="h-full w-[14%] bg-[#12121C] opacity-95 flex flex-col items-center">
          {children}
        </div>
    </>
  )
}