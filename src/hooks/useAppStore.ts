import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Contact, UserPublic } from '@/typings'
import { Language, Theme } from '@/typings'

interface State {
  theme: Theme
  primaryColor: string
  layoutColor: string
  language: Language
  userInfo: UserPublic
  contactList: Contact[]
  contactMap: Map<string, Contact>
}

interface Actions {
  setTheme: (theme: Theme) => void
  setPrimaryColor: (primaryColor: string) => void
  setLayoutColor: (layoutColor: string) => void
  setUserInfo: (userInfo: UserPublic) => void
  setContactList: (contactList: Contact[]) => void
}

type Store = State & Actions

export const useAppStore = create(
  persist(
    immer<Store>((set) => ({
      theme: Theme.Light,
      primaryColor: '#5e7e1e',
      layoutColor: '#f0f2f5',
      language: Language.Zh,
      userInfo: {} as UserPublic,
      contactList: [],
      contactMap: new Map(),

      setTheme: (theme) => set({ theme }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setLayoutColor: (layoutColor) => set({ layoutColor }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setContactList: (contactList) => {
        const contactMap = new Map<string, Contact>()
        contactList.forEach((contact) => contactMap.set(contact._id, contact))
        set({ contactList, contactMap })
      }
    })),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage),
      partialize(state) {
        return {
          theme: state.theme,
          primaryColor: state.primaryColor,
          language: state.language
        }
      }
    }
  )
)
