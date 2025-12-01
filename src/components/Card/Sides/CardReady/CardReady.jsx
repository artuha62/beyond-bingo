import { useContext, useRef } from 'react'
import { ActionsContext } from '../../../../context/CardsContext.jsx'
import { surface } from '../../Surface/CardSurface.module.scss'
import styles from './CardReady.module.scss'

const LONG_PRESS_DELAY = 450
const MOVE_THRESHOLD = 16

const CardReady = ({ card: { id, text, count }, cardRef }) => {
  const { handleIncrementCounter, handleOpenMenu } = useContext(ActionsContext)

  const startTime = useRef(0)
  const startPos = useRef({ x: 0, y: 0 })
  const moved = useRef(false)
  const longPressTimer = useRef(null)

  const onPointerDown = (event) => {
    moved.current = false
    startTime.current = Date.now()
    startPos.current = { x: event.clientX, y: event.clientY }

    longPressTimer.current = setTimeout(() => {
      if (!moved.current) {
        handleOpenMenu(id, cardRef)
      }
    }, LONG_PRESS_DELAY)
  }

  const onPointerMove = (event) => {
    if (moved.current) return

    const distanceX = Math.abs(event.clientX - startPos.current.x)
    const distanceY = Math.abs(event.clientY - startPos.current.y)

    if (distanceX > MOVE_THRESHOLD || distanceY > MOVE_THRESHOLD) {
      moved.current = true
      clearTimeout(longPressTimer.current)
    }
  }

  const onPointerUp = () => {
    clearTimeout(longPressTimer.current)

    if (moved.current) return

    const pressDuration = Date.now() - startTime.current

    if (pressDuration < LONG_PRESS_DELAY) {
      handleIncrementCounter(id)
    }
  }

  return (
    <div
      className={`${surface} ${styles.readySide}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="button"
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
