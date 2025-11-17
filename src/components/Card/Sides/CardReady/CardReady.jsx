import { useContext } from 'react'
import { CardsContext } from '../../../../context/CardsContext.jsx'
import { surface } from '../../Surface/CardSurface.module.css'
import styles from './CardReady.module.css'

const CardReady = ({ card: { id, text, count } }) => {
  const { handleIncrementCounter } = useContext(CardsContext)

  return (
    <div
      className={`${surface} ${styles.readySide}`}
      onClick={() => handleIncrementCounter(id)}
    >
      <span className={styles.text}>{text}</span>
      <div className={styles.counter}>
        <div>x</div>
        <div>{count}</div>
      </div>
    </div>
  )
}

export default CardReady
