import { memo } from 'react'
import CardMenu from './CardMenu/CardMenu.jsx'
import MenuPortal from '../MenuPortal.jsx'
import { useRef } from 'react'

const Card = memo(function Card({
  card,
  handleFlip,
  handleSubmit,
  handleInputChange,
  handleIncrementCounter,
  handleOpenMenu,
  handleCloseMenu,
  handleDeleteCard,
  handleRenameCard,
  handleMouseUp,
}) {
  const cardRef = useRef(null)

  return (
    <div
      ref={cardRef}
      className={`flip-card ${!card.text ? 'flip-card--new' : ''} ${
        card.isFlipped ? 'flipped' : ''
      } ${card.isEditing ? 'editing' : ''}`}
      key={card.id}
      onPointerDown={() => handleOpenMenu(card.id, card.isEditing, cardRef)}
      onPointerUp={handleMouseUp}
    >
      {/* Передняя сторона */}
      <div className="flip-card-plus" onClick={() => handleFlip(card.id)}>
        <p className="hint">+</p>
      </div>

      {/* Задняя сторона */}
      {card.isEditing ? (
        <div className="flip-card-text">
          <form
            onSubmit={(event) => handleSubmit(card.id, event)}
            onClick={(event) => event.stopPropagation()}
          >
            <input
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
        <CardMenu
          showMenu={card.showMenu}
          menuPosition={card.menuPosition}
          menuRename={() => handleRenameCard(card.id)}
          menuDelete={() => handleDeleteCard(card.id)}
          handleCloseMenu={() => handleCloseMenu(card.id)}
        />
      </MenuPortal>
    </div>
  )
})

export default Card
