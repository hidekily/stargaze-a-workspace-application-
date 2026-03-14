import { createFileRoute} from '@tanstack/react-router'
import {authClient} from '../lib/auth-client'
import {rateLimit, throttle} from '@tanstack/react-pacer'
import { StarField } from '@/components/Starfield';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const getRedirectURL = () => window.location.origin + "/console/workspace";

  const tryLogin = rateLimit(
    throttle(
        async(provider: "google") => {
        const data = await authClient.signIn.social({
          provider,
          callbackURL: getRedirectURL()
        })
        if(data.error){
          alert(data.error.message)
        }
      },
      {wait: 5000}
    ),
    {
      limit: 5,
      window: 60 * 500,
      onReject: () => {
        alert("too many attempts, try again in 30 minutes")
      },
    }
  )

  return (
    <>
      <div className='relative bg-[#12121C] w-full h-full flex justify-center items-center'>
        <StarField />

        <section className='relative z-10 w-full h-full flex flex-row'>
          <section className='w-[50%] h-full flex flex-col p-14 gap-5'>
            <span className='text-[#FF6B4A] text-4xl'>Stargaze | ✨</span>
            {<span className='text-lg break-normal w-[90%] text-[#E8E8F0]'>
              Your space to
              <span className='text-[#FFD666] italic bold'> organize life</span>,
              <span className='text-[#7BA3FF] italic bold'> track goals</span>,
              <span className='text-[#FFB347] italic bold'> share expenses</span>, 
              <span className='text-[#FF6B4A] italic bold'> and plan with people that matter</span>. 
              Minimalistic design with bright accents that <span className='text-[#FF6B4A] bold italic'>guide </span>
              your focus to what matters.
            </span>}
          </section>

          <section className='w-[50%] h-full flex flex-col justify-center items-center opacity-80'>
              <section className='rounded-2xl w-[80%] h-[65%] bg-[#1A1A2E] shadow-lg shadow-white flex flex-col justify-center items-center gap-5'>
                <button onClick={() => tryLogin('google')} className='bg-white w-[80%] h-[15%] rounded-lg flex justify-center items-center text-center gap-2'>
                  <span className='google'></span>
                  <span>google</span>
                </button>

                <button onClick={() => tryLogin('google')} className='bg-white w-[80%] h-[15%] rounded-lg flex justify-center items-center text-center gap-2'>
                  <span className='google'></span>
                  <span>Apple</span>
                </button>

                <button onClick={() => tryLogin('google')} className='bg-white w-[80%] h-[15%] rounded-lg flex justify-center items-center text-center gap-2'>
                  <span className='google'></span>
                  <span>Microsoft</span>
                </button>
              </section>
          </section>
        </section>
      </div>
    </>
  )
}
