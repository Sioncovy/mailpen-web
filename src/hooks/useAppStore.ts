import { create } from 'zustand'
import type { Contact, UserPublic } from '@/typings'
import { Language, Theme } from '@/typings'

interface State {
  theme: Theme
  language: Language
  userInfo: UserPublic
  contactList: Contact[]
  contactMap: Map<string, Contact>
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
  contactMap: new Map(),

  setTheme: theme => set({ theme }),
  setUserInfo: userInfo => set({ userInfo }),
  setContactList: (contactList) => {
    const contactMap = new Map<string, Contact>()
    contactList.forEach(contact => contactMap.set(contact._id, contact))
    set({ contactList, contactMap })
  },
}))
