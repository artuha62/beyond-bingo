import { Navigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import Auth from '../../pages/Auth/Auth.jsx'

const AuthGuard = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        style={{
          width: 1366,
          height: 1024,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#f5c507',
        }}
      >
        <div
          style={{
            width: '70px',
            height: '70px',
            border: '10px solid white',
            borderTop: '10px solid black',
            borderRadius: '50%',
            animation: 'spin 0.4s linear infinite',
          }}
        ></div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Auth />
}

export default AuthGuard
