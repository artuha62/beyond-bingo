import Card from '../Card.jsx'
import { useContext } from 'react'
import { CardsDataContext } from '@/context/CardsContext.jsx'
import CardMenu from '../../CardMenu/CardMenu.jsx'
import CardSkeleton from '../Skeleton/CardSkeleton.jsx'
import styles from './CardsGrid.module.scss'

const CardsGrid = () => {
  const { cards, showSkeleton } = useContext(CardsDataContext)

  if (showSkeleton) {
    return <CardSkeleton />
  }

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
