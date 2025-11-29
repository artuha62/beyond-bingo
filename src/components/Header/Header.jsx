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
      <Title />
      <BurgerButton onClick={handleSidebarOpen} disabled={menuOpen} />

      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

export default Header
