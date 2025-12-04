import { useState } from 'react'
import { supabase } from '@/services/supabase.js'
import styles from './AuthForm.module.scss'

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('test62@gmail.com')
  const [password, setPassword] = useState('123456')

  const handleLogin = async (event) => {
    event.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    }
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>С возвращением!</h1>
      <p className={styles.subtitle}>
        Нет учётной записи?{' '}
        <span className={styles.link} onClick={onSwitch}>
          Создайте аккаунт
        </span>
      </p>

      <input
        placeholder="Эл.почта"
        className={styles.input}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        placeholder="Пароль"
        type="password"
        className={styles.input}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button className={styles.button} onClick={handleLogin}>
        Войти
      </button>
    </div>
  )
}

export default Login
