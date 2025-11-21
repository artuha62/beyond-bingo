import { useAuth } from '../../hooks/useAuth.js'
import { Navigate } from 'react-router'

const PrivateRoute = ({ element }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Загрузка...</div>
  }
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return element
}

export default PrivateRoute
