import { createFileRoute } from '@tanstack/react-router'
import { usePomodoro } from '@/types/pomodoro'
import { useState } from 'react'

export const Route = createFileRoute('/console/workspace/personal/pomodoro')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    timeLeft,
    isRunning, 
    sessions, 
    currentSession, 
    focusTime,
    breakTime, 
    isBreak, 
    pauseTimer, 
    startTimer, 
    resetTimer, 
    setFocusTime,
    nextSession
  } = usePomodoro()

  const options = [20, 40, 60, 80, 100, 120]
  
  

  return(
    <>
      <div className='h-[100%] w-full text-[#FF6B4A]'>
        <section className='w-[70%] h-full flex flex-col items-center'>
          <div className='h-[45%] w-full flex flex-col justify-center items-center text-[#ff6b4a] gap-5'>
            <span className='text-lg'>Pomodoro 🍅</span>
            <span className='text-9xl'>{timeLeft}</span>
            <span>{"sessão " + currentSession + ` de ` + sessions}</span>
          </div>

          <div className='h-[10%] w-full flex flex-row justify-center items-center text-md gap-5'>
            {options.map((index) => (
              <a key={index} className={`set-timer ${focusTime === index ? "bg-[#ff6b4a]/40 border-[#ff6b3a]/50 border-1" : "bg-zinc-800 border-1 border-zinc-600"}`} onClick={() => setFocusTime(index)}>
                {index}
              </a>
            ))}
          </div>

          <div className='h-[30%] w-full flex flex-row justify-center items-center gap-15'>
            <button onClick={() => {startTimer()}} className='w-45 h-20 rounded-lg bg-zinc-800 border-1 border-[#ff6b4a]'>Start</button>
            <button onClick={() => {pauseTimer()}} className='w-45 h-20 rounded-lg bg-zinc-800 border-1 border-[#ff6b4a]'>Pause</button>
            <button onClick={() => {resetTimer()}} className='w-45 h-20 rounded-lg bg-zinc-800 border-1 border-[#ff6b4a]'>Reset</button>
          </div>
        </section>
      </div>
    </>
  )
}
