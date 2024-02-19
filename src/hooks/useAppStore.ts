import { create } from 'zustand'
import type { User } from '@/typings'
import { Theme } from '@/typings'

interface State {
  theme: Theme
  userInfo: User
}

interface Actions {
  setTheme: (theme: Theme) => void
  setUserInfo: (userInfo: User) => void
}

type Store = State & Actions

export const useAppStore = create<Store>(set => ({
  theme: Theme.Light,
  userInfo: {} as User,

  setTheme: theme => set({ theme }),
  setUserInfo: userInfo => set({ userInfo }),
}))
