import { useState } from 'react'
import { supabase } from '../supabase.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Вы успешно вошли!')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 50,
      }}
    >
      <h1>Вход</h1>
      <form onSubmit={handleLogin}>
        <p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>
        <button>Войти</button>
      </form>
    </div>
  )
}

export default Login
