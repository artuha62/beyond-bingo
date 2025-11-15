import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'

const CardReady = ({ card }) => {
  const { handleIncrementCounter } = useContext(CardsContext)
  return (
    <div className="ready-card" onClick={() => handleIncrementCounter(card.id)}>
      <span className="ready-card-description">{card.text}</span>
      <span className="ready-card-counter">
        <div className="counter-body">
          <div>x</div>
          <div>{card.count}</div>
        </div>
      </span>
    </div>
  )
}

export default CardReady
