import Bingo from './pages/Bingo.jsx'
import { CardsProvider } from './context/CardsContext.jsx'
import { Navigate, Route, Routes } from 'react-router'
import Registration from './pages/Registration.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './hooks/useAuth.js'

const App = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <CardsProvider>
              <Bingo />
            </CardsProvider>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/registration"
        element={user ? <Navigate to="/" replace /> : <Registration />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
