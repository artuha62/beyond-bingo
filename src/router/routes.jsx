import { Navigate } from 'react-router'
import PrivateRoute from './guards/PrivateRoute.jsx'
import AuthGuard from './guards/AuthGuard.jsx'
import Bingo from '../pages/Bingo.jsx'

export const routes = [
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Bingo />
      </PrivateRoute>
    ),
  },

  {
    path: '/auth',
    element: <AuthGuard />,
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]
