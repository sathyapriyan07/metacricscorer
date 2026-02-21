import { create } from 'zustand'
import type { UserRole } from '../types'

interface AuthState {
  role: UserRole
  setRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'USER',
  setRole: (role) => set({ role }),
}))
