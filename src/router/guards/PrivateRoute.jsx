import { useAuth } from '../../hooks/useAuth.js'
import { Navigate } from 'react-router'
import { CardsProvider } from '../../context/CardsContext.jsx'

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Загрузка...</div>
  if (!user) return <Navigate to="/auth" replace />

  return <CardsProvider userId={user.id}>{children}</CardsProvider>
}

export default PrivateRoute
