import { memo, useContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import CardFront from './Sides/CardFront/CardFront.jsx'
import CardBack from './Sides/CardBack/CardBack.jsx'
import CardReady from './Sides/CardReady/CardReady.jsx'
import { ActionsContext } from '../../context/CardsContext.jsx'
import styles from './Card.module.css'

const Card = ({ card }) => {
  console.log(`🔄 Рендер карточки: ${card.text}, count = ${card.count}`)
  const { id, text, isFlipped, isEditing, isRemoving } = card
  const { handleOpenMenu, handleMouseUp } = useContext(ActionsContext)

  const isFrontInitial = !text && !isEditing
  const isBackInitial = isEditing

  const [showFront, setShowFront] = useState(isFrontInitial)
  const [showBack, setShowBack] = useState(isBackInitial)

  const cardRef = useRef(null)
  const inputRef = useRef(null)

  // управление анимацией флипа
  useEffect(() => {
    if (!isEditing) return

    if (showFront) {
      setShowBack(true)

      const flipTimer = setTimeout(() => {
        setShowFront(false)
      }, 300)

      return () => clearTimeout(flipTimer)
    } else {
      setShowBack(true)
      setShowFront(false)
    }
  }, [isEditing, showFront])

  useEffect(() => {
    if (!isEditing && text) {
      setShowBack(false)
      setShowFront(false)
    }
  }, [isEditing, text])

  // autofocus после появления back
  useEffect(() => {
    if (!showBack || !isEditing) return

    const node = cardRef.current
    if (!node) return

    const handleEnd = () => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
      node.removeEventListener('transitionend', handleEnd)
    }

    node.addEventListener('transitionend', handleEnd)

    return () => node.removeEventListener('transitionend', handleEnd)
  }, [showBack, isEditing])

  return (
    <div
      ref={cardRef}
      className={[
        styles.card,
        text || isFlipped ? styles.flipped : '',
        isRemoving ? styles.removing : '',
      ].join(' ')}
      onPointerDown={() => handleOpenMenu(id, isEditing, cardRef)}
      onPointerUp={handleMouseUp}
    >
      <div className={styles.inner}>
        {/* FRONT — пустая карточка */}
        {showFront && <CardFront card={card} />}

        {/* BACK — режим редактирования */}
        {showBack && <CardBack card={card} inputRef={inputRef} />}

        {/* READY — готовая карточка с текстом */}
        {!isEditing && text && <CardReady card={card} />}
      </div>
    </div>
  )
}

export default memo(Card)
