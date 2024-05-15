import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface State {
  video: boolean
}

interface Actions {
  setVideo: (video: boolean) => void
}

type Store = State & Actions

export const useStateStore = create(
  immer<Store>((set) => ({
    video: false,

    setVideo: (video) => set({ video })
  }))
)
