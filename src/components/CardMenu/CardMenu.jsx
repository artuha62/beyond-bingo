import styles from './CardMenu.module.css'
import { AnimatePresence, motion } from 'motion/react'
import { FaPencil } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'

const CardMenu = ({
  showMenu,
  menuPosition,
  menuRename,
  menuDelete,
  handleCloseMenu,
}) => {
  if (!menuPosition) return null

  const { top, left, width, height } = menuPosition
  const menuWidth = 220
  const menuHeight = 74
  return (
    <>
      {/* Меню остается на месте */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className={styles.menu}
            style={{
              left: left + (width - menuWidth) / 2,
              top: top + (height - menuHeight) / 2,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <button className={styles.icon} onClick={menuRename}>
              <FaPencil size={22} />
            </button>
            <button className={styles.icon} onClick={menuDelete}>
              <MdDeleteOutline size={26} />
            </button>
            <button className={styles.icon} onClick={handleCloseMenu}>
              <TiDelete size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CardMenu
