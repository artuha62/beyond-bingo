import { useState } from 'react'
import { supabase } from '../supabase.js'

const Registration = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (event) => {
    event.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })

    if (email) alert('Вы успешно зарегистрировались!')

    if (error) {
      alert(error.message)
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
      <h1>Регистрация</h1>
      <form onSubmit={handleRegister}>
        <p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={email}
            placeholder="Email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            value={password}
            placeholder="Password"
            type="password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <button>Регистрация</button>
      </form>
    </div>
  )
}

export default Registration
