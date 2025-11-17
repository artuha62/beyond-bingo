import { useContext } from 'react'
import { CardsContext } from '../../../../context/CardsContext.jsx'
import base from '../../Surface/CardBase.module.css'
import styles from './CardFront.module.css'

const CardFront = ({ card: { id } }) => {
  const { handleFlip } = useContext(CardsContext)
  return (
    <div
      className={`${base.base} ${styles.frontSide} ${styles.pulseAnimation}`}
      onClick={() => handleFlip(id)}
    >
      <p className={styles.plusButton}>+</p>
    </div>
  )
}

export default CardFront
