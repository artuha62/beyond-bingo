import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Сначала получаем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Подписываемся на изменения (срабатывает только при реальных изменениях)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Обновляем только если событие реально произошло
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
