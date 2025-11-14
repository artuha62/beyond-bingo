import { memo, useEffect } from 'react'
import CardMenu from './CardMenu/CardMenu.jsx'
import MenuPortal from '../MenuPortal.jsx'
import { useRef } from 'react'

const Card = memo(function Card({
  card,
  menu,
  handleFlip,
  handleSubmit,
  handleInputChange,
  handleIncrementCounter,
  handleOpenMenu,
  handleCloseMenu,
  handleDeleteCard,
  handleRenameCard,
  handleResetCounter,
  handleMouseUp,
}) {
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
      className={`flip-card
        ${!card.text ? 'flip-card--new' : ''} 
        ${card.isFlipped ? 'flipped' : ''} 
        ${card.isRemoving ? 'removing' : ''}
      `}
      onPointerDown={() => handleOpenMenu(card.id, card.isEditing, cardRef)}
      onPointerUp={handleMouseUp}
    >
      {/* Передняя сторона */}
      <div className="flip-card-plus-pulse">
        <div className="flip-card-plus" onClick={() => handleFlip(card.id)}>
          <p className="hint">+</p>
        </div>
      </div>

      {/* Задняя сторона */}
      {card.isEditing ? (
        <div className="flip-card-text">
          <form
            onBlur={(event) => handleSubmit(card.id, event)}
            onSubmit={(event) => handleSubmit(card.id, event)}
          >
            <input
              ref={inputRef}
              className="flip-card-input"
              type="text"
              placeholder="Напиши что-нибудь..."
              value={card.text}
              onChange={(event) =>
                handleInputChange(card.id, event.target.value)
              }
            />
          </form>
        </div>
      ) : (
        <div
          className="flip-card-body"
          onClick={() => handleIncrementCounter(card.id)}
        >
          <span className="flip-card-description">{card.text}</span>
          <span className="flip-card-counter">
            <div className="counter-body">
              <div>x</div>
              <div>{card.count}</div>
            </div>
          </span>
        </div>
      )}

      {/* Меню */}
      <MenuPortal>
        {menu.openCardId === card.id && (
          <CardMenu
            position={menu.position}
            onRename={() => handleRenameCard(card.id)}
            onDelete={() => handleDeleteCard(card.id)}
            onResetCounter={() => handleResetCounter(card.id)}
            onClose={handleCloseMenu}
          />
        )}
      </MenuPortal>
    </div>
  )
})

export default Card
