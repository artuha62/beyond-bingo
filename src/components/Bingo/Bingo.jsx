import Card from '../Card/Card.jsx'
import Title from '../Title/Title.jsx'
import { useContext } from 'react'
import { CardsContext } from '../../context/CardsContext.jsx'
import styles from './Bingo.module.css'

const Bingo = () => {
  const { cards, menu, handleCloseMenu } = useContext(CardsContext)

  const isMenuOpen = menu.openCardId !== null || undefined

  return (
    <div className={styles.container}>
      <Title />
      {isMenuOpen && (
        <div className={styles.overlay} onClick={handleCloseMenu}></div>
      )}
      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.cardEaseIn}>
            <Card card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default Bingo
