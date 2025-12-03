import styles from '../../CardsGrid/CardsGrid.module.scss'
import card from '../Card.module.scss'
import skeleton from './CardSkeleton.module.scss'

const CardSkeleton = () => {
  return (
    <div className={styles.cardsGrid}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i}>
          <div className={card.card}>
            <div className={card.inner}>
              <div className={skeleton.skeleton}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardSkeleton
