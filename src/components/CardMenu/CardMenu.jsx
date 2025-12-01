import { useContext, useLayoutEffect, useState } from 'react'
import { ActionsContext, MenuDataContext } from '../../context/CardsContext.jsx'
import { FaPencil } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { RiResetLeftFill } from 'react-icons/ri'
import styles from './CardMenu.module.scss'

const CardMenu = () => {
  const { menu } = useContext(MenuDataContext)
  const {
    handleRenameCard,
    handleDeleteCard,
    handleResetCounter,
    handleCloseMenu,
  } = useContext(ActionsContext)

  const { openCardId, cardPosition } = menu
  const isOpen = !!openCardId

  // Centering the menu on the card
  const [coords, setCoords] = useState(null)

  useLayoutEffect(() => {
    if (!cardPosition) return

    const centerCardX = cardPosition.left + cardPosition.width / 2
    const centerCardY = cardPosition.top + cardPosition.height / 2

    setCoords({ x: centerCardX, y: centerCardY })
  }, [cardPosition])

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.open : ''}`}
        onClick={handleCloseMenu}
      />

      <div
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        style={{
          left: coords?.x,
          top: coords?.y,
        }}
      >
        <button
          className={styles.icon}
          onClick={() => {
            handleCloseMenu()
            handleRenameCard(openCardId)
          }}
          disabled={!isOpen}
        >
          <FaPencil />
        </button>

        <button
          className={styles.icon}
          onClick={() => {
            handleCloseMenu()
            handleResetCounter(openCardId)
          }}
          disabled={!isOpen}
        >
          <RiResetLeftFill />
        </button>

        <button
          className={styles.icon}
          onClick={() => {
            handleCloseMenu()
            handleDeleteCard(openCardId)
          }}
          disabled={!isOpen}
        >
          <MdDeleteOutline />
        </button>

        <button
          className={styles.icon}
          onClick={handleCloseMenu}
          disabled={!isOpen}
        >
          <TiDelete />
        </button>
      </div>
    </>
  )
}

export default CardMenu
