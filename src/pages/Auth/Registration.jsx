import { useState } from 'react'
import { supabase } from '../../services/supabase.js'
import styles from './AuthForm.module.scss'

const Registration = ({ onSwitch }) => {
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
    <div className={styles.form}>
      <h1 className={styles.title}>Создайте аккаунт</h1>
      <p className={styles.subtitle}>
        Уже зарегистрированы?{' '}
        <span className={styles.link} onClick={onSwitch}>
          Войти
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

      <button className={styles.button} onClick={handleRegister}>
        Создать аккаунт
      </button>
    </div>
  )
}

export default Registration
