import Card from './Card.jsx'
import Title from './Title.jsx'

const Bingo = ({ cards, menu, handleCloseMenu, ...handlers }) => {
  const isMenuOpen = menu.openCardId !== null

  return (
    <>
      <Title>Bingo</Title>
      {isMenuOpen && (
        <div className="global-overlay" onClick={handleCloseMenu}></div>
      )}
      <div className="cards-grid">
        {cards.map((card) => (
          <div className="card-wrapper">
            <Card
              key={card.id}
              card={card}
              menu={menu}
              handleCloseMenu={handleCloseMenu}
              {...handlers}
            />
          </div>
        ))}
      </div>
    </>
  )
}
export default Bingo
