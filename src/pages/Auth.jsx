import { useState } from 'react'
import Login from './Login'
import Registration from './Registration'

const Auth = () => {
  const [mode, setMode] = useState('login')

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <button
          onClick={() => setMode('login')}
          style={{
            padding: 10,
            fontWeight: mode === 'login' ? 'bold' : 'normal',
          }}
        >
          Войти
        </button>

        <button
          onClick={() => setMode('register')}
          style={{
            padding: 10,
            fontWeight: mode === 'register' ? 'bold' : 'normal',
          }}
        >
          Создать аккаунт
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        {mode === 'login' ? <Login /> : <Registration />}
      </div>
    </div>
  )
}

export default Auth
