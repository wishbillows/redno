// src/stores/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'  // 持久化到 localStorage

interface UserInfo {
  id: number
  name: string
  avatar: string
  role: string
}
interface MenuRouter {
  key: string
  label: string
  icon: string
  children?: MenuRouter[]
}

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
  MenuRouter: MenuRouter[]
  setToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  setMenurouter: (MenuRouter: MenuRouter[]) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      MenuRouter:[],
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setMenurouter: (MenuRouter) => set({ MenuRouter }),
      logout: () => set({ token: null, userInfo: null ,MenuRouter:[]}),
    }),
    { name: 'auth-storage' }  // localStorage key
  )
)