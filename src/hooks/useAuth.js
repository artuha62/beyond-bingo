import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await new Promise((resolve) => setTimeout(resolve, 0))

      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === 'SIGNED_IN' ||
          event === 'SIGNED_OUT' ||
          event === 'TOKEN_REFRESHED'
        ) {
          setUser(session?.user ?? null)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
