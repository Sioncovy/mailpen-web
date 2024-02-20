import { create } from 'zustand'
import type { User } from '@/typings'
import { Language, Theme } from '@/typings'

interface State {
  theme: Theme
  language: Language
  userInfo: User
}

interface Actions {
  setTheme: (theme: Theme) => void
  setUserInfo: (userInfo: User) => void
}

type Store = State & Actions

export const useAppStore = create<Store>(set => ({
  theme: Theme.Light,
  language: Language.Zh,
  userInfo: {} as User,

  setTheme: theme => set({ theme }),
  setUserInfo: userInfo => set({ userInfo }),
}))
