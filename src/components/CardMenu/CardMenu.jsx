import styles from './CardMenu.module.css'
import { FaPencil } from 'react-icons/fa6'
import { MdDeleteOutline } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import { RiResetLeftFill } from 'react-icons/ri'

const CardMenu = ({
  position,
  onRename,
  onDelete,
  onClose,
  onResetCounter,
}) => {
  if (!position) return null

  return (
    <div
      className={styles.menu}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button className={styles.icon} onClick={onRename}>
        <FaPencil size={22} />
      </button>
      <button className={styles.icon} onClick={onResetCounter}>
        <RiResetLeftFill size={26} />
      </button>
      <button className={styles.icon} onClick={onDelete}>
        <MdDeleteOutline size={26} />
      </button>

      <button className={styles.icon} onClick={onClose}>
        <TiDelete size={26} />
      </button>
    </div>
  )
}

export default CardMenu
