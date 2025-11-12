import { AnimatePresence, motion } from 'motion/react'
import Card from './Card.jsx'
import Title from './Title.jsx'

const Bingo = ({ cards, handleCloseMenu, ...handlers }) => {
  const isMenuOpen = cards.some((card) => card.showMenu)

  return (
    <>
      <Title>Bingo</Title>
      {isMenuOpen && (
        <div className="global-overlay" onClick={handleCloseMenu}></div>
      )}
      <div className="cards-grid">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card
                card={card}
                handleCloseMenu={handleCloseMenu}
                {...handlers}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
export default Bingo
