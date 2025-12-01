import Card from '../Card/Card.jsx'
import { useContext } from 'react'
import { CardsDataContext } from '../../context/CardsContext.jsx'
import CardMenu from '../CardMenu/CardMenu.jsx'
import styles from './CardsGrid.module.scss'

const CardsGrid = () => {
  const { cards } = useContext(CardsDataContext)
  return (
    <>
      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.cardEaseIn}>
            <Card card={card} />
          </div>
        ))}
      </div>
      <CardMenu />
    </>
  )
}

export default CardsGrid
