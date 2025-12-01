import { IoEllipsisHorizontalCircle } from 'react-icons/io5'
import styles from './BurgerButton.module.scss'

const BurgerButton = ({ onClick, disabled }) => {
  return (
    <button
      className={styles.burgerButton}
      onClick={onClick}
      disabled={disabled}
    >
      <IoEllipsisHorizontalCircle />
    </button>
  )
}

export default BurgerButton
