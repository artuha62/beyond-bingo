import { useState } from 'react'
import { supabase } from '../../services/supabase.js'
import styles from './AuthForm.module.css'

const Login = ({ onSwitch }) => {
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
