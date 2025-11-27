import { memo, useEffect } from 'react'
import { useRef } from 'react'
import CardFront from './Sides/CardFront/CardFront.jsx'
import CardBack from './Sides/CardBack/CardBack.jsx'
import CardReady from './Sides/CardReady/CardReady.jsx'
import styles from './Card.module.css'

const Card = ({ card }) => {
  const { text, isFlipped, isEditing, isRemoving } = card
  const cardRef = useRef(null)
  const inputRef = useRef(null)

  const showFront = !text && !isEditing
  const showBack = isEditing
  const showReady = !isEditing && text

  // Autofocus после появления back
  useEffect(() => {
    if (!showBack) return

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
  }, [showBack])

  return (
    <div
      ref={cardRef}
      className={[
        styles.card,
        text || isFlipped ? styles.flipped : '',
        isRemoving ? styles.removing : '',
      ].join(' ')}
    >
      <div className={styles.inner}>
        {showFront && <CardFront card={card} />}
        {showBack && <CardBack card={card} inputRef={inputRef} />}
        {showReady && <CardReady card={card} cardRef={cardRef} />}
      </div>
    </div>
  )
}

export default memo(Card)
