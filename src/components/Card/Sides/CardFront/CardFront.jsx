import { useContext } from 'react'
import { CardsContext } from '../../../../context/CardsContext.jsx'
import { surface } from '../../Surface/CardSurface.module.css'
import styles from './CardFront.module.css'

const CardFront = ({ card: { id } }) => {
  const { handleFlip } = useContext(CardsContext)
  return (
    <div
      className={`${surface} ${styles.frontSide} ${styles.pulseAnimation}`}
      onClick={() => handleFlip(id)}
    >
      <p className={styles.plusButton}>+</p>
    </div>
  )
}

export default CardFront
