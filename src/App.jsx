import Bingo from './pages/Bingo.jsx'
import { CardsProvider } from './context/CardsContext.jsx'
import { Navigate, Route, Routes } from 'react-router'
import { useAuth } from './hooks/useAuth.js'
import Auth from './pages/Auth.jsx'

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
            <Navigate to="/auth" />
          )
        }
      />

      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
