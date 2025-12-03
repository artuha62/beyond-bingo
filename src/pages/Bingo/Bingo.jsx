import CardsGrid from '../../components/CardsGrid/CardsGrid.jsx'
import { CardsProvider } from '../../context/CardsContext.jsx'
import styles from './Bingo.module.scss'
import Header from '../../components/Header/Header.jsx'

const Bingo = () => {
  return (
    <CardsProvider>
      <div className={styles.bingo}>
        <div className={styles.container}>
          <Header />
          <CardsGrid />
        </div>
      </div>
    </CardsProvider>
  )
}
export default Bingo
