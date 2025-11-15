import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'

const CardFront = ({ card }) => {
  const { handleFlip } = useContext(CardsContext)
  return (
    <div className="card-front" onClick={() => handleFlip(card.id)}>
      <p className="hint">+</p>
    </div>
  )
}

export default CardFront
