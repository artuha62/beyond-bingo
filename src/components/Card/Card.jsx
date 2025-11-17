import { memo, useContext, useEffect, useState } from 'react'
import CardMenu from '../CardMenu/CardMenu.jsx'
import MenuPortal from '../../MenuPortal.jsx'
import { useRef } from 'react'
import CardFront from './Sides/CardFront/CardFront.jsx'
import CardBack from './Sides/CardBack/CardBack.jsx'
import CardReady from './Sides/CardReady/CardReady.jsx'
import { CardsContext } from '../../context/CardsContext.jsx'
import styles from './Card.module.css'

const Card = ({ card }) => {
  const { id, isFlipped, isEditing, isRemoving } = card
  const { menu, handleOpenMenu, handleMouseUp } = useContext(CardsContext)

  const [showFrontSide, setShowFrontSide] = useState(true)

  const cardRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isEditing) return

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
  }, [isEditing])

  // front side unmount
  useEffect(() => {
    setTimeout(() => {
      if (!isFlipped) return
      setShowFrontSide(false)
    }, 300)
  }, [isFlipped])

  return (
    <div
      ref={cardRef}
      className={[
        styles.card,
        isFlipped ? styles.flipped : '',
        isRemoving ? styles.removing : '',
      ].join(' ')}
      onPointerDown={() => handleOpenMenu(id, isEditing, cardRef)}
      onPointerUp={handleMouseUp}
    >
      <div className={styles.inner}>
        {showFrontSide && <CardFront card={card} />}

        {isEditing ? (
          <CardBack card={card} inputRef={inputRef} />
        ) : (
          <CardReady card={card} />
        )}
      </div>

      <MenuPortal>
        {menu.openCardId === id && <CardMenu card={card} menu={menu} />}
      </MenuPortal>
    </div>
  )
}

export default memo(Card)
