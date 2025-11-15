import styles from './CardMenu.module.css'
import { FaPencil } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { RiResetLeftFill } from 'react-icons/ri'
import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'

const CardMenu = ({ card, menu }) => {
  const {
    handleRenameCard,
    handleDeleteCard,
    handleResetCounter,
    handleCloseMenu,
  } = useContext(CardsContext)

  if (!menu.position) return null

  return (
    <div
      className={styles.menu}
      style={{
        left: menu.position.x,
        top: menu.position.y,
      }}
    >
      <button className={styles.icon} onClick={() => handleRenameCard(card.id)}>
        <FaPencil size={30} />
      </button>
      <button
        className={styles.icon}
        onClick={() => handleResetCounter(card.id)}
      >
        <RiResetLeftFill size={35} />
      </button>
      <button className={styles.icon} onClick={() => handleDeleteCard(card.id)}>
        <MdDeleteOutline size={35} />
      </button>

      <button className={styles.icon} onClick={handleCloseMenu}>
        <TiDelete size={40} />
      </button>
    </div>
  )
}

export default CardMenu
