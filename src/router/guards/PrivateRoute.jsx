import { useAuth } from '@/hooks/useAuth.js'
import { Navigate } from 'react-router'
import Loader from '@/components/UI/Loader/Loader.jsx'

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading)
    return (
      <Loader/>
    )
  if (!user) return <Navigate to="/auth" replace />

  return children
}

export default PrivateRoute
