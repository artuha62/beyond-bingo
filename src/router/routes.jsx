import { Navigate } from 'react-router'
import PrivateRoute from './guards/PrivateRoute.jsx'
import AuthGuard from './guards/AuthGuard.jsx'
import Bingo from '../pages/Bingo.jsx'
import { CardsProvider } from '../context/CardsContext.jsx'

export const routes = [
  //private route(bingo page)
  {
    path: '/',
    element: (
      <PrivateRoute
        element={
          <CardsProvider>
            <Bingo />
          </CardsProvider>
        }
      />
    ),
  },

  //public route(authorisation page)
  {
    path: '/auth',
    element: <AuthGuard />,
  },

  //404 error page
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]
