import React from "react"

export function TabBar({children} : {children: React.ReactNode}){
  return(
    <>
        <div className="min-h-[90%] overflow-auto h-full w-[20%] bg-[#12121C] flex flex-col items-center gap-8 border-r-1 border-l-1 border-white">
          {children}
        </div>
    </>
  )
}