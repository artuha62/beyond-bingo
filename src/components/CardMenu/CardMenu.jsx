import { useContext } from 'react'
import { ActionsContext, MenuDataContext } from '../../context/CardsContext.jsx'
import { FaPencil } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { RiResetLeftFill } from 'react-icons/ri'
import styles from './CardMenu.module.css'

const CardMenu = () => {
  const { menu } = useContext(MenuDataContext)
  const {
    handleRenameCard,
    handleDeleteCard,
    handleResetCounter,
    handleCloseMenu,
  } = useContext(ActionsContext)

  const { openCardId: id, position } = menu

  if (!position || !id) return null

  return (
    <div
      className={styles.menu}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        className={styles.icon}
        onClick={() => {
          handleCloseMenu()
          handleRenameCard(id)
        }}
      >
        <FaPencil size={30} />
      </button>

      <button
        className={styles.icon}
        onClick={() => {
          handleCloseMenu()
          handleResetCounter(id)
        }}
      >
        <RiResetLeftFill size={35} />
      </button>

      <button
        className={styles.icon}
        onClick={() => {
          handleCloseMenu()
          handleDeleteCard(id)
        }}
      >
        <MdDeleteOutline size={35} />
      </button>

      <button className={styles.icon} onClick={handleCloseMenu}>
        <TiDelete size={40} />
      </button>
    </div>
  )
}

export default CardMenu
