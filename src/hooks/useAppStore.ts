import { create } from 'zustand'
import type { Contact, UserPublic } from '@/typings'
import { Language, Theme } from '@/typings'

interface State {
  theme: Theme
  language: Language
  userInfo: UserPublic
  contactList: Contact[]
}

interface Actions {
  setTheme: (theme: Theme) => void
  setUserInfo: (userInfo: UserPublic) => void
  setContactList: (contactList: Contact[]) => void
}

type Store = State & Actions

export const useAppStore = create<Store>(set => ({
  theme: Theme.Light,
  language: Language.Zh,
  userInfo: {} as UserPublic,
  contactList: [],

  setTheme: theme => set({ theme }),
  setUserInfo: userInfo => set({ userInfo }),
  setContactList: contactList => set({ contactList }),
}))
