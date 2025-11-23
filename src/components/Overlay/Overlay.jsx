import { ActionsContext, MenuDataContext } from '../../context/CardsContext.jsx'
import styles from './Overlay.module.css'
import { useContext } from 'react'

const Overlay = () => {
  const { menu } = useContext(MenuDataContext)
  const { handleCloseMenu } = useContext(ActionsContext)

  const isMenuOpen = menu.openCardId !== null || undefined
  return (
    <>
      {isMenuOpen && (
        <div className={styles.overlay} onClick={handleCloseMenu}></div>
      )}
    </>
  )
}

export default Overlay
