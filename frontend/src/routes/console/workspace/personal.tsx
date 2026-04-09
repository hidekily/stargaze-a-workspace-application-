import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/console/workspace/personal')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='w-full h-full overflow-y-auto p-5 bg-[#0A0A0F] flex flex-row'>
      <section className='w-[45%] h-full bg-cyan-800'>
        <div className='h-full bg-zinc-900 w-full'> {/*todo list*/}

        </div>
      </section>

      <section className='w-[55%] h-full bg-cyan-900'>

      </section>
    </div>
  )
}