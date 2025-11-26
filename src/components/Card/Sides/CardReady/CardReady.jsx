import { useContext, useRef } from 'react'
import { ActionsContext } from '../../../../context/CardsContext.jsx'
import { surface } from '../../Surface/CardSurface.module.css'
import styles from './CardReady.module.css'

const CardReady = ({ card: { id, text, count }, cardRef }) => {
  const { handleIncrementCounter, handleMouseUp, handleOpenMenu } =
    useContext(ActionsContext)

  const pressStartTime = useRef(0)

  const handlePointerDown = () => {
    pressStartTime.current = Date.now()

    handleOpenMenu(id, cardRef)
  }

  const handlePointerUp = () => {
    handleMouseUp()

    const pressDuration = Date.now() - pressStartTime.current

    if (pressDuration < 500) {
      handleIncrementCounter(id)
    }
  }

  return (
    <div
      className={`${surface} ${styles.readySide}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handleMouseUp}
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
