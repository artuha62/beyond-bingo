import { memo, useContext, useEffect } from 'react'
import CardMenu from '../CardMenu/CardMenu.jsx'
import MenuPortal from '../../MenuPortal.jsx'
import { useRef } from 'react'
import CardFront from './CardFront.jsx'
import CardBack from './CardBack.jsx'
import CardReady from './CardReady.jsx'
import { CardsContext } from '../../context/CardsContext.jsx'

const Card = memo(function Card({ card }) {
  const { menu, handleOpenMenu, handleMouseUp } = useContext(CardsContext)

  const cardRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!card.isEditing) return

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
  }, [card.isEditing])

  return (
    <div
      ref={cardRef}
      className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isRemoving ? 'removing' : ''}`}
      onPointerDown={() => handleOpenMenu(card.id, card.isEditing, cardRef)}
      onPointerUp={handleMouseUp}
    >
      <CardFront card={card} />

      {card.isEditing ? (
        <CardBack card={card} inputRef={inputRef} />
      ) : (
        <CardReady card={card} />
      )}

      <MenuPortal>
        {menu.openCardId === card.id && <CardMenu card={card} menu={menu} />}
      </MenuPortal>
    </div>
  )
})

export default Card
