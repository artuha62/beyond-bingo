import { Navigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import Auth from '../../pages/Auth.jsx'

const AuthGuard = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Auth />
}

export default AuthGuard
