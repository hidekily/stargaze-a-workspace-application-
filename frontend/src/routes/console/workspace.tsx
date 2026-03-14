import { createFileRoute } from '@tanstack/react-router'
import { StarField } from '@/components/Starfield';

export const Route = createFileRoute('/console/workspace')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
        <div className='w-full h-full relative'>
            <StarField />
        </div>
    </>
  )
}
