import { useState } from 'react'
import Login from './Login.jsx'
import Registration from './Registration.jsx'
import styles from './Auth.module.scss'

const Auth = () => {
  const [mode, setMode] = useState('login')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.formsWrapper} data-mode={mode}>
            <div className={styles.formSlide}>
              <Login onSwitch={() => setMode('register')} />
            </div>

            <div className={styles.formSlide}>
              <Registration onSwitch={() => setMode('login')} />
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.blank}></div>
        </div>
      </div>
    </div>
  )
}

export default Auth
