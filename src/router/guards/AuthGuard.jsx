import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth.js'
import Auth from '@/pages/Auth/Auth.jsx'
import Loader from '@/components/UI/Loader/Loader.jsx'

const AuthGuard = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Loader/>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Auth />
}

export default AuthGuard
