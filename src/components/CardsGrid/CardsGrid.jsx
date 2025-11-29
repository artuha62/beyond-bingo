import Card from '../Card/Card.jsx'
import { useContext } from 'react'
import {
  CardsDataContext,
  MenuDataContext,
} from '../../context/CardsContext.jsx'
import MenuPortal from '../CardMenu/MenuPortal.jsx'
import CardMenu from '../CardMenu/CardMenu.jsx'
import styles from './CardsGrid.module.scss'

const CardsGrid = () => {
  const { cards } = useContext(CardsDataContext)
  const { menu } = useContext(MenuDataContext)
  return (
    <>
      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.cardEaseIn}>
            <Card card={card} />
          </div>
        ))}
      </div>

      {menu.openCardId && (
        <MenuPortal>
          <CardMenu
            card={cards.find((card) => card.id === menu.openCardId)}
            menu={menu}
          />
        </MenuPortal>
      )}
    </>
  )
}

export default CardsGrid
