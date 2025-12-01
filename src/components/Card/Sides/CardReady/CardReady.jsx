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

    const deltaX = Math.abs(event.clientX - startPos.current.x)
    const deltaY = Math.abs(event.clientY - startPos.current.y)

    const timeSincePress = Date.now() - startTime.current

    const isEarlyMovement = timeSincePress < 120 && (deltaX > 1 || deltaY > 1)
    const isScrollGesture = deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD

    if (isEarlyMovement || isScrollGesture) {
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
