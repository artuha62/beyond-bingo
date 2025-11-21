import Card from '../components/Card/Card.jsx'
import Title from '../components/Title/Title.jsx'
import { useContext } from 'react'
import { CardsContext } from '../context/CardsContext.jsx'
import styles from '../components/Bingo/Bingo.module.css'
import LogoutButton from '../components/UI/LogoutButton.jsx'

const Bingo = () => {
  const { cards, menu, handleCloseMenu } = useContext(CardsContext)

  const isMenuOpen = menu.openCardId !== null || undefined

  return (
    <div className={styles.container}>
      <Title />
      <LogoutButton />
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
