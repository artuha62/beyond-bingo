import Title from '../Title/Title.jsx'
import Sidebar from '../Sidebar/Sidebar.jsx'
import { useState } from 'react'
import BurgerButton from '../UI/BurgerButton/BurgerButton.jsx'
import styles from './Header.module.scss'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSidebarOpen = () => {
    setMenuOpen(true)
  }
  return (
    <div className={styles.header}>
      <div className={styles.spacer} />
      <Title />
      <div className={styles.menuWrapper}>
        <BurgerButton onClick={handleSidebarOpen} disabled={menuOpen} />
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  )
}

export default Header
