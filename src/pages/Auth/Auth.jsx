import { useState } from 'react'
import Login from './Login.jsx'
import Registration from './Registration.jsx'
import styles from './Auth.module.css'

const Auth = () => {
  const [mode, setMode] = useState('login')
  const [isTransitioning, setIsTransitioning] = useState(false)

  return (
    <div
      className={`${styles.wrapper} ${isTransitioning ? styles.fadeOut : ''}`}
    >
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.formsWrapper} data-mode={mode}>
            <div className={styles.formSlide}>
              <Login
                onSwitch={() => setMode('register')}
                onLoginSuccess={() => setIsTransitioning(true)}
              />
            </div>

            <div className={styles.formSlide}>
              <Registration
                onSwitch={() => setMode('login')}
                onRegisterSuccess={() => setIsTransitioning(true)}
              />
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
