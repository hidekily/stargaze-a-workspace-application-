import { createFileRoute } from '@tanstack/react-router'
import { StarField } from '@/components/Starfield';

export const Route = createFileRoute('/console/workspace')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <div className='w-full h-full relative bg-black'>
            <StarField />

            <div className='relative w-full h-full flex flex-row'>
            
            </div>
            //ainda tenho q pensar no design... + configurar o ambiente pq o backend ta sem o docker p drizzle rodar. dps disso -- fzr o design, pensar no workflow das functions e fzr a API com fastify p functions. AMEM DEUS EU ODEIO git merge conflict
        </div>
    </>
  )
}
