import styles from './CardMenu.module.css'
import { FaPencil } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { RiResetLeftFill } from 'react-icons/ri'
import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'

const CardMenu = ({ card: { id }, menu: { position } }) => {
  const {
    handleRenameCard,
    handleDeleteCard,
    handleResetCounter,
    handleCloseMenu,
  } = useContext(CardsContext)

  if (!position) return null

  return (
    <div
      className={styles.menu}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button className={styles.icon} onClick={() => handleRenameCard(id)}>
        <FaPencil size={30} />
      </button>
      <button className={styles.icon} onClick={() => handleResetCounter(id)}>
        <RiResetLeftFill size={35} />
      </button>
      <button className={styles.icon} onClick={() => handleDeleteCard(id)}>
        <MdDeleteOutline size={35} />
      </button>

      <button className={styles.icon} onClick={handleCloseMenu}>
        <TiDelete size={40} />
      </button>
    </div>
  )
}

export default CardMenu
