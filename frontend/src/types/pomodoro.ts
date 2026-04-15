import { create } from "zustand"

const pomodoroOptions: Record<number, number> = {
  20: 5,
  40: 10,
  60: 20,
  80: 40,
  100: 50,
  120: 60,
}

interface Pomodoro {
  timeLeft: number
  isRunning: boolean
  sessions: number
  currentSession: number
  focusTime: number
  breakTime: number
  isBreak: boolean

  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  setFocusTime: (minutes: number) => void
  nextSession: () => void
  tick: () => void
}

export const usePomodoro = create<Pomodoro>((set, get) => ({
  timeLeft: 20 * 60,
  isRunning: false,
  sessions: 4,
  currentSession: 1,
  focusTime: 25,
  breakTime: 5,
  isBreak: false,

  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => set((state) => ({
    timeLeft: state.focusTime * 60,
    isRunning: false,
    isBreak: false,
  })),

  setFocusTime: (minutes) => set({
    focusTime: minutes,
    breakTime: pomodoroOptions[minutes],
    timeLeft: minutes * 60,
    isRunning: false,
    isBreak: false,
  }),

  nextSession: () => set((state) => {
    if (state.isBreak) {
      return {
        isBreak: false,
        timeLeft: state.focusTime * 60,
        currentSession: state.currentSession + 1,
        isRunning: false,
      }
    }
    return {
      isBreak: true,
      timeLeft: state.breakTime * 60,
      isRunning: false,
    }
  }),

  tick: () => set((state) => ({ timeLeft: state.timeLeft - 1 })),
}))

export { pomodoroOptions }