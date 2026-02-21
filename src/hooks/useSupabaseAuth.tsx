import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/useAuthStore'

export const useSupabaseAuth = () => {
  const setRole = useAuthStore((s) => s.setRole)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const role = (session?.user?.user_metadata?.role ?? 'USER').toUpperCase()
      setRole(role === 'ADMIN' ? 'ADMIN' : 'USER')
    })

    return () => subscription.unsubscribe()
  }, [setRole])
}
