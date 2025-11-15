import Card from './Card/Card.jsx'
import Title from './Title.jsx'
import { useContext } from 'react'
import { CardsContext } from '../context/CardsContext.jsx'

const Bingo = () => {
  const { cards, menu, handleCloseMenu } = useContext(CardsContext)

  const isMenuOpen = menu.openCardId !== null

  return (
    <div className="bingo">
      <Title />
      {isMenuOpen && (
        <div className="global-overlay" onClick={handleCloseMenu}></div>
      )}
      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="card-wrapper">
            <Card card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default Bingo
