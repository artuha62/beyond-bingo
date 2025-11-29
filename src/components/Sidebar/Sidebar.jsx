import { useContext } from 'react'
import { ActionsContext } from '../../context/CardsContext.jsx'
import { supabase } from '../../services/supabase.js'
import styles from './Sidebar.module.scss'

const Sidebar = ({ isOpen, onClose }) => {
  const { handleDeleteAllCards } = useContext(ActionsContext)
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.button} onClick={handleDeleteAllCards}>
          Удалить все карточки
        </button>

        <button className={styles.button} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </>
  )
}

export default Sidebar
