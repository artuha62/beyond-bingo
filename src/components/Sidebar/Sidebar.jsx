import { useContext } from 'react'
import { ActionsContext } from '../../context/CardsContext.jsx'
import { supabase } from '../../services/supabase.js'
import { MdLogout } from 'react-icons/md'
import { MdDeleteOutline } from 'react-icons/md'
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
        onPointerDown={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.button} onClick={handleDeleteAllCards}>
          <span>Удалить все карточки</span>
          <MdDeleteOutline />
        </button>

        <button className={styles.button} onClick={handleLogout}>
          <span>Выйти</span>
          <MdLogout />
        </button>
      </div>
    </>
  )
}

export default Sidebar
