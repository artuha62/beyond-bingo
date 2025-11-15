import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'

const CardBack = ({ card, inputRef }) => {
  const { handleSubmit, handleInputChange } = useContext(CardsContext)
  return (
    <div className="card-back">
      <form
        onBlur={(event) => handleSubmit(card.id, event)}
        onSubmit={(event) => handleSubmit(card.id, event)}
      >
        <input
          ref={inputRef}
          className="card-input"
          type="text"
          placeholder="Напиши что-нибудь..."
          value={card.text}
          onChange={(event) => handleInputChange(card.id, event.target.value)}
        />
      </form>
    </div>
  )
}

export default CardBack
