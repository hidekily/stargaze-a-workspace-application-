import { ReactNode } from "react"

interface ModalProps{
    header: ReactNode,
    title?: string,
    subtitle?: ReactNode
    buttons?:{
        onclick: () => void
        text?: string
        colorVariant: "add" | "danger" | "mid"
    }[],
    children? : React.ReactNode
}

const variantColors = {
  add: "bg-[#ff6b4a]/20 hover:bg-[#ff6b4a]/35 border border-[#ff6b4a]/40 text-[#ff6b4a]",
  danger: "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300",
  mid: "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300",
}

export function Modal({header, title, subtitle, buttons, children}:ModalProps){
    return(
        <>
            <div className="inset-0 fixed bg-black/60 backdrop-blur-sm flex justify-center items-center w-full h-full z-50">
                <section className="bg-zinc-900 border border-zinc-800 w-[90%] h-auto flex flex-col rounded-2xl gap-5 sm:w-[45%]">
                    <div className="w-full flex flex-col p-6 gap-4 sm:p-8 sm:gap-4">
                        <span className="text-zinc-500 text-sm">{header}</span>
                        <span className="text-xl font-semibold text-white sm:text-2xl">{title}</span>
                        {children}
                        <span className="text-sm text-zinc-400 sm:text-base">{subtitle}</span>
                    </div>

                    <div className="w-full flex p-6 pt-2 gap-3 sm:p-8 sm:pt-2">
                        {buttons && buttons.map((btn, index) => (
                            <button key={index} onClick={btn.onclick} className={`${variantColors[btn.colorVariant]} w-full h-9 rounded-xl text-sm transition-colors duration-150 sm:w-36`}>
                                {btn.text}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
}